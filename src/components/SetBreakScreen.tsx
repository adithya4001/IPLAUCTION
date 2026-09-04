import { useGame, SET_SIZE } from "@/context/GameContext";
import { motion } from "framer-motion";
import AppBackground from "@/components/AppBackground";
import TeamCrest from "@/components/TeamCrest";
import PlayerCard from "@/components/PlayerCard";


function formatPrice(lakhs: number): string {
  if (lakhs >= 100) return `₹${(lakhs / 100).toFixed(2)} Cr`;
  return `₹${lakhs} L`;
}

export default function SetBreakScreen() {
  const { state, dispatch } = useGame();
  const isHost = state.lobbyPlayers.find(
    (lp) => lp.user.id === state.currentUser?.id
  )?.isHost || false;

  const completedSetIndex = state.currentSet - 1;
  const setStart = completedSetIndex * SET_SIZE;
  const setEnd = Math.min(setStart + SET_SIZE, state.playerPool.length);
  const setPlayers = state.playerPool.slice(setStart, setEnd);

  const soldInSet = state.soldPlayers.filter((sp) =>
    setPlayers.some((p) => p.id === sp.player.id)
  );
  const unsoldInSet = state.unsoldPlayers.filter((up) =>
    setPlayers.some((p) => p.id === up.id)
  );

  return (
    <motion.div
      className="relative min-h-screen flex flex-col items-center justify-center p-6"
     
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <AppBackground variant="stadium" />
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="glass-card p-8 max-w-4xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="font-display font-black text-3xl text-primary neon-text">
            SET {completedSetIndex + 1} COMPLETE
          </h2>
          <p className="text-muted-foreground mt-1">Auction break • Next set starting in</p>
          <motion.div
            className="font-display font-black text-5xl text-primary mt-2"
            animate={state.setBreakTimer <= 5 ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.5 }}
          >
            {state.setBreakTimer}s
          </motion.div>
          <div className="w-48 mx-auto bg-secondary rounded-full h-2 mt-2 overflow-hidden">
            <motion.div
              className="h-2 rounded-full"
              style={{ background: "var(--gradient-gold)" }}
              animate={{ width: `${(state.setBreakTimer / 30) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Set Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Sold Players in Set */}
          <div className="bg-secondary/30 rounded-xl p-4">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-neon-green mb-3">
              ✅ Sold ({soldInSet.length})
            </h3>
            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
              {soldInSet.map((sp) => {
                const team = Object.values(state.teamStates).find(
                  (ts) => ts.team.id === sp.teamId
                )?.team;
                return (
                  <PlayerCard
                    key={sp.player.id}
                    player={sp.player}
                    variant="compact"
                    outcome="sold"
                    priceCaption="Sold"
                    priceTone="green"
                    priceLabel={formatPrice(sp.price)}
                    subtitle={
                      team ? (
                        <span className="inline-flex items-center gap-1" style={{ color: team.colorHex }}>
                          <TeamCrest teamId={team.id} shortName={team.shortName} colorHex={team.colorHex} size="xs" />
                          {team.shortName}
                        </span>
                      ) : undefined
                    }
                  />
                );
              })}
              {soldInSet.length === 0 && (
                <p className="text-muted-foreground text-xs">No players sold in this set</p>
              )}
            </div>
          </div>

          {/* Unsold Players in Set */}
          <div className="bg-secondary/30 rounded-xl p-4">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-destructive mb-3">
              ❌ Unsold ({unsoldInSet.length})
            </h3>
            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
              {unsoldInSet.map((p) => (
                <PlayerCard
                  key={p.id}
                  player={p}
                  variant="compact"
                  outcome="unsold"
                  priceCaption="Unsold at"
                  priceTone="red"
                  priceLabel={formatPrice(p.basePrice)}
                />
              ))}
              {unsoldInSet.length === 0 && (
                <p className="text-muted-foreground text-xs">No unsold players in this set</p>
              )}
            </div>
          </div>
        </div>


        {/* Team Status */}
        <div className="bg-secondary/30 rounded-xl p-4">
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
            📊 Team Summary
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.values(state.teamStates).map((ts) => {
              const teamSold = state.soldPlayers.filter((sp) => sp.teamId === ts.team.id);
              const totalSpent = teamSold.reduce((sum, sp) => sum + sp.price, 0);
              return (
                <div
                  key={ts.team.id}
                  className="bg-card/40 rounded-lg p-3 border border-border/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm" style={{ color: ts.team.colorHex }}>
                      <TeamCrest teamId={ts.team.id} shortName={ts.team.shortName} colorHex={ts.team.colorHex} size="sm" className="mr-1" />{ts.team.shortName}
                    </span>
                    <span className="text-primary font-bold text-sm">
                      {formatPrice(ts.purseRemaining)}
                    </span>
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>Bought: {teamSold.length}</span>
                    <span>Spent: {formatPrice(totalSpent)}</span>
                    <span>Squad: {ts.squad.length + ts.team.retainedPlayers.length}/25</span>
                    <span>OS: {ts.overseasCount}/8</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Skip button for host */}
        {isHost && (
          <div className="text-center mt-6">
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => dispatch({ type: "END_SET_BREAK" })}
              className="px-6 py-3 rounded-lg font-display font-bold text-sm bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 transition-all"
            >
              SKIP BREAK →
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
