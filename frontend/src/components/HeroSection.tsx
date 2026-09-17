import React from 'react';
import { ArrowRight, Sparkles, Shield, Activity, Lock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { StellarMotion3D } from './StellarMotion3D';

interface HeroSectionProps {
  onAnalyzeClick: () => void;
  onScannerClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onAnalyzeClick, onScannerClick }) => {
  const handleScannerClick = () => {
    if (onScannerClick) {
      onScannerClick();
    } else {
      const el = document.getElementById('scan');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-[100vh] w-full flex flex-col justify-between pt-28 pb-6 px-4 sm:px-8 md:px-12 overflow-hidden select-none z-20"
    >
      {/* Overhead Volumetric Cyan/Emerald Ambient Light Beam */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[520px] volumetric-beam pointer-events-none -z-10" />

      {/* Top Telemetry & Cinematic Header */}
      <div className="relative z-30 w-full max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Spline-Style Spaced Subtitle Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.12] text-[11px] sm:text-xs font-mono-cad tracking-[0.3em] uppercase text-cyan-300/90 mb-4 backdrop-blur-md shadow-sm hover:border-cyan-400/50 transition-colors"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#06b6d4]" />
          <span>STARK AI // PROTOCOL 01</span>
        </motion.div>

        {/* iOS 27 Liquid Glass Master Headline */}
        <div className="relative mb-4">
          {/* Ethereal Optical Glass Refraction Aura & Ambient Rim Lighting */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[125%] h-[135%] bg-radial from-emerald-400/16 via-cyan-400/8 to-transparent blur-3xl pointer-events-none -z-10" />
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[650px] h-[100px] bg-cyan-400/10 blur-2xl rounded-full pointer-events-none -z-10" />

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="ios27-liquid-glass-headline text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold uppercase leading-[0.96] select-none"
          >
            <span className="text-liquid-glass-silver">
              CYBER
            </span>{' '}
            <span className="text-liquid-glass-emerald">
              SENTINEL
            </span>
          </motion.h1>
        </div>

        {/* Cinematic Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-sm sm:text-base md:text-lg smooth-type font-normal tracking-wide text-cyan-100/80 mb-6 max-w-2xl"
        >
          To the Perimeter and Beyond — Instant Autonomous Threat Defense
        </motion.p>

        {/* Dual Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="flex flex-wrap items-center justify-center gap-3.5 mb-2 z-40"
        >
          {/* Primary Button: White Capsule with Emerald Arrow Button */}
          <button
            onClick={onAnalyzeClick}
            className="btn-fxology-primary group inline-flex items-center gap-3 pl-6 pr-2 py-2 text-sm font-semibold cursor-pointer shadow-[0_0_25px_rgba(6,182,212,0.3)]"
          >
            <span>Analyze Suspicious Message</span>
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-neutral-950 flex items-center justify-center group-hover:bg-cyan-400 group-hover:translate-x-0.5 transition-all shadow-[0_0_12px_rgba(0,229,117,0.5)]">
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>

          {/* Secondary Button: Frosted Glass Capsule */}
          <button
            onClick={handleScannerClick}
            className="btn-fxology-secondary inline-flex items-center gap-2 px-6 py-3 text-sm font-medium cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Launch Optical Scanner</span>
          </button>
        </motion.div>
      </div>

      {/* Interactive 3D Cosmic Celestial Motion UI (Pinterest Pin 1093108140813241341 StellarX Parity) */}
      <div className="relative z-20 w-full max-w-5xl mx-auto flex items-center justify-center pointer-events-auto">
        <StellarMotion3D className="mx-auto" />
      </div>

      {/* Glowing Curved Planetary Horizon & Lower Telemetry Atmosphere */}
      <div className="relative z-30 w-full max-w-6xl mx-auto mt-auto pt-4">
        {/* Curved Planetary Horizon Glow Container */}
        <div className="curved-horizon-container">
          <div className="curved-horizon-rim" />
        </div>

        {/* Lower CAD Telemetry Grid floating on horizon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="relative z-40 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-2"
        >
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-black/40 border border-white/[0.08] backdrop-blur-md">
            <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
            <div className="flex flex-col">
              <span className="font-display text-base sm:text-lg font-bold text-white tracking-tight leading-tight">
                ₹10Cr+
              </span>
              <span className="text-[11px] font-mono-cad text-neutral-400 uppercase tracking-wider">
                Intercepted Losses
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-black/40 border border-white/[0.08] backdrop-blur-md">
            <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="flex flex-col">
              <span className="font-display text-base sm:text-lg font-bold text-white tracking-tight leading-tight">
                250K+
              </span>
              <span className="text-[11px] font-mono-cad text-neutral-400 uppercase tracking-wider">
                Threats Defanged
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-black/40 border border-white/[0.08] backdrop-blur-md">
            <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
            <div className="flex flex-col">
              <span className="font-display text-base sm:text-lg font-bold text-emerald-400 tracking-tight leading-tight">
                99.9%
              </span>
              <span className="text-[11px] font-mono-cad text-neutral-400 uppercase tracking-wider">
                Precision Rate
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-black/40 border border-white/[0.08] backdrop-blur-md">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="flex flex-col">
              <span className="font-display text-base sm:text-lg font-bold text-white tracking-tight leading-tight">
                0ms Latency
              </span>
              <span className="text-[11px] font-mono-cad text-neutral-400 uppercase tracking-wider">
                Autonomous Local
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

