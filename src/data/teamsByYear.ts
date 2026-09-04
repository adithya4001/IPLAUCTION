import type { IPLTeam } from "./teams";
import { IPL_TEAMS } from "./teams";

// Historical IPL teams for each auction year
// Teams, retentions, and purse amounts are approximated based on real IPL history

const BASE_PURSE_EARLY = 8000; // 80 Cr for early IPL
const BASE_PURSE_MID = 9000;   // 90 Cr
const BASE_PURSE_2022 = 9000;  // 90 Cr mega auction
const BASE_PURSE_2025 = 12000; // 120 Cr

// ========== TEAM DEFINITIONS ==========

const CSK: (purse: number, retentions?: IPLTeam["retainedPlayers"], spent?: number) => IPLTeam = (purse, retentions = [], spent = 0) => ({
  id: "csk", name: "Chennai Super Kings", shortName: "CSK", color: "neon-yellow", colorHex: "#FFC107", logo: "🦁",
  totalPurse: purse, retainedPlayers: retentions, purseSpentOnRetentions: spent,
});

const MI: (purse: number, retentions?: IPLTeam["retainedPlayers"], spent?: number) => IPLTeam = (purse, retentions = [], spent = 0) => ({
  id: "mi", name: "Mumbai Indians", shortName: "MI", color: "neon-blue", colorHex: "#004BA0", logo: "🏏",
  totalPurse: purse, retainedPlayers: retentions, purseSpentOnRetentions: spent,
});

const RCB: (purse: number, retentions?: IPLTeam["retainedPlayers"], spent?: number) => IPLTeam = (purse, retentions = [], spent = 0) => ({
  id: "rcb", name: "Royal Challengers Bengaluru", shortName: "RCB", color: "neon-red", colorHex: "#EC1C24", logo: "👑",
  totalPurse: purse, retainedPlayers: retentions, purseSpentOnRetentions: spent,
});

const KKR: (purse: number, retentions?: IPLTeam["retainedPlayers"], spent?: number) => IPLTeam = (purse, retentions = [], spent = 0) => ({
  id: "kkr", name: "Kolkata Knight Riders", shortName: "KKR", color: "neon-purple", colorHex: "#3A225D", logo: "⚔️",
  totalPurse: purse, retainedPlayers: retentions, purseSpentOnRetentions: spent,
});

const DD: (purse: number, retentions?: IPLTeam["retainedPlayers"], spent?: number) => IPLTeam = (purse, retentions = [], spent = 0) => ({
  id: "dd", name: "Delhi Daredevils", shortName: "DD", color: "neon-blue", colorHex: "#0078BC", logo: "🦅",
  totalPurse: purse, retainedPlayers: retentions, purseSpentOnRetentions: spent,
});

const DC: (purse: number, retentions?: IPLTeam["retainedPlayers"], spent?: number) => IPLTeam = (purse, retentions = [], spent = 0) => ({
  id: "dc", name: "Delhi Capitals", shortName: "DC", color: "neon-blue", colorHex: "#0078BC", logo: "🦅",
  totalPurse: purse, retainedPlayers: retentions, purseSpentOnRetentions: spent,
});

const RR: (purse: number, retentions?: IPLTeam["retainedPlayers"], spent?: number) => IPLTeam = (purse, retentions = [], spent = 0) => ({
  id: "rr", name: "Rajasthan Royals", shortName: "RR", color: "neon-pink", colorHex: "#EA1A85", logo: "👸",
  totalPurse: purse, retainedPlayers: retentions, purseSpentOnRetentions: spent,
});

const KXIP: (purse: number, retentions?: IPLTeam["retainedPlayers"], spent?: number) => IPLTeam = (purse, retentions = [], spent = 0) => ({
  id: "kxip", name: "Kings XI Punjab", shortName: "KXIP", color: "neon-red", colorHex: "#DD1F2D", logo: "🗡️",
  totalPurse: purse, retainedPlayers: retentions, purseSpentOnRetentions: spent,
});

const PBKS: (purse: number, retentions?: IPLTeam["retainedPlayers"], spent?: number) => IPLTeam = (purse, retentions = [], spent = 0) => ({
  id: "pbks", name: "Punjab Kings", shortName: "PBKS", color: "neon-red", colorHex: "#DD1F2D", logo: "🗡️",
  totalPurse: purse, retainedPlayers: retentions, purseSpentOnRetentions: spent,
});

const DCH: (purse: number, retentions?: IPLTeam["retainedPlayers"], spent?: number) => IPLTeam = (purse, retentions = [], spent = 0) => ({
  id: "dch", name: "Deccan Chargers", shortName: "DCH", color: "neon-cyan", colorHex: "#1C8AC8", logo: "⚡",
  totalPurse: purse, retainedPlayers: retentions, purseSpentOnRetentions: spent,
});

const SRH: (purse: number, retentions?: IPLTeam["retainedPlayers"], spent?: number) => IPLTeam = (purse, retentions = [], spent = 0) => ({
  id: "srh", name: "Sunrisers Hyderabad", shortName: "SRH", color: "neon-orange", colorHex: "#FF822A", logo: "☀️",
  totalPurse: purse, retainedPlayers: retentions, purseSpentOnRetentions: spent,
});

const PWI: (purse: number, retentions?: IPLTeam["retainedPlayers"], spent?: number) => IPLTeam = (purse, retentions = [], spent = 0) => ({
  id: "pwi", name: "Pune Warriors India", shortName: "PWI", color: "neon-purple", colorHex: "#6B21A8", logo: "⚔️",
  totalPurse: purse, retainedPlayers: retentions, purseSpentOnRetentions: spent,
});

const KTK: (purse: number, retentions?: IPLTeam["retainedPlayers"], spent?: number) => IPLTeam = (purse, retentions = [], spent = 0) => ({
  id: "ktk", name: "Kochi Tuskers Kerala", shortName: "KTK", color: "neon-orange", colorHex: "#E85D04", logo: "🐘",
  totalPurse: purse, retainedPlayers: retentions, purseSpentOnRetentions: spent,
});

const RPS: (purse: number, retentions?: IPLTeam["retainedPlayers"], spent?: number) => IPLTeam = (purse, retentions = [], spent = 0) => ({
  id: "rps", name: "Rising Pune Supergiant", shortName: "RPS", color: "neon-purple", colorHex: "#6B21A8", logo: "🏔️",
  totalPurse: purse, retainedPlayers: retentions, purseSpentOnRetentions: spent,
});

const GL: (purse: number, retentions?: IPLTeam["retainedPlayers"], spent?: number) => IPLTeam = (purse, retentions = [], spent = 0) => ({
  id: "gl", name: "Gujarat Lions", shortName: "GL", color: "neon-orange", colorHex: "#E85D04", logo: "🦁",
  totalPurse: purse, retainedPlayers: retentions, purseSpentOnRetentions: spent,
});

const GT: (purse: number, retentions?: IPLTeam["retainedPlayers"], spent?: number) => IPLTeam = (purse, retentions = [], spent = 0) => ({
  id: "gt", name: "Gujarat Titans", shortName: "GT", color: "neon-cyan", colorHex: "#1C1C1C", logo: "🛡️",
  totalPurse: purse, retainedPlayers: retentions, purseSpentOnRetentions: spent,
});

const LSG: (purse: number, retentions?: IPLTeam["retainedPlayers"], spent?: number) => IPLTeam = (purse, retentions = [], spent = 0) => ({
  id: "lsg", name: "Lucknow Super Giants", shortName: "LSG", color: "neon-cyan", colorHex: "#A72056", logo: "🐅",
  totalPurse: purse, retainedPlayers: retentions, purseSpentOnRetentions: spent,
});

// ========== YEAR-WISE TEAMS ==========

const TEAMS_2008: IPLTeam[] = [
  CSK(BASE_PURSE_EARLY), MI(BASE_PURSE_EARLY), RCB(BASE_PURSE_EARLY), KKR(BASE_PURSE_EARLY),
  DD(BASE_PURSE_EARLY), RR(BASE_PURSE_EARLY), KXIP(BASE_PURSE_EARLY), DCH(BASE_PURSE_EARLY),
];

const TEAMS_2009: IPLTeam[] = [
  CSK(BASE_PURSE_EARLY), MI(BASE_PURSE_EARLY), RCB(BASE_PURSE_EARLY), KKR(BASE_PURSE_EARLY),
  DD(BASE_PURSE_EARLY), RR(BASE_PURSE_EARLY), KXIP(BASE_PURSE_EARLY), DCH(BASE_PURSE_EARLY),
];

const TEAMS_2010: IPLTeam[] = [
  CSK(BASE_PURSE_EARLY), MI(BASE_PURSE_EARLY), RCB(BASE_PURSE_EARLY), KKR(BASE_PURSE_EARLY),
  DD(BASE_PURSE_EARLY), RR(BASE_PURSE_EARLY), KXIP(BASE_PURSE_EARLY), DCH(BASE_PURSE_EARLY),
];

const TEAMS_2011: IPLTeam[] = [
  CSK(BASE_PURSE_MID, [
    { name: "MS Dhoni", role: "WK", country: "India", overseas: false, retentionCost: 900 },
    { name: "Suresh Raina", role: "Batter", country: "India", overseas: false, retentionCost: 700 },
  ], 1600),
  MI(BASE_PURSE_MID, [
    { name: "Sachin Tendulkar", role: "Batter", country: "India", overseas: false, retentionCost: 1000 },
    { name: "Harbhajan Singh", role: "Bowler", country: "India", overseas: false, retentionCost: 700 },
  ], 1700),
  RCB(BASE_PURSE_MID, [
    { name: "Virat Kohli", role: "Batter", country: "India", overseas: false, retentionCost: 200 },
  ], 200),
  KKR(BASE_PURSE_MID, [
    { name: "Gautam Gambhir", role: "Batter", country: "India", overseas: false, retentionCost: 800 },
  ], 800),
  DD(BASE_PURSE_MID, [
    { name: "Virender Sehwag", role: "Batter", country: "India", overseas: false, retentionCost: 800 },
  ], 800),
  RR(BASE_PURSE_MID, [
    { name: "Shane Watson", role: "All-Rounder", country: "Australia", overseas: true, retentionCost: 800 },
  ], 800),
  KXIP(BASE_PURSE_MID),
  DCH(BASE_PURSE_MID),
  PWI(BASE_PURSE_MID),
  KTK(BASE_PURSE_MID),
];

const TEAMS_2012: IPLTeam[] = [
  CSK(BASE_PURSE_MID, [
    { name: "MS Dhoni", role: "WK", country: "India", overseas: false, retentionCost: 900 },
    { name: "Suresh Raina", role: "Batter", country: "India", overseas: false, retentionCost: 700 },
  ], 1600),
  MI(BASE_PURSE_MID, [
    { name: "Sachin Tendulkar", role: "Batter", country: "India", overseas: false, retentionCost: 1000 },
    { name: "Rohit Sharma", role: "Batter", country: "India", overseas: false, retentionCost: 700 },
  ], 1700),
  RCB(BASE_PURSE_MID, [
    { name: "Virat Kohli", role: "Batter", country: "India", overseas: false, retentionCost: 500 },
    { name: "Chris Gayle", role: "Batter", country: "West Indies", overseas: true, retentionCost: 700 },
  ], 1200),
  KKR(BASE_PURSE_MID, [
    { name: "Gautam Gambhir", role: "Batter", country: "India", overseas: false, retentionCost: 800 },
  ], 800),
  DD(BASE_PURSE_MID, [
    { name: "Virender Sehwag", role: "Batter", country: "India", overseas: false, retentionCost: 800 },
  ], 800),
  RR(BASE_PURSE_MID, [
    { name: "Shane Watson", role: "All-Rounder", country: "Australia", overseas: true, retentionCost: 800 },
  ], 800),
  KXIP(BASE_PURSE_MID),
  DCH(BASE_PURSE_MID),
  PWI(BASE_PURSE_MID),
];

const TEAMS_2013: IPLTeam[] = [
  CSK(BASE_PURSE_MID, [
    { name: "MS Dhoni", role: "WK", country: "India", overseas: false, retentionCost: 900 },
    { name: "Suresh Raina", role: "Batter", country: "India", overseas: false, retentionCost: 700 },
    { name: "Ravindra Jadeja", role: "All-Rounder", country: "India", overseas: false, retentionCost: 600 },
  ], 2200),
  MI(BASE_PURSE_MID, [
    { name: "Rohit Sharma", role: "Batter", country: "India", overseas: false, retentionCost: 900 },
    { name: "Kieron Pollard", role: "All-Rounder", country: "West Indies", overseas: true, retentionCost: 700 },
  ], 1600),
  RCB(BASE_PURSE_MID, [
    { name: "Virat Kohli", role: "Batter", country: "India", overseas: false, retentionCost: 700 },
    { name: "Chris Gayle", role: "Batter", country: "West Indies", overseas: true, retentionCost: 700 },
  ], 1400),
  KKR(BASE_PURSE_MID, [
    { name: "Gautam Gambhir", role: "Batter", country: "India", overseas: false, retentionCost: 800 },
  ], 800),
  DD(BASE_PURSE_MID, [
    { name: "Virender Sehwag", role: "Batter", country: "India", overseas: false, retentionCost: 800 },
  ], 800),
  RR(BASE_PURSE_MID, [
    { name: "Shane Watson", role: "All-Rounder", country: "Australia", overseas: true, retentionCost: 800 },
  ], 800),
  KXIP(BASE_PURSE_MID),
  SRH(BASE_PURSE_MID, [
    { name: "David Warner", role: "Batter", country: "Australia", overseas: true, retentionCost: 500 },
  ], 500),
];

const TEAMS_2014: IPLTeam[] = [
  CSK(BASE_PURSE_MID, [
    { name: "MS Dhoni", role: "WK", country: "India", overseas: false, retentionCost: 1250 },
    { name: "Suresh Raina", role: "Batter", country: "India", overseas: false, retentionCost: 1100 },
    { name: "Ravindra Jadeja", role: "All-Rounder", country: "India", overseas: false, retentionCost: 900 },
    { name: "Ravichandran Ashwin", role: "Bowler", country: "India", overseas: false, retentionCost: 700 },
    { name: "Dwayne Bravo", role: "All-Rounder", country: "West Indies", overseas: true, retentionCost: 700 },
  ], 4650),
  MI(BASE_PURSE_MID, [
    { name: "Rohit Sharma", role: "Batter", country: "India", overseas: false, retentionCost: 1150 },
    { name: "Kieron Pollard", role: "All-Rounder", country: "West Indies", overseas: true, retentionCost: 900 },
    { name: "Lasith Malinga", role: "Bowler", country: "Sri Lanka", overseas: true, retentionCost: 700 },
    { name: "Ambati Rayudu", role: "Batter", country: "India", overseas: false, retentionCost: 500 },
    { name: "Harbhajan Singh", role: "Bowler", country: "India", overseas: false, retentionCost: 500 },
  ], 3750),
  RCB(BASE_PURSE_MID, [
    { name: "Virat Kohli", role: "Batter", country: "India", overseas: false, retentionCost: 1100 },
    { name: "Chris Gayle", role: "Batter", country: "West Indies", overseas: true, retentionCost: 1000 },
    { name: "AB de Villiers", role: "WK", country: "South Africa", overseas: true, retentionCost: 900 },
  ], 3000),
  KKR(BASE_PURSE_MID, [
    { name: "Gautam Gambhir", role: "Batter", country: "India", overseas: false, retentionCost: 1100 },
    { name: "Sunil Narine", role: "All-Rounder", country: "West Indies", overseas: true, retentionCost: 900 },
  ], 2000),
  DD(BASE_PURSE_MID),
  RR(BASE_PURSE_MID, [
    { name: "Shane Watson", role: "All-Rounder", country: "Australia", overseas: true, retentionCost: 900 },
  ], 900),
  KXIP(BASE_PURSE_MID),
  SRH(BASE_PURSE_MID, [
    { name: "David Warner", role: "Batter", country: "Australia", overseas: true, retentionCost: 700 },
    { name: "Shikhar Dhawan", role: "Batter", country: "India", overseas: false, retentionCost: 700 },
  ], 1400),
];

const TEAMS_2015: IPLTeam[] = TEAMS_2014.map(t => ({ ...t }));

const TEAMS_2016: IPLTeam[] = [
  // CSK and RR suspended; replaced by RPS and GL
  MI(BASE_PURSE_MID, [
    { name: "Rohit Sharma", role: "Batter", country: "India", overseas: false, retentionCost: 1200 },
    { name: "Kieron Pollard", role: "All-Rounder", country: "West Indies", overseas: true, retentionCost: 900 },
  ], 2100),
  RCB(BASE_PURSE_MID, [
    { name: "Virat Kohli", role: "Batter", country: "India", overseas: false, retentionCost: 1250 },
    { name: "AB de Villiers", role: "WK", country: "South Africa", overseas: true, retentionCost: 1000 },
    { name: "Chris Gayle", role: "Batter", country: "West Indies", overseas: true, retentionCost: 900 },
  ], 3150),
  KKR(BASE_PURSE_MID, [
    { name: "Gautam Gambhir", role: "Batter", country: "India", overseas: false, retentionCost: 1100 },
    { name: "Sunil Narine", role: "All-Rounder", country: "West Indies", overseas: true, retentionCost: 900 },
  ], 2000),
  DD(BASE_PURSE_MID),
  KXIP(BASE_PURSE_MID, [
    { name: "David Miller", role: "Batter", country: "South Africa", overseas: true, retentionCost: 600 },
  ], 600),
  SRH(BASE_PURSE_MID, [
    { name: "David Warner", role: "Batter", country: "Australia", overseas: true, retentionCost: 900 },
    { name: "Shikhar Dhawan", role: "Batter", country: "India", overseas: false, retentionCost: 700 },
  ], 1600),
  RPS(BASE_PURSE_MID, [
    { name: "MS Dhoni", role: "WK", country: "India", overseas: false, retentionCost: 1250 },
  ], 1250),
  GL(BASE_PURSE_MID, [
    { name: "Suresh Raina", role: "Batter", country: "India", overseas: false, retentionCost: 1100 },
    { name: "Ravindra Jadeja", role: "All-Rounder", country: "India", overseas: false, retentionCost: 900 },
  ], 2000),
];

const TEAMS_2017: IPLTeam[] = TEAMS_2016.map(t => ({ ...t }));

const TEAMS_2018: IPLTeam[] = [
  // CSK and RR return; RPS and GL disbanded. Mega auction.
  CSK(BASE_PURSE_MID, [
    { name: "MS Dhoni", role: "WK", country: "India", overseas: false, retentionCost: 1500 },
    { name: "Suresh Raina", role: "Batter", country: "India", overseas: false, retentionCost: 1100 },
    { name: "Ravindra Jadeja", role: "All-Rounder", country: "India", overseas: false, retentionCost: 700 },
  ], 3300),
  MI(BASE_PURSE_MID, [
    { name: "Rohit Sharma", role: "Batter", country: "India", overseas: false, retentionCost: 1500 },
    { name: "Hardik Pandya", role: "All-Rounder", country: "India", overseas: false, retentionCost: 1100 },
    { name: "Jasprit Bumrah", role: "Bowler", country: "India", overseas: false, retentionCost: 700 },
  ], 3300),
  RCB(BASE_PURSE_MID, [
    { name: "Virat Kohli", role: "Batter", country: "India", overseas: false, retentionCost: 1700 },
    { name: "AB de Villiers", role: "WK", country: "South Africa", overseas: true, retentionCost: 1100 },
  ], 2800),
  KKR(BASE_PURSE_MID, [
    { name: "Sunil Narine", role: "All-Rounder", country: "West Indies", overseas: true, retentionCost: 1100 },
    { name: "Andre Russell", role: "All-Rounder", country: "West Indies", overseas: true, retentionCost: 800 },
  ], 1900),
  DD(BASE_PURSE_MID),
  RR(BASE_PURSE_MID, [
    { name: "Steve Smith", role: "Batter", country: "Australia", overseas: true, retentionCost: 1200 },
  ], 1200),
  KXIP(BASE_PURSE_MID),
  SRH(BASE_PURSE_MID, [
    { name: "David Warner", role: "Batter", country: "Australia", overseas: true, retentionCost: 1250 },
    { name: "Bhuvneshwar Kumar", role: "Bowler", country: "India", overseas: false, retentionCost: 850 },
  ], 2100),
];

const TEAMS_2019: IPLTeam[] = TEAMS_2018.map(t => ({ ...t }));

// DD renamed to DC from 2019
const TEAMS_2019_ACTUAL: IPLTeam[] = TEAMS_2019.map(t =>
  t.id === "dd" ? DC(t.totalPurse, t.retainedPlayers, t.purseSpentOnRetentions) : t
);

const TEAMS_2020: IPLTeam[] = TEAMS_2019_ACTUAL.map(t => ({ ...t }));
const TEAMS_2021: IPLTeam[] = TEAMS_2020.map(t => ({ ...t }));

const TEAMS_2022: IPLTeam[] = [
  // Mega auction. GT and LSG added.
  CSK(9000, [
    { name: "MS Dhoni", role: "WK", country: "India", overseas: false, retentionCost: 1200 },
    { name: "Ravindra Jadeja", role: "All-Rounder", country: "India", overseas: false, retentionCost: 1600 },
    { name: "Moeen Ali", role: "All-Rounder", country: "England", overseas: true, retentionCost: 800 },
    { name: "Ruturaj Gaikwad", role: "Batter", country: "India", overseas: false, retentionCost: 600 },
  ], 4200),
  MI(9000, [
    { name: "Rohit Sharma", role: "Batter", country: "India", overseas: false, retentionCost: 1600 },
    { name: "Jasprit Bumrah", role: "Bowler", country: "India", overseas: false, retentionCost: 1200 },
    { name: "Suryakumar Yadav", role: "Batter", country: "India", overseas: false, retentionCost: 800 },
    { name: "Kieron Pollard", role: "All-Rounder", country: "West Indies", overseas: true, retentionCost: 600 },
  ], 4200),
  RCB(9000, [
    { name: "Virat Kohli", role: "Batter", country: "India", overseas: false, retentionCost: 1500 },
    { name: "Glenn Maxwell", role: "All-Rounder", country: "Australia", overseas: true, retentionCost: 1100 },
    { name: "Mohammed Siraj", role: "Bowler", country: "India", overseas: false, retentionCost: 700 },
  ], 3300),
  KKR(9000, [
    { name: "Andre Russell", role: "All-Rounder", country: "West Indies", overseas: true, retentionCost: 1200 },
    { name: "Varun Chakaravarthy", role: "Bowler", country: "India", overseas: false, retentionCost: 800 },
    { name: "Venkatesh Iyer", role: "All-Rounder", country: "India", overseas: false, retentionCost: 800 },
    { name: "Sunil Narine", role: "All-Rounder", country: "West Indies", overseas: true, retentionCost: 600 },
  ], 3400),
  DC(9000, [
    { name: "Rishabh Pant", role: "WK", country: "India", overseas: false, retentionCost: 1600 },
    { name: "Axar Patel", role: "All-Rounder", country: "India", overseas: false, retentionCost: 900 },
    { name: "Prithvi Shaw", role: "Batter", country: "India", overseas: false, retentionCost: 750 },
    { name: "Anrich Nortje", role: "Bowler", country: "South Africa", overseas: true, retentionCost: 650 },
  ], 3900),
  SRH(9000, [
    { name: "Kane Williamson", role: "Batter", country: "New Zealand", overseas: true, retentionCost: 1400 },
    { name: "Abdul Samad", role: "All-Rounder", country: "India", overseas: false, retentionCost: 400 },
    { name: "Umran Malik", role: "Bowler", country: "India", overseas: false, retentionCost: 400 },
  ], 2200),
  RR(9000, [
    { name: "Sanju Samson", role: "WK", country: "India", overseas: false, retentionCost: 1400 },
    { name: "Jos Buttler", role: "WK", country: "England", overseas: true, retentionCost: 1000 },
    { name: "Yashasvi Jaiswal", role: "Batter", country: "India", overseas: false, retentionCost: 400 },
  ], 2800),
  PBKS(9000, [
    { name: "Mayank Agarwal", role: "Batter", country: "India", overseas: false, retentionCost: 1200 },
    { name: "Arshdeep Singh", role: "Bowler", country: "India", overseas: false, retentionCost: 400 },
  ], 1600),
  GT(9000, [], 0), // New franchise, draft picks
  LSG(9000, [], 0), // New franchise, draft picks
];

const TEAMS_2023: IPLTeam[] = TEAMS_2022.map(t => ({ ...t }));
const TEAMS_2024: IPLTeam[] = TEAMS_2023.map(t => ({ ...t }));

// Custom mode: all current 10 teams, 120 Cr each, no retentions
const TEAMS_CUSTOM: IPLTeam[] = [
  RCB(12000), PBKS(12000), SRH(12000), CSK(12000), MI(12000),
  DC(12000), KKR(12000), LSG(12000), GT(12000), RR(12000),
];

export function getTeamsForYear(year: string): IPLTeam[] {
  switch (year) {
    case "IPL 2008": return TEAMS_2008;
    case "IPL 2009": return TEAMS_2009;
    case "IPL 2010": return TEAMS_2010;
    case "IPL 2011": return TEAMS_2011;
    case "IPL 2012": return TEAMS_2012;
    case "IPL 2013": return TEAMS_2013;
    case "IPL 2014": return TEAMS_2014;
    case "IPL 2015": return TEAMS_2015;
    case "IPL 2016": return TEAMS_2016;
    case "IPL 2017": return TEAMS_2017;
    case "IPL 2018": return TEAMS_2018;
    case "IPL 2019": return TEAMS_2019_ACTUAL;
    case "IPL 2020": return TEAMS_2020;
    case "IPL 2021": return TEAMS_2021;
    case "IPL 2022": return TEAMS_2022;
    case "IPL 2023": return TEAMS_2023;
    case "IPL 2024": return TEAMS_2024;
    case "IPL 2025": return IPL_TEAMS; // from teams.ts (the original 2025 data)
    case "IPL 2026": return IPL_TEAMS;
    case "Custom Auction": return TEAMS_CUSTOM;
    default: return IPL_TEAMS;
  }
}
