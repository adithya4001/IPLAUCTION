import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { SFX } from "@/hooks/useSoundEffects";

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  text: string;
  timestamp: number;
  teamColor?: string;
}

interface GameChatProps {
  roomId: string | null;
  userId: string;
  username: string;
  avatar: string;
  teamColor?: string;
  minimized?: boolean;
}

export default function GameChat({ roomId, userId, username, avatar, teamColor, minimized = false }: GameChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(!minimized);
  const [unread, setUnread] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    if (!roomId) return;

    const channel = supabase.channel(`chat-${roomId}`, {
      config: { broadcast: { self: true } },
    });

    channel
      .on("broadcast", { event: "chat" }, (payload) => {
        const msg = payload.payload as ChatMessage;
        setMessages((prev) => [...prev.slice(-99), msg]);
        if (!isOpen && msg.userId !== userId) {
          setUnread((u) => u + 1);
        }
        SFX.click();
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      channel.unsubscribe();
      channelRef.current = null;
    };
  }, [roomId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) setUnread(0);
  }, [isOpen]);

  const sendMessage = useCallback(() => {
    if (!input.trim() || !channelRef.current) return;
    const msg: ChatMessage = {
      id: `${userId}-${Date.now()}`,
      userId,
      username,
      avatar,
      text: input.trim(),
      timestamp: Date.now(),
      teamColor,
    };
    channelRef.current.send({ type: "broadcast", event: "chat", payload: msg });
    setInput("");
  }, [input, userId, username, avatar, teamColor]);

  // Quick reactions
  const quickReactions = ["🔥", "💰", "😤", "👏", "😂", "💀"];

  const sendReaction = (emoji: string) => {
    if (!channelRef.current) return;
    const msg: ChatMessage = {
      id: `${userId}-${Date.now()}`,
      userId,
      username,
      avatar,
      text: emoji,
      timestamp: Date.now(),
      teamColor,
    };
    channelRef.current.send({ type: "broadcast", event: "chat", payload: msg });
  };

  if (!roomId) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end">
      {/* Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mb-2 relative bg-primary/20 border border-primary/40 text-primary rounded-full w-12 h-12 flex items-center justify-center font-display font-bold text-lg hover:bg-primary/30 transition-all shadow-lg"
      >
        💬
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="w-72 sm:w-80 glass-card border border-border/40 rounded-xl overflow-hidden flex flex-col"
            style={{ maxHeight: "360px" }}
          >
            {/* Header */}
            <div className="px-3 py-2 border-b border-border/30 bg-card/80 flex items-center justify-between">
              <span className="font-display text-xs font-bold uppercase tracking-wider text-primary">
                Live Chat
              </span>
              <span className="text-[10px] text-muted-foreground">{messages.length} msgs</span>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-2 space-y-1.5" style={{ minHeight: "160px", maxHeight: "220px" }}>
              {messages.length === 0 && (
                <p className="text-center text-muted-foreground text-xs py-4">No messages yet. Say hello! 👋</p>
              )}
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.userId === userId ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex gap-1.5 ${msg.userId === userId ? "flex-row-reverse" : ""}`}
                >
                  <span className="text-lg flex-shrink-0">{msg.avatar}</span>
                  <div className={`max-w-[80%] ${msg.userId === userId ? "text-right" : ""}`}>
                    <span
                      className="text-[10px] font-bold"
                      style={{ color: msg.teamColor || "hsl(var(--muted-foreground))" }}
                    >
                      {msg.username}
                    </span>
                    <div
                      className={`text-xs px-2 py-1 rounded-lg mt-0.5 ${
                        msg.text.length <= 2
                          ? "text-2xl bg-transparent"
                          : msg.userId === userId
                          ? "bg-primary/15 text-foreground"
                          : "bg-secondary/60 text-foreground"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick reactions */}
            <div className="flex gap-1 px-2 py-1 border-t border-border/20">
              {quickReactions.map((e) => (
                <button
                  key={e}
                  onClick={() => sendReaction(e)}
                  className="flex-1 text-base hover:scale-125 transition-transform active:scale-90"
                >
                  {e}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-1.5 p-2 border-t border-border/30">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-secondary/50 border border-border/30 rounded-lg px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                maxLength={200}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className="px-3 py-1.5 rounded-lg bg-primary/20 text-primary text-xs font-bold hover:bg-primary/30 disabled:opacity-30 transition-all"
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
