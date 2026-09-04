// Retention rules per IPL year
// Each slot has a fixed cost. Players fill slots from highest to lowest cost.

export interface RetentionSlot {
  slotNumber: number;
  cost: number; // in lakhs
  label: string;
}

export interface RetentionRules {
  maxRetentions: number;
  maxOverseas: number; // max overseas retentions
  slots: RetentionSlot[];
  totalPurse: number; // in lakhs
}

// Returns retention rules for a given auction year
export function getRetentionRules(year: string): RetentionRules {
  switch (year) {
    case "IPL 2008":
    case "IPL 2009":
    case "IPL 2010":
      // Early era — 3 retentions allowed
      return {
        maxRetentions: 3,
        maxOverseas: 2,
        totalPurse: 8000,
        slots: [
          { slotNumber: 1, cost: 900, label: "Retention 1" },
          { slotNumber: 2, cost: 700, label: "Retention 2" },
          { slotNumber: 3, cost: 500, label: "Retention 3" },
        ],
      };


    case "IPL 2011":
      return {
        maxRetentions: 4,
        maxOverseas: 2,
        totalPurse: 9000,
        slots: [
          { slotNumber: 1, cost: 1000, label: "Retention 1" },
          { slotNumber: 2, cost: 700, label: "Retention 2" },
          { slotNumber: 3, cost: 500, label: "Retention 3" },
          { slotNumber: 4, cost: 300, label: "Retention 4" },
        ],
      };

    case "IPL 2012":
    case "IPL 2013":
      return {
        maxRetentions: 4,
        maxOverseas: 2,
        totalPurse: 9000,
        slots: [
          { slotNumber: 1, cost: 1000, label: "Retention 1" },
          { slotNumber: 2, cost: 800, label: "Retention 2" },
          { slotNumber: 3, cost: 600, label: "Retention 3" },
          { slotNumber: 4, cost: 400, label: "Retention 4" },
        ],
      };

    case "IPL 2014":
    case "IPL 2015":
      return {
        maxRetentions: 5,
        maxOverseas: 2,
        totalPurse: 9000,
        slots: [
          { slotNumber: 1, cost: 1250, label: "Retention 1" },
          { slotNumber: 2, cost: 1100, label: "Retention 2" },
          { slotNumber: 3, cost: 900, label: "Retention 3" },
          { slotNumber: 4, cost: 700, label: "Retention 4" },
          { slotNumber: 5, cost: 500, label: "Retention 5" },
        ],
      };

    case "IPL 2016":
    case "IPL 2017":
      return {
        maxRetentions: 5,
        maxOverseas: 2,
        totalPurse: 9000,
        slots: [
          { slotNumber: 1, cost: 1250, label: "Retention 1" },
          { slotNumber: 2, cost: 1100, label: "Retention 2" },
          { slotNumber: 3, cost: 900, label: "Retention 3" },
          { slotNumber: 4, cost: 700, label: "Retention 4" },
          { slotNumber: 5, cost: 500, label: "Retention 5" },
        ],
      };

    case "IPL 2018":
      // Mega auction — max 3 retentions
      return {
        maxRetentions: 3,
        maxOverseas: 1,
        totalPurse: 9000,
        slots: [
          { slotNumber: 1, cost: 1500, label: "Retention 1" },
          { slotNumber: 2, cost: 1100, label: "Retention 2" },
          { slotNumber: 3, cost: 700, label: "Retention 3" },
        ],
      };

    case "IPL 2019":
    case "IPL 2020":
    case "IPL 2021":
      return {
        maxRetentions: 3,
        maxOverseas: 1,
        totalPurse: 9000,
        slots: [
          { slotNumber: 1, cost: 1500, label: "Retention 1" },
          { slotNumber: 2, cost: 1100, label: "Retention 2" },
          { slotNumber: 3, cost: 700, label: "Retention 3" },
        ],
      };

    case "IPL 2022":
      // Mega auction — max 4 retentions
      return {
        maxRetentions: 4,
        maxOverseas: 2,
        totalPurse: 9000,
        slots: [
          { slotNumber: 1, cost: 1600, label: "Retention 1" },
          { slotNumber: 2, cost: 1200, label: "Retention 2" },
          { slotNumber: 3, cost: 800, label: "Retention 3" },
          { slotNumber: 4, cost: 600, label: "Retention 4" },
        ],
      };

    case "IPL 2023":
    case "IPL 2024":
      return {
        maxRetentions: 4,
        maxOverseas: 2,
        totalPurse: 9000,
        slots: [
          { slotNumber: 1, cost: 1600, label: "Retention 1" },
          { slotNumber: 2, cost: 1200, label: "Retention 2" },
          { slotNumber: 3, cost: 800, label: "Retention 3" },
          { slotNumber: 4, cost: 600, label: "Retention 4" },
        ],
      };

    case "IPL 2025":
    case "IPL 2026":
      // Max 6 retentions
      return {
        maxRetentions: 6,
        maxOverseas: 2,
        totalPurse: 12000,
        slots: [
          { slotNumber: 1, cost: 1800, label: "Retention 1" },
          { slotNumber: 2, cost: 1400, label: "Retention 2" },
          { slotNumber: 3, cost: 1100, label: "Retention 3" },
          { slotNumber: 4, cost: 800, label: "Retention 4" },
          { slotNumber: 5, cost: 500, label: "Retention 5" },
          { slotNumber: 6, cost: 400, label: "Retention 6" },
        ],
      };

    case "Custom Auction":
      return { maxRetentions: 0, maxOverseas: 0, slots: [], totalPurse: 12000 };

    default:
      return { maxRetentions: 0, maxOverseas: 0, slots: [], totalPurse: 12000 };
  }
}

// Get all available players for retention for a given team + year
// This combines the team's default retained players with the auction pool
export function getRetentionCandidates(year: string, teamId: string): { name: string; role: string; country: string; overseas: boolean }[] {
  // We import dynamically to avoid circular deps
  // Instead, this is called from the component which has access to both
  return [];
}

// ===================== Category-based retention policy =====================
// Retentions are constrained by allowed combinations of capped / foreigner / uncapped players.

export type RetentionMode = "none" | "capped-uncapped" | "three-tier";

export interface RetentionCombo {
  capped: number;
  foreigner: number;
  uncapped: number;
}

export interface RetentionPolicy {
  mode: RetentionMode;
  maxRetentions: number;
  cappedCosts: number[]; // ordinal costs (lakhs) for capped/foreign retentions
  uncappedCost: number; // flat cost (lakhs) for every uncapped retention
  combos: RetentionCombo[];
  totalPurse: number;
}

const combo = (capped: number, foreigner: number, uncapped: number): RetentionCombo => ({
  capped,
  foreigner,
  uncapped,
});

// IPL 2025/2026 — capped (incl. overseas) vs uncapped only
const COMBOS_2025: RetentionCombo[] = [
  combo(4, 0, 2), combo(5, 0, 1), combo(3, 0, 1), combo(3, 0, 2), combo(4, 0, 1),
  combo(2, 0, 2), combo(2, 0, 1), combo(1, 0, 2), combo(1, 0, 1), combo(0, 0, 1),
  combo(0, 0, 2), combo(1, 0, 0), combo(2, 0, 0), combo(3, 0, 0), combo(4, 0, 0),
  combo(5, 0, 0),
];

// IPL 2022 mega auction — capped / foreigner / uncapped, max 4
const COMBOS_2022: RetentionCombo[] = [
  combo(2, 0, 0), combo(0, 0, 2), combo(2, 0, 2), combo(1, 2, 1), combo(2, 1, 1),
  combo(0, 2, 2), combo(2, 1, 0), combo(2, 0, 1), combo(1, 0, 0), combo(0, 1, 0),
  combo(0, 0, 1), combo(3, 0, 1), combo(3, 1, 0),
];

// All other years — capped / foreigner / uncapped, max 3
const COMBOS_DEFAULT: RetentionCombo[] = [
  combo(3, 0, 0), combo(0, 2, 1), combo(2, 0, 1), combo(1, 0, 2), combo(0, 3, 0),
  combo(0, 0, 3), combo(1, 0, 0), combo(0, 0, 1), combo(0, 1, 0), combo(2, 1, 0),
];

export function getRetentionPolicy(year: string): RetentionPolicy {
  const rules = getRetentionRules(year);
  const slotCosts = rules.slots.map((s) => s.cost);

  if (year === "Custom Auction" || rules.maxRetentions === 0) {
    return { mode: "none", maxRetentions: 0, cappedCosts: [], uncappedCost: 0, combos: [], totalPurse: rules.totalPurse };
  }

  if (year === "IPL 2025" || year === "IPL 2026") {
    return {
      mode: "capped-uncapped",
      maxRetentions: 6,
      cappedCosts: [1800, 1400, 1100, 1800, 1400],
      uncappedCost: 400,
      combos: COMBOS_2025,
      totalPurse: rules.totalPurse,
    };
  }

  if (year === "IPL 2022") {
    return {
      mode: "three-tier",
      maxRetentions: 4,
      cappedCosts: slotCosts.length ? slotCosts : [1600, 1200, 800, 600],
      uncappedCost: 400,
      combos: COMBOS_2022,
      totalPurse: rules.totalPurse,
    };
  }

  return {
    mode: "three-tier",
    maxRetentions: 3,
    cappedCosts: (slotCosts.length ? slotCosts : [1500, 1100, 700]).slice(0, 3),
    uncappedCost: 400,
    combos: COMBOS_DEFAULT,
    totalPurse: rules.totalPurse,
  };
}

export interface CategoryCounts { capped: number; foreigner: number; uncapped: number }

// Can we still reach a valid combination after adding one more of `category`?
export function canAddCategory(
  policy: RetentionPolicy,
  counts: CategoryCounts,
  category: "capped" | "foreigner" | "uncapped",
): boolean {
  const next: CategoryCounts = { ...counts, [category]: counts[category] + 1 };
  return policy.combos.some(
    (c) => c.capped >= next.capped && c.foreigner >= next.foreigner && c.uncapped >= next.uncapped,
  );
}

export function isValidCombo(policy: RetentionPolicy, counts: CategoryCounts): boolean {
  return policy.combos.some(
    (c) => c.capped === counts.capped && c.foreigner === counts.foreigner && c.uncapped === counts.uncapped,
  );
}
