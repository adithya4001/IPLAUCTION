interface CrestPalette {
  base: string;
  accent: string;
}

/** Authentic-feeling franchise palettes (primary + secondary) */
const TEAM_PALETTE: Record<string, CrestPalette> = {
  csk: { base: "#F9CD05", accent: "#0081B4" },
  mi: { base: "#004BA0", accent: "#D1AB3E" },
  rcb: { base: "#D5152A", accent: "#111111" },
  kkr: { base: "#3A225D", accent: "#D4AF37" },
  dd: { base: "#0078BC", accent: "#DC2C36" },
  dc: { base: "#17449B", accent: "#DC2C36" },
  rr: { base: "#EA1A85", accent: "#254AA5" },
  kxip: { base: "#DD1F2D", accent: "#B0B0B0" },
  pbks: { base: "#DD1F2D", accent: "#D4AF37" },
  dch: { base: "#1C8AC8", accent: "#D4AF37" },
  srh: { base: "#F26522", accent: "#000000" },
  pwi: { base: "#6B21A8", accent: "#3FB6E0" },
  ktk: { base: "#E85D04", accent: "#0F3D3E" },
  rps: { base: "#6B21A8", accent: "#E23744" },
  gl: { base: "#E85D04", accent: "#B71C1C" },
  gt: { base: "#1B2133", accent: "#B9975B" },
  lsg: { base: "#0C2D63", accent: "#A72056" },
};

const SIZES = { xs: 20, sm: 28, md: 40, lg: 64, xl: 96 } as const;

interface TeamCrestProps {
  teamId: string;
  shortName: string;
  colorHex?: string;
  size?: keyof typeof SIZES;
  className?: string;
}

/**
 * Hand-drawn style franchise crest — shield silhouette, metallic rim,
 * chevron field and the franchise monogram. Replaces emoji "stickers".
 */
export default function TeamCrest({
  teamId,
  shortName,
  colorHex,
  size = "md",
  className = "",
}: TeamCrestProps) {
  const palette = TEAM_PALETTE[teamId] ?? {
    base: colorHex ?? "#334155",
    accent: "#D4AF37",
  };
  const px = SIZES[size];
  const uid = `crest-${teamId}-${size}`;
  const letters = shortName.slice(0, 4);
  const fontSize = letters.length >= 4 ? 22 : letters.length === 3 ? 27 : 32;

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 100 110"
      className={`inline-block shrink-0 align-middle ${className}`}
      role="img"
      aria-label={`${shortName} crest`}
    >
      <defs>
        <linearGradient id={`${uid}-field`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={palette.base} stopOpacity="1" />
          <stop offset="100%" stopColor={palette.accent} stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id={`${uid}-rim`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F7E7A1" />
          <stop offset="45%" stopColor="#C9A227" />
          <stop offset="100%" stopColor="#8A6B12" />
        </linearGradient>
        <linearGradient id={`${uid}-shine`} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="55%" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
        </linearGradient>
        <clipPath id={`${uid}-clip`}>
          <path d="M50 3 L94 18 V58 C94 84 74 99 50 107 C26 99 6 84 6 58 V18 Z" />
        </clipPath>
      </defs>

      {/* rim */}
      <path
        d="M50 3 L94 18 V58 C94 84 74 99 50 107 C26 99 6 84 6 58 V18 Z"
        fill={`url(#${uid}-rim)`}
      />
      {/* field */}
      <g clipPath={`url(#${uid}-clip)`}>
        <path
          d="M50 3 L94 18 V58 C94 84 74 99 50 107 C26 99 6 84 6 58 V18 Z"
          fill={`url(#${uid}-field)`}
          transform="translate(50 55) scale(0.93) translate(-50 -55)"
        />
        {/* chevron stripes */}
        <path d="M-10 74 L50 44 L110 74 L110 86 L50 56 L-10 86 Z" fill="#ffffff" opacity="0.14" />
        <path d="M-10 92 L50 62 L110 92 L110 100 L50 70 L-10 100 Z" fill="#000000" opacity="0.18" />
        <circle cx="50" cy="34" r="26" fill="#000000" opacity="0.16" />
        <path
          d="M50 3 L94 18 V58 C94 84 74 99 50 107 C26 99 6 84 6 58 V18 Z"
          fill={`url(#${uid}-shine)`}
        />
      </g>

      {/* monogram */}
      <text
        x="50"
        y="60"
        textAnchor="middle"
        fontFamily="Anton, Oswald, Impact, sans-serif"
        fontSize={fontSize}
        letterSpacing="1"
        fill="#FFFFFF"
        stroke="#00000055"
        strokeWidth="0.6"
      >
        {letters}
      </text>
      {/* base star */}
      <path
        d="M50 76 l2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.1 5.9-.8z"
        fill="#F7E7A1"
        opacity="0.9"
      />
    </svg>
  );
}
