import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Lock } from 'lucide-react';
import { GlassHelixLoop } from './GlassHelixLoop';

interface KineticHelixSectionProps {
  onAnalyzeClick: () => void;
  onScanClick: () => void;
}

export const KineticHelixSection: React.FC<KineticHelixSectionProps> = ({
  onAnalyzeClick,
  onScanClick,
}) => {
  return (
    <section
      id="kinetic"
      className="relative min-h-screen w-full px-6 md:px-12 lg:px-20 py-24 z-20 flex items-center overflow-hidden select-none bg-[#050806]"
    >
      {/* Background Volumetric Green Glow */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Mission Statement & Dual Actions */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-5 flex flex-col items-start gap-6 z-20"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono-cad text-neutral-300 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#00e575]" />
            <span>COLLECTIVE RESILIENCE // 24/7 ACTIVE</span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold text-white tracking-tight leading-[1.08]">
            Stop losing your hard-earned money to fraud.
          </h2>

          <p className="text-base sm:text-lg text-neutral-400 font-normal leading-relaxed max-w-lg">
            Join thousands protected against deceptive UPI cashback intents, electricity cut-off deadlines, and fake banking trojans. Verify before you tap.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            {/* Primary Action Button */}
            <button
              onClick={onAnalyzeClick}
              className="btn-fxology-primary group inline-flex items-center gap-3 pl-6 pr-2 py-2 text-sm font-semibold cursor-pointer"
            >
              <span>Scan Suspicious Link</span>
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-neutral-950 flex items-center justify-center group-hover:bg-emerald-400 group-hover:translate-x-0.5 transition-all shadow-[0_0_12px_rgba(0,229,117,0.5)]">
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>

            {/* Secondary Action Button */}
            <button
              onClick={onScanClick}
              className="btn-fxology-secondary inline-flex items-center gap-2 px-6 py-3 text-sm font-medium cursor-pointer"
            >
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Zero-Storage Verify</span>
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono-cad text-neutral-500 pt-4">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Privacy Protected</span>
            </div>
            <span>•</span>
            <span>Zero-Credential Safe</span>
          </div>
        </motion.div>

        {/* Right Column: Kinetic Repeating Typography + 3D Glass Helix Loop (Frame 33 Parity) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="lg:col-span-7 relative flex items-center justify-center min-h-[460px] md:min-h-[560px]"
        >
          {/* Ambient Optic Aura behind Helix Loop and Typography */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[460px] bg-radial from-emerald-400/12 via-teal-500/6 to-transparent blur-[90px] rounded-full pointer-events-none -z-10" />

          {/* Repeating Kinetic Typography Backdrop matching Reference Image */}
          <div className="absolute inset-0 flex flex-col justify-center items-center select-none pointer-events-none overflow-hidden -z-10 leading-[0.88]">
            <div className="text-stroke-glass font-display font-extrabold text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tighter">
              FRAUD
            </div>
            <div className="text-glow-glass-white font-display font-extrabold text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tighter">
              CONQUER
            </div>
            <div className="text-gradient-glass-emerald font-display font-extrabold text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tighter">
              FRAUD
            </div>
            <div className="text-stroke-glass font-display font-extrabold text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tighter">
              CONQUER
            </div>
            <div className="text-stroke-glass font-display font-extrabold text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tighter">
              FRAUD
            </div>
            <div className="text-glow-glass-white font-display font-extrabold text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tighter">
              CONQUER
            </div>
          </div>

          {/* Interactive 3D Figure-8 Glass Loop Overlaid */}
          <div className="relative z-10 w-full flex items-center justify-center">
            <GlassHelixLoop />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
