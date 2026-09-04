DROP POLICY IF EXISTS "Authenticated users can read rooms" ON public.game_rooms;

CREATE POLICY "Members can read their rooms"
ON public.game_rooms
FOR SELECT
TO authenticated
USING (host_player_id = (auth.uid())::text OR public.is_room_member(id, auth.uid()));

CREATE OR REPLACE FUNCTION public.find_room_by_code(_code text)
RETURNS TABLE (id uuid, room_code text, game_mode text, timer_duration integer, status text, host_player_id text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT r.id, r.room_code, r.game_mode, r.timer_duration, r.status, r.host_player_id
  FROM public.game_rooms r
  WHERE r.room_code = upper(_code)
    AND r.status = 'lobby'
  LIMIT 1
$$;

REVOKE ALL ON FUNCTION public.find_room_by_code(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.find_room_by_code(text) TO authenticated;