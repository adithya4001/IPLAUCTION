import { useState, useEffect } from "react";
import { getPlayerImageUrl } from "@/data/playerImages";

export const ROLE_ICONS: Record<string, string> = {
  Batter: "🏏",
  Bowler: "🎾",
  "All-Rounder": "⭐",
  WK: "🧤",
};

export const COUNTRY_FLAGS: Record<string, string> = {
  India: "🇮🇳",
  Australia: "🇦🇺",
  England: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "South Africa": "🇿🇦",
  "New Zealand": "🇳🇿",
  "West Indies": "🏝️",
  "Sri Lanka": "🇱🇰",
  Pakistan: "🇵🇰",
  Afghanistan: "🇦🇫",
  Bangladesh: "🇧🇩",
};

export function getPlayerInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** Deterministic hue per player so the fallback never looks random between renders. */
export function getPlayerHue(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash) % 360;
}

interface PlayerPortraitProps {
  name: string;
  role?: string;
  /** Tailwind sizing/border classes applied to the wrapper. */
  className?: string;
  /** Font size class for the fallback initials. */
  initialsClassName?: string;
  rounded?: string;
}

/**
 * Player photo with a guaranteed visual fallback: if no image exists (or it fails
 * to load) we render the exact same frame with initials on a deterministic
 * gradient plus the role glyph, so every card keeps identical layout.
 */
export default function PlayerPortrait({
  name,
  role,
  className = "",
  initialsClassName = "text-2xl",
  rounded = "",
}: PlayerPortraitProps) {
  const [src, setSrc] = useState(getPlayerImageUrl(name));
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    setSrc(getPlayerImageUrl(name));
    setFailed(false);
  }, [name]);
  const hue = getPlayerHue(name);
  const showImage = !!src && !failed;

  return (
    <div className={`relative overflow-hidden bg-background/80 ${rounded} ${className}`}>
      {/* Fallback layer always renders underneath — image sits on top when available */}
      <div
        aria-hidden={showImage ? true : undefined}
        className="absolute inset-0 flex items-center justify-center"
        style={{
          background: `linear-gradient(150deg, hsl(${hue} 55% 26%), hsl(${(hue + 40) % 360} 60% 14%))`,
        }}
      >
        <span
          className={`font-display font-black tracking-wide text-foreground/90 ${initialsClassName}`}
          style={{ textShadow: "0 2px 10px hsl(0 0% 0% / 0.7)" }}
        >
          {getPlayerInitials(name)}
        </span>
        {role && (
          <span className="absolute bottom-1 right-1 text-[10px] opacity-80">
            {ROLE_ICONS[role] || "⭐"}
          </span>
        )}
      </div>

      {showImage && (
        <img
          src={src}
          alt={name}
          loading="lazy"
          onError={() => setFailed(true)}
          className="relative w-full h-full object-cover object-top"
        />
      )}
    </div>
  );
}
