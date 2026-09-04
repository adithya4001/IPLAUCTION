export interface PlayerStats {
  matches?: number;
  runs?: number;
  wickets?: number;
  strikeRate?: number;
  average?: number;
  economy?: number;
}

export interface AuctionPlayer {
  id: string;
  name: string;
  role: "Batter" | "Bowler" | "All-Rounder" | "WK";
  country: string;
  overseas: boolean;
  basePrice: number; // in lakhs
  specialization: string;
  stats?: PlayerStats;
}

export const PLAYER_POOL: AuctionPlayer[] = [
  { id: "p1", name: "KL Rahul", role: "WK", country: "India", overseas: false, basePrice: 200, specialization: "Top-Order WK Batter", stats: { matches: 132, runs: 4683, strikeRate: 134.2, average: 37.4 } },
  { id: "p2", name: "Shreyas Iyer", role: "Batter", country: "India", overseas: false, basePrice: 200, specialization: "Middle-Order Batter", stats: { matches: 115, runs: 3127, strikeRate: 126.7, average: 32.6 } },
  { id: "p3", name: "Rishabh Pant", role: "WK", country: "India", overseas: false, basePrice: 200, specialization: "Explosive WK Batter", stats: { matches: 98, runs: 2838, strikeRate: 148.7, average: 35.1 } },
  { id: "p4", name: "Devdutt Padikkal", role: "Batter", country: "India", overseas: false, basePrice: 200, specialization: "Left-Hand Top-Order", stats: { matches: 52, runs: 1210, strikeRate: 124.5, average: 25.7 } },
  { id: "p5", name: "Jos Buttler", role: "WK", country: "England", overseas: true, basePrice: 200, specialization: "Explosive Opener", stats: { matches: 82, runs: 2831, strikeRate: 150.6, average: 38.2 } },
  { id: "p6", name: "David Warner", role: "Batter", country: "Australia", overseas: true, basePrice: 200, specialization: "Aggressive Opener", stats: { matches: 176, runs: 6565, strikeRate: 139.9, average: 40.2 } },
  { id: "p7", name: "Quinton de Kock", role: "WK", country: "South Africa", overseas: true, basePrice: 200, specialization: "WK Batter", stats: { matches: 92, runs: 2756, strikeRate: 137.3, average: 31.3 } },
  { id: "p8", name: "Faf du Plessis", role: "Batter", country: "South Africa", overseas: true, basePrice: 200, specialization: "Anchor Batter", stats: { matches: 118, runs: 3403, strikeRate: 131.1, average: 30.4 } },
  { id: "p9", name: "Mohammed Shami", role: "Bowler", country: "India", overseas: false, basePrice: 200, specialization: "Pace Bowler", stats: { matches: 101, runs: 0, wickets: 120, economy: 8.5 } },
  { id: "p10", name: "Yuzvendra Chahal", role: "Bowler", country: "India", overseas: false, basePrice: 200, specialization: "Leg Spinner", stats: { matches: 142, wickets: 187, economy: 7.6 } },
  { id: "p11", name: "Kagiso Rabada", role: "Bowler", country: "South Africa", overseas: true, basePrice: 200, specialization: "Fast Bowler", stats: { matches: 63, wickets: 82, economy: 8.4 } },
  { id: "p12", name: "Trent Boult", role: "Bowler", country: "New Zealand", overseas: true, basePrice: 200, specialization: "Left-Arm Pace", stats: { matches: 78, wickets: 94, economy: 8.2 } },
  { id: "p13", name: "Josh Hazlewood", role: "Bowler", country: "Australia", overseas: true, basePrice: 200, specialization: "Fast Bowler", stats: { matches: 38, wickets: 46, economy: 8.0 } },
  { id: "p14", name: "Arshdeep Singh", role: "Bowler", country: "India", overseas: false, basePrice: 200, specialization: "Left-Arm Pace", stats: { matches: 44, wickets: 51, economy: 9.2 } },
  { id: "p15", name: "Bhuvneshwar Kumar", role: "Bowler", country: "India", overseas: false, basePrice: 200, specialization: "Swing Bowler", stats: { matches: 162, wickets: 165, economy: 7.3 } },
  { id: "p16", name: "Mitchell Starc", role: "Bowler", country: "Australia", overseas: true, basePrice: 200, specialization: "Left-Arm Fast", stats: { matches: 48, wickets: 58, economy: 8.9 } },
  { id: "p17", name: "Glenn Maxwell", role: "All-Rounder", country: "Australia", overseas: true, basePrice: 200, specialization: "Explosive All-Rounder", stats: { matches: 122, runs: 2685, wickets: 30, strikeRate: 155.4, average: 24.0 } },
  { id: "p18", name: "Marcus Stoinis", role: "All-Rounder", country: "Australia", overseas: true, basePrice: 200, specialization: "Pace All-Rounder", stats: { matches: 76, runs: 1411, wickets: 28, strikeRate: 136.9 } },
  { id: "p19", name: "Liam Livingstone", role: "All-Rounder", country: "England", overseas: true, basePrice: 200, specialization: "Power-Hitting AR", stats: { matches: 36, runs: 682, wickets: 12, strikeRate: 147.3 } },
  { id: "p20", name: "Washington Sundar", role: "All-Rounder", country: "India", overseas: false, basePrice: 200, specialization: "Spin All-Rounder", stats: { matches: 58, runs: 450, wickets: 32, economy: 6.9 } },
  { id: "p21", name: "Ishan Kishan", role: "WK", country: "India", overseas: false, basePrice: 200, specialization: "Aggressive WK", stats: { matches: 72, runs: 1903, strikeRate: 136.3, average: 28.4 } },
  { id: "p22", name: "Deepak Chahar", role: "Bowler", country: "India", overseas: false, basePrice: 200, specialization: "Swing Bowler", stats: { matches: 63, wickets: 67, economy: 7.8 } },
  { id: "p23", name: "Shardul Thakur", role: "All-Rounder", country: "India", overseas: false, basePrice: 200, specialization: "Seam AR", stats: { matches: 82, wickets: 78, runs: 432, economy: 8.8 } },
  { id: "p24", name: "Rahul Chahar", role: "Bowler", country: "India", overseas: false, basePrice: 50, specialization: "Leg Spinner", stats: { matches: 45, wickets: 42, economy: 7.5 } },
  { id: "p25", name: "Venkatesh Iyer", role: "All-Rounder", country: "India", overseas: false, basePrice: 200, specialization: "Left-Hand AR", stats: { matches: 32, runs: 748, strikeRate: 130.2, average: 24.9 } },
  { id: "p26", name: "Prithvi Shaw", role: "Batter", country: "India", overseas: false, basePrice: 75, specialization: "Aggressive Opener", stats: { matches: 51, runs: 1125, strikeRate: 146.8, average: 22.5 } },
  { id: "p27", name: "Sam Curran", role: "All-Rounder", country: "England", overseas: true, basePrice: 200, specialization: "Left-Arm Pace AR", stats: { matches: 52, runs: 489, wickets: 45, economy: 8.6 } },
  { id: "p28", name: "Cameron Green", role: "All-Rounder", country: "Australia", overseas: true, basePrice: 200, specialization: "Pace All-Rounder", stats: { matches: 18, runs: 452, wickets: 8, strikeRate: 153.2 } },
  { id: "p29", name: "Phil Salt", role: "WK", country: "England", overseas: true, basePrice: 200, specialization: "Explosive Opener", stats: { matches: 24, runs: 768, strikeRate: 162.5, average: 34.9 } },
  { id: "p30", name: "Mitchell Marsh", role: "All-Rounder", country: "Australia", overseas: true, basePrice: 200, specialization: "Pace All-Rounder", stats: { matches: 34, runs: 672, wickets: 15, strikeRate: 142.1 } },
];

export function getShuffledPool(): AuctionPlayer[] {
  const pool = [...PLAYER_POOL];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool;
}
