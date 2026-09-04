import { useGame } from "@/context/GameContext";
import { motion } from "framer-motion";
import AppBackground from "@/components/AppBackground";
import TeamCrest from "@/components/TeamCrest";
import PlayerCard from "@/components/PlayerCard";


function formatPrice(lakhs: number): string {
  if (lakhs >= 100) return `₹${(lakhs / 100).toFixed(2)} Cr`;
  return `₹${lakhs} L`;
}

export default function ResultsScreen() {
  const { state, dispatch } = useGame();

  const teamResults = Object.values(state.teamStates)
    .map((ts) => ({
      ...ts,
      totalSpent: ts.team.totalPurse - ts.purseRemaining,
      totalPlayers: ts.team.retainedPlayers.length + ts.squad.length,
    }))
    .sort((a, b) => b.totalPlayers - a.totalPlayers);

  return (
    <div className="relative min-h-screen p-4 md:p-8">
      <AppBackground variant="trophy" />
      <div className="text-center mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display font-bold text-4xl text-primary neon-text"
        >
          AUCTION COMPLETE! 🏆
        </motion.h1>
        <p className="text-muted-foreground mt-2">
          {state.soldPlayers.length} players sold
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        {teamResults.map((ts, i) => (
          <motion.div
            key={ts.team.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <TeamCrest teamId={ts.team.id} shortName={ts.team.shortName} colorHex={ts.team.colorHex} size="lg" />
              <div>
                <h3 className="font-display font-bold text-lg" style={{ color: ts.team.colorHex }}>
                  {ts.team.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {ts.totalPlayers} players • {formatPrice(ts.purseRemaining)} remaining
                </p>
              </div>
            </div>
            <div className="space-y-1.5 max-h-[320px] overflow-y-auto pr-1">
              {ts.team.retainedPlayers.map((p) => (
                <PlayerCard
                  key={p.name}
                  player={p}
                  variant="compact"
                  animate={false}
                  headerLabel="Retained"
                  subtitle="Retained"
                  priceCaption="Retention"
                  priceTone="gold"
                  priceLabel={formatPrice(p.retentionCost)}
                />
              ))}
              {ts.squad.map((p) => {
                const sold = state.soldPlayers.find((sp) => sp.player.id === p.id);
                return (
                  <PlayerCard
                    key={p.id}
                    player={p}
                    variant="compact"
                    animate={false}
                    outcome="sold"
                    priceCaption="Bought"
                    priceTone="green"
                    priceLabel={formatPrice(sold?.price || 0)}
                  />
                );
              })}
            </div>

          </motion.div>
        ))}
      </div>

      <div className="text-center mt-8">
        <button
          onClick={() => dispatch({ type: "SET_PHASE", phase: "menu" })}
          className="gradient-gold-bg text-primary-foreground font-display font-bold px-8 py-3 rounded-xl uppercase tracking-wider hover:shadow-[var(--shadow-neon-gold)] transition-all"
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
}
