import {
  Gamepad2,
  Trophy,
  Zap,
  Flame,
  Gem,
  Star,
  Target,
  Rocket,
  User,
} from "lucide-react";

/** Emoji values are still what we persist — this maps them to crafted icon art. */
export const AVATAR_KEYS = ["🎮", "🏆", "⚡", "🔥", "💎", "🌟", "🎯", "🚀"] as const;

const ICONS: Record<string, typeof User> = {
  "🎮": Gamepad2,
  "🏆": Trophy,
  "⚡": Zap,
  "🔥": Flame,
  "💎": Gem,
  "🌟": Star,
  "🎯": Target,
  "🚀": Rocket,
};

const TINTS: Record<string, string> = {
  "🎮": "185 100% 50%",
  "🏆": "45 100% 51%",
  "⚡": "55 100% 55%",
  "🔥": "20 100% 55%",
  "💎": "210 100% 60%",
  "🌟": "45 100% 60%",
  "🎯": "0 100% 58%",
  "🚀": "280 100% 65%",
};

const SIZES = { sm: 28, md: 40, lg: 52 } as const;

interface UserAvatarProps {
  value?: string;
  size?: keyof typeof SIZES;
  className?: string;
}

export default function UserAvatar({ value = "🎮", size = "md", className = "" }: UserAvatarProps) {
  const Icon = ICONS[value] ?? User;
  const tint = TINTS[value] ?? "45 100% 51%";
  const px = SIZES[size];
  return (
    <span
      className={`inline-flex items-center justify-center rounded-xl border align-middle ${className}`}
      style={{
        width: px,
        height: px,
        borderColor: `hsl(${tint} / 0.45)`,
        background: `radial-gradient(circle at 30% 25%, hsl(${tint} / 0.35), hsl(${tint} / 0.08) 70%)`,
        boxShadow: `0 0 14px hsl(${tint} / 0.25), inset 0 1px 0 hsl(0 0% 100% / 0.15)`,
      }}
    >
      <Icon size={px * 0.5} strokeWidth={2.2} style={{ color: `hsl(${tint})` }} />
    </span>
  );
}
