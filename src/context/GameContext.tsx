import React, { createContext, useContext, useReducer, useCallback, useEffect } from "react";
import { IPLTeam, IPL_TEAMS } from "@/data/teams";
import { AuctionPlayer } from "@/data/players";
import { getPlayerPoolForYear } from "@/data/playersByYear";
import { getTeamsForYear } from "@/data/teamsByYear";

// Types
export interface User {
  id: string;
  username: string;
  avatar: string;
}

export interface LobbyPlayer {
  user: User;
  team: IPLTeam | null;
  isReady: boolean;
  isHost: boolean;
}

export interface TeamState {
  team: IPLTeam;
  purseRemaining: number;
  squad: AuctionPlayer[];
  overseasCount: number;
}

export interface BidEntry {
  teamId: string;
  amount: number;
  timestamp: number;
}

export type GamePhase = "menu" | "lobby" | "auction" | "results";
export type AuctionStatus = "bidding" | "going_once" | "going_twice" | "sold" | "unsold" | "paused" | "set_break";

export const SET_SIZE = 6;
export const SET_BREAK_DURATION = 30;

export const AUCTION_YEARS = [
  "IPL 2008", "IPL 2009", "IPL 2010", "IPL 2011", "IPL 2012",
  "IPL 2013", "IPL 2014", "IPL 2015", "IPL 2016", "IPL 2017",
  "IPL 2018", "IPL 2019", "IPL 2020", "IPL 2021", "IPL 2022",
  "IPL 2023", "IPL 2024", "IPL 2025", "IPL 2026", "Custom Auction",
];

export interface GameState {
  phase: GamePhase;
  currentUser: User | null;
  roomCode: string | null;
  roomId: string | null;
  lobbyPlayers: LobbyPlayer[];
  gameMode: string;
  timerDuration: number;
  playerPool: AuctionPlayer[];
  currentPlayerIndex: number;
  currentBid: number;
  currentBidder: string | null;
  auctionStatus: AuctionStatus;
  timer: number;
  teamStates: Record<string, TeamState>;
  bidHistory: BidEntry[];
  soldPlayers: { player: AuctionPlayer; teamId: string; price: number }[];
  unsoldPlayers: AuctionPlayer[];
  passedTeams: string[];
  currentSet: number;
  setBreakTimer: number;
  customRetentions: Record<string, { retentions: import("@/data/teams").RetainedPlayer[]; totalSpent: number }>;
}

type Action =
  | { type: "LOGIN"; user: User }
  | { type: "SET_PHASE"; phase: GamePhase }
  | { type: "SET_ROOM"; roomId: string; roomCode: string }
  | { type: "SYNC_LOBBY"; players: LobbyPlayer[]; gameMode: string; timerDuration: number; roomCode: string; roomId: string }
  | { type: "START_AUCTION" }
  | { type: "PLACE_BID"; teamId: string; amount: number }
  | { type: "PASS_BID"; teamId: string }
  | { type: "TICK_TIMER" }
  | { type: "SOLD" }
  | { type: "UNSOLD" }
  | { type: "NEXT_PLAYER" }
  | { type: "SET_AUCTION_STATUS"; status: AuctionStatus }
  | { type: "SYNC_AUCTION"; payload: Partial<GameState> }
  | { type: "LEAVE_ROOM" }
  | { type: "TICK_SET_BREAK" }
  | { type: "END_SET_BREAK" }
  | { type: "SET_CUSTOM_RETENTIONS"; teamId: string; retentions: import("@/data/teams").RetainedPlayer[]; totalSpent: number }
  | { type: "REMOVE_TEAM"; teamId: string | null; playerId?: string }
  | { type: "END_AUCTION" }
  | { type: "RESTORE_STATE"; state: GameState };

const initialState: GameState = {
  phase: "menu",
  currentUser: null,
  roomCode: null,
  roomId: null,
  lobbyPlayers: [],
  gameMode: "IPL 2025",
  timerDuration: 30,
  playerPool: [],
  currentPlayerIndex: 0,
  currentBid: 0,
  currentBidder: null,
  auctionStatus: "paused",
  timer: 30,
  teamStates: {},
  bidHistory: [],
  soldPlayers: [],
  unsoldPlayers: [],
  passedTeams: [],
  currentSet: 0,
  setBreakTimer: 0,
  customRetentions: {},
};

function initTeamStates(lobbyPlayers: LobbyPlayer[]): Record<string, TeamState> {
  const states: Record<string, TeamState> = {};
  lobbyPlayers.forEach((lp) => {
    if (lp.team) {
      states[lp.team.id] = {
        team: lp.team,
        purseRemaining: lp.team.totalPurse - lp.team.purseSpentOnRetentions,
        squad: [],
        overseasCount: lp.team.retainedPlayers.filter((p) => p.overseas).length,
      };
    }
  });
  return states;
}

// Marks the current player unsold and records them in the unsold list (deduped)
function markUnsold(state: GameState): GameState {
  const player = state.playerPool[state.currentPlayerIndex];
  const alreadyListed = player ? state.unsoldPlayers.some((p) => p.id === player.id) : true;
  return {
    ...state,
    auctionStatus: "unsold",
    unsoldPlayers: player && !alreadyListed ? [...state.unsoldPlayers, player] : state.unsoldPlayers,
  };
}


// Fisher-Yates shuffle — new random player order for every auction
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getBidIncrement(currentBid: number): number {
  if (currentBid < 100) return 5;
  if (currentBid < 200) return 10;
  if (currentBid < 500) return 20;
  if (currentBid < 1000) return 25;
  return 50;
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "LOGIN":
      return { ...state, currentUser: action.user };

    case "SET_PHASE":
      return { ...state, phase: action.phase };

    case "SET_ROOM":
      return { ...state, roomId: action.roomId, roomCode: action.roomCode, phase: "lobby" };

    case "SYNC_LOBBY":
      return {
        ...state,
        lobbyPlayers: action.players,
        gameMode: action.gameMode,
        timerDuration: action.timerDuration,
        roomCode: action.roomCode,
        roomId: action.roomId,
      };

    case "START_AUCTION": {
      const pool = getPlayerPoolForYear(state.gameMode);
      const yearTeams = getTeamsForYear(state.gameMode);
      // Collect all retained player names to filter from auction pool
      const retainedNames = new Set<string>();
      // Build team states from lobby players, using custom retentions if available
      const teamStates: Record<string, TeamState> = {};
      state.lobbyPlayers.forEach((lp) => {
        if (lp.team) {
          const yearTeam = yearTeams.find(t => t.id === lp.team!.id) || lp.team;
          const custom = state.customRetentions[yearTeam.id];
          const retentions = custom ? custom.retentions : yearTeam.retainedPlayers;
          const spent = custom ? custom.totalSpent : yearTeam.purseSpentOnRetentions;
          retentions.forEach(r => retainedNames.add(r.name));
          teamStates[yearTeam.id] = {
            team: { ...yearTeam, retainedPlayers: retentions, purseSpentOnRetentions: spent },
            purseRemaining: yearTeam.totalPurse - spent,
            squad: [],
            overseasCount: retentions.filter((p) => p.overseas).length,
          };
        }
      });
      // Filter retained players out of auction pool, then randomise order (fresh every auction)
      const filteredPool = shuffleArray(pool.filter(p => !retainedNames.has(p.name)));
      return {
        ...state,
        phase: "auction",
        playerPool: filteredPool,
        currentPlayerIndex: 0,
        currentBid: filteredPool[0]?.basePrice || 200,
        currentBidder: null,
        auctionStatus: "bidding",
        timer: state.timerDuration,
        teamStates,
        bidHistory: [],
        soldPlayers: [],
        unsoldPlayers: [],
        passedTeams: [],
        currentSet: 0,
        setBreakTimer: 0,
      };
    }

    case "PLACE_BID": {
      // If no one has bid yet, allow bidding at base price (amount = currentBid)
      const newBid = action.amount || state.currentBid;
      return {
        ...state,
        currentBid: newBid,
        currentBidder: action.teamId,
        timer: state.timerDuration,
        auctionStatus: "bidding",
        passedTeams: state.passedTeams.filter((t) => t !== action.teamId),
        bidHistory: [
          ...state.bidHistory,
          { teamId: action.teamId, amount: newBid, timestamp: Date.now() },
        ],
      };
    }

    case "PASS_BID":
      return {
        ...state,
        passedTeams: [...state.passedTeams, action.teamId],
      };

    case "TICK_TIMER": {
      const newTimer = state.timer - 1;
      if (newTimer <= 0) {
        if (state.auctionStatus === "bidding" && state.currentBidder) {
          return { ...state, timer: 3, auctionStatus: "going_once" };
        }
        if (state.auctionStatus === "going_once") {
          return { ...state, timer: 3, auctionStatus: "going_twice" };
        }
        if (state.auctionStatus === "going_twice") {
          if (state.currentBidder) {
            return { ...state, timer: 0, auctionStatus: "sold" };
          }
          return { ...markUnsold(state), timer: 0 };
        }
        if (state.auctionStatus === "bidding" && !state.currentBidder) {
          return { ...markUnsold(state), timer: 0 };
        }
      }
      return { ...state, timer: newTimer };
    }


    case "SOLD": {
      const player = state.playerPool[state.currentPlayerIndex];
      const buyerTeamId = state.currentBidder!;
      const updatedTeamStates = { ...state.teamStates };
      if (updatedTeamStates[buyerTeamId]) {
        updatedTeamStates[buyerTeamId] = {
          ...updatedTeamStates[buyerTeamId],
          purseRemaining: updatedTeamStates[buyerTeamId].purseRemaining - state.currentBid,
          squad: [...updatedTeamStates[buyerTeamId].squad, player],
          overseasCount: updatedTeamStates[buyerTeamId].overseasCount + (player.overseas ? 1 : 0),
        };
      }
      return {
        ...state,
        teamStates: updatedTeamStates,
        soldPlayers: [...state.soldPlayers, { player, teamId: buyerTeamId, price: state.currentBid }],
        auctionStatus: "sold",
      };
    }

    case "UNSOLD":
      return markUnsold(state);


    case "NEXT_PLAYER": {
      const nextIndex = state.currentPlayerIndex + 1;
      if (nextIndex >= state.playerPool.length) {
        return { ...state, phase: "results" };
      }
      // Check if we're crossing into a new set (every SET_SIZE players)
      const currentSetNum = Math.floor(state.currentPlayerIndex / SET_SIZE);
      const nextSetNum = Math.floor(nextIndex / SET_SIZE);
      if (nextSetNum > currentSetNum) {
        // Set break!
        return {
          ...state,
          currentPlayerIndex: nextIndex,
          currentBid: state.playerPool[nextIndex].basePrice,
          currentBidder: null,
          auctionStatus: "set_break",
          timer: 0,
          bidHistory: [],
          passedTeams: [],
          currentSet: nextSetNum,
          setBreakTimer: SET_BREAK_DURATION,
        };
      }
      return {
        ...state,
        currentPlayerIndex: nextIndex,
        currentBid: state.playerPool[nextIndex].basePrice,
        currentBidder: null,
        auctionStatus: "bidding",
        timer: state.timerDuration,
        bidHistory: [],
        passedTeams: [],
      };
    }

    case "TICK_SET_BREAK": {
      const newBreakTimer = state.setBreakTimer - 1;
      if (newBreakTimer <= 0) {
        return {
          ...state,
          setBreakTimer: 0,
          auctionStatus: "bidding",
          timer: state.timerDuration,
        };
      }
      return { ...state, setBreakTimer: newBreakTimer };
    }

    case "END_SET_BREAK":
      return {
        ...state,
        setBreakTimer: 0,
        auctionStatus: "bidding",
        timer: state.timerDuration,
      };

    case "SET_AUCTION_STATUS":
      if (action.status === "unsold") return markUnsold(state);
      return { ...state, auctionStatus: action.status };


    case "SYNC_AUCTION":
      return { ...state, ...action.payload };

    case "LEAVE_ROOM":
      return { ...initialState, currentUser: state.currentUser, phase: "menu" };

    case "SET_CUSTOM_RETENTIONS":
      return {
        ...state,
        customRetentions: {
          ...state.customRetentions,
          [action.teamId]: { retentions: action.retentions, totalSpent: action.totalSpent },
        },
      };

    // A player disconnected/left mid-auction: drop their team, release their squad
    // back into the pool (queued at the very end for re-buying) and keep the
    // pass/sell logic working with the remaining teams only.
    case "REMOVE_TEAM": {
      const lobbyPlayers = state.lobbyPlayers.filter(
        (lp) => !(action.teamId && lp.team?.id === action.teamId) && !(action.playerId && lp.user.id === action.playerId)
      );
      if (!action.teamId) return { ...state, lobbyPlayers };

      const ts = state.teamStates[action.teamId];
      const teamStates = { ...state.teamStates };
      delete teamStates[action.teamId];

      const onBlockId = state.playerPool[state.currentPlayerIndex]?.id;
      const released = (ts?.squad || []).filter((p) => p.id !== onBlockId);
      const wasBidder = state.currentBidder === action.teamId;

      return {
        ...state,
        lobbyPlayers,
        teamStates,
        playerPool: [...state.playerPool, ...released],
        soldPlayers: state.soldPlayers.filter((sp) => sp.teamId !== action.teamId),
        passedTeams: state.passedTeams.filter((t) => t !== action.teamId),
        bidHistory: state.bidHistory.filter((b) => b.teamId !== action.teamId),
        currentBidder: wasBidder ? null : state.currentBidder,
        currentBid: wasBidder
          ? state.playerPool[state.currentPlayerIndex]?.basePrice ?? state.currentBid
          : state.currentBid,
      };
    }

    case "END_AUCTION":
      return { ...state, phase: "results", auctionStatus: "paused" };

    case "RESTORE_STATE":
      return { ...action.state };

    default:
      return state;
  }
}

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<Action>;
  getBidIncrement: () => number;
} | null>(null);

const STORAGE_KEY = "ipl-auction-session";

// Persist the live auction so a browser reload (or a flaky network) resumes
// exactly where the player was instead of dumping them back on the home page.
function loadPersisted(userId: string): GameState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw) as { userId: string; savedAt: number; state: GameState };
    if (!saved?.state || saved.userId !== userId) return null;
    if (Date.now() - saved.savedAt > 12 * 60 * 60 * 1000) return null;
    if (saved.state.phase !== "auction" && saved.state.phase !== "results") return null;
    return { ...saved.state, currentUser: saved.state.currentUser };
  } catch {
    return null;
  }
}

export function GameProvider({ children, initialUser }: { children: React.ReactNode; initialUser: { id: string; username: string; avatar: string } }) {
  const [state, dispatch] = useReducer(reducer, undefined as unknown as GameState, () => {
    const restored = loadPersisted(initialUser.id);
    if (restored) return { ...restored, currentUser: initialUser };
    return { ...initialState, currentUser: initialUser };
  });

  // Save on every meaningful change; clear once we're back on the menu.
  useEffect(() => {
    try {
      if (state.phase === "auction" || state.phase === "results") {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ userId: initialUser.id, savedAt: Date.now(), state })
        );
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      /* quota or private mode — persistence is best-effort */
    }
  }, [state, initialUser.id]);

  const getIncrement = useCallback(() => {
    return getBidIncrement(state.currentBid);
  }, [state.currentBid]);

  return (
    <GameContext.Provider value={{ state, dispatch, getBidIncrement: getIncrement }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within GameProvider");
  }
  return context;
}
