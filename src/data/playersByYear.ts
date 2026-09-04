import type { AuctionPlayer } from "./players";
import { PLAYERS_2008, PLAYERS_2009, PLAYERS_2010, PLAYERS_2011, PLAYERS_2012, PLAYERS_2013 } from "./playersEarlyEra";
import { PLAYERS_2014, PLAYERS_2015, PLAYERS_2016, PLAYERS_2017, PLAYERS_2018, PLAYERS_2019 } from "./playersMidEra";
import { PLAYERS_2020, PLAYERS_2021, PLAYERS_2022, PLAYERS_2023, PLAYERS_2024, PLAYERS_2025, PLAYERS_CUSTOM } from "./playersModernEra";

export function getPlayersForYear(year: string): AuctionPlayer[] {
  switch (year) {
    case "IPL 2008": return PLAYERS_2008;
    case "IPL 2009": return PLAYERS_2009;
    case "IPL 2010": return PLAYERS_2010;
    case "IPL 2011": return PLAYERS_2011;
    case "IPL 2012": return PLAYERS_2012;
    case "IPL 2013": return PLAYERS_2013;
    case "IPL 2014": return PLAYERS_2014;
    case "IPL 2015": return PLAYERS_2015;
    case "IPL 2016": return PLAYERS_2016;
    case "IPL 2017": return PLAYERS_2017;
    case "IPL 2018": return PLAYERS_2018;
    case "IPL 2019": return PLAYERS_2019;
    case "IPL 2020": return PLAYERS_2020;
    case "IPL 2021": return PLAYERS_2021;
    case "IPL 2022": return PLAYERS_2022;
    case "IPL 2023": return PLAYERS_2023;
    case "IPL 2024": return PLAYERS_2024;
    case "IPL 2025": return PLAYERS_2025;
    case "IPL 2026": return PLAYERS_2025;
    case "Custom Auction": return PLAYERS_CUSTOM;
    default: return PLAYERS_2025;
  }
}

// Backward-compatible alias
export const getPlayerPoolForYear = getPlayersForYear;

// Re-export for backward compatibility
export { PLAYERS_2008, PLAYERS_2009, PLAYERS_2010, PLAYERS_2011, PLAYERS_2012, PLAYERS_2013 };
export { PLAYERS_2014, PLAYERS_2015, PLAYERS_2016, PLAYERS_2017, PLAYERS_2018, PLAYERS_2019 };
export { PLAYERS_2020, PLAYERS_2021, PLAYERS_2022, PLAYERS_2023, PLAYERS_2024, PLAYERS_2025, PLAYERS_CUSTOM };
