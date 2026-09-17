import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface PrismaticDisplay3DProps {
  className?: string;
}

export const PrismaticDisplay3D: React.FC<PrismaticDisplay3DProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const screenCanvasRef = useRef<HTMLCanvasElement>(null);
  const reflectionCanvasRef = useRef<HTMLCanvasElement>(null);

  // Mouse tracking for 3D gyro tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 120 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // 3D rotation transforms
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [22, 10]); // Tilted back ~16deg baseline
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-8, 8]);
  const glintTranslateX = useTransform(smoothMouseX, [-0.5, 0.5], [-30, 30]);

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // Canvas fluid aurora renderer matching Pinterest Imagica AI reference
  useEffect(() => {
    const screenCanvas = screenCanvasRef.current;
    const reflectionCanvas = reflectionCanvasRef.current;
    if (!screenCanvas) return;

    const screenCtx = screenCanvas.getContext('2d');
    const reflectionCtx = reflectionCanvas ? reflectionCanvas.getContext('2d') : null;
    if (!screenCtx) return;

    let animationFrameId: number;
    let startTime = performance.now();

    const render = (now: number) => {
      const elapsed = (now - startTime) * 0.001;
      const t = elapsed * 0.85; // Speed multiplier for fluid wave

      const w = screenCanvas.width;
      const h = screenCanvas.height;

      // Clear
      screenCtx.clearRect(0, 0, w, h);

      // Deep obsidian backing
      screenCtx.fillStyle = '#060a08';
      screenCtx.fillRect(0, 0, w, h);

      // Additive / Screen blending for luminous aurora light fields
      screenCtx.globalCompositeOperation = 'screen';

      // 1. Warm Magenta / Rose Field (left to center-left)
      const p1x = w * (0.16 + 0.12 * Math.sin(t * 0.7));
      const p1y = h * (0.42 + 0.28 * Math.cos(t * 0.5));
      const r1 = w * 0.46;
      const g1 = screenCtx.createRadialGradient(p1x, p1y, 5, p1x, p1y, r1);
      g1.addColorStop(0, 'rgba(244, 63, 94, 0.95)');
      g1.addColorStop(0.4, 'rgba(236, 72, 153, 0.65)');
      g1.addColorStop(0.8, 'rgba(219, 39, 119, 0.2)');
      g1.addColorStop(1, 'rgba(219, 39, 119, 0)');
      screenCtx.fillStyle = g1;
      screenCtx.beginPath();
      screenCtx.arc(p1x, p1y, r1, 0, Math.PI * 2);
      screenCtx.fill();

      // 2. Royal Purple / Violet Horizon (top-left & center)
      const p2x = w * (0.34 + 0.14 * Math.cos(t * 0.6 + 1));
      const p2y = h * (0.22 + 0.24 * Math.sin(t * 0.8));
      const r2 = w * 0.42;
      const g2 = screenCtx.createRadialGradient(p2x, p2y, 5, p2x, p2y, r2);
      g2.addColorStop(0, 'rgba(139, 92, 246, 0.9)');
      g2.addColorStop(0.5, 'rgba(124, 58, 237, 0.55)');
      g2.addColorStop(0.85, 'rgba(99, 102, 241, 0.2)');
      g2.addColorStop(1, 'rgba(99, 102, 241, 0)');
      screenCtx.fillStyle = g2;
      screenCtx.beginPath();
      screenCtx.arc(p2x, p2y, r2, 0, Math.PI * 2);
      screenCtx.fill();

      // 3. Electric Cyan / Sky Horizon (center to center-right)
      const p3x = w * (0.64 + 0.15 * Math.sin(t * 0.75 + 1.8));
      const p3y = h * (0.52 + 0.25 * Math.cos(t * 0.65));
      const r3 = w * 0.48;
      const g3 = screenCtx.createRadialGradient(p3x, p3y, 5, p3x, p3y, r3);
      g3.addColorStop(0, 'rgba(6, 182, 212, 0.98)');
      g3.addColorStop(0.45, 'rgba(56, 189, 248, 0.65)');
      g3.addColorStop(0.8, 'rgba(14, 165, 233, 0.25)');
      g3.addColorStop(1, 'rgba(6, 182, 212, 0)');
      screenCtx.fillStyle = g3;
      screenCtx.beginPath();
      screenCtx.arc(p3x, p3y, r3, 0, Math.PI * 2);
      screenCtx.fill();

      // 4. Aurora Mint / Emerald Lagoon (bottom-right)
      const p4x = w * (0.84 + 0.1 * Math.cos(t * 0.55 + 2));
      const p4y = h * (0.62 + 0.22 * Math.sin(t * 0.9 + 0.5));
      const r4 = w * 0.42;
      const g4 = screenCtx.createRadialGradient(p4x, p4y, 5, p4x, p4y, r4);
      g4.addColorStop(0, 'rgba(16, 185, 129, 0.95)');
      g4.addColorStop(0.45, 'rgba(52, 211, 153, 0.6)');
      g4.addColorStop(0.8, 'rgba(5, 150, 105, 0.2)');
      g4.addColorStop(1, 'rgba(16, 185, 129, 0)');
      screenCtx.fillStyle = g4;
      screenCtx.beginPath();
      screenCtx.arc(p4x, p4y, r4, 0, Math.PI * 2);
      screenCtx.fill();

      // 5. Deep Sapphire / Cobalt Wave (far right)
      const p5x = w * (0.92 + 0.08 * Math.sin(t * 0.65 + 3));
      const p5y = h * (0.35 + 0.25 * Math.cos(t * 0.7));
      const r5 = w * 0.38;
      const g5 = screenCtx.createRadialGradient(p5x, p5y, 5, p5x, p5y, r5);
      g5.addColorStop(0, 'rgba(59, 130, 246, 0.85)');
      g5.addColorStop(0.5, 'rgba(37, 99, 235, 0.45)');
      g5.addColorStop(1, 'rgba(59, 130, 246, 0)');
      screenCtx.fillStyle = g5;
      screenCtx.beginPath();
      screenCtx.arc(p5x, p5y, r5, 0, Math.PI * 2);
      screenCtx.fill();

      // 6. Central Luminous Incandescent White Core Beam
      const coreX = w * (0.48 + 0.12 * Math.sin(t * 0.9 + 0.8));
      const coreY = h * 0.46;
      const coreRadius = w * 0.52;
      const gCore = screenCtx.createRadialGradient(coreX, coreY, 2, coreX, coreY, coreRadius);
      gCore.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
      gCore.addColorStop(0.2, 'rgba(240, 253, 250, 0.85)');
      gCore.addColorStop(0.45, 'rgba(186, 230, 253, 0.4)');
      gCore.addColorStop(0.75, 'rgba(167, 243, 208, 0.15)');
      gCore.addColorStop(1, 'rgba(255, 255, 255, 0)');
      screenCtx.fillStyle = gCore;
      screenCtx.beginPath();
      screenCtx.arc(coreX, coreY, coreRadius, 0, Math.PI * 2);
      screenCtx.fill();

      // 7. Horizontal Anamorphic Laser Aurora Ribbon Flare (matching Imagica reference)
      const ribbonY = h * (0.5 + 0.08 * Math.sin(t * 1.15));
      const ribbonGrad = screenCtx.createLinearGradient(0, 0, w, 0);
      ribbonGrad.addColorStop(0, 'rgba(236, 72, 153, 0.55)');
      ribbonGrad.addColorStop(0.25, 'rgba(168, 85, 247, 0.5)');
      ribbonGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.95)');
      ribbonGrad.addColorStop(0.75, 'rgba(6, 182, 212, 0.6)');
      ribbonGrad.addColorStop(1, 'rgba(16, 185, 129, 0.45)');
      screenCtx.fillStyle = ribbonGrad;
      screenCtx.fillRect(0, ribbonY - h * 0.18, w, h * 0.36);

      // Reset composite operation
      screenCtx.globalCompositeOperation = 'source-over';

      // Draw mirrored live reflection onto bottom canvas if present
      if (reflectionCtx && reflectionCanvas) {
        reflectionCtx.clearRect(0, 0, reflectionCanvas.width, reflectionCanvas.height);
        reflectionCtx.save();
        // Flip vertically
        reflectionCtx.scale(1, -1);
        reflectionCtx.drawImage(
          screenCanvas,
          0,
          -reflectionCanvas.height,
          reflectionCanvas.width,
          reflectionCanvas.height
        );
        reflectionCtx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full max-w-3xl mx-auto flex flex-col items-center select-none ${className}`}
      style={{ perspective: '1200px' }}
    >
      {/* ═══════════════ Volumetric Atmospheric Aura Spill ═══════════════ */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[320px] pointer-events-none -z-10 overflow-visible">
        {/* Left Magenta Aura */}
        <div
          className="absolute left-[5%] top-1/4 w-[340px] h-[220px] rounded-full blur-[75px] opacity-35 transition-opacity duration-700"
          style={{
            background: 'radial-gradient(circle, rgba(236,72,153,0.5) 0%, rgba(139,92,246,0.2) 60%, transparent 70%)',
            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          }}
        />

        {/* Center Cyan Luminous Beam */}
        <div
          className="absolute left-1/2 -translate-x-1/2 top-10 w-[500px] h-[260px] rounded-full blur-[80px] opacity-45 transition-opacity duration-700"
          style={{
            background: 'radial-gradient(circle, rgba(6,182,212,0.4) 0%, rgba(56,189,248,0.2) 40%, transparent 70%)',
            transform: isHovered ? 'scale(1.15)' : 'scale(1)',
          }}
        />

        {/* Right Emerald / Indigo Aura */}
        <div
          className="absolute right-[5%] top-1/4 w-[340px] h-[220px] rounded-full blur-[75px] opacity-35 transition-opacity duration-700"
          style={{
            background: 'radial-gradient(circle, rgba(16,185,129,0.4) 0%, rgba(59,130,246,0.25) 50%, transparent 70%)',
            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          }}
        />
      </div>

      {/* ═══════════════ 3D Interactive Console / Open Display ═══════════════ */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full flex flex-col items-center"
      >
        {/* The 3D Angled Screen Display (matching Pinterest reference) */}
        <div
          className="relative w-[92%] sm:w-[88%] md:w-[85%] rounded-xl overflow-hidden shadow-2xl transition-shadow duration-500"
          style={{
            background: 'linear-gradient(180deg, #18221b 0%, #0d1310 100%)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            boxShadow:
              '0 0 50px 15px rgba(6,182,212,0.25), 0 0 100px 30px rgba(139,92,246,0.18), inset 0 1px 1.5px rgba(255,255,255,0.6)',
          }}
        >
          {/* Top Chassis Specular Edge Glint */}
          <motion.div
            style={{ x: glintTranslateX }}
            className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/70 to-transparent pointer-events-none z-30"
          />

          {/* Screen Bezel Inset */}
          <div className="p-1.5 sm:p-2 bg-neutral-950/80 rounded-xl relative overflow-hidden">
            {/* The Fluid Live Aurora Canvas */}
            <div className="relative w-full h-[120px] sm:h-[150px] md:h-[175px] rounded-lg overflow-hidden">
              <canvas
                ref={screenCanvasRef}
                width={900}
                height={220}
                className="w-full h-full object-cover rounded-lg"
              />

              {/* Realistic Glass Specular Surface Reflection */}
              <div
                className="absolute inset-0 pointer-events-none rounded-lg z-20"
                style={{
                  background:
                    'linear-gradient(115deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 28%, transparent 55%)',
                }}
              />

              {/* Inner Screen Shadow / Bezel Depth */}
              <div
                className="absolute inset-0 pointer-events-none rounded-lg z-20 shadow-[inset_0_0_20px_rgba(0,0,0,0.55)]"
              />
            </div>
          </div>

          {/* Bottom Hinge Bevel Line */}
          <div className="h-[3px] bg-gradient-to-r from-transparent via-white/30 to-transparent relative z-30" />
        </div>

        {/* ═══════════════ Reflective Perspective Stage / Floor ═══════════════ */}
        <div
          className="relative w-[96%] sm:w-[94%] md:w-[92%] -mt-1 rounded-2xl overflow-hidden pointer-events-none"
          style={{
            height: '130px',
            transform: 'rotateX(42deg)',
            transformOrigin: 'top center',
            background: 'linear-gradient(180deg, rgba(14,20,16,0.7) 0%, rgba(5,8,6,0.95) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.15)',
          }}
        >
          {/* Mirrored Live Screen Canvas Reflection */}
          <div
            className="absolute inset-x-0 top-0 h-full overflow-hidden opacity-60 blur-md"
            style={{
              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)',
            }}
          >
            <canvas
              ref={reflectionCanvasRef}
              width={900}
              height={220}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Top Rim Specular Catch */}
          <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

          {/* Ambient Perspective Floor Vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050806]/40 to-[#050806]" />
        </div>
      </motion.div>
    </div>
  );
};
