
-- Create game_rooms table
CREATE TABLE public.game_rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_code TEXT NOT NULL UNIQUE,
  host_player_id TEXT NOT NULL,
  game_mode TEXT NOT NULL DEFAULT 'IPL 2025',
  timer_duration INTEGER NOT NULL DEFAULT 30,
  status TEXT NOT NULL DEFAULT 'lobby',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create room_players table
CREATE TABLE public.room_players (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.game_rooms(id) ON DELETE CASCADE,
  player_id TEXT NOT NULL,
  username TEXT NOT NULL,
  avatar TEXT NOT NULL,
  team_id TEXT,
  is_ready BOOLEAN NOT NULL DEFAULT false,
  is_host BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(room_id, player_id)
);

-- Enable RLS
ALTER TABLE public.game_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_players ENABLE ROW LEVEL SECURITY;

-- Permissive policies (no auth, anonymous game access)
CREATE POLICY "Anyone can read game rooms" ON public.game_rooms FOR SELECT USING (true);
CREATE POLICY "Anyone can create game rooms" ON public.game_rooms FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update game rooms" ON public.game_rooms FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete game rooms" ON public.game_rooms FOR DELETE USING (true);

CREATE POLICY "Anyone can read room players" ON public.room_players FOR SELECT USING (true);
CREATE POLICY "Anyone can insert room players" ON public.room_players FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update room players" ON public.room_players FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete room players" ON public.room_players FOR DELETE USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_players;
