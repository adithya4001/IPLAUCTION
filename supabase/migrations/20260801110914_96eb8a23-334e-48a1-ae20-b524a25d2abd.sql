CREATE OR REPLACE FUNCTION public.is_room_host(_room_id uuid, _uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT _uid IS NOT NULL
    AND _uid = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.game_rooms r
      WHERE r.id = _room_id AND r.host_player_id = _uid::text
    )
$function$;

CREATE OR REPLACE FUNCTION public.is_room_member(_room_id uuid, _uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT _uid IS NOT NULL
    AND _uid = auth.uid()
    AND (
      EXISTS (
        SELECT 1 FROM public.room_players p
        WHERE p.room_id = _room_id AND p.player_id = _uid::text
      )
      OR public.is_room_host(_room_id, _uid)
    )
$function$;

REVOKE ALL ON FUNCTION public.is_room_host(uuid, uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_room_member(uuid, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_room_host(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_room_member(uuid, uuid) TO authenticated;

REVOKE ALL ON FUNCTION public.find_room_by_code(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.find_room_by_code(text) TO authenticated;