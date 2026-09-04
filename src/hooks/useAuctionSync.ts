import { useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

export interface AuctionBroadcast {
  type: "AUCTION_STATE" | "BID_ACTION" | "PASS_ACTION" | "START_AUCTION" | "PLAYER_LEFT" | "END_AUCTION";
  // For AUCTION_STATE (host broadcasts full state):
  currentPlayerIndex?: number;
  currentBid?: number;
  currentBidder?: string | null;
  auctionStatus?: string;
  timer?: number;
  soldPlayers?: any[];
  teamStates?: any;
  passedTeams?: string[];
  playerPool?: any[];
  bidHistory?: any[];
  unsoldPlayers?: any[];
  // For BID_ACTION / PASS_ACTION (non-host sends):
  teamId?: string;
  amount?: number;
  // For PLAYER_LEFT:
  username?: string;
  playerId?: string;
  releasedCount?: number;
}

export function useAuctionSync(
  roomId: string | null,
  isHost: boolean,
  onReceive: (msg: AuctionBroadcast) => void
) {
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!roomId) return;

    const channel = supabase.channel(`auction-${roomId}`, {
      config: { broadcast: { self: false } },
    });

    channel
      .on("broadcast", { event: "auction" }, (payload) => {
        onReceive(payload.payload as AuctionBroadcast);
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      channel.unsubscribe();
      channelRef.current = null;
    };
  }, [roomId, onReceive]);

  const broadcast = useCallback(
    (msg: AuctionBroadcast) => {
      if (channelRef.current) {
        channelRef.current.send({
          type: "broadcast",
          event: "auction",
          payload: msg,
        });
      }
    },
    []
  );

  return { broadcast };
}
