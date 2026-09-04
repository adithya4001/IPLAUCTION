CREATE OR REPLACE FUNCTION public.find_room_by_code(_code text)
 RETURNS TABLE(id uuid, room_code text, game_mode text, timer_duration integer, status text, host_player_id text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT r.id, r.room_code, r.game_mode, r.timer_duration, r.status, r.host_player_id
  FROM public.game_rooms r
  WHERE upper(r.room_code) = upper(_code)
    AND r.status = 'lobby'
    AND r.created_at > now() - interval '12 hours'
  ORDER BY r.created_at DESC
  LIMIT 1
$function$;