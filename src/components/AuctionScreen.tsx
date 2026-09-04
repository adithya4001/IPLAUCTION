import { useGame, SET_SIZE } from "@/context/GameContext";
import { useAuctionSync } from "@/hooks/useAuctionSync";
import { SFX, Ambience } from "@/hooks/useSoundEffects";
import { useEffect, useRef, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PlayerCard from "./PlayerCard";
import ConfettiEffect from "./ConfettiEffect";
import GameChat from "./GameChat";
import SetBreakScreen from "./SetBreakScreen";
import AuctionSideTabs from "./AuctionSideTabs";
import AppBackground from "@/components/AppBackground";
import TeamCrest from "@/components/TeamCrest";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Flag } from "lucide-react";

function formatPrice(lakhs: number): string {
  if (lakhs >= 100) return `₹${(lakhs / 100).toFixed(2)} Cr`;
  return `₹${lakhs} L`;
}

export default function AuctionScreen() {
  const { state, dispatch, getBidIncrement } = useGame();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [showSold, setShowSold] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [bidFlash, setBidFlash] = useState(false);
  const [screenShake, setScreenShake] = useState(false);
  const [leftNotice, setLeftNotice] = useState<{ username: string; teamId: string | null; released: number } | null>(null);
  const [confirmLeave, setConfirmLeave] = useState<null | "leave" | "end">(null);
  const prevBidRef = useRef(state.currentBid);
  const prevStatusRef = useRef(state.auctionStatus);
  const prevPlayerRef = useRef(state.currentPlayerIndex);

  const currentPlayer = state.playerPool[state.currentPlayerIndex];
  const myTeamId = state.lobbyPlayers.find(
    (lp) => lp.user.id === state.currentUser?.id
  )?.team?.id;
  const myTeamState = myTeamId ? state.teamStates[myTeamId] : null;
  const myTeam = state.lobbyPlayers.find(
    (lp) => lp.user.id === state.currentUser?.id
  )?.team;
  const isHost = state.lobbyPlayers.find(
    (lp) => lp.user.id === state.currentUser?.id
  )?.isHost || false;

  const increment = getBidIncrement();

  // Auction sync
  const handleSyncReceive = useCallback((msg: any) => {
    if (msg.type === "AUCTION_STATE" && !isHost) {
      dispatch({
        type: "SYNC_AUCTION",
        payload: {
          currentPlayerIndex: msg.currentPlayerIndex,
          currentBid: msg.currentBid,
          currentBidder: msg.currentBidder,
          auctionStatus: msg.auctionStatus,
          timer: msg.timer,
          soldPlayers: msg.soldPlayers,
          teamStates: msg.teamStates,
          passedTeams: msg.passedTeams,
          playerPool: msg.playerPool,
          bidHistory: msg.bidHistory,
          unsoldPlayers: msg.unsoldPlayers,
        },
      });
    } else if (msg.type === "BID_ACTION" && isHost) {
      dispatch({ type: "PLACE_BID", teamId: msg.teamId!, amount: msg.amount! });
    } else if (msg.type === "PASS_ACTION" && isHost) {
      dispatch({ type: "PASS_BID", teamId: msg.teamId! });
    } else if (msg.type === "START_AUCTION" && !isHost) {
      dispatch({ type: "START_AUCTION" });
    } else if (msg.type === "PLAYER_LEFT") {
      setLeftNotice({ username: msg.username || "A player", teamId: msg.teamId || null, released: msg.releasedCount || 0 });
      toast({
        title: `${msg.username || "A player"} left the auction`,
        description: msg.releasedCount
          ? `Their team is out. ${msg.releasedCount} of their players return at the end for re-buying.`
          : "Their team has been removed from this auction.",
        variant: "destructive",
      });
      dispatch({ type: "REMOVE_TEAM", teamId: msg.teamId || null, playerId: msg.playerId });
    } else if (msg.type === "END_AUCTION") {
      toast({ title: "Auction ended", description: "The host has ended the auction. Showing results." });
      dispatch({ type: "END_AUCTION" });
    }
  }, [isHost, dispatch]);

  const { broadcast } = useAuctionSync(state.roomId, isHost, handleSyncReceive);

  // Host broadcasts
  useEffect(() => {
    if (!isHost || state.phase !== "auction") return;
    broadcast({
      type: "AUCTION_STATE",
      currentPlayerIndex: state.currentPlayerIndex,
      currentBid: state.currentBid,
      currentBidder: state.currentBidder,
      auctionStatus: state.auctionStatus,
      timer: state.timer,
      soldPlayers: state.soldPlayers,
      teamStates: state.teamStates,
      passedTeams: state.passedTeams,
      playerPool: state.playerPool,
      bidHistory: state.bidHistory,
      unsoldPlayers: state.unsoldPlayers,
    } as any);
  }, [isHost, state.currentBid, state.currentBidder, state.auctionStatus, state.timer, state.currentPlayerIndex, state.soldPlayers.length, state.passedTeams.length, state.setBreakTimer]);

  // Stadium ambience for the whole auction session
  useEffect(() => {
    Ambience.start();
    return () => Ambience.stop();
  }, []);

  // Ambience intensity follows the auction phase
  useEffect(() => {
    if (state.auctionStatus === "sold" || state.auctionStatus === "going_twice") {
      Ambience.setIntensity("roar");
    } else if (state.auctionStatus === "going_once" || (state.timer <= 5 && state.auctionStatus === "bidding")) {
      Ambience.setIntensity("tense");
    } else {
      Ambience.setIntensity("calm");
    }
  }, [state.auctionStatus, state.timer]);

  // Sound + visual effects for bids
  useEffect(() => {
    if (state.currentBid !== prevBidRef.current && state.currentBidder) {
      if (state.currentBidder === myTeamId) {
        SFX.myBid();
        SFX.bidConfirm();
      } else {
        SFX.bid();
      }
      setBidFlash(true);
      setTimeout(() => setBidFlash(false), 300);
      prevBidRef.current = state.currentBid;
    }
  }, [state.currentBid, state.currentBidder, myTeamId]);

  // Status effects
  useEffect(() => {
    if (state.auctionStatus !== prevStatusRef.current) {
      if (state.auctionStatus === "sold") {
        SFX.sold();
        SFX.crowdCheer();
        setShowConfetti(true);
        setScreenShake(true);
        setTimeout(() => { setShowConfetti(false); setScreenShake(false); }, 3000);
      } else if (state.auctionStatus === "unsold") {
        SFX.unsold();
        setScreenShake(true);
        setTimeout(() => setScreenShake(false), 500);
      } else if (state.auctionStatus === "going_once" || state.auctionStatus === "going_twice") {
        SFX.goingOnce();
      }
      prevStatusRef.current = state.auctionStatus;
    }
  }, [state.auctionStatus]);


  useEffect(() => {
    if (state.currentPlayerIndex !== prevPlayerRef.current) {
      SFX.playerReveal();
      prevPlayerRef.current = state.currentPlayerIndex;
    }
  }, [state.currentPlayerIndex]);

  // Timer tick sounds
  useEffect(() => {
    if (state.timer <= 5 && state.timer > 0 && (state.auctionStatus === "bidding" || state.auctionStatus === "going_once" || state.auctionStatus === "going_twice")) {
      SFX.timerUrgent();
    } else if (state.timer <= 10 && state.timer > 5 && state.auctionStatus === "bidding") {
      SFX.timerTick();
    }
  }, [state.timer, state.auctionStatus]);

  // Timer - only host (also handles set break timer)
  useEffect(() => {
    if (!isHost) return;
    if (state.auctionStatus === "set_break") {
      timerRef.current = setInterval(() => {
        dispatch({ type: "TICK_SET_BREAK" });
      }, 1000);
    } else if (state.auctionStatus === "bidding" || state.auctionStatus === "going_once" || state.auctionStatus === "going_twice") {
      timerRef.current = setInterval(() => {
        dispatch({ type: "TICK_TIMER" });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.auctionStatus, dispatch, isHost]);

  // Sold/unsold - host
  useEffect(() => {
    if (!isHost) return;
    if (state.auctionStatus === "sold") {
      dispatch({ type: "SOLD" });
      setShowSold(true);
      setTimeout(() => {
        setShowSold(false);
        dispatch({ type: "NEXT_PLAYER" });
      }, 3500);
    } else if (state.auctionStatus === "unsold") {
      setShowSold(true);
      setTimeout(() => {
        setShowSold(false);
        dispatch({ type: "NEXT_PLAYER" });
      }, 2500);
    }
  }, [state.auctionStatus, dispatch, isHost]);

  // Non-host overlay
  useEffect(() => {
    if (isHost) return;
    if (state.auctionStatus === "sold" || state.auctionStatus === "unsold") {
      setShowSold(true);
      setTimeout(() => setShowSold(false), 3000);
    }
  }, [state.auctionStatus, isHost]);

  // Bot bidding - host
  useEffect(() => {
    if (!isHost) return;
    if (state.auctionStatus !== "bidding") return;
    const botTeams = state.lobbyPlayers
      .filter((lp) => lp.user.id.startsWith("bot_") && lp.team)
      .map((lp) => lp.team!.id)
      .filter((tid) => !state.passedTeams.includes(tid) && tid !== state.currentBidder);

    if (botTeams.length === 0) return;

    const timeout = setTimeout(() => {
      if (Math.random() > 0.4) {
        const botTeam = botTeams[Math.floor(Math.random() * botTeams.length)];
        const ts = state.teamStates[botTeam];
        // If no one has bid, bot bids at base price; otherwise increment
        const botBidAmount = state.currentBidder
          ? state.currentBid + increment
          : currentPlayer.basePrice;
        if (ts && ts.purseRemaining >= botBidAmount) {
          dispatch({ type: "PLACE_BID", teamId: botTeam, amount: botBidAmount });
        } else {
          dispatch({ type: "PASS_BID", teamId: botTeam });
        }
      }
    }, 1500 + Math.random() * 3000);

    return () => clearTimeout(timeout);
  }, [state.currentBid, state.auctionStatus, state.passedTeams, state.currentBidder, isHost]);

  // Auto-sell/unsold when all teams have passed (host only)
  useEffect(() => {
    if (!isHost) return;
    if (state.auctionStatus !== "bidding") return;
    
    const allTeamIds = Object.keys(state.teamStates);
    if (allTeamIds.length === 0) return;
    
    // Teams that haven't passed (excluding current bidder)
    const teamsNotPassed = allTeamIds.filter(
      tid => !state.passedTeams.includes(tid) && tid !== state.currentBidder
    );
    
    if (teamsNotPassed.length === 0) {
      // All non-bidding teams have passed
      if (state.currentBidder) {
        // Someone has bid → sell immediately
        dispatch({ type: "SET_AUCTION_STATUS", status: "sold" });
      } else {
        // No one bid → unsold
        dispatch({ type: "SET_AUCTION_STATUS", status: "unsold" });
      }
    }
  }, [state.passedTeams, state.currentBidder, state.auctionStatus, state.teamStates, isHost, dispatch]);

  const handleBid = useCallback((customAmount?: number) => {
    if (!myTeamId || !myTeamState) return;
    // If no one has bid yet, first bid is at base price
    const bidAmount = customAmount || (state.currentBidder ? state.currentBid + increment : state.currentBid);
    if (bidAmount > myTeamState.purseRemaining) return;

    if (isHost) {
      dispatch({ type: "PLACE_BID", teamId: myTeamId, amount: bidAmount });
    } else {
      broadcast({ type: "BID_ACTION", teamId: myTeamId, amount: bidAmount });
    }
  }, [myTeamId, myTeamState, state.currentBid, state.currentBidder, increment, dispatch, isHost, broadcast]);

  const handlePass = () => {
    if (!myTeamId) return;
    if (isHost) {
      dispatch({ type: "PASS_BID", teamId: myTeamId });
    } else {
      broadcast({ type: "PASS_ACTION", teamId: myTeamId });
    }
  };

  // Auto-dismiss the "player left" banner
  useEffect(() => {
    if (!leftNotice) return;
    const t = setTimeout(() => setLeftNotice(null), 6000);
    return () => clearTimeout(t);
  }, [leftNotice]);

  // Host ends the auction for everyone — instantly frees the room for a new game
  const handleEndAuction = useCallback(() => {
    broadcast({ type: "END_AUCTION" });
    dispatch({ type: "END_AUCTION" });
  }, [broadcast, dispatch]);

  // A player quits mid-auction: tell everyone, release their squad, clean up the room row
  const handleLeaveAuction = useCallback(async () => {
    const released = myTeamId ? state.teamStates[myTeamId]?.squad.length ?? 0 : 0;
    broadcast({
      type: "PLAYER_LEFT",
      teamId: myTeamId ?? undefined,
      playerId: state.currentUser?.id,
      username: state.currentUser?.username,
      releasedCount: released,
    });
    if (isHost) broadcast({ type: "END_AUCTION" });
    // give the broadcast a moment to flush before the channel tears down
    await new Promise((r) => setTimeout(r, 250));
    if (state.roomId && state.currentUser?.id) {
      await supabase
        .from("room_players")
        .delete()
        .eq("room_id", state.roomId)
        .eq("player_id", state.currentUser.id)
        .then(() => {}, () => {});
    }
    dispatch({ type: "LEAVE_ROOM" });
  }, [broadcast, dispatch, isHost, myTeamId, state.currentUser, state.roomId, state.teamStates]);



  const isPassed = myTeamId ? state.passedTeams.includes(myTeamId) : false;
  const isMyBid = state.currentBidder === myTeamId;
  const bidderTeam = state.currentBidder
    ? state.lobbyPlayers.find((lp) => lp.team?.id === state.currentBidder)?.team
    : null;

  const timerColor =
    state.timer <= 5
      ? "text-destructive"
      : state.timer <= 10
      ? "text-neon-orange"
      : "text-primary";

  const statusText =
    state.auctionStatus === "going_once"
      ? "GOING ONCE..."
      : state.auctionStatus === "going_twice"
      ? "GOING TWICE..."
      : state.auctionStatus === "sold"
      ? "SOLD! 🔨"
      : state.auctionStatus === "unsold"
      ? "UNSOLD"
      : "";

  const currentSetIndex = Math.floor(state.currentPlayerIndex / SET_SIZE);

  if (state.phase === "results") return null;
  if (!currentPlayer) return null;

  // Show set break screen
  if (state.auctionStatus === "set_break") {
    return <SetBreakScreen />;
  }

  return (
    <motion.div
      className="relative min-h-screen flex flex-col auction-stage"
      animate={screenShake ? { x: [0, -5, 5, -3, 3, 0] } : {}}
      transition={{ duration: 0.4 }}
    >
      <AppBackground variant="auction" />
      {/* Auction atmosphere layers */}
      <div className="auction-spotlight" />
      <div className="auction-podium-glow" />
      <div className="auction-edge-glow" />
      <div className="auction-particles">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="auction-particle" />
        ))}
      </div>

      {/* Confetti */}
      <ConfettiEffect trigger={showConfetti} />

      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-primary/20 bg-card/50 backdrop-blur-xl"
        style={{ backgroundImage: "linear-gradient(180deg, hsl(45 100% 51% / 0.06), transparent)" }}>
        <div className="font-display font-bold text-sm text-primary neon-text">
          IPL AUCTION MASTERMIND
        </div>
        <div className="text-xs text-muted-foreground">
          Set {currentSetIndex + 1}/{Math.ceil(state.playerPool.length / SET_SIZE)} • Player {state.currentPlayerIndex + 1} / {state.playerPool.length} • {state.gameMode}
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm font-semibold text-muted-foreground">
            {myTeamState && <TeamCrest teamId={myTeamState.team.id} shortName={myTeamState.team.shortName} colorHex={myTeamState.team.colorHex} size="sm" />} {myTeamState?.team.shortName}
          </div>
          {isHost && (
            <button
              onClick={() => { SFX.click(); setConfirmLeave("end"); }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-display font-bold uppercase tracking-wider bg-neon-orange/10 border border-neon-orange/40 text-neon-orange hover:bg-neon-orange/20 transition-all"
            >
              <Flag className="w-3.5 h-3.5" /> End Auction
            </button>
          )}
          <button
            onClick={() => { SFX.click(); setConfirmLeave("leave"); }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-display font-bold uppercase tracking-wider bg-destructive/10 border border-destructive/40 text-destructive hover:bg-destructive/20 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" /> Leave
          </button>
        </div>
      </div>

      {/* Player-left banner */}
      <AnimatePresence>
        {leftNotice && (
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-[60] glass-card px-5 py-3 border border-destructive/50 text-center"
          >
            <div className="font-display font-bold text-destructive text-sm uppercase tracking-wider">
              {leftNotice.username} left the auction
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Their team is out{leftNotice.released > 0 ? ` — ${leftNotice.released} player${leftNotice.released > 1 ? "s" : ""} return at the end for re-buying` : ""}.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Leave / End confirmation */}
      <AnimatePresence>
        {confirmLeave && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="glass-card p-6 max-w-sm w-full text-center"
            >
              <h3 className="font-display font-black text-xl text-primary neon-text">
                {confirmLeave === "end" ? "End the auction?" : "Leave the auction?"}
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                {confirmLeave === "end"
                  ? "Results are shown to everyone right away and a new game can be started."
                  : "Your team is removed and your bought players go back into the pool at the end for re-buying."}
              </p>
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => { SFX.click(); setConfirmLeave(null); }}
                  className="flex-1 py-2.5 rounded-lg font-display font-bold uppercase text-sm bg-secondary border border-border text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    SFX.click();
                    const action = confirmLeave;
                    setConfirmLeave(null);
                    if (action === "end") handleEndAuction();
                    else handleLeaveAuction();
                  }}
                  className="flex-1 py-2.5 rounded-lg font-display font-bold uppercase text-sm bg-destructive/20 border border-destructive/50 text-destructive hover:bg-destructive/30"
                >
                  {confirmLeave === "end" ? "End Now" : "Leave"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4">
        {/* Left - Auction Info Tabs */}
        <div className="lg:col-span-3">
          <div className="stage-panel panel-rail p-4">
            <AuctionSideTabs />
          </div>
        </div>


        {/* Center - Auction Block */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
          {/* Sold/Unsold overlay */}
          <AnimatePresence>
            {showSold && (
              <motion.div
                initial={{ scale: 0.1, opacity: 0, rotate: -15 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 1.5 }}
                transition={{ type: "spring", damping: 8, stiffness: 200 }}
                className="absolute z-50 font-display font-black text-6xl md:text-8xl"
              >
                {state.auctionStatus === "sold" || (state.soldPlayers.length > 0 && state.soldPlayers[state.soldPlayers.length - 1]?.player.id === currentPlayer?.id) ? (
                  <div className="flex flex-col items-center">
                    <motion.span
                      className="text-neon-green"
                      style={{ textShadow: "0 0 40px hsl(145 100% 45% / 0.8), 0 0 80px hsl(145 100% 45% / 0.3)" }}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.5, repeat: 2 }}
                    >
                      SOLD! 🔨
                    </motion.span>
                    {bidderTeam && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-2xl mt-2"
                        style={{ color: bidderTeam.colorHex }}
                      >
                        <TeamCrest teamId={bidderTeam.id} shortName={bidderTeam.shortName} colorHex={bidderTeam.colorHex} size="md" className="mr-2" />{bidderTeam.name}
                      </motion.div>
                    )}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-3xl text-primary mt-1 neon-text"
                    >
                      {formatPrice(state.currentBid)}
                    </motion.div>
                  </div>
                ) : (
                  <motion.span
                    className="text-destructive"
                    style={{ textShadow: "0 0 30px hsl(0 100% 55% / 0.5)" }}
                    animate={{ opacity: [1, 0.6, 1] }}
                    transition={{ duration: 0.8, repeat: 1 }}
                  >
                    UNSOLD 😔
                  </motion.span>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Going once/twice pulsing background */}
          <AnimatePresence>
            {(state.auctionStatus === "going_once" || state.auctionStatus === "going_twice") && (
              <motion.div
                className="absolute inset-0 rounded-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.15, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                style={{ background: "radial-gradient(circle, hsl(25 100% 55% / 0.3), transparent 70%)" }}
              />
            )}
          </AnimatePresence>

          <motion.div
            key={currentPlayer.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: showSold ? 0.3 : 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="glass-card p-6 md:p-8 w-full max-w-lg text-center relative overflow-hidden"
          >
            {/* Status badge */}
            {statusText && !showSold && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full font-display font-bold text-sm ${
                  state.auctionStatus === "sold"
                    ? "bg-neon-green/20 text-neon-green"
                    : state.auctionStatus === "unsold"
                    ? "bg-destructive/20 text-destructive"
                    : "bg-neon-orange/20 text-neon-orange timer-urgent"
                }`}
              >
                {statusText}
              </motion.div>
            )}

            {/* Player Card Component — remounts per player so the spotlight entrance always plays */}
            <AnimatePresence mode="wait">
              <PlayerCard
                key={currentPlayer.id}
                player={currentPlayer}
                outcome={
                  state.auctionStatus === "sold"
                    ? "sold"
                    : state.auctionStatus === "unsold"
                    ? "unsold"
                    : null
                }
                headerLabel={
                  state.auctionStatus === "sold"
                    ? "Sold"
                    : state.auctionStatus === "unsold"
                    ? "Unsold"
                    : "Player Profile"
                }
              />
            </AnimatePresence>


            {/* Current Bid */}
            <div className={`bg-secondary/50 rounded-xl p-4 mt-3 transition-all ${bidFlash ? "ring-2 ring-primary shadow-[var(--shadow-neon-gold)]" : ""}`}>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Current Bid</div>
              <motion.div
                key={state.currentBid}
                initial={{ scale: 1.2, color: "hsl(45 100% 70%)" }}
                animate={{ scale: 1, color: "hsl(45 100% 51%)" }}
                className="font-display font-black text-4xl md:text-5xl neon-text"
              >
                {formatPrice(state.currentBid)}
              </motion.div>
              {bidderTeam && (
                <motion.div
                  key={state.currentBidder}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm font-bold"
                  style={{ color: bidderTeam.colorHex }}
                >
                  <TeamCrest teamId={bidderTeam.id} shortName={bidderTeam.shortName} colorHex={bidderTeam.colorHex} size="xs" className="mr-1" />{bidderTeam.shortName}
                  {isMyBid && (
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="ml-1"
                    >
                      (YOU! 🎯)
                    </motion.span>
                  )}
                </motion.div>
              )}
            </div>

            {/* Timer */}
            <div className="mt-4">
              <motion.div
                className={`font-display font-black text-5xl ${timerColor} ${state.timer <= 5 ? "timer-urgent" : ""}`}
                animate={state.timer <= 3 ? { scale: [1, 1.15, 1] } : {}}
                transition={{ duration: 0.5 }}
              >
                {state.timer}
              </motion.div>
              <div className="w-full bg-secondary rounded-full h-2.5 mt-2 overflow-hidden">
                <motion.div
                  className={`h-2.5 rounded-full ${state.timer <= 5 ? "bg-destructive" : state.timer <= 10 ? "bg-neon-orange" : ""}`}
                  style={state.timer > 10 ? { background: "var(--gradient-gold)" } : {}}
                  animate={{ width: `${(state.timer / state.timerDuration) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right - Bid Controls */}
        <div className="lg:col-span-3 flex flex-col gap-3">
          <div className="glass-card p-4 text-center">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">My Purse</div>
            <div className="font-display font-black text-3xl text-primary neon-text mt-1">
              {myTeamState ? formatPrice(myTeamState.purseRemaining) : "---"}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Overseas: {myTeamState?.overseasCount || 0}/8
            </div>
          </div>

          <div className="glass-card p-4 space-y-3">
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Place Bid
            </h3>

            {/* Base Price button - shown when no one has bid yet */}
            {!state.currentBidder && (
              <motion.button
                whileTap={{ scale: 0.92 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => { SFX.click(); handleBid(currentPlayer.basePrice); }}
                disabled={isPassed || showSold}
                className="w-full py-3 rounded-lg font-bold text-sm transition-all bg-neon-green/10 border border-neon-green/40 text-neon-green hover:bg-neon-green/20 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                BID AT BASE PRICE ({formatPrice(currentPlayer.basePrice)})
              </motion.button>
            )}

            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 5].map((multiplier) => {
                const bidAmount = state.currentBidder
                  ? state.currentBid + increment * multiplier
                  : currentPlayer.basePrice + increment * multiplier;
                const canAfford = myTeamState && bidAmount <= myTeamState.purseRemaining;
                return (
                  <motion.button
                    key={multiplier}
                    whileTap={{ scale: 0.92 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => { SFX.click(); handleBid(bidAmount); }}
                    disabled={isPassed || isMyBid || !canAfford || showSold}
                    className="py-3 rounded-lg font-bold text-sm transition-all bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 hover:shadow-[var(--shadow-neon-gold)] disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    +{formatPrice(increment * multiplier)}
                  </motion.button>
                );
              })}
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => { SFX.click(); handlePass(); }}
              disabled={isPassed || isMyBid || showSold}
              className={`w-full py-3 rounded-lg font-display font-bold uppercase tracking-wider transition-all ${
                isPassed
                  ? "bg-destructive/20 border border-destructive/30 text-destructive"
                  : "bg-secondary border border-border text-muted-foreground hover:border-destructive/50 hover:text-destructive"
              }`}
            >
              {isPassed ? "PASSED ✗" : "PASS"}
            </motion.button>
          </div>

          <div className="glass-card p-4 flex-1">
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Bid History
            </h3>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {[...state.bidHistory].reverse().slice(0, 8).map((bid, i) => {
                const team = state.lobbyPlayers.find((lp) => lp.team?.id === bid.teamId)?.team;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex justify-between text-xs py-1"
                  >
                    <span style={{ color: team?.colorHex }}>
                      {team && <TeamCrest teamId={team.id} shortName={team.shortName} colorHex={team.colorHex} size="xs" className="mr-1" />}{team?.shortName}
                    </span>
                    <span className="text-primary font-bold">{formatPrice(bid.amount)}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Chat */}
      <GameChat
        roomId={state.roomId}
        userId={state.currentUser?.id || ""}
        username={state.currentUser?.username || ""}
        avatar={state.currentUser?.avatar || "🎮"}
        teamColor={myTeam?.colorHex}
      />
    </motion.div>
  );
}
