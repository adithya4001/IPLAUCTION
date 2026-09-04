import { useGame, AUCTION_YEARS } from "@/context/GameContext";
import { useRoom } from "@/hooks/useRoom";
import { useAuctionSync } from "@/hooks/useAuctionSync";
import { SFX } from "@/hooks/useSoundEffects";
import { getTeamsForYear } from "@/data/teamsByYear";
import { getRetentionRules } from "@/data/retentionRules";
import { RetainedPlayer } from "@/data/teams";
import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import GameChat from "./GameChat";
import RetentionModal from "./RetentionModal";
import AppBackground from "@/components/AppBackground";
import TeamCrest from "@/components/TeamCrest";
import { Zap, Crosshair, Gavel } from "lucide-react";
export default function LobbyScreen() {
  const { state, dispatch } = useGame();
  const currentUserId = state.currentUser?.id;
  const currentPlayer = state.lobbyPlayers.find((lp) => lp.user.id === currentUserId);
  const isHost = currentPlayer?.isHost;
  const roomId = state.roomId;

  const handleLobbyUpdate = useCallback(
    (players: any[], roomData: any) => {
      dispatch({
        type: "SYNC_LOBBY",
        players,
        gameMode: roomData.gameMode,
        timerDuration: roomData.timerDuration,
        roomCode: roomData.roomCode,
        roomId: roomData.roomId,
      });
    },
    [dispatch]
  );

  const handleRoomStarted = useCallback(() => {
    SFX.sold();
    dispatch({ type: "START_AUCTION" });
  }, [dispatch]);

  // Auction sync for broadcasting start
  const handleSyncReceive = useCallback((msg: any) => {
    if (msg.type === "START_AUCTION") {
      dispatch({ type: "START_AUCTION" });
    }
  }, [dispatch]);

  const { broadcast } = useAuctionSync(roomId, isHost || false, handleSyncReceive);

  const {
    selectTeam,
    toggleReady,
    setGameMode,
    setTimerDuration,
    startAuction,
    addBotPlayers,
    leaveRoom,
  } = useRoom(state.currentUser, roomId, handleLobbyUpdate, handleRoomStarted);

  const handleLeaveRoom = async () => {
    if (roomId && currentUserId) {
      await leaveRoom(roomId, currentUserId);
      dispatch({ type: "LEAVE_ROOM" });
    }
  };

  const availableTeams = useMemo(() => getTeamsForYear(state.gameMode), [state.gameMode]);
  const retentionRules = useMemo(() => getRetentionRules(state.gameMode), [state.gameMode]);

  const [showRetentionModal, setShowRetentionModal] = useState(false);
  const [pendingTeamId, setPendingTeamId] = useState<string | null>(null);

  const pendingTeam = useMemo(() =>
    pendingTeamId ? availableTeams.find(t => t.id === pendingTeamId) || null : null,
    [pendingTeamId, availableTeams]
  );

  const takenTeamIds = state.lobbyPlayers
    .filter((lp) => lp.team && lp.user.id !== currentUserId)
    .map((lp) => lp.team!.id);

  const allReady =
    state.lobbyPlayers.length >= 2 &&
    state.lobbyPlayers.every((lp) => lp.isReady && lp.team);

  const handleStartAuction = async () => {
    if (roomId) {
      broadcast({ type: "START_AUCTION" });
      await startAuction(roomId);
    }
  };

  const handleSelectTeam = async (teamId: string) => {
    if (roomId && currentUserId) {
      // If retentions are available for this year, show the retention modal
      if (retentionRules.maxRetentions > 0) {
        setPendingTeamId(teamId);
        setShowRetentionModal(true);
      } else {
        await selectTeam(roomId, currentUserId, teamId);
      }
    }
  };

  const handleRetentionConfirm = async (retentions: RetainedPlayer[], totalSpent: number) => {
    if (pendingTeamId && roomId && currentUserId) {
      dispatch({
        type: "SET_CUSTOM_RETENTIONS",
        teamId: pendingTeamId,
        retentions,
        totalSpent,
      });
      await selectTeam(roomId, currentUserId, pendingTeamId);
      setShowRetentionModal(false);
      setPendingTeamId(null);
    }
  };

  const handleRetentionCancel = () => {
    setShowRetentionModal(false);
    setPendingTeamId(null);
  };

  const handleToggleReady = async () => {
    if (roomId && currentUserId) {
      SFX.ready();
      await toggleReady(roomId, currentUserId, currentPlayer?.isReady || false);
    }
  };

  const handleSetGameMode = async (mode: string) => {
    if (roomId) await setGameMode(roomId, mode);
  };

  const handleSetTimerDuration = async (duration: number) => {
    if (roomId) await setTimerDuration(roomId, duration);
  };

  const handleAddBots = async () => {
    if (roomId) {
      const existingTeamIds = state.lobbyPlayers
        .filter((lp) => lp.team)
        .map((lp) => lp.team!.id);
      await addBotPlayers(roomId, existingTeamIds);
    }
  };

  return (
    <div className="relative min-h-screen p-4 md:p-8">
      <AppBackground variant="auction" />
      {/* Header */}
      <div className="text-center mb-6 relative">
        <button
          onClick={handleLeaveRoom}
          className="absolute left-0 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg border border-destructive/50 bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all text-sm font-bold"
        >
          ← Leave Room
        </button>
        <h1 className="font-display font-bold text-2xl md:text-3xl text-primary neon-text">
          AUCTION LOBBY
        </h1>
        <div className="flex items-center justify-center gap-3 mt-2">
          <span className="text-muted-foreground text-sm">Room Code:</span>
          <span className="font-display font-bold text-xl text-primary tracking-[0.3em] bg-primary/10 px-4 py-1 rounded-lg border border-primary/30">
            {state.roomCode}
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Players in Lobby */}
        <div className="lg:col-span-1">
          <div className="glass-card p-5">
            <h2 className="font-display font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">
              Players ({state.lobbyPlayers.length}/10)
            </h2>
            <div className="space-y-3">
              <AnimatePresence>
                {state.lobbyPlayers.map((lp) => (
                  <motion.div
                    key={lp.user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30"
                  >
                    <span className="text-2xl">{lp.user.avatar}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground truncate">
                        {lp.user.username}
                        {lp.isHost && <span className="text-primary text-xs ml-2">HOST</span>}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {lp.team ? (<span className="inline-flex items-center gap-1"><TeamCrest teamId={lp.team.id} shortName={lp.team.shortName} colorHex={lp.team.colorHex} size="xs" />{lp.team.shortName}</span>) : ("No team selected")}
                      </p>
                    </div>
                    <div
                      className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                        lp.isReady
                          ? "bg-neon-green/20 text-neon-green"
                          : "bg-destructive/20 text-destructive"
                      }`}
                    >
                      {lp.isReady ? "Ready" : "Not Ready"}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Add Bots */}
            {isHost && state.lobbyPlayers.length < 4 && (
              <button
                onClick={handleAddBots}
                className="w-full mt-4 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all text-sm font-semibold"
              >
                + Add Bot Players
              </button>
            )}
          </div>

          {/* Host Controls */}
          {isHost && (
            <div className="glass-card p-5 mt-4">
              <h2 className="font-display font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3">
                Game Settings
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground">Auction Year / Mode</label>
                  <select
                    value={state.gameMode}
                    onChange={(e) => handleSetGameMode(e.target.value)}
                    className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:border-primary mt-1 cursor-pointer appearance-auto"
                    style={{ colorScheme: "dark" }}
                  >
                    {AUCTION_YEARS.map((year) => (
                      <option key={year} value={year} className="bg-secondary text-foreground">
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Timer Pace</label>
                  <div className="flex gap-2 mt-1">
                    {[15, 30].map((d) => (
                      <button
                        key={d}
                        onClick={() => handleSetTimerDuration(d)}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                          state.timerDuration === d
                            ? "bg-primary/20 border border-primary text-primary"
                            : "bg-secondary/50 border border-border text-muted-foreground"
                        }`}
                      >
                        <span className="inline-flex items-center justify-center gap-1">{d}s {d === 15 ? <><Zap className="h-3.5 w-3.5" /> Fast</> : <><Crosshair className="h-3.5 w-3.5" /> Standard</>}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Team Selection */}
        <div className="lg:col-span-2">
          <div className="glass-card p-5">
            <h2 className="font-display font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">
              Select Your Franchise
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {availableTeams.map((team) => {
                const isTaken = takenTeamIds.includes(team.id);
                const isSelected = currentPlayer?.team?.id === team.id;
                const customRet = state.customRetentions[team.id];
                const retCount = customRet ? customRet.retentions.length : team.retainedPlayers.length;
                const spent = customRet ? customRet.totalSpent : team.purseSpentOnRetentions;
                return (
                  <motion.button
                    key={team.id}
                    whileHover={!isTaken ? { scale: 1.05 } : {}}
                    whileTap={!isTaken ? { scale: 0.95 } : {}}
                    onClick={() => {
                      if (!isTaken) handleSelectTeam(team.id);
                    }}
                    disabled={isTaken}
                    className={`p-3 rounded-xl border-2 transition-all text-center ${
                      isSelected
                        ? "border-primary bg-primary/15 shadow-[var(--shadow-neon-gold)]"
                        : isTaken
                        ? "border-border/30 bg-secondary/20 opacity-40 cursor-not-allowed"
                        : "border-border/50 bg-secondary/30 hover:border-primary/40"
                    }`}
                    style={isSelected ? { borderColor: team.colorHex } : {}}
                  >
                    <div className="mb-1 flex justify-center"><TeamCrest teamId={team.id} shortName={team.shortName} colorHex={team.colorHex} size="lg" /></div>
                    <p
                      className="font-display font-bold text-xs"
                      style={isSelected ? { color: team.colorHex } : {}}
                    >
                      {team.shortName}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      ₹{((team.totalPurse - spent) / 100).toFixed(1)}Cr left
                    </p>
                    {retCount > 0 && (
                      <p className="text-[9px] text-primary/70 mt-0.5">{retCount} retained</p>
                    )}
                    {isTaken && <p className="text-[9px] text-destructive mt-1">TAKEN</p>}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Ready + Start */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleToggleReady}
              className={`flex-1 py-4 rounded-xl font-display font-bold text-lg uppercase tracking-wider transition-all ${
                currentPlayer?.isReady
                  ? "bg-neon-green/20 border-2 border-neon-green text-neon-green"
                  : "bg-secondary border-2 border-border text-muted-foreground hover:border-primary/50"
              }`}
            >
              {currentPlayer?.isReady ? "✓ READY" : "CLICK TO READY UP"}
            </button>
            {isHost && (
              <button
                onClick={handleStartAuction}
                disabled={!allReady}
                className="flex-1 py-4 rounded-xl font-display font-bold text-lg uppercase tracking-wider gradient-gold-bg text-primary-foreground transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-[var(--shadow-neon-gold)]"
              >
                <span className="inline-flex items-center justify-center gap-2"><Gavel className="h-5 w-5" /> START AUCTION</span>
              </button>
            )}
          </div>
          {/* Change Retentions button */}
          {currentPlayer?.team && retentionRules.maxRetentions > 0 && (
            <button
              onClick={() => {
                setPendingTeamId(currentPlayer.team!.id);
                setShowRetentionModal(true);
              }}
              className="w-full mt-2 py-2 rounded-lg border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 transition-all text-sm font-bold"
            >
              🔄 Change Retentions ({state.customRetentions[currentPlayer.team!.id]?.retentions.length ?? currentPlayer.team!.retainedPlayers.length} players)
            </button>
          )}
        </div>
      </div>

      {/* Chat */}
      <GameChat
        roomId={state.roomId}
        userId={state.currentUser?.id || ""}
        username={state.currentUser?.username || ""}
        avatar={state.currentUser?.avatar || "🎮"}
        teamColor={currentPlayer?.team?.colorHex}
      />

      {/* Retention Modal */}
      {showRetentionModal && pendingTeam && (
        <RetentionModal
          team={pendingTeam}
          gameMode={state.gameMode}
          onConfirm={handleRetentionConfirm}
          onCancel={handleRetentionCancel}
        />
      )}
    </div>
  );
}
