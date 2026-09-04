/**
 * RLS regression tests — verifies room data access rules for every endpoint
 * (game_rooms, room_players, profiles, find_room_by_code).
 *
 * These tests run against the real backend with two dedicated test accounts.
 * Provide credentials as env vars before running:
 *
 *   RLS_TEST_EMAIL_A / RLS_TEST_PASSWORD_A
 *   RLS_TEST_EMAIL_B / RLS_TEST_PASSWORD_B
 *
 * If they are missing the suite is skipped instead of failing, so CI without
 * credentials stays green.
 */
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const URL = process.env.VITE_SUPABASE_URL ?? import.meta.env?.VITE_SUPABASE_URL;
const ANON =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY;

const A = { email: process.env.RLS_TEST_EMAIL_A, password: process.env.RLS_TEST_PASSWORD_A };
const B = { email: process.env.RLS_TEST_EMAIL_B, password: process.env.RLS_TEST_PASSWORD_B };

const hasCreds = Boolean(URL && ANON && A.email && A.password && B.email && B.password);

function client(): SupabaseClient {
  return createClient(URL as string, ANON as string, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function signIn(creds: { email?: string; password?: string }) {
  const c = client();
  const { error } = await c.auth.signInWithPassword({
    email: creds.email as string,
    password: creds.password as string,
  });
  if (error) throw new Error(`Test account sign-in failed: ${error.message}`);
  const { data } = await c.auth.getUser();
  return { c, uid: data.user!.id };
}

describe.skipIf(!hasCreds)("RLS: room data access rules", () => {
  let anon: SupabaseClient;
  let alice: SupabaseClient;
  let bob: SupabaseClient;
  let aliceId: string;
  let bobId: string;
  let roomId: string;
  let roomCode: string;

  beforeAll(async () => {
    anon = client();
    const a = await signIn(A);
    const b = await signIn(B);
    alice = a.c;
    bob = b.c;
    aliceId = a.uid;
    bobId = b.uid;

    roomCode = `T${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    const { data, error } = await alice
      .from("game_rooms")
      .insert({ room_code: roomCode, host_player_id: aliceId })
      .select()
      .single();
    if (error) throw new Error(`Host could not create room: ${error.message}`);
    roomId = data.id;
  }, 30000);

  afterAll(async () => {
    if (roomId && alice) {
      await alice.from("room_players").delete().eq("room_id", roomId);
      await alice.from("game_rooms").delete().eq("id", roomId);
    }
  });

  // ---------- game_rooms ----------
  it("anonymous users cannot read any room", async () => {
    const { data } = await anon.from("game_rooms").select("*");
    expect(data ?? []).toHaveLength(0);
  });

  it("anonymous users cannot create a room", async () => {
    const { error } = await anon
      .from("game_rooms")
      .insert({ room_code: "ANONX1", host_player_id: aliceId });
    expect(error).not.toBeNull();
  });

  it("host can read their own room", async () => {
    const { data } = await alice.from("game_rooms").select("*").eq("id", roomId);
    expect(data).toHaveLength(1);
  });

  it("a signed-in non-member cannot read another user's room directly", async () => {
    const { data } = await bob.from("game_rooms").select("*").eq("id", roomId);
    expect(data ?? []).toHaveLength(0);
  });

  it("a user cannot create a room owned by someone else", async () => {
    const { error } = await bob
      .from("game_rooms")
      .insert({ room_code: "SPOOF1", host_player_id: aliceId });
    expect(error).not.toBeNull();
  });

  it("a non-host cannot update or delete the room", async () => {
    const { data: upd } = await bob
      .from("game_rooms")
      .update({ timer_duration: 99 })
      .eq("id", roomId)
      .select();
    expect(upd ?? []).toHaveLength(0);

    const { data: del } = await bob.from("game_rooms").delete().eq("id", roomId).select();
    expect(del ?? []).toHaveLength(0);
  });

  it("the host can update their own room", async () => {
    const { data } = await alice
      .from("game_rooms")
      .update({ timer_duration: 20 })
      .eq("id", roomId)
      .select();
    expect(data).toHaveLength(1);
  });

  // ---------- find_room_by_code ----------
  it("code lookup is unavailable to anonymous callers", async () => {
    const { error } = await anon.rpc("find_room_by_code", { _code: roomCode });
    expect(error).not.toBeNull();
  });

  it("a signed-in user can resolve a valid lobby code", async () => {
    const { data, error } = await bob.rpc("find_room_by_code", { _code: roomCode });
    expect(error).toBeNull();
    expect(data?.[0]?.id).toBe(roomId);
  });

  it("an unknown code resolves to nothing", async () => {
    const { data } = await bob.rpc("find_room_by_code", { _code: "ZZZZZZ" });
    expect(data ?? []).toHaveLength(0);
  });

  // ---------- room_players ----------
  it("a user can join themselves to a room", async () => {
    const { error } = await bob.from("room_players").insert({
      room_id: roomId,
      player_id: bobId,
      username: "rls-bob",
      avatar: "🎮",
    });
    expect(error).toBeNull();
  });

  it("members can read the player list of their room", async () => {
    const { data } = await bob.from("room_players").select("*").eq("room_id", roomId);
    expect((data ?? []).length).toBeGreaterThan(0);
  });

  it("anonymous users cannot read the player list", async () => {
    const { data } = await anon.from("room_players").select("*").eq("room_id", roomId);
    expect(data ?? []).toHaveLength(0);
  });

  it("a user cannot insert a player row impersonating someone else", async () => {
    const { error } = await bob.from("room_players").insert({
      room_id: roomId,
      player_id: aliceId,
      username: "impostor",
      avatar: "😈",
    });
    expect(error).not.toBeNull();
  });

  it("a member cannot edit another player's row", async () => {
    await alice.from("room_players").insert({
      room_id: roomId,
      player_id: aliceId,
      username: "rls-alice",
      avatar: "🎮",
      is_host: true,
    });
    const { data } = await bob
      .from("room_players")
      .update({ team_id: "csk" })
      .eq("room_id", roomId)
      .eq("player_id", aliceId)
      .select();
    expect(data ?? []).toHaveLength(0);
  });

  it("a player can update their own row", async () => {
    const { data } = await bob
      .from("room_players")
      .update({ team_id: "mi", is_ready: true })
      .eq("room_id", roomId)
      .eq("player_id", bobId)
      .select();
    expect(data).toHaveLength(1);
  });

  it("the host can remove a player, a non-host cannot remove others", async () => {
    const { data: badDelete } = await bob
      .from("room_players")
      .delete()
      .eq("room_id", roomId)
      .eq("player_id", aliceId)
      .select();
    expect(badDelete ?? []).toHaveLength(0);

    const { data: hostDelete } = await alice
      .from("room_players")
      .delete()
      .eq("room_id", roomId)
      .eq("player_id", bobId)
      .select();
    expect(hostDelete).toHaveLength(1);
  });

  // ---------- profiles ----------
  it("a user can read only their own profile", async () => {
    const { data } = await alice.from("profiles").select("*");
    expect((data ?? []).every((p: { id: string }) => p.id === aliceId)).toBe(true);
  });

  it("a user cannot update someone else's profile", async () => {
    const { data } = await bob
      .from("profiles")
      .update({ username: "hacked" })
      .eq("id", aliceId)
      .select();
    expect(data ?? []).toHaveLength(0);
  });
});
