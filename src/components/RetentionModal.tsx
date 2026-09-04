import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  getRetentionRules,
  getRetentionPolicy,
  canAddCategory,
  isValidCombo,
  CategoryCounts,
} from "@/data/retentionRules";
import { getTeamsForYear } from "@/data/teamsByYear";
import { getPreviousSeasonSquad } from "@/data/teamSquads";
import { getPlayersForYear } from "@/data/playersByYear";

import { getPlayerCategory, PlayerCategory } from "@/data/playerCategory";
import { IPLTeam, RetainedPlayer } from "@/data/teams";
import TeamCrest from "@/components/TeamCrest";
import PlayerCard from "@/components/PlayerCard";


interface RetentionModalProps {
  team: IPLTeam;
  gameMode: string;
  onConfirm: (retentions: RetainedPlayer[], totalSpent: number) => void;
  onCancel: () => void;
}

interface Candidate {
  name: string;
  role: string;
  country: string;
  overseas: boolean;
  source: "retained" | "pool";
  category: PlayerCategory; // effective category (foreigner merged into capped in 2-tier modes)
}

export default function RetentionModal({ team, gameMode, onConfirm, onCancel }: RetentionModalProps) {
  const rules = getRetentionRules(gameMode);
  const policy = getRetentionPolicy(gameMode);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [roleFilter, setRoleFilter] = useState<string>("All");

  // Build candidate pool: only players from the team's previous season squad
  const candidates = useMemo<Candidate[]>(() => {
    const yearTeams = getTeamsForYear(gameMode);
    const yearTeam = yearTeams.find(t => t.id === team.id);
    const defaultRetained = yearTeam?.retainedPlayers || [];
    const previousSquad = getPreviousSeasonSquad(gameMode, team.id);

    const candidateMap = new Map<string, Candidate>();
    const retainedNames = new Set(defaultRetained.map(p => p.name));

    const categorize = (p: { name: string; overseas: boolean }): PlayerCategory => {
      const cat = getPlayerCategory(gameMode, p);
      if (policy.mode === "capped-uncapped" && cat === "foreigner") return "capped";
      return cat;
    };

    previousSquad.forEach(p => {
      candidateMap.set(p.name, {
        name: p.name, role: p.role, country: p.country, overseas: p.overseas,
        source: retainedNames.has(p.name) ? "retained" : "pool",
        category: categorize(p),
      });
    });

    defaultRetained.forEach(p => {
      if (!candidateMap.has(p.name)) {
        candidateMap.set(p.name, {
          name: p.name, role: p.role, country: p.country, overseas: p.overseas,
          source: "retained", category: categorize(p),
        });
      }
    });

    // Early years (2008–2010) have no previous-season squad data —
    // let managers pick their retentions from that season's player pool.
    if (candidateMap.size === 0) {
      getPlayersForYear(gameMode).forEach(p => {
        if (candidateMap.has(p.name)) return;
        candidateMap.set(p.name, {
          name: p.name, role: p.role, country: p.country, overseas: p.overseas,
          source: "pool", category: categorize(p),
        });
      });
    }

    return Array.from(candidateMap.values());
  }, [team.id, gameMode, policy.mode]);


  const findCandidate = (name: string) => candidates.find(c => c.name === name);

  const counts: CategoryCounts = useMemo(() => {
    const c: CategoryCounts = { capped: 0, foreigner: 0, uncapped: 0 };
    selectedPlayers.forEach(name => {
      const cand = findCandidate(name);
      if (cand) c[cand.category] += 1;
    });
    return c;
  }, [selectedPlayers, candidates]);

  // Costs: capped/foreign retentions take ordinal slot prices, uncapped a flat price
  const costs = useMemo(() => {
    const map = new Map<string, number>();
    let cappedIdx = 0;
    selectedPlayers.forEach(name => {
      const cand = findCandidate(name);
      if (!cand) return;
      if (cand.category === "uncapped") {
        map.set(name, policy.uncappedCost);
      } else {
        const cost = policy.cappedCosts[cappedIdx] ?? policy.cappedCosts[policy.cappedCosts.length - 1] ?? 0;
        map.set(name, cost);
        cappedIdx += 1;
      }
    });
    return map;
  }, [selectedPlayers, candidates, policy]);

  const totalSpent = Array.from(costs.values()).reduce((a, b) => a + b, 0);
  const purseRemaining = policy.totalPurse - totalSpent;
  const comboValid = isValidCombo(policy, counts);

  const togglePlayer = (name: string) => {
    const candidate = findCandidate(name);
    if (!candidate) return;

    if (selectedPlayers.includes(name)) {
      setSelectedPlayers(prev => prev.filter(n => n !== name));
      return;
    }
    if (selectedPlayers.length >= policy.maxRetentions) return;
    if (!canAddCategory(policy, counts, candidate.category)) return;
    setSelectedPlayers(prev => [...prev, name]);
  };

  const handleConfirm = () => {
    if (!comboValid) return;
    const retentions: RetainedPlayer[] = selectedPlayers.map(name => {
      const candidate = findCandidate(name)!;
      return {
        name: candidate.name,
        role: candidate.role as RetainedPlayer["role"],
        country: candidate.country,
        overseas: candidate.overseas,
        retentionCost: costs.get(name) ?? 0,
      };
    });
    onConfirm(retentions, totalSpent);
  };

  if (policy.mode === "none" || rules.maxRetentions === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card p-6 max-w-md w-full text-center"
        >
          <h2 className="font-display font-bold text-xl text-primary mb-3">No Retentions Available</h2>
          <p className="text-muted-foreground text-sm mb-4">
            {gameMode} doesn't have retention rules. All players go to the auction pool.
          </p>
          <button
            onClick={() => onConfirm([], 0)}
            className="px-6 py-3 rounded-xl gradient-gold-bg text-primary-foreground font-display font-bold"
          >
            Continue to Lobby
          </button>
        </motion.div>
      </div>
    );
  }

  const roles = ["All", "Batter", "Bowler", "All-Rounder", "WK"];
  const filterByRole = (list: Candidate[]) =>
    roleFilter === "All" ? list : list.filter(c => c.role === roleFilter);

  const columns: { key: PlayerCategory; title: string; hint: string }[] =
    policy.mode === "capped-uncapped"
      ? [
          { key: "capped", title: "Capped Players", hint: `₹${(policy.cappedCosts[0] / 100).toFixed(0)}Cr / ₹${(policy.cappedCosts[1] / 100).toFixed(0)}Cr / ₹${(policy.cappedCosts[2] / 100).toFixed(0)}Cr` },
          { key: "uncapped", title: "Uncapped Players", hint: `₹${(policy.uncappedCost / 100).toFixed(0)}Cr each` },
        ]
      : [
          { key: "capped", title: "Capped (Indian)", hint: "Slot price" },
          { key: "foreigner", title: "Foreigners", hint: "Slot price" },
          { key: "uncapped", title: "Uncapped", hint: `₹${(policy.uncappedCost / 100).toFixed(0)}Cr each` },
        ];

  const nextCappedCost =
    policy.cappedCosts[counts.capped + counts.foreigner] ??
    policy.cappedCosts[policy.cappedCosts.length - 1] ??
    0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-card p-5 max-w-5xl w-full max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-display font-bold text-xl text-primary">
              <TeamCrest teamId={team.id} shortName={team.shortName} colorHex={team.colorHex} size="md" className="mr-2" />{team.shortName} — Choose Retentions
            </h2>
            <p className="text-muted-foreground text-xs mt-1">
              {gameMode} • Max {policy.maxRetentions} retentions • Only valid category combinations allowed
            </p>
          </div>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground text-2xl">✕</button>
        </div>

        {/* Disclaimer */}
        <div className="mb-3 p-3 rounded-lg border border-primary/30 bg-primary/5 text-xs text-muted-foreground">
          {policy.mode === "capped-uncapped" ? (
            <>
              ⓘ Capped players are retained at{" "}
              <span className="text-primary font-bold">
                {policy.cappedCosts.map(c => `₹${(c / 100).toFixed(0)}Cr`).join(", ")}
              </span>{" "}
              (in the order you pick them). Uncapped players are retained at{" "}
              <span className="text-neon-green font-bold">₹{(policy.uncappedCost / 100).toFixed(0)}Cr</span> each.
            </>
          ) : (
            <>
              ⓘ Capped and overseas players are retained at{" "}
              <span className="text-primary font-bold">
                {policy.cappedCosts.map(c => `₹${(c / 100).toFixed(0)}Cr`).join(", ")}
              </span>{" "}
              (in pick order). Uncapped players are retained at{" "}
              <span className="text-neon-green font-bold">₹{(policy.uncappedCost / 100).toFixed(0)}Cr</span> each.
            </>
          )}
        </div>

        {/* Summary bar */}
        <div className="flex gap-4 mb-3 p-3 rounded-lg bg-secondary/40 border border-border">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Retained</p>
            <p className="font-display font-bold text-foreground">
              {selectedPlayers.length} / {policy.maxRetentions}
            </p>
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">
              {policy.mode === "capped-uncapped" ? "Capped / Uncapped" : "Capped / Foreign / Uncapped"}
            </p>
            <p className="font-display font-bold text-foreground">
              {policy.mode === "capped-uncapped"
                ? `${counts.capped} / ${counts.uncapped}`
                : `${counts.capped} / ${counts.foreigner} / ${counts.uncapped}`}
            </p>
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Spent on Retentions</p>
            <p className="font-display font-bold text-primary">₹{(totalSpent / 100).toFixed(1)} Cr</p>
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Purse for Auction</p>
            <p className="font-display font-bold text-neon-green">₹{(purseRemaining / 100).toFixed(1)} Cr</p>
          </div>
        </div>

        {/* Selected retentions */}
        {selectedPlayers.length > 0 && (
          <div className="grid gap-2 mb-3 sm:grid-cols-2 lg:grid-cols-3">
            {selectedPlayers.map((name, idx) => {
              const cand = findCandidate(name);
              if (!cand) return null;
              return (
                <PlayerCard
                  key={name}
                  player={cand}
                  variant="compact"
                  selected
                  subtitle={`Retention ${idx + 1} • ${cand.category}`}
                  priceCaption="Cost"
                  priceTone="gold"
                  priceLabel={`₹${((costs.get(name) ?? 0) / 100).toFixed(1)}Cr`}
                  rightSlot={
                    <button
                      onClick={() => togglePlayer(name)}
                      className="text-destructive text-[10px] hover:underline flex-shrink-0"
                    >
                      Remove
                    </button>
                  }
                />
              );
            })}
          </div>

        )}

        {/* Role filter */}
        <div className="flex gap-2 mb-3">
          {roles.map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                roleFilter === r
                  ? "bg-primary/20 text-primary border border-primary/50"
                  : "bg-secondary/30 text-muted-foreground border border-border/30 hover:border-primary/30"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Category columns */}
        <div className={`flex-1 overflow-y-auto min-h-0 grid gap-4 ${columns.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
          {columns.map(col => {
            const list = filterByRole(candidates.filter(c => c.category === col.key));
            const canAdd = canAddCategory(policy, counts, col.key) && selectedPlayers.length < policy.maxRetentions;
            return (
              <div key={col.key}>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span className={col.key === "uncapped" ? "text-neon-green" : "text-primary"}>
                    {col.title} ({list.length})
                  </span>
                  <span className="text-[10px] text-muted-foreground font-normal">{col.hint}</span>
                </h3>
                <div className="space-y-2">
                  {list.map(p => {
                    const isSelected = selectedPlayers.includes(p.name);
                    return (
                      <PlayerRow
                        key={p.name}
                        player={p}
                        isSelected={isSelected}
                        disabled={!isSelected && !canAdd}
                        onToggle={() => togglePlayer(p.name)}
                        slotCost={
                          isSelected
                            ? costs.get(p.name)
                            : p.category === "uncapped"
                            ? policy.uncappedCost
                            : nextCappedCost
                        }
                      />
                    );
                  })}
                  {list.length === 0 && (
                    <p className="text-[11px] text-muted-foreground italic">No players in this category.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="mt-3">
          {!comboValid && (
            <p className="text-[11px] text-destructive mb-2">
              This combination isn't allowed for {gameMode}. Adjust your picks to a valid capped/uncapped mix.
            </p>
          )}
          <div className="flex gap-3 pt-3 border-t border-border">
            <button
              onClick={() => onConfirm([], 0)}
              className="flex-1 py-3 rounded-xl border border-border text-muted-foreground hover:text-foreground font-display font-bold text-sm"
            >
              Skip Retentions
            </button>
            <button
              onClick={handleConfirm}
              disabled={!comboValid}
              className={`flex-1 py-3 rounded-xl font-display font-bold text-sm ${
                comboValid
                  ? "gradient-gold-bg text-primary-foreground"
                  : "bg-secondary/40 text-muted-foreground cursor-not-allowed"
              }`}
            >
              Confirm {selectedPlayers.length} Retention{selectedPlayers.length !== 1 ? "s" : ""} — ₹{(totalSpent / 100).toFixed(1)}Cr
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function PlayerRow({
  player,
  isSelected,
  disabled,
  onToggle,
  slotCost,
}: {
  player: { name: string; role: string; country: string; overseas: boolean; source: string };
  isSelected: boolean;
  disabled: boolean;
  onToggle: () => void;
  slotCost?: number;
}) {
  const blocked = disabled && !isSelected;
  return (
    <button
      onClick={onToggle}
      disabled={blocked}
      className={`block w-full text-left transition-all ${
        blocked ? "opacity-40 cursor-not-allowed" : "hover:scale-[1.01]"
      }`}
    >
      <PlayerCard
        player={player}
        variant="compact"
        animate={false}
        selected={isSelected}
        subtitle={player.source === "retained" ? "⭐ Previous retention" : undefined}
        priceCaption={isSelected ? "Retention" : "Slot price"}
        priceTone={isSelected ? "gold" : "muted"}
        priceLabel={slotCost !== undefined ? `₹${(slotCost / 100).toFixed(1)}Cr` : "—"}
        leftSlot={
          <span
            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 text-xs ${
              isSelected ? "border-primary bg-primary text-primary-foreground" : "border-border"
            }`}
          >
            {isSelected ? "✓" : ""}
          </span>
        }
      />
    </button>
  );
}

