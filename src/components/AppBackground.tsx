import stadiumBg from "@/assets/bg-stadium.jpg";
import auctionHallBg from "@/assets/bg-auction-hall.jpg";
import trophyBg from "@/assets/bg-trophy.jpg";

type Variant = "stadium" | "auction" | "trophy";

const IMAGES: Record<Variant, string> = {
  stadium: stadiumBg,
  auction: auctionHallBg,
  trophy: trophyBg,
};

interface AppBackgroundProps {
  variant?: Variant;
  /** dim the photo more for content-heavy screens */
  intensity?: "soft" | "strong";
}

/**
 * Full-screen animated cricket-world backdrop.
 * Purely decorative — sits behind all screen content.
 */
export default function AppBackground({ variant = "stadium", intensity = "strong" }: AppBackgroundProps) {
  return (
    <div className="app-bg" aria-hidden="true">
      <div
        className="app-bg-photo"
        style={{ backgroundImage: `url(${IMAGES[variant]})` }}
      />
      <div className={intensity === "strong" ? "app-bg-veil app-bg-veil-strong" : "app-bg-veil"} />
      <div className="app-bg-spotlights" />
      <div className="app-bg-sweep" />
      <div className="auction-particles">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="auction-particle" />
        ))}
      </div>
      <div className="auction-edge-glow" />
    </div>
  );
}
