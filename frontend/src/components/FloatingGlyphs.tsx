import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface GlyphItem {
  id: string;
  text: string;
  x: string;
  y: string;
  size: string;
  opacity: number;
  rotation?: number;
  driftClass: string;
  delay: number;
}

const GLYPHS: GlyphItem[] = [
  // Top left cluster
  { id: 'g1', text: '(12+12)', x: '12%', y: '24%', size: 'text-lg md:text-2xl', opacity: 0.35, rotation: -4, driftClass: 'animate-float-1', delay: 0 },
  { id: 'g2', text: '-15+6', x: '18%', y: '48%', size: 'text-base md:text-xl', opacity: 0.4, rotation: 3, driftClass: 'animate-float-2', delay: 0.5 },
  { id: 'g3', text: '3y', x: '10%', y: '58%', size: 'text-sm md:text-lg', opacity: 0.3, rotation: -2, driftClass: 'animate-float-3', delay: 1 },
  { id: 'g4', text: '24', x: '15%', y: '68%', size: 'text-2xl md:text-4xl font-light', opacity: 0.25, rotation: 6, driftClass: 'animate-float-1', delay: 1.5 },

  // Top right cluster
  { id: 'g5', text: '12', x: '82%', y: '26%', size: 'text-xl md:text-3xl font-light', opacity: 0.3, rotation: 8, driftClass: 'animate-float-2', delay: 0.3 },
  { id: 'g6', text: '17+6-4', x: '80%', y: '52%', size: 'text-base md:text-xl', opacity: 0.35, rotation: -3, driftClass: 'animate-float-3', delay: 0.8 },
  { id: 'g7', text: '-8', x: '72%', y: '62%', size: 'text-lg md:text-2xl', opacity: 0.35, rotation: 4, driftClass: 'animate-float-1', delay: 1.2 },
  { id: 'g8', text: '5×9/8', x: '85%', y: '70%', size: 'text-sm md:text-lg', opacity: 0.25, rotation: -5, driftClass: 'animate-float-2', delay: 1.7 },

  // Subtle cryptographic / threat equations
  { id: 'g9', text: '√256', x: '26%', y: '18%', size: 'text-xs md:text-sm font-mono-cad', opacity: 0.28, rotation: 2, driftClass: 'animate-float-3', delay: 2 },
  { id: 'g10', text: 'SHA-256(0x8F)', x: '74%', y: '18%', size: 'text-xs md:text-sm font-mono-cad', opacity: 0.25, rotation: -2, driftClass: 'animate-float-1', delay: 2.3 },
  { id: 'g11', text: 'UPI_INTENT.CRC', x: '28%', y: '78%', size: 'text-[11px] md:text-xs font-mono-cad', opacity: 0.25, rotation: 1, driftClass: 'animate-float-2', delay: 2.6 },
  { id: 'g12', text: 'APK_DEFANG:0ms', x: '68%', y: '80%', size: 'text-[11px] md:text-xs font-mono-cad', opacity: 0.25, rotation: -4, driftClass: 'animate-float-3', delay: 3 },
];

const ORBS = [
  { id: 'o1', x: '35%', y: '28%', size: 6, delay: 0 },
  { id: 'o2', x: '42%', y: '22%', size: 4, delay: 1.5 },
  { id: 'o3', x: '62%', y: '30%', size: 5, delay: 0.8 },
  { id: 'o4', x: '58%', y: '65%', size: 7, delay: 2.2 },
  { id: 'o5', x: '38%', y: '72%', size: 4, delay: 3.1 },
  { id: 'o6', x: '22%', y: '36%', size: 5, delay: 1.1 },
  { id: 'o7', x: '78%', y: '42%', size: 6, delay: 2.7 },
];

export const FloatingGlyphs: React.FC = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for high-end organic parallax
  const springX = useSpring(mouseX, { stiffness: 45, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 45, damping: 25 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const normX = (e.clientX / innerWidth - 0.5) * 30;
      const normY = (e.clientY / innerHeight - 0.5) * 30;
      mouseX.set(normX);
      mouseY.set(normY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-10" aria-hidden="true">
      {/* Floating Mathematical & Algorithmic Glyphs with Parallax */}
      {GLYPHS.map((glyph) => (
        <motion.div
          key={glyph.id}
          style={{
            left: glyph.x,
            top: glyph.y,
            x: springX,
            y: springY,
          }}
          className="absolute"
        >
          <div
            className={`font-display text-white/50 tracking-wider font-light ${glyph.size} ${glyph.driftClass}`}
            style={{
              opacity: glyph.opacity,
              transform: `rotate(${glyph.rotation || 0}deg)`,
              textShadow: '0 0 12px rgba(255,255,255,0.15)',
            }}
          >
            {glyph.text}
          </div>
        </motion.div>
      ))}

      {/* Luminous Glowing Emerald Orbs / Particles */}
      {ORBS.map((orb) => (
        <motion.div
          key={orb.id}
          style={{
            left: orb.x,
            top: orb.y,
            x: springX,
            y: springY,
          }}
          className="absolute"
        >
          <div
            className="rounded-full bg-emerald-400 animate-orb"
            style={{
              width: `${orb.size}px`,
              height: `${orb.size}px`,
              animationDelay: `${orb.delay}s`,
              boxShadow: '0 0 14px 4px rgba(0, 229, 117, 0.65)',
            }}
          />
        </motion.div>
      ))}

      {/* Subtle Blueprint Chalkboard Grid Accents */}
      <div className="absolute left-10 top-1/3 w-28 h-28 border border-white/[0.04] rounded-sm pointer-events-none hidden md:block" />
      <div className="absolute right-14 top-1/4 w-32 h-32 border border-white/[0.03] rounded-sm pointer-events-none hidden md:block" />
      <div className="absolute left-1/4 bottom-16 w-40 h-24 border-t border-b border-white/[0.03] pointer-events-none hidden md:block" />
    </div>
  );
};
