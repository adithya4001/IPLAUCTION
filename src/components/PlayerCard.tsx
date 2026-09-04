import { motion } from "framer-motion";
import { ReactNode } from "react";
import PlayerPortrait, { COUNTRY_FLAGS, ROLE_ICONS } from "@/components/PlayerPortrait";

export function formatPrice(lakhs: number): string {
  if (lakhs >= 100) return `₹${(lakhs / 100).toFixed(2)} Cr`;
  return `₹${lakhs} L`;
}

export interface PlayerCardPlayer {
  id?: string;
  name: string;
  role: string;
  country: string;
  overseas?: boolean;
  basePrice?: number;
  specialization?: string;
  stats?: {
    matches?: number | null;
    runs?: number | null;
    wickets?: number | null;
    strikeRate?: number | null;
    average?: number | null;
    economy?: number | null;
  } | null;
}

type Tone = "gold" | "green" | "red" | "muted";

const TONE_CLASS: Record<Tone, string> = {
  gold: "text-primary",
  green: "text-neon-green",
  red: "text-destructive",
  muted: "text-muted-foreground",
};

interface PlayerCardProps {
  player: PlayerCardPlayer;
  showStats?: boolean;
  /** "full" = broadcast stage card, "compact" = same styling in a list row. */
  variant?: "full" | "compact";
  /** Outcome ribbon/glow — drives the SOLD / UNSOLD treatment. */
  outcome?: "sold" | "unsold" | null;
  /** Overrides the price shown bottom-right (defaults to base price). */
  priceLabel?: string;
  priceCaption?: string;
  priceTone?: Tone;
  /** Optional slots for checkboxes, team crests, remove buttons, etc. */
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  subtitle?: ReactNode;
  headerLabel?: string;
  selected?: boolean;
  className?: string;
  animate?: boolean;
}

export default function PlayerCard({
  player,
  showStats = true,
  variant = "full",
  outcome = null,
  priceLabel,
  priceCaption,
  priceTone = "gold",
  leftSlot,
  rightSlot,
  subtitle,
  headerLabel = "Player Profile",
  selected = false,
  className = "",
  animate = true,
}: PlayerCardProps) {
  const flag = COUNTRY_FLAGS[player.country] || "🌍";
  const roleIcon = ROLE_ICONS[player.role] || "⭐";
  const price = priceLabel ?? (player.basePrice != null ? formatPrice(player.basePrice) : "—");

  const outcomeRing =
    outcome === "sold"
      ? "border-neon-green/70 shadow-[0_0_36px_-6px_hsl(145_100%_45%/0.55)]"
      : outcome === "unsold"
      ? "border-destructive/60 shadow-[0_0_30px_-8px_hsl(0_100%_55%/0.45)]"
      : selected
      ? "border-primary/70 shadow-[0_0_30px_-8px_hsl(var(--primary)/0.6)]"
      : "border-primary/35 shadow-[0_18px_50px_-18px_hsl(var(--primary)/0.5)]";

  /* ---------------- Compact list row ---------------- */
  if (variant === "compact") {
    return (
      <motion.div
        initial={animate ? { opacity: 0, x: 12 } : false}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className={`flex items-center gap-2.5 rounded-lg border bg-background/70 backdrop-blur-sm px-2 py-1.5 ${outcomeRing} ${className}`}
      >
        {leftSlot}
        <PlayerPortrait
          name={player.name}
          role={player.role}
          className="w-10 h-12 flex-shrink-0 border border-primary/30"
          initialsClassName="text-sm"
          rounded="rounded-md"
        />
        <div className="min-w-0 flex-1">
          <p className="font-display font-bold uppercase tracking-wide text-[13px] leading-tight text-foreground truncate">
            {player.name}
          </p>
          <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground truncate">
            {roleIcon} {player.role} · {flag} {player.country}
            {player.overseas ? " · OS" : ""}
          </p>
          {subtitle && <div className="text-[10px] text-muted-foreground/90 truncate">{subtitle}</div>}
        </div>
        <div className="text-right flex-shrink-0">
          {priceCaption && (
            <div className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground">{priceCaption}</div>
          )}
          <div className={`font-display font-black text-sm leading-none ${TONE_CLASS[priceTone]}`}>{price}</div>
        </div>
        {rightSlot}
      </motion.div>
    );
  }

  /* ---------------- Full broadcast card ---------------- */
  const statRows: { label: string; value: string }[] = [];
  if (showStats && player.stats) {
    const s = player.stats;
    if (s.matches != null) statRows.push({ label: "Matches", value: String(s.matches) });
    if (s.runs != null) statRows.push({ label: "Runs", value: String(s.runs) });
    if (s.wickets != null) statRows.push({ label: "Wickets", value: String(s.wickets) });
    if (s.strikeRate != null) statRows.push({ label: "Strike Rate", value: s.strikeRate.toFixed(1) });
    if (s.average != null) statRows.push({ label: "Average", value: s.average.toFixed(1) });
    if (s.economy != null) statRows.push({ label: "Economy", value: s.economy.toFixed(1) });
  }

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 30, scale: 0.94 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -24, scale: 0.96 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`relative rounded-2xl overflow-hidden border bg-background/85 backdrop-blur-xl text-left ${outcomeRing} ${className}`}
    >
      {/* Broadcast header bar */}
      <div className="relative flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-primary via-primary/80 to-primary/10">
        <div className="w-7 h-7 rounded-full bg-background/85 border border-primary flex items-center justify-center text-sm">
          {roleIcon}
        </div>
        <div className="leading-none">
          <div className="font-display font-black tracking-[0.18em] text-[13px] md:text-sm text-primary-foreground uppercase">
            IPL Player Auction
          </div>
          <div className="text-[10px] font-semibold tracking-[0.3em] text-primary-foreground/85 uppercase mt-1">
            {headerLabel}
          </div>
        </div>
        {player.overseas && (
          <span className="ml-auto text-[10px] font-bold tracking-widest uppercase bg-background/85 text-accent px-2 py-1 rounded">
            Overseas
          </span>
        )}
      </div>

      {/* Spotlight sweep on entrance */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-r from-transparent via-primary/20 to-transparent"
        initial={{ x: "-130%" }}
        animate={{ x: "130%" }}
        transition={{ duration: 1.1, ease: "easeInOut", repeat: Infinity, repeatDelay: 3.2 }}
      />

      <div className="grid grid-cols-[minmax(0,42%)_minmax(0,1fr)]">
        {/* Photo panel */}
        <div className="relative border-r border-primary/25">
          <PlayerPortrait
            name={player.name}
            role={player.role}
            className="w-full h-full min-h-[190px] max-h-[260px]"
            initialsClassName="text-5xl"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/85 via-transparent to-transparent" />
          <div className="absolute bottom-2 left-2 flex items-center gap-1 text-lg bg-background/85 border border-primary/40 rounded-full px-2 py-0.5">
            <span>{flag}</span>
          </div>
        </div>

        {/* Info panel */}
        <div className="p-3 md:p-4 flex flex-col bg-background/60">
          <motion.h2
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.12 }}
            className="font-display font-black uppercase tracking-wide text-xl md:text-3xl text-foreground leading-tight"
            style={{ textShadow: "0 2px 14px hsl(0 0% 0% / 0.85)" }}
          >
            {player.name}
          </motion.h2>
          <div className="text-[11px] md:text-xs font-semibold tracking-[0.2em] uppercase text-primary mt-1">
            {player.role} · {player.country}
          </div>
          {player.specialization && (
            <div className="text-xs text-foreground/85 mt-1">{player.specialization}</div>
          )}
          {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}

          {statRows.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.28 }}
              className="mt-3 space-y-1"
            >
              {statRows.map((row, i) => (
                <motion.div
                  key={row.label}
                  initial={{ opacity: 0, x: 14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="flex items-center justify-between gap-3 bg-background/70 border-l-2 border-primary rounded-r px-2 py-1"
                >
                  <span className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {row.label}
                  </span>
                  <span className="font-display font-bold text-sm md:text-base text-foreground">
                    {row.value}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="mt-auto pt-3 flex items-end justify-between gap-2">
            <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              {priceCaption ?? "Base Price"}
            </div>
            <div className={`font-display font-black text-xl md:text-2xl ${TONE_CLASS[priceTone]}`}>
              {price}
            </div>
          </div>
          {rightSlot}
        </div>
      </div>
    </motion.div>
  );
}
