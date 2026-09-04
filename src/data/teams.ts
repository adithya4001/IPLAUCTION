export interface IPLTeam {
  id: string;
  name: string;
  shortName: string;
  color: string; // tailwind color class
  colorHex: string;
  logo: string; // emoji for now
  totalPurse: number; // in lakhs
  retainedPlayers: RetainedPlayer[];
  purseSpentOnRetentions: number;
}

export interface RetainedPlayer {
  name: string;
  role: "Batter" | "Bowler" | "All-Rounder" | "WK";
  country: string;
  overseas: boolean;
  retentionCost: number; // in lakhs
}

export const IPL_TEAMS: IPLTeam[] = [
  {
    id: "csk",
    name: "Chennai Super Kings",
    shortName: "CSK",
    color: "neon-yellow",
    colorHex: "#FFC107",
    logo: "🦁",
    totalPurse: 12000,
    retainedPlayers: [
      { name: "MS Dhoni", role: "WK", country: "India", overseas: false, retentionCost: 400 },
      { name: "Ruturaj Gaikwad", role: "Batter", country: "India", overseas: false, retentionCost: 1800 },
      { name: "Matheesha Pathirana", role: "Bowler", country: "Sri Lanka", overseas: true, retentionCost: 1300 },
      { name: "Shivam Dube", role: "All-Rounder", country: "India", overseas: false, retentionCost: 1200 },
      { name: "Ravindra Jadeja", role: "All-Rounder", country: "India", overseas: false, retentionCost: 1800 },
    ],
    purseSpentOnRetentions: 6500,
  },
  {
    id: "mi",
    name: "Mumbai Indians",
    shortName: "MI",
    color: "neon-blue",
    colorHex: "#004BA0",
    logo: "🏏",
    totalPurse: 12000,
    retainedPlayers: [
      { name: "Jasprit Bumrah", role: "Bowler", country: "India", overseas: false, retentionCost: 1800 },
      { name: "Suryakumar Yadav", role: "Batter", country: "India", overseas: false, retentionCost: 1635 },
      { name: "Hardik Pandya", role: "All-Rounder", country: "India", overseas: false, retentionCost: 1635 },
      { name: "Rohit Sharma", role: "Batter", country: "India", overseas: false, retentionCost: 1630 },
      { name: "Tilak Varma", role: "Batter", country: "India", overseas: false, retentionCost: 800 },
    ],
    purseSpentOnRetentions: 7500,
  },
  {
    id: "rcb",
    name: "Royal Challengers Bengaluru",
    shortName: "RCB",
    color: "neon-red",
    colorHex: "#EC1C24",
    logo: "👑",
    totalPurse: 12000,
    retainedPlayers: [
      { name: "Virat Kohli", role: "Batter", country: "India", overseas: false, retentionCost: 2100 },
      { name: "Rajat Patidar", role: "Batter", country: "India", overseas: false, retentionCost: 1100 },
      { name: "Yash Dayal", role: "Bowler", country: "India", overseas: false, retentionCost: 500 },
    ],
    purseSpentOnRetentions: 3700,
  },
  {
    id: "kkr",
    name: "Kolkata Knight Riders",
    shortName: "KKR",
    color: "neon-purple",
    colorHex: "#3A225D",
    logo: "⚔️",
    totalPurse: 12000,
    retainedPlayers: [
      { name: "Rinku Singh", role: "Batter", country: "India", overseas: false, retentionCost: 1300 },
      { name: "Varun Chakaravarthy", role: "Bowler", country: "India", overseas: false, retentionCost: 1200 },
      { name: "Sunil Narine", role: "All-Rounder", country: "West Indies", overseas: true, retentionCost: 1200 },
      { name: "Andre Russell", role: "All-Rounder", country: "West Indies", overseas: true, retentionCost: 1200 },
      { name: "Harshit Rana", role: "Bowler", country: "India", overseas: false, retentionCost: 400 },
      { name: "Ramandeep Singh", role: "All-Rounder", country: "India", overseas: false, retentionCost: 400 },
    ],
    purseSpentOnRetentions: 5700,
  },
  {
    id: "dc",
    name: "Delhi Capitals",
    shortName: "DC",
    color: "neon-blue",
    colorHex: "#0078BC",
    logo: "🦅",
    totalPurse: 12000,
    retainedPlayers: [
      { name: "Axar Patel", role: "All-Rounder", country: "India", overseas: false, retentionCost: 1675 },
      { name: "Kuldeep Yadav", role: "Bowler", country: "India", overseas: false, retentionCost: 1325 },
      { name: "Tristan Stubbs", role: "Batter", country: "South Africa", overseas: true, retentionCost: 1000 },
      { name: "Abishek Porel", role: "WK", country: "India", overseas: false, retentionCost: 400 },
    ],
    purseSpentOnRetentions: 4400,
  },
  {
    id: "srh",
    name: "Sunrisers Hyderabad",
    shortName: "SRH",
    color: "neon-orange",
    colorHex: "#FF822A",
    logo: "☀️",
    totalPurse: 12000,
    retainedPlayers: [
      { name: "Heinrich Klaasen", role: "WK", country: "South Africa", overseas: true, retentionCost: 2300 },
      { name: "Pat Cummins", role: "Bowler", country: "Australia", overseas: true, retentionCost: 1800 },
      { name: "Abhishek Sharma", role: "All-Rounder", country: "India", overseas: false, retentionCost: 1400 },
      { name: "Travis Head", role: "Batter", country: "Australia", overseas: true, retentionCost: 1400 },
      { name: "Nitish Kumar Reddy", role: "All-Rounder", country: "India", overseas: false, retentionCost: 600 },
    ],
    purseSpentOnRetentions: 7500,
  },
  {
    id: "rr",
    name: "Rajasthan Royals",
    shortName: "RR",
    color: "neon-pink",
    colorHex: "#EA1A85",
    logo: "👸",
    totalPurse: 12000,
    retainedPlayers: [
      { name: "Sanju Samson", role: "WK", country: "India", overseas: false, retentionCost: 1800 },
      { name: "Yashasvi Jaiswal", role: "Batter", country: "India", overseas: false, retentionCost: 1800 },
      { name: "Riyan Parag", role: "All-Rounder", country: "India", overseas: false, retentionCost: 1400 },
      { name: "Dhruv Jurel", role: "WK", country: "India", overseas: false, retentionCost: 1400 },
      { name: "Shimron Hetmyer", role: "Batter", country: "West Indies", overseas: true, retentionCost: 1100 },
      { name: "Sandeep Sharma", role: "Bowler", country: "India", overseas: false, retentionCost: 400 },
    ],
    purseSpentOnRetentions: 7900,
  },
  {
    id: "pbks",
    name: "Punjab Kings",
    shortName: "PBKS",
    color: "neon-red",
    colorHex: "#DD1F2D",
    logo: "🗡️",
    totalPurse: 12000,
    retainedPlayers: [
      { name: "Shashank Singh", role: "All-Rounder", country: "India", overseas: false, retentionCost: 550 },
      { name: "Prabhsimran Singh", role: "WK", country: "India", overseas: false, retentionCost: 400 },
    ],
    purseSpentOnRetentions: 950,
  },
  {
    id: "gt",
    name: "Gujarat Titans",
    shortName: "GT",
    color: "neon-cyan",
    colorHex: "#1C1C1C",
    logo: "🛡️",
    totalPurse: 12000,
    retainedPlayers: [
      { name: "Rashid Khan", role: "Bowler", country: "Afghanistan", overseas: true, retentionCost: 1800 },
      { name: "Shubman Gill", role: "Batter", country: "India", overseas: false, retentionCost: 1650 },
      { name: "Sai Sudharsan", role: "Batter", country: "India", overseas: false, retentionCost: 850 },
      { name: "Rahul Tewatia", role: "All-Rounder", country: "India", overseas: false, retentionCost: 400 },
      { name: "Shahrukh Khan", role: "Batter", country: "India", overseas: false, retentionCost: 400 },
    ],
    purseSpentOnRetentions: 5100,
  },
  {
    id: "lsg",
    name: "Lucknow Super Giants",
    shortName: "LSG",
    color: "neon-cyan",
    colorHex: "#A72056",
    logo: "🐅",
    totalPurse: 12000,
    retainedPlayers: [
      { name: "Nicholas Pooran", role: "WK", country: "West Indies", overseas: true, retentionCost: 2100 },
      { name: "Ravi Bishnoi", role: "Bowler", country: "India", overseas: false, retentionCost: 1100 },
      { name: "Mayank Yadav", role: "Bowler", country: "India", overseas: false, retentionCost: 1100 },
      { name: "Mohsin Khan", role: "Bowler", country: "India", overseas: false, retentionCost: 400 },
      { name: "Ayush Badoni", role: "Batter", country: "India", overseas: false, retentionCost: 400 },
    ],
    purseSpentOnRetentions: 5100,
  },
];
