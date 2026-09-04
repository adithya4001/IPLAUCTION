// Classifies squad players as capped / foreigner / uncapped for retention purposes.
import { getPlayersForYear } from "./playersByYear";

export type PlayerCategory = "capped" | "foreigner" | "uncapped";

const norm = (n: string) => n.toLowerCase().replace(/[^a-z]/g, "");

// Known uncapped (at the time) Indian players across eras.
const UNCAPPED_NAMES = new Set(
  [
    // Modern era
    "Rinku Singh", "Yashasvi Jaiswal", "Tilak Varma", "Abhishek Sharma", "Rasikh Salam",
    "Ramandeep Singh", "Angkrish Raghuvanshi", "Harshit Rana", "Vaibhav Arora", "Suyash Sharma",
    "Sameer Rizvi", "Nehal Wadhera", "Ashwani Kumar", "Vignesh Puthur", "Naman Dhir",
    "Shivam Dube", "Anshul Kamboj", "Shaik Rasheed", "Ayush Mhatre", "Sarfaraz Khan",
    "Prabhsimran Singh", "Shashank Singh", "Musheer Khan", "Vipraj Nigam", "Ashutosh Sharma",
    "Abdul Samad", "Nitish Kumar Reddy", "Anmolpreet Singh", "Aniket Verma", "Atharva Taide",
    "Dhruv Jurel", "Kumar Kartikeya", "Yudhvir Singh", "Akash Madhwal", "Mohsin Khan",
    "Yash Dayal", "Rajvardhan Hangargekar", "Simarjeet Singh", "Mukesh Choudhary",
    "Swastik Chikara", "Karn Sharma", "Kuldeep Sen", "Tushar Deshpande", "Arjun Tendulkar",
    "Sai Sudharsan", "Rahul Tewatia", "Riyan Parag", "Priyansh Arya", "Shubham Dubey",
    "Kumar Kushagra", "Nishant Sindhu", "Darshan Nalkande", "Raj Bawa", "Yash Thakur",
    // Earlier eras
    "Paul Valthaty", "Manvinder Bisla", "Sanju Samson", "Sandeep Sharma", "Axar Patel",
    "Jaydev Unadkat", "Krunal Pandya", "Hardik Pandya", "Nitish Rana", "Rahul Chahar",
    "Deepak Hooda", "Basil Thampi", "Kamlesh Nagarkoti", "Shivam Mavi", "Prasidh Krishna",
    "Mayank Markande", "Anukul Roy", "Ankit Rajpoot", "Shreyas Gopal", "Mohit Sharma",
    "Vijay Shankar", "Siddarth Kaul", "Rahul Tripathi", "Anmol Malhotra", "Ishan Kishan",
    "Devdutt Padikkal", "Ruturaj Gaikwad", "Kartik Tyagi", "Ravi Bishnoi", "T Natarajan",
    "Varun Chakravarthy", "Chetan Sakariya", "Arshdeep Singh", "Avesh Khan", "Venkatesh Iyer",
  ].map(norm),
);

const poolCache = new Map<string, Map<string, number>>();

function poolBasePrices(year: string): Map<string, number> {
  let cached = poolCache.get(year);
  if (!cached) {
    cached = new Map<string, number>();
    for (const p of getPlayersForYear(year)) cached.set(norm(p.name), p.basePrice);
    poolCache.set(year, cached);
  }
  return cached;
}

export function getPlayerCategory(
  year: string,
  player: { name: string; overseas: boolean },
): PlayerCategory {
  if (player.overseas) return "foreigner";
  const key = norm(player.name);
  if (UNCAPPED_NAMES.has(key)) return "uncapped";
  const base = poolBasePrices(year).get(key);
  if (base !== undefined && base <= 75) return "uncapped";
  return "capped";
}
