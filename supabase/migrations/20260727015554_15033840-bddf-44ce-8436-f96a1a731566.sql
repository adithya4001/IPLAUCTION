-- Remove duplicate active codes (keep newest) before enforcing uniqueness
DELETE FROM public.game_rooms r
USING public.game_rooms r2
WHERE r.room_code = r2.room_code
  AND r.status IN ('lobby', 'auction')
  AND r2.status IN ('lobby', 'auction')
  AND r.created_at < r2.created_at;

CREATE UNIQUE INDEX IF NOT EXISTS game_rooms_active_code_unique
ON public.game_rooms (room_code)
WHERE status IN ('lobby', 'auction');

CREATE OR REPLACE FUNCTION public.find_room_by_code(_code text)
RETURNS TABLE (id uuid, room_code text, game_mode text, timer_duration integer, status text, host_player_id text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT r.id, r.room_code, r.game_mode, r.timer_duration, r.status, r.host_player_id
  FROM public.game_rooms r
  WHERE upper(r.room_code) = upper(_code)
    AND r.status = 'lobby'
  ORDER BY r.created_at DESC
  LIMIT 1
$$;

REVOKE ALL ON FUNCTION public.find_room_by_code(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.find_room_by_code(text) TO authenticated;