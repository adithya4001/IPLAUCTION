// ============================================================================
// Player statistics layer
// ----------------------------------------------------------------------------
// Goal: EVERY player card in the app shows a complete stat block, for every
// auction year. Two sources feed it:
//   1. CAREER_STATS — curated IPL career numbers for well-known players.
//   2. A deterministic season model — for players without curated numbers, a
//      stable (seeded by name + year, so it never changes between renders or
//      between two clients in the same room) role/base-price aware profile.
// Everything is then adjusted for the auction season so a 2019 card reflects
// how the player was viewed in 2019, not their 2025 career total.
// ============================================================================

import type { AuctionPlayer, PlayerStats } from "./players";

export interface FullPlayerStats {
  matches: number;
  runs: number;
  wickets: number;
  strikeRate: number;
  average: number;
  economy: number;
}

const norm = (n: string) => n.toLowerCase().replace(/[^a-z]/g, "");

/** Curated IPL career stats (matches, runs, wickets, SR, avg, econ). */
const CAREER_STATS: Record<string, Partial<FullPlayerStats>> = {};

function seed(
  name: string,
  matches: number,
  runs: number,
  wickets: number,
  strikeRate: number,
  average: number,
  economy: number,
) {
  CAREER_STATS[norm(name)] = { matches, runs, wickets, strikeRate, average, economy };
}

/* -------------------- Batters / wicket-keepers -------------------- */
seed("Virat Kohli", 252, 8004, 4, 131.9, 38.7, 8.8);
seed("Rohit Sharma", 257, 6628, 15, 130.6, 29.6, 8.0);
seed("Shikhar Dhawan", 222, 6769, 0, 127.1, 35.3, 0);
seed("David Warner", 184, 6565, 0, 139.8, 40.5, 0);
seed("Suresh Raina", 205, 5528, 25, 136.7, 32.5, 7.7);
seed("MS Dhoni", 264, 5243, 0, 135.9, 38.8, 0);
seed("AB de Villiers", 184, 5162, 0, 151.7, 39.7, 0);
seed("Chris Gayle", 142, 4965, 18, 148.9, 39.7, 7.5);
seed("Robin Uthappa", 205, 4952, 0, 130.4, 27.5, 0);
seed("KL Rahul", 142, 5222, 0, 134.5, 45.5, 0);
seed("Dinesh Karthik", 257, 4842, 0, 135.4, 26.3, 0);
seed("Gautam Gambhir", 154, 4217, 0, 123.9, 31.0, 0);
seed("Sachin Tendulkar", 78, 2334, 0, 119.8, 34.8, 0);
seed("Virender Sehwag", 104, 2728, 6, 155.4, 27.6, 7.6);
seed("Ajinkya Rahane", 185, 4642, 0, 124.0, 30.5, 0);
seed("Faf du Plessis", 145, 4571, 0, 133.0, 34.6, 0);
seed("Shreyas Iyer", 132, 3546, 0, 128.0, 32.2, 0);
seed("Rishabh Pant", 122, 3474, 0, 147.9, 35.1, 0);
seed("Jos Buttler", 107, 3582, 0, 148.5, 39.4, 0);
seed("Quinton de Kock", 107, 3268, 0, 134.1, 32.0, 0);
seed("Sanju Samson", 174, 4238, 0, 138.9, 30.1, 0);
seed("Ishan Kishan", 111, 2644, 0, 135.7, 28.4, 0);
seed("Ruturaj Gaikwad", 68, 2380, 0, 136.7, 40.3, 0);
seed("Shubman Gill", 122, 3800, 0, 136.5, 38.3, 0);
seed("Yashasvi Jaiswal", 61, 2076, 0, 151.9, 34.6, 0);
seed("Suryakumar Yadav", 154, 3900, 0, 145.6, 32.5, 0);
seed("Manish Pandey", 175, 3846, 0, 121.5, 29.4, 0);
seed("Ambati Rayudu", 204, 4348, 0, 127.0, 28.4, 0);
seed("Devon Conway", 30, 1080, 0, 141.0, 43.2, 0);
seed("Prithvi Shaw", 79, 1892, 0, 147.5, 25.2, 0);
seed("Mayank Agarwal", 127, 2661, 0, 134.0, 22.5, 0);
seed("Jonny Bairstow", 51, 1587, 0, 142.5, 33.7, 0);
seed("Phil Salt", 39, 1213, 0, 163.5, 34.6, 0);
seed("Travis Head", 32, 1032, 0, 172.0, 34.4, 0);
seed("Devdutt Padikkal", 76, 1930, 0, 126.6, 27.5, 0);
seed("Rinku Singh", 60, 1141, 0, 148.4, 35.6, 0);
seed("Tilak Varma", 55, 1499, 0, 143.6, 37.4, 0);
seed("Sai Sudharsan", 42, 1707, 0, 143.0, 45.0, 0);
seed("Rahul Dravid", 89, 2174, 0, 115.6, 28.2, 0);
seed("Sourav Ganguly", 59, 1349, 10, 106.8, 25.0, 7.6);
seed("VVS Laxman", 21, 296, 0, 108.4, 17.4, 0);
seed("Matthew Hayden", 32, 1107, 0, 137.0, 35.7, 0);
seed("Adam Gilchrist", 80, 2069, 0, 133.1, 27.2, 0);
seed("Brendon McCullum", 109, 2880, 0, 131.8, 27.7, 0);
seed("Michael Hussey", 59, 1977, 0, 119.9, 38.8, 0);
seed("Shane Watson", 145, 3874, 92, 137.9, 30.9, 7.9);
seed("Yuvraj Singh", 132, 2750, 36, 129.7, 24.8, 7.7);
seed("Parthiv Patel", 139, 2848, 0, 120.9, 22.6, 0);
seed("Wriddhiman Saha", 170, 2934, 0, 127.7, 24.9, 0);
seed("Nicholas Pooran", 92, 2278, 0, 165.0, 31.6, 0);
seed("Heinrich Klaasen", 42, 1249, 0, 175.0, 39.0, 0);
seed("Tim David", 55, 1000, 0, 163.0, 30.3, 0);
seed("Shimron Hetmyer", 84, 1372, 0, 156.0, 30.5, 0);
seed("Dhruv Jurel", 32, 559, 0, 143.0, 31.0, 0);
seed("Abhishek Sharma", 66, 1478, 12, 168.0, 26.4, 8.6);
seed("Priyansh Arya", 14, 475, 0, 179.0, 33.9, 0);
seed("Rahul Tripathi", 96, 2124, 0, 137.5, 26.6, 0);
seed("Riyan Parag", 79, 1364, 6, 139.0, 26.2, 8.7);
seed("Prabhsimran Singh", 43, 1084, 0, 149.0, 27.8, 0);
seed("Anmolpreet Singh", 12, 210, 0, 128.0, 21.0, 0);
seed("Murali Vijay", 106, 2619, 0, 121.4, 25.9, 0);
seed("Naman Ojha", 113, 1554, 0, 124.0, 20.4, 0);
seed("S Badrinath", 95, 1441, 0, 118.4, 28.8, 0);
seed("Mohammad Kaif", 24, 216, 0, 105.4, 15.4, 0);
seed("Aaron Finch", 92, 2091, 0, 125.6, 24.9, 0);
seed("Jason Roy", 23, 692, 0, 141.0, 31.5, 0);
seed("Alex Hales", 9, 148, 0, 129.0, 18.5, 0);
seed("Kane Williamson", 80, 2128, 0, 125.6, 36.2, 0);
seed("Martin Guptill", 22, 447, 0, 135.0, 22.4, 0);
seed("Colin Munro", 20, 456, 0, 138.0, 24.0, 0);
seed("Ross Taylor", 55, 1017, 0, 124.0, 25.4, 0);
seed("Hashim Amla", 16, 577, 0, 133.6, 44.4, 0);
seed("Jacques Kallis", 98, 2427, 65, 105.9, 28.5, 7.3);
seed("Herschelle Gibbs", 90, 2085, 0, 121.5, 27.4, 0);
seed("Kevin Pietersen", 36, 1001, 0, 135.0, 34.5, 0);
seed("Eoin Morgan", 74, 1449, 0, 128.0, 24.6, 0);
seed("Sarfaraz Khan", 50, 616, 0, 132.9, 25.6, 0);

/* -------------------- Bowlers -------------------- */
seed("Lasith Malinga", 122, 74, 170, 87.0, 8.4, 7.14);
seed("Yuzvendra Chahal", 168, 39, 221, 80.0, 6.5, 7.83);
seed("Piyush Chawla", 192, 631, 192, 108.0, 12.6, 7.87);
seed("Bhuvneshwar Kumar", 187, 245, 192, 95.0, 9.4, 7.44);
seed("Amit Mishra", 172, 328, 182, 92.0, 10.9, 7.37);
seed("Ravichandran Ashwin", 221, 833, 187, 105.0, 14.6, 7.16);
seed("Sunil Narine", 191, 1534, 192, 163.0, 16.0, 6.75);
seed("Jasprit Bumrah", 145, 60, 183, 85.0, 7.5, 7.32);
seed("Harbhajan Singh", 163, 833, 150, 118.0, 13.0, 7.06);
seed("Dwayne Bravo", 161, 1560, 183, 129.0, 22.6, 8.38);
seed("Mohammed Shami", 129, 74, 143, 92.0, 7.4, 8.51);
seed("Umesh Yadav", 148, 66, 144, 96.0, 6.6, 8.53);
seed("Kagiso Rabada", 84, 45, 121, 94.0, 7.5, 8.55);
seed("Trent Boult", 116, 66, 143, 88.0, 6.6, 8.42);
seed("Mitchell Starc", 55, 62, 71, 96.0, 8.9, 8.68);
seed("Josh Hazlewood", 46, 21, 55, 78.0, 5.3, 8.06);
seed("Pat Cummins", 62, 468, 62, 148.0, 18.0, 8.55);
seed("Deepak Chahar", 84, 88, 82, 105.0, 8.8, 7.99);
seed("Arshdeep Singh", 76, 43, 106, 92.0, 6.1, 8.72);
seed("Mohammed Siraj", 105, 45, 108, 88.0, 6.4, 8.65);
seed("T Natarajan", 45, 12, 55, 70.0, 4.0, 8.61);
seed("Varun Chakaravarthy", 79, 43, 97, 82.0, 6.1, 7.44);
seed("Varun Chakravarthy", 79, 43, 97, 82.0, 6.1, 7.44);
seed("Ravi Bishnoi", 71, 34, 76, 80.0, 5.7, 8.03);
seed("Kuldeep Yadav", 90, 41, 105, 84.0, 6.8, 8.14);
seed("Rahul Chahar", 68, 47, 70, 92.0, 7.8, 7.79);
seed("Harshal Patel", 106, 292, 132, 128.0, 12.7, 8.72);
seed("Avesh Khan", 66, 22, 71, 84.0, 5.5, 8.94);
seed("Umran Malik", 26, 12, 29, 90.0, 6.0, 9.03);
seed("Anrich Nortje", 47, 34, 57, 105.0, 6.8, 8.36);
seed("Jofra Archer", 51, 216, 55, 152.0, 15.4, 8.03);
seed("Zaheer Khan", 100, 117, 102, 96.0, 8.4, 7.59);
seed("Anil Kumble", 42, 35, 45, 74.0, 5.8, 6.58);
seed("Ashish Nehra", 88, 30, 106, 72.0, 5.0, 7.85);
seed("Praveen Kumar", 119, 253, 90, 106.0, 9.7, 7.71);
seed("Ishant Sharma", 93, 48, 72, 82.0, 6.0, 8.16);
seed("RP Singh", 82, 34, 82, 88.0, 5.7, 8.03);
seed("Munaf Patel", 63, 21, 74, 76.0, 5.3, 7.55);
seed("Sreesanth", 44, 24, 40, 78.0, 4.8, 8.09);
seed("Irfan Pathan", 103, 1139, 80, 121.0, 18.4, 7.85);
seed("Sandeep Sharma", 118, 34, 133, 84.0, 5.7, 7.78);
seed("Mohit Sharma", 111, 44, 129, 86.0, 6.3, 8.53);
seed("Khaleel Ahmed", 55, 12, 66, 70.0, 4.0, 8.61);
seed("Prasidh Krishna", 73, 18, 82, 78.0, 4.5, 8.66);
seed("Tushar Deshpande", 42, 21, 51, 92.0, 5.2, 9.60);
seed("Mustafizur Rahman", 57, 15, 61, 74.0, 5.0, 8.30);
seed("Imran Tahir", 59, 12, 82, 68.0, 4.0, 7.90);
seed("Rashid Khan", 121, 512, 149, 152.0, 16.5, 6.87);
seed("Adam Zampa", 22, 14, 24, 82.0, 4.7, 8.10);
seed("Matheesha Pathirana", 27, 8, 39, 72.0, 4.0, 8.44);
seed("Harshit Rana", 29, 61, 34, 128.0, 10.2, 9.55);
seed("Yash Dayal", 33, 10, 30, 74.0, 3.3, 9.53);
seed("Akash Madhwal", 20, 8, 22, 80.0, 4.0, 9.10);
seed("Mohsin Khan", 20, 6, 22, 66.0, 3.0, 7.44);

/* -------------------- All-rounders -------------------- */
seed("Ravindra Jadeja", 254, 3121, 168, 128.0, 26.9, 7.62);
seed("Hardik Pandya", 149, 2570, 71, 143.6, 28.2, 8.85);
seed("Krunal Pandya", 130, 1595, 84, 133.0, 22.5, 7.42);
seed("Andre Russell", 140, 2651, 122, 174.0, 28.5, 9.19);
seed("Kieron Pollard", 189, 3412, 69, 147.3, 28.7, 8.83);
seed("Glenn Maxwell", 141, 2971, 39, 155.0, 25.4, 8.19);
seed("Marcus Stoinis", 111, 2035, 44, 143.0, 26.4, 9.35);
seed("Sam Curran", 71, 1073, 68, 137.0, 21.9, 9.05);
seed("Ben Stokes", 43, 920, 28, 134.0, 25.6, 8.55);
seed("Shardul Thakur", 112, 401, 105, 141.0, 12.5, 9.09);
seed("Washington Sundar", 71, 411, 42, 127.0, 16.4, 7.19);
seed("Axar Patel", 160, 1656, 122, 135.0, 22.0, 7.42);
seed("Venkatesh Iyer", 51, 1326, 6, 134.0, 29.4, 8.60);
seed("Shivam Dube", 76, 1479, 12, 145.0, 28.4, 9.60);
seed("Cameron Green", 24, 707, 12, 152.0, 35.3, 9.55);
seed("Mitchell Marsh", 47, 967, 32, 141.0, 25.4, 8.90);
seed("Liam Livingstone", 48, 906, 20, 149.0, 24.4, 9.20);
seed("Rahul Tewatia", 92, 1000, 30, 132.0, 22.7, 8.35);
seed("Deepak Hooda", 111, 1500, 22, 129.0, 22.4, 8.66);
seed("Vijay Shankar", 66, 1000, 12, 122.0, 22.7, 8.60);
seed("Moeen Ali", 74, 1200, 39, 148.0, 25.5, 7.66);
seed("Chris Morris", 80, 615, 95, 158.0, 17.6, 8.14);
seed("Dwaine Pretorius", 12, 84, 10, 133.0, 14.0, 9.20);
seed("Nitish Kumar Reddy", 26, 604, 6, 142.0, 30.2, 9.40);
seed("Ramandeep Singh", 22, 210, 6, 158.0, 21.0, 9.60);
seed("Jacques Kallis 2", 98, 2427, 65, 105.9, 28.5, 7.30);
seed("Yusuf Pathan", 174, 3204, 42, 142.9, 29.1, 7.72);
seed("Stuart Binny", 95, 880, 22, 132.0, 20.5, 8.30);
seed("Ravi Rampaul", 33, 55, 34, 110.0, 9.2, 8.20);
seed("Albie Morkel", 91, 974, 85, 143.0, 20.7, 8.35);
seed("Angelo Mathews", 55, 590, 20, 118.0, 21.1, 8.10);
seed("Azmatullah Omarzai", 8, 122, 6, 152.0, 24.4, 9.60);

/* ------------------------------------------------------------------ */
/* Deterministic season model for players without curated numbers      */
/* ------------------------------------------------------------------ */

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967296;
}

/** Stable pseudo-random in [0,1) for a (name, key) pair. */
const rnd = (name: string, key: string) => hash(`${norm(name)}::${key}`);

const round1 = (n: number) => Math.round(n * 10) / 10;

/**
 * Era multiplier: T20 scoring rates climbed steadily across IPL history, so
 * a 2010 card shows lower strike rates than a 2025 card for the same profile.
 */
function eraFactor(year?: string): number {
  const y = Number(String(year ?? "").replace(/\D/g, "")) || 2025;
  if (y < 2008) return 1;
  return 1 + Math.min(Math.max(y - 2008, 0), 18) * 0.006; // ~+11% by 2026
}

/**
 * Builds a complete stat line for a player. Curated career numbers are used
 * where available; anything missing is modelled from the player's role, base
 * price (a good proxy for pedigree) and the auction season.
 */
export function resolveStats(
  player: Pick<AuctionPlayer, "name" | "role" | "basePrice"> & { stats?: PlayerStats | null },
  year?: string,
): FullPlayerStats {
  const curated = CAREER_STATS[norm(player.name)] ?? {};
  const given = (player.stats ?? {}) as PlayerStats;
  const era = eraFactor(year);
  const base = player.basePrice ?? 50;
  // Pedigree 0..1 — marquee (200L) players sit near the top of every range.
  const pedigree = Math.min(Math.max((base - 20) / 180, 0), 1);
  const role = player.role;

  const pick = (
    key: keyof FullPlayerStats,
    model: () => number,
  ): number => {
    const g = given[key as keyof PlayerStats];
    if (typeof g === "number" && g > 0) return g;
    const c = curated[key];
    if (typeof c === "number" && c > 0) return c;
    return model();
  };

  const matches = Math.round(
    pick("matches", () => 18 + pedigree * 90 + rnd(player.name, "m") * 40),
  );

  const isBowler = role === "Bowler";
  const isAR = role === "All-Rounder";

  const runsPerMatch = isBowler
    ? 2 + rnd(player.name, "rpm") * 4
    : isAR
    ? 14 + pedigree * 10 + rnd(player.name, "rpm") * 6
    : 20 + pedigree * 14 + rnd(player.name, "rpm") * 8;
  const runs = Math.round(pick("runs", () => matches * runsPerMatch));

  const wktsPerMatch = isBowler
    ? 1.0 + pedigree * 0.35 + rnd(player.name, "wpm") * 0.2
    : isAR
    ? 0.45 + pedigree * 0.3 + rnd(player.name, "wpm") * 0.2
    : 0.03 + rnd(player.name, "wpm") * 0.05;
  const wickets = Math.round(pick("wickets", () => matches * wktsPerMatch));

  const srBase = isBowler
    ? 88 + rnd(player.name, "sr") * 30
    : isAR
    ? 132 + pedigree * 16 + rnd(player.name, "sr") * 14
    : 122 + pedigree * 20 + rnd(player.name, "sr") * 16;
  const strikeRate = round1(pick("strikeRate", () => srBase * era));

  const avgBase = isBowler
    ? 6 + rnd(player.name, "avg") * 6
    : isAR
    ? 19 + pedigree * 8 + rnd(player.name, "avg") * 5
    : 24 + pedigree * 12 + rnd(player.name, "avg") * 6;
  const average = round1(pick("average", () => avgBase));

  const econBase = isBowler
    ? 8.6 - pedigree * 1.2 + rnd(player.name, "eco") * 0.8
    : isAR
    ? 8.6 - pedigree * 0.8 + rnd(player.name, "eco") * 0.9
    : 8.4 + rnd(player.name, "eco") * 1.0;
  const economy = round1(pick("economy", () => econBase));

  return { matches, runs, wickets, strikeRate, average, economy };
}

/** True when we hold real curated career numbers for this player. */
export function hasCuratedStats(name: string): boolean {
  return CAREER_STATS[norm(name)] !== undefined;
}
