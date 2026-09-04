-- Helper functions (security definer, not callable from API)
CREATE OR REPLACE FUNCTION public.is_room_host(_room_id uuid, _uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.game_rooms r
    WHERE r.id = _room_id AND r.host_player_id = _uid::text
  )
$$;

CREATE OR REPLACE FUNCTION public.is_room_member(_room_id uuid, _uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.room_players p
    WHERE p.room_id = _room_id AND p.player_id = _uid::text
  ) OR public.is_room_host(_room_id, _uid)
$$;

REVOKE ALL ON FUNCTION public.is_room_host(uuid, uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.is_room_member(uuid, uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- game_rooms
DROP POLICY IF EXISTS "Anyone can create game rooms" ON public.game_rooms;
DROP POLICY IF EXISTS "Anyone can delete game rooms" ON public.game_rooms;
DROP POLICY IF EXISTS "Anyone can read game rooms" ON public.game_rooms;
DROP POLICY IF EXISTS "Anyone can update game rooms" ON public.game_rooms;

REVOKE ALL ON public.game_rooms FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.game_rooms TO authenticated;
GRANT ALL ON public.game_rooms TO service_role;

CREATE POLICY "Authenticated users can read rooms"
ON public.game_rooms FOR SELECT TO authenticated USING (true);

CREATE POLICY "Host can create own room"
ON public.game_rooms FOR INSERT TO authenticated
WITH CHECK (host_player_id = auth.uid()::text);

CREATE POLICY "Host can update own room"
ON public.game_rooms FOR UPDATE TO authenticated
USING (host_player_id = auth.uid()::text)
WITH CHECK (host_player_id = auth.uid()::text);

CREATE POLICY "Host can delete own room"
ON public.game_rooms FOR DELETE TO authenticated
USING (host_player_id = auth.uid()::text);

-- room_players
DROP POLICY IF EXISTS "Anyone can delete room players" ON public.room_players;
DROP POLICY IF EXISTS "Anyone can insert room players" ON public.room_players;
DROP POLICY IF EXISTS "Anyone can read room players" ON public.room_players;
DROP POLICY IF EXISTS "Anyone can update room players" ON public.room_players;

REVOKE ALL ON public.room_players FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.room_players TO authenticated;
GRANT ALL ON public.room_players TO service_role;

CREATE POLICY "Members can read room players"
ON public.room_players FOR SELECT TO authenticated
USING (player_id = auth.uid()::text OR public.is_room_member(room_id, auth.uid()));

CREATE POLICY "Players join themselves or host adds"
ON public.room_players FOR INSERT TO authenticated
WITH CHECK (player_id = auth.uid()::text OR public.is_room_host(room_id, auth.uid()));

CREATE POLICY "Players update own row or host updates"
ON public.room_players FOR UPDATE TO authenticated
USING (player_id = auth.uid()::text OR public.is_room_host(room_id, auth.uid()))
WITH CHECK (player_id = auth.uid()::text OR public.is_room_host(room_id, auth.uid()));

CREATE POLICY "Players remove themselves or host removes"
ON public.room_players FOR DELETE TO authenticated
USING (player_id = auth.uid()::text OR public.is_room_host(room_id, auth.uid()));