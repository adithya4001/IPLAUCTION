// ============================================================================
// AI Bidding Strategy Agent + Purse Optimiser
// ----------------------------------------------------------------------------
// Pure, deterministic analytics that run locally for the whole auction:
//   • rates the player on the block using that season's stats,
//   • reads your squad gaps, purse and the competition around the table,
//   • returns a BUY / VALUE / AVOID signal with a fair price and a hard max,
//   • flags when live bidding blows past fair value (purse optimiser),
//   • surfaces cheaper backup options still to come in the pool.
// The agent only ever suggests — the user makes the final call.
// ============================================================================

import type { AuctionPlayer } from "@/data/players";
import type { TeamState } from "@/context/GameContext";
import { resolveStats } from "@/data/playerStats";

export type Verdict = "must_buy" | "buy" | "value" | "avoid";

export interface Alternative {
  player: AuctionPlayer;
  rating: number;
  fairValue: number;
}

export interface Advice {
  rating: number; // 0-100 season-adjusted quality
  verdict: Verdict;
  fairValue: number; // lakhs
  maxBid: number; // lakhs — hard ceiling given purse + remaining needs
  needScore: number; // 0-100 how badly your XI needs this role
  competition: number; // 0-100 how hard rivals are likely to chase him
  reasons: string[];
  warnings: string[];
  alternatives: Alternative[];
  slotsLeft: number;
  reserveNeeded: number;
}

const MIN_SQUAD = 18;
const MAX_SQUAD = 25;
const MAX_OVERSEAS = 8;
const MIN_BASE = 30; // lakhs kept in reserve per unfilled slot

const clamp = (n: number, lo: number, hi: number) => Math.min(Math.max(n, lo), hi);

/** 0-100 quality score from the player's stats for the selected season. */
export function ratePlayer(player: AuctionPlayer, year: string): number {
  const s = resolveStats(player, year);
  const perMatch = (v: number) => (s.matches > 0 ? v / s.matches : 0);

  const batScore =
    clamp((s.strikeRate - 110) / 60, 0, 1) * 45 +
    clamp((s.average - 15) / 30, 0, 1) * 35 +
    clamp(perMatch(s.runs) / 35, 0, 1) * 20;

  const bowlScore =
    clamp((9.8 - s.economy) / 3, 0, 1) * 45 +
    clamp(perMatch(s.wickets) / 1.4, 0, 1) * 40 +
    clamp(s.wickets / 120, 0, 1) * 15;

  const experience = clamp(s.matches / 120, 0, 1) * 6;

  let core: number;
  if (player.role === "Bowler") core = bowlScore;
  else if (player.role === "All-Rounder") core = batScore * 0.55 + bowlScore * 0.55;
  else core = batScore;

  return Math.round(clamp(core + experience, 4, 99));
}

interface SquadGaps {
  batters: number;
  bowlers: number;
  allRounders: number;
  keepers: number;
  overseas: number;
  size: number;
}

function gapsOf(team: TeamState | undefined): SquadGaps {
  const squad = team?.squad ?? [];
  const retained = team?.team.retainedPlayers ?? [];
  const roles = [
    ...squad.map((p) => p.role),
    ...retained.map((p) => p.role),
  ];
  const count = (r: string) => roles.filter((x) => x === r).length;
  return {
    batters: count("Batter"),
    bowlers: count("Bowler"),
    allRounders: count("All-Rounder"),
    keepers: count("WK"),
    overseas:
      squad.filter((p) => p.overseas).length + retained.filter((p) => p.overseas).length,
    size: roles.length,
  };
}

/** Target composition for a balanced IPL squad. */
const TARGETS: Record<string, number> = {
  Batter: 6,
  Bowler: 7,
  "All-Rounder": 4,
  WK: 2,
};

function needScoreFor(role: string, gaps: SquadGaps): number {
  const have =
    role === "Batter"
      ? gaps.batters
      : role === "Bowler"
      ? gaps.bowlers
      : role === "All-Rounder"
      ? gaps.allRounders
      : gaps.keepers;
  const target = TARGETS[role] ?? 4;
  const deficit = clamp((target - have) / target, 0, 1);
  return Math.round(deficit * 100);
}

/** How aggressively rivals are likely to bid: purse-rich teams with the same gap. */
function competitionFor(
  player: AuctionPlayer,
  teamStates: Record<string, TeamState>,
  myTeamId: string | null,
): number {
  const rivals = Object.values(teamStates).filter((t) => t.team.id !== myTeamId);
  if (rivals.length === 0) return 0;
  let score = 0;
  for (const r of rivals) {
    const g = gapsOf(r);
    if (g.size >= MAX_SQUAD) continue;
    if (player.overseas && g.overseas >= MAX_OVERSEAS) continue;
    const need = needScoreFor(player.role, g) / 100;
    const purse = clamp(r.purseRemaining / 4000, 0, 1);
    score += need * 0.6 + purse * 0.4;
  }
  return Math.round(clamp((score / rivals.length) * 100, 0, 100));
}

/** Market-fair price for the player this season, before your own needs. */
export function fairValueOf(
  player: AuctionPlayer,
  year: string,
  competition: number,
): number {
  const rating = ratePlayer(player, year);
  const base = player.basePrice || 50;
  // Elite players command a steep premium over base; fringe players stay near it.
  const multiplier = 0.9 + Math.pow(rating / 100, 2.2) * 9;
  const compBoost = 1 + (competition / 100) * 0.35;
  const raw = base * multiplier * compBoost;
  return Math.round(clamp(raw, base, 3000) / 5) * 5;
}

export interface AdviceInput {
  player: AuctionPlayer;
  year: string;
  myTeamId: string | null;
  teamStates: Record<string, TeamState>;
  currentBid: number;
  /** Players still to come after the one on the block. */
  upcoming: AuctionPlayer[];
}

export function analyzePlayer(input: AdviceInput): Advice {
  const { player, year, myTeamId, teamStates, currentBid, upcoming } = input;
  const me = myTeamId ? teamStates[myTeamId] : undefined;
  const gaps = gapsOf(me);
  const purse = me?.purseRemaining ?? 0;

  const rating = ratePlayer(player, year);
  const need = needScoreFor(player.role, gaps);
  const competition = competitionFor(player, teamStates, myTeamId);
  const fairValue = fairValueOf(player, year, competition);

  const slotsLeft = Math.max(MIN_SQUAD - gaps.size, 0);
  const reserveNeeded = Math.max(slotsLeft - 1, 0) * MIN_BASE;
  const spendable = Math.max(purse - reserveNeeded, 0);

  // Your ceiling: fair value stretched by how badly you need the role, then
  // hard-capped by what you can actually afford while still filling the XI.
  const needStretch = 1 + (need / 100) * 0.45;
  let maxBid = Math.round(Math.min(fairValue * needStretch, spendable) / 5) * 5;

  const reasons: string[] = [];
  const warnings: string[] = [];
  const s = resolveStats(player, year);

  if (player.role === "Bowler") {
    reasons.push(`${s.wickets} wickets in ${s.matches} games at an economy of ${s.economy}.`);
  } else if (player.role === "All-Rounder") {
    reasons.push(
      `${s.runs} runs at SR ${s.strikeRate} plus ${s.wickets} wickets — two-in-one value.`,
    );
  } else {
    reasons.push(`${s.runs} runs at an average of ${s.average} and SR ${s.strikeRate}.`);
  }

  if (rating >= 78) reasons.push(`Top-bracket ${player.role.toLowerCase()} form heading into ${year}.`);
  else if (rating >= 60) reasons.push(`Solid ${year} numbers — a dependable first-XI option.`);
  else if (rating >= 42) reasons.push(`Squad-filler numbers for ${year} — value only at a low price.`);
  else reasons.push(`Form dipped ahead of ${year}; the numbers do not justify a chase.`);

  if (need >= 60) reasons.push(`You are short of ${player.role.toLowerCase()}s — high squad need.`);
  else if (need <= 20) reasons.push(`Your ${player.role.toLowerCase()} slots are close to full.`);

  if (competition >= 60) reasons.push("Several rival teams have the purse and the same gap — expect a war.");

  // Hard blockers
  if (player.overseas && gaps.overseas >= MAX_OVERSEAS) {
    warnings.push("Overseas quota full — you cannot fit this player.");
    maxBid = 0;
  }
  if (gaps.size >= MAX_SQUAD) {
    warnings.push("Squad is full at 25 players.");
    maxBid = 0;
  }
  if (purse < (player.basePrice || 0)) {
    warnings.push("Base price is above your remaining purse.");
    maxBid = 0;
  }
  if (slotsLeft > 0 && reserveNeeded > 0) {
    reasons.push(
      `Keep ₹${(reserveNeeded / 100).toFixed(2)} Cr aside for the ${slotsLeft} slots you still must fill.`,
    );
  }

  // Purse optimiser alerts on the live bid
  if (maxBid > 0 && currentBid > fairValue * 1.15) {
    const over = Math.round(((currentBid - fairValue) / Math.max(fairValue, 1)) * 100);
    warnings.push(
      `Bidding is ${over}% above his ${year} fair value of ${fmt(fairValue)} — the stats do not back this price.`,
    );
  }
  if (maxBid > 0 && currentBid > maxBid) {
    warnings.push(`Past your ceiling of ${fmt(maxBid)}. Walking away protects the rest of your squad.`);
  }
  if (maxBid > 0 && currentBid > purse * 0.4 && slotsLeft > 3) {
    warnings.push(
      `This one buy eats ${Math.round((currentBid / Math.max(purse, 1)) * 100)}% of your purse with ${slotsLeft} slots left.`,
    );
  }

  let verdict: Verdict;
  const priceOk = currentBid <= fairValue * 1.05;
  if (maxBid === 0) verdict = "avoid";
  else if (rating >= 72 && need >= 45 && priceOk) verdict = "must_buy";
  else if (rating >= 58 && priceOk) verdict = "buy";
  else if (currentBid <= fairValue * 0.75 && rating >= 45) verdict = "value";
  else if (currentBid > maxBid || rating < 42) verdict = "avoid";
  else verdict = "value";

  return {
    rating,
    verdict,
    fairValue,
    maxBid,
    needScore: need,
    competition,
    reasons,
    warnings,
    alternatives: findAlternatives(player, year, upcoming, teamStates, myTeamId, Math.max(maxBid, spendable)),
    slotsLeft,
    reserveNeeded,
  };
}

/** Cheaper players still to come who cover the same role at a similar level. */
export function findAlternatives(
  player: AuctionPlayer,
  year: string,
  upcoming: AuctionPlayer[],
  teamStates: Record<string, TeamState>,
  myTeamId: string | null,
  budget: number,
): Alternative[] {
  const baseRating = ratePlayer(player, year);
  const out: Alternative[] = [];
  for (const p of upcoming) {
    if (p.id === player.id) continue;
    if (p.role !== player.role) continue;
    const rating = ratePlayer(p, year);
    if (rating < baseRating * 0.72) continue;
    const comp = competitionFor(p, teamStates, myTeamId);
    const fv = fairValueOf(p, year, comp);
    if (fv > budget) continue;
    out.push({ player: p, rating, fairValue: fv });
  }
  // Best value first: quality per rupee.
  out.sort((a, b) => b.rating / Math.max(b.fairValue, 1) - a.rating / Math.max(a.fairValue, 1));
  return out.slice(0, 4);
}

/** Bargains anywhere in the remaining pool that fit the purse right now. */
export function findBargains(
  year: string,
  upcoming: AuctionPlayer[],
  teamStates: Record<string, TeamState>,
  myTeamId: string | null,
  limit = 5,
): Alternative[] {
  const me = myTeamId ? teamStates[myTeamId] : undefined;
  const gaps = gapsOf(me);
  const purse = me?.purseRemaining ?? 0;
  const slotsLeft = Math.max(MIN_SQUAD - gaps.size, 0);
  const spendable = Math.max(purse - Math.max(slotsLeft - 1, 0) * MIN_BASE, 0);

  const scored = upcoming
    .filter((p) => !(p.overseas && gaps.overseas >= MAX_OVERSEAS))
    .map((p) => {
      const rating = ratePlayer(p, year);
      const fv = fairValueOf(p, year, competitionFor(p, teamStates, myTeamId));
      return { player: p, rating, fairValue: fv };
    })
    .filter((a) => a.fairValue <= spendable && a.rating >= 45)
    .map((a) => ({
      ...a,
      score:
        (a.rating / Math.max(a.fairValue, 1)) * (1 + needScoreFor(a.player.role, gaps) / 100),
    }))
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(({ player, rating, fairValue }) => ({ player, rating, fairValue }));
}

export function fmt(lakhs: number): string {
  if (lakhs >= 100) return `₹${(lakhs / 100).toFixed(2)} Cr`;
  return `₹${lakhs} L`;
}

export const VERDICT_META: Record<Verdict, { label: string; tone: string; ring: string }> = {
  must_buy: { label: "Must Buy", tone: "text-neon-green", ring: "border-neon-green/60" },
  buy: { label: "Buy", tone: "text-neon-green", ring: "border-neon-green/40" },
  value: { label: "Only At Value", tone: "text-primary", ring: "border-primary/50" },
  avoid: { label: "Avoid", tone: "text-destructive", ring: "border-destructive/50" },
};

export { MIN_SQUAD, MAX_SQUAD, MAX_OVERSEAS };
