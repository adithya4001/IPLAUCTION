import { useGame } from "@/context/GameContext";
import { useRoom } from "@/hooks/useRoom";
import { SFX } from "@/hooks/useSoundEffects";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import AppBackground from "@/components/AppBackground";
import emblem from "@/assets/emblem-auction.png";
import gavel from "@/assets/icon-gavel.png";
import { KeyRound } from "lucide-react";
import UserAvatar from "@/components/UserAvatar";

export default function MainMenu() {
  const { state, dispatch } = useGame();
  const [joinCode, setJoinCode] = useState("");
  const [showJoin, setShowJoin] = useState(false);
  const [loading, setLoading] = useState(false);

  const { createRoom, joinRoom } = useRoom(
    state.currentUser,
    null,
    () => {},
    () => {}
  );

  const handleCreate = async () => {
    if (!state.currentUser || loading) return;
    
    // Ensure auth session is ready before creating room
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error("Please sign in again");
      return;
    }
    
    setLoading(true);
    const roomId = await createRoom(state.currentUser);
    setLoading(false);
    if (roomId) {
      SFX.join();
      dispatch({ type: "SET_ROOM", roomId, roomCode: "" });
    } else {
      toast.error("Failed to create room");
    }
  };

  const handleJoin = async () => {
    if (!state.currentUser || joinCode.length !== 6 || loading) return;
    
    // Ensure auth session is ready before joining room
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error("Please sign in again");
      return;
    }
    
    setLoading(true);
    const roomId = await joinRoom(state.currentUser, joinCode);
    setLoading(false);
    if (roomId) {
      SFX.join();
      dispatch({ type: "SET_ROOM", roomId, roomCode: joinCode });
    } else {
      toast.error("Room not found or already started");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
      <AppBackground variant="stadium" />
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <img src={emblem} alt="IPL Auction Mastermind crest" width={132} height={132} className="mx-auto mb-3 h-28 w-28 md:h-32 md:w-32 object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.55)]" />
        <h1 className="text-4xl md:text-5xl font-display font-bold text-primary neon-text">
          IPL AUCTION
        </h1>
        <p className="text-xl text-primary/80 font-display tracking-[0.3em] mt-1">MASTERMIND</p>
        <p className="text-muted-foreground mt-4 text-lg">
          Welcome, <span className="text-primary font-bold inline-flex items-center gap-2"><UserAvatar value={state.currentUser?.avatar} size="sm" />{state.currentUser?.username}</span>
        </p>
        <button
          onClick={async () => {
            setLoading(true);
            try {
              await supabase.auth.signOut();
              window.location.reload();
            } catch (error) {
              console.error("Sign out error:", error);
              toast.error("Failed to sign out");
              setLoading(false);
            }
          }}
          disabled={loading}
          className="mt-2 text-sm text-muted-foreground hover:text-destructive transition-colors underline disabled:opacity-50"
        >
          {loading ? "Signing out..." : "Sign Out"}
        </button>
      </motion.div>

      <div className="flex flex-col gap-5 w-full max-w-sm">
        <motion.button
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          onClick={handleCreate}
          disabled={loading}
          className="glass-card-hover p-6 text-center group cursor-pointer disabled:opacity-50"
        >
          <img src={gavel} alt="" loading="lazy" width={72} height={72} className="mx-auto mb-2 h-16 w-16 object-contain transition-transform group-hover:scale-110" />
          <h2 className="font-display font-bold text-xl text-primary">
            {loading ? "CREATING..." : "CREATE ROOM"}
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Host a new auction lobby</p>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => setShowJoin(!showJoin)}
          className="glass-card-hover p-6 text-center group cursor-pointer"
        >
          <KeyRound className="mx-auto mb-2 h-12 w-12 text-accent transition-transform group-hover:scale-110" strokeWidth={1.6} />
          <h2 className="font-display font-bold text-xl text-accent neon-text-accent">JOIN ROOM</h2>
          <p className="text-muted-foreground text-sm mt-1">Enter a 6-digit room code</p>
        </motion.button>

        {showJoin && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="glass-card p-4"
          >
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase().slice(0, 6))}
              placeholder="ROOM CODE"
              className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-center text-foreground font-display font-bold text-2xl tracking-[0.5em] placeholder:text-muted-foreground placeholder:text-base placeholder:tracking-normal focus:outline-none focus:border-primary"
            />
            <button
              onClick={handleJoin}
              disabled={joinCode.length !== 6 || loading}
              className="w-full mt-3 gradient-gold-bg text-primary-foreground font-display font-bold py-3 rounded-lg uppercase disabled:opacity-40"
            >
              {loading ? "Joining..." : "Join"}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
