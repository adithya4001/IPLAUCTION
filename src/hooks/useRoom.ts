import { useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { IPL_TEAMS } from "@/data/teams";
import type { User, LobbyPlayer } from "@/context/GameContext";
import type { RealtimeChannel } from "@supabase/supabase-js";

// Unambiguous charset (no O/0/I/1) — always exactly 6 characters.
// Codes are drawn from the platform CSPRNG with rejection sampling so every
// code is uniformly distributed and unguessable (32^6 ≈ 1.07 billion codes).
const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function generateRoomCode(): string {
  const len = 6;
  const out: string[] = [];
  // 256 % 32 === 0, so no byte value is biased; rejection kept for safety if the
  // charset length ever changes to a non-power-of-two.
  const limit = Math.floor(256 / CODE_CHARS.length) * CODE_CHARS.length;
  while (out.length < len) {
    const bytes = new Uint8Array(len);
    crypto.getRandomValues(bytes);
    for (const b of bytes) {
      if (b >= limit) continue;
      out.push(CODE_CHARS[b % CODE_CHARS.length]);
      if (out.length === len) break;
    }
  }
  return out.join("");
}



export function useRoom(
  currentUser: User | null,
  roomId: string | null,
  onLobbyUpdate: (players: LobbyPlayer[], roomData: { gameMode: string; timerDuration: number; roomCode: string; roomId: string }) => void,
  onRoomStarted: () => void
) {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const roomIdRef = useRef<string | null>(null);

  const fetchPlayers = useCallback(async (rid: string) => {
    const [{ data: room }, { data: players }] = await Promise.all([
      supabase.from("game_rooms").select("*").eq("id", rid).single(),
      supabase.from("room_players").select("*").eq("room_id", rid).order("created_at"),
    ]);
    if (!room || !players) return;

    const lobbyPlayers: LobbyPlayer[] = players.map((p) => ({
      user: { id: p.player_id, username: p.username, avatar: p.avatar },
      team: p.team_id ? IPL_TEAMS.find((t) => t.id === p.team_id) || null : null,
      isReady: p.is_ready,
      isHost: p.is_host,
    }));

    onLobbyUpdate(lobbyPlayers, {
      gameMode: room.game_mode,
      timerDuration: room.timer_duration,
      roomCode: room.room_code,
      roomId: room.id,
    });

    if (room.status === "auction") {
      onRoomStarted();
    }
  }, [onLobbyUpdate, onRoomStarted]);

  // Subscribe to realtime changes + handle disconnect cleanup
  useEffect(() => {
    if (!roomId) return;
    roomIdRef.current = roomId;

    // Initial fetch
    fetchPlayers(roomId);

    // Subscribe to room_players changes
    const channel = supabase
      .channel(`room-${roomId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "room_players", filter: `room_id=eq.${roomId}` },
        () => { fetchPlayers(roomId); }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "game_rooms", filter: `id=eq.${roomId}` },
        () => { fetchPlayers(roomId); }
      )
      .subscribe();

    channelRef.current = channel;

    // Cleanup player on tab close / navigate away
    let accessToken: string | null = null;
    supabase.auth.getSession().then(({ data }) => {
      accessToken = data.session?.access_token ?? null;
    });

    const handleBeforeUnload = () => {
      if (currentUser && roomIdRef.current && accessToken) {
        const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/room_players?room_id=eq.${roomIdRef.current}&player_id=eq.${currentUser.id}`;
        const headers = {
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        };
        // sendBeacon doesn't support DELETE, so use fetch with keepalive
        fetch(url, { method: "DELETE", headers, keepalive: true }).catch(() => {});
      }
    };


    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      channel.unsubscribe();
      channelRef.current = null;
    };
  }, [roomId, fetchPlayers, currentUser]);

  const createRoom = useCallback(async (user: User): Promise<string | null> => {
    // Retry on the (rare) case where the generated code is already in use by an active room
    let room: { id: string } | null = null;
    let lastError: unknown = null;

    for (let attempt = 0; attempt < 5 && !room; attempt++) {
      const { data, error } = await supabase
        .from("game_rooms")
        .insert({ room_code: generateRoomCode(), host_player_id: user.id })
        .select()
        .single();

      if (data) {
        room = data;
        break;
      }
      lastError = error;
      if (error?.code !== "23505") break; // not a duplicate-code conflict
    }

    if (!room) {
      console.error("Failed to create room", lastError);
      return null;
    }

    await supabase.from("room_players").insert({
      room_id: room.id,
      player_id: user.id,
      username: user.username,
      avatar: user.avatar,
      is_host: true,
    });

    return room.id;
  }, []);


  const joinRoom = useCallback(async (user: User, code: string): Promise<string | null> => {
    const { data: rooms, error } = await supabase.rpc("find_room_by_code", {
      _code: code.toUpperCase(),
    });

    const room = Array.isArray(rooms) ? rooms[0] : rooms;

    if (error || !room) {
      console.error("Room not found", error);
      return null;
    }


    // Check if already in room
    const { data: existing } = await supabase
      .from("room_players")
      .select("id")
      .eq("room_id", room.id)
      .eq("player_id", user.id)
      .maybeSingle();

    if (!existing) {
      await supabase.from("room_players").insert({
        room_id: room.id,
        player_id: user.id,
        username: user.username,
        avatar: user.avatar,
        is_host: false,
      });
    }

    return room.id;
  }, []);

  const selectTeam = useCallback(async (rid: string, playerId: string, teamId: string) => {
    await supabase
      .from("room_players")
      .update({ team_id: teamId })
      .eq("room_id", rid)
      .eq("player_id", playerId);
  }, []);

  const toggleReady = useCallback(async (rid: string, playerId: string, currentReady: boolean) => {
    await supabase
      .from("room_players")
      .update({ is_ready: !currentReady })
      .eq("room_id", rid)
      .eq("player_id", playerId);
  }, []);

  const setGameMode = useCallback(async (rid: string, mode: string) => {
    await supabase
      .from("game_rooms")
      .update({ game_mode: mode })
      .eq("id", rid);
  }, []);

  const setTimerDuration = useCallback(async (rid: string, duration: number) => {
    await supabase
      .from("game_rooms")
      .update({ timer_duration: duration })
      .eq("id", rid);
  }, []);

  const startAuction = useCallback(async (rid: string) => {
    await supabase
      .from("game_rooms")
      .update({ status: "auction" })
      .eq("id", rid);
  }, []);

  const addBotPlayers = useCallback(async (rid: string, existingTeamIds: string[]) => {
    const availableTeams = IPL_TEAMS.filter((t) => !existingTeamIds.includes(t.id));
    const botNames = ["AuctionBot", "BidMaster", "IPL_Fan99"];
    const avatars = ["⚡", "🔥", "💎"];
    const botsNeeded = Math.min(3, availableTeams.length);

    const bots = [];
    for (let i = 0; i < botsNeeded; i++) {
      bots.push({
        room_id: rid,
        player_id: `bot_${Date.now()}_${i}`,
        username: botNames[i],
        avatar: avatars[i],
        team_id: availableTeams[i].id,
        is_ready: true,
        is_host: false,
      });
    }

    if (bots.length > 0) {
      await supabase.from("room_players").insert(bots);
    }
  }, []);

  const leaveRoom = useCallback(async (rid: string, playerId: string) => {
    await supabase
      .from("room_players")
      .delete()
      .eq("room_id", rid)
      .eq("player_id", playerId);
  }, []);

  return {
    createRoom,
    joinRoom,
    selectTeam,
    toggleReady,
    setGameMode,
    setTimerDuration,
    startAuction,
    addBotPlayers,
    leaveRoom,
  };
}
