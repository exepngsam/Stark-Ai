import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const MagneticReticle: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Buttery-smooth spring lag for physical tracking inertia
  const springX = useSpring(mouseX, { stiffness: 450, damping: 28 });
  const springY = useSpring(mouseY, { stiffness: 450, damping: 28 });

  useEffect(() => {
    // Only run on non-touch pointer devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Track when user is hovering interactive elements
    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target?.closest('button') ||
        target?.closest('a') ||
        target?.closest('textarea') ||
        target?.closest('input') ||
        target?.closest('[role="button"]') ||
        target?.closest('.cursor-pointer')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleOver, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer Magnetic Circular Reticle Ring */}
      <motion.div
        style={{
          left: springX,
          top: springY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className="custom-reticle flex items-center justify-center border border-cyan-400/80 shadow-[0_0_15px_rgba(6,182,212,0.45)]"
        animate={{
          width: isHovering ? 48 : 32,
          height: isHovering ? 48 : 32,
          borderColor: isHovering ? '#00e575' : '#06b6d4',
          boxShadow: isHovering
            ? '0 0 22px rgba(0,229,117,0.6)'
            : '0 0 14px rgba(6,182,212,0.4)',
        }}
      >
        {/* Subtle Crosshair Ticks */}
        <div className="absolute top-0 w-[1px] h-1.5 bg-cyan-300" />
        <div className="absolute bottom-0 w-[1px] h-1.5 bg-cyan-300" />
        <div className="absolute left-0 h-[1px] w-1.5 bg-cyan-300" />
        <div className="absolute right-0 h-[1px] w-1.5 bg-cyan-300" />
      </motion.div>

      {/* Central Precision Target Pip */}
      <motion.div
        style={{
          left: mouseX,
          top: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className="fixed z-[10000] pointer-events-none rounded-full bg-cyan-300 shadow-[0_0_6px_#06b6d4]"
        animate={{
          width: isHovering ? 6 : 4,
          height: isHovering ? 6 : 4,
          backgroundColor: isHovering ? '#00e575' : '#67e8f9',
        }}
      />
    </>
  );
};
