import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  rotation: number;
  scale: number;
  delay: number;
}

const CONFETTI_COLORS = [
  "hsl(45, 100%, 51%)",  // gold
  "hsl(280, 100%, 65%)", // purple
  "hsl(145, 100%, 45%)", // green
  "hsl(0, 100%, 55%)",   // red
  "hsl(210, 100%, 55%)", // blue
  "hsl(25, 100%, 55%)",  // orange
  "hsl(330, 100%, 60%)", // pink
  "hsl(185, 100%, 50%)", // cyan
];

export default function ConfettiEffect({ trigger }: { trigger: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!trigger) return;
    const newParticles: Particle[] = [];
    for (let i = 0; i < 60; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        rotation: Math.random() * 720 - 360,
        scale: 0.5 + Math.random() * 1,
        delay: Math.random() * 0.5,
      });
    }
    setParticles(newParticles);
    const timer = setTimeout(() => setParticles([]), 3000);
    return () => clearTimeout(timer);
  }, [trigger]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: `${p.x}vw`, y: `${p.y}vh`, rotate: 0, opacity: 1, scale: p.scale }}
          animate={{
            y: "110vh",
            rotate: p.rotation,
            opacity: [1, 1, 0.8, 0],
          }}
          transition={{ duration: 2.5 + Math.random(), delay: p.delay, ease: "easeIn" }}
          style={{ position: "absolute", width: 10, height: 14, backgroundColor: p.color, borderRadius: 2 }}
        />
      ))}
    </div>
  );
}
