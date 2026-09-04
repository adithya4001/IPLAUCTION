import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { motion } from "framer-motion";
import { toast } from "sonner";
import AppBackground from "@/components/AppBackground";
import UserAvatar, { AVATAR_KEYS } from "@/components/UserAvatar";
import emblem from "@/assets/emblem-auction.png";

const AVATARS = [...AVATAR_KEYS];

interface AuthScreenProps {
  onAuthenticated: (user: { id: string; username: string; avatar: string }) => void;
}

export default function AuthScreen({ onAuthenticated }: AuthScreenProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email.trim() || !password.trim() || !username.trim()) {
      toast.error("Please fill all fields");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          username: username.trim(),
          avatar: AVATARS[selectedAvatar],
        },
        emailRedirectTo: window.location.origin,
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Check your email for verification link!");
      setMode("login");
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter email and password");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (data.user) {
      // Fetch profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("username, avatar")
        .eq("id", data.user.id)
        .single();
      onAuthenticated({
        id: data.user.id,
        username: profile?.username || data.user.email || "Player",
        avatar: profile?.avatar || "🎮",
      });
    }
  };

  const handleGoogleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });

    if (error) {
      console.error("Google Login Error:", error.message);
    }
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

        {/* Mode Toggle */}
        <div className="flex rounded-lg overflow-hidden border border-border mb-6">
          <button
            onClick={() => setMode("login")}
            className={`tab-pill flex-1 rounded-none ${mode === "login" ? "is-active" : ""}`}
          >
            Login
          </button>
          <button
            onClick={() => setMode("signup")}
            className={`tab-pill flex-1 rounded-none ${mode === "signup" ? "is-active" : ""}`}
          >
            Sign Up
          </button>
        </div>

        {/* Avatar Selection (signup only) */}
        {mode === "signup" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-5"
          >
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
          </motion.div>
        )}

        {/* Username (signup only) */}
        {mode === "signup" && (
          <div className="mb-4">
            <label className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mb-2 block">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose your gamer tag..."
              className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-semibold"
            />
          </div>
        )}

        {/* Email */}
        <div className="mb-4">
          <label className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mb-2 block">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-semibold"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mb-2 block">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (mode === "login" ? handleLogin() : handleSignup())}
            placeholder="••••••••"
            className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-semibold"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={mode === "login" ? handleLogin : handleSignup}
          disabled={loading}
          className="w-full gradient-gold-bg text-primary-foreground font-display font-bold text-lg py-4 rounded-lg uppercase tracking-wider transition-all duration-300 hover:shadow-[var(--shadow-neon-gold)] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "Please wait..." : mode === "login" ? "Enter Arena" : "Create Account"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-border" />
          <span className="text-muted-foreground text-sm uppercase tracking-wider">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-secondary/60 border border-border text-foreground font-semibold py-3.5 rounded-lg transition-all hover:bg-secondary hover:border-primary/30 disabled:opacity-40 flex items-center justify-center gap-3"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>
      </motion.div>
    </div>
  );
}
