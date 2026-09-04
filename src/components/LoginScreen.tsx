import { useState } from "react";
import { useGame } from "@/context/GameContext";
import { motion } from "framer-motion";
import AppBackground from "@/components/AppBackground";
import UserAvatar, { AVATAR_KEYS } from "@/components/UserAvatar";
import emblem from "@/assets/emblem-auction.png";

const AVATARS = [...AVATAR_KEYS];

export default function LoginScreen() {
  const { dispatch } = useGame();
  const [username, setUsername] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(0);

  const handleLogin = () => {
    if (!username.trim()) return;
    dispatch({
      type: "LOGIN",
      user: {
        id: `user_${Date.now()}`,
        username: username.trim(),
        avatar: AVATARS[selectedAvatar],
      },
    });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <AppBackground variant="stadium" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-8 w-full max-w-md"
      >
        {/* Title */}
        <div className="text-center mb-8">
          <img src={emblem} alt="IPL Auction Mastermind crest" width={104} height={104} className="mx-auto mb-3 h-24 w-24 object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.5)]" />
          <motion.h1
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-3xl md:text-4xl font-display font-bold text-primary neon-text mb-2"
          >
            IPL AUCTION
          </motion.h1>
          <p className="text-lg text-primary font-display tracking-widest">MASTERMIND</p>
          <div className="w-24 h-0.5 mx-auto mt-4 gradient-gold-bg rounded-full" />
        </div>

        {/* Avatar Selection */}
        <div className="mb-6">
          <label className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mb-3 block">
            Choose Avatar
          </label>
          <div className="grid grid-cols-4 gap-3">
            {AVATARS.map((avatar, i) => (
              <button
                key={i}
                onClick={() => setSelectedAvatar(i)}
                aria-label={`Avatar ${i + 1}`}
                className={`flex items-center justify-center p-2 rounded-xl transition-all duration-200 ${
                  selectedAvatar === i
                    ? "bg-primary/15 border-2 border-primary scale-105 shadow-[var(--shadow-neon-gold)]"
                    : "bg-secondary/40 border-2 border-transparent hover:border-primary/30"
                }`}
              >
                <UserAvatar value={avatar} size="md" />
              </button>
            ))}
          </div>
        </div>

        {/* Username */}
        <div className="mb-6">
          <label className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mb-2 block">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Enter your gamer tag..."
            className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-semibold text-lg"
          />
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={!username.trim()}
          className="w-full gradient-gold-bg text-primary-foreground font-display font-bold text-lg py-4 rounded-lg uppercase tracking-wider transition-all duration-300 hover:shadow-[var(--shadow-neon-gold)] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Enter Arena
        </button>
      </motion.div>
    </div>
  );
}
