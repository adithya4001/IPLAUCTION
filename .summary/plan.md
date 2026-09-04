

## Plan: Add Player Photos & Realistic Auction Background

### Overview
Replace the initials-based avatar circles with real player photos using publicly available cricket image APIs, and add an immersive IPL auction-style background to the auction screen.

### 1. Player Photo System

**Approach:** Use a utility function that generates image URLs from a reliable cricket image source. We'll use ESPN Cricinfo player image URLs (pattern-based) with a fallback to the existing initials avatar.

**Changes to `src/components/PlayerCard.tsx`:**
- Add an `imageUrl` field lookup from a new `src/data/playerImages.ts` mapping file
- Replace the colored initials circle with an `<img>` tag that falls back to the initials avatar on error
- Style the photo with a circular crop, border glow matching the team/role

**New file `src/data/playerImages.ts`:**
- A `Record<string, string>` mapping ~150+ key player names to their image URLs
- Use reliable CDN sources (e.g., `https://img1.hscicdn.com/image/upload/f_auto,t_h_100/lsci/db/PICTURES/CMS/...` or similar public cricket image endpoints)
- For players without a mapped image, fall back to initials

### 2. Realistic Auction Background

**Changes to `src/components/AuctionScreen.tsx`:**
- Replace the plain `var(--gradient-dark)` background with a layered IPL auction stage design:
  - Dark gradient base with subtle radial spotlight effects
  - Animated particle/bokeh dots using CSS or framer-motion
  - A subtle podium/stage glow behind the player card
  - Golden accent lighting from edges

**Changes to `src/index.css`:**
- Add new CSS classes for auction atmosphere:
  - `.auction-stage` — radial gradient spotlight effect
  - `.auction-particles` — floating bokeh/light particles via CSS animation
  - `.auction-spotlight` — animated top-down light cone

### 3. Enhanced Player Card Styling

**Changes to `src/components/PlayerCard.tsx`:**
- Add a glowing border around the player photo that pulses during active bidding
- Country flag overlay on the photo corner
- Role badge with icon overlay

### Technical Details

- **Image fallback chain:** Mapped URL → initials avatar (existing logic preserved)
- **Performance:** Images loaded lazily with `loading="lazy"`, small thumbnail sizes (~100-150px)
- **No external dependencies needed** — uses CSS animations and existing framer-motion

### Files to Create/Edit
| File | Action |
|------|--------|
| `src/data/playerImages.ts` | Create — player name → image URL mapping |
| `src/components/PlayerCard.tsx` | Edit — add photo with fallback, enhanced styling |
| `src/components/AuctionScreen.tsx` | Edit — add auction stage background |
| `src/index.css` | Edit — add auction atmosphere CSS classes |

