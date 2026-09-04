import { useEffect, useState } from "react";
import { GameProvider, useGame } from "@/context/GameContext";
import { supabase } from "@/integrations/supabase/client";
import AppBackground from "@/components/AppBackground";
import AuthScreen from "@/components/AuthScreen";
import MainMenu from "@/components/MainMenu";
import LobbyScreen from "@/components/LobbyScreen";
import AuctionScreen from "@/components/AuctionScreen";
import ResultsScreen from "@/components/ResultsScreen";

function GameRouter() {
  const { state } = useGame();

  switch (state.phase) {
    case "menu":
      return <MainMenu />;
    case "lobby":
      return <LobbyScreen />;
    case "auction":
      return <AuctionScreen />;
    case "results":
      return <ResultsScreen />;
    default:
      return <MainMenu />;
  }
}

export default function Index() {
  const [authUser, setAuthUser] = useState<{ id: string; username: string; avatar: string } | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    // Set a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (mounted) {
        setChecking(false);
      }
    }, 5000);

    // CRITICAL: Call getSession() FIRST to restore from storage
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (!mounted) return;
      
      if (error) {
        console.error("Auth error:", error);
        setChecking(false);
        return;
      }
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username, avatar")
          .eq("id", session.user.id)
          .single();
        setAuthUser({
          id: session.user.id,
          username: profile?.username || session.user.email || "Player",
          avatar: profile?.avatar || "🎮",
        });
      }
      setChecking(false);
    });

    // THEN set up listener for subsequent changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        
        // Don't block on async operations - fire and forget
        if (session?.user) {
          supabase
            .from("profiles")
            .select("username, avatar")
            .eq("id", session.user.id)
            .single()
            .then(({ data: profile }) => {
              if (!mounted) return;
              setAuthUser({
                id: session.user.id,
                username: profile?.username || session.user.email || "Player",
                avatar: profile?.avatar || "🎮",
              });
            });
        } else {
          setAuthUser(null);
        }
      }
    );

    return () => {
      mounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  if (checking) {
    return (
      <div className="dark">
        <div className="relative min-h-screen flex items-center justify-center">
          <AppBackground variant="stadium" />
          <div className="text-primary font-display text-2xl animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="dark">
        <AuthScreen onAuthenticated={setAuthUser} />
      </div>
    );
  }

  return (
    <GameProvider initialUser={authUser}>
      <div className="dark">
        <GameRouter />
      </div>
    </GameProvider>
  );
}
