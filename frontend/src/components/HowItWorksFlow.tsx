import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Shield, Scan, FileCheck } from 'lucide-react';
import { PrismaticDisplay3D } from './PrismaticDisplay3D';

interface HowItWorksFlowProps {
  onAnalyzeClick?: () => void;
  onScanClick?: () => void;
}

export const HowItWorksFlow: React.FC<HowItWorksFlowProps> = ({ onAnalyzeClick, onScanClick }) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="workflow"
      className="relative min-h-screen w-full px-6 md:px-12 lg:px-20 py-28 z-20 flex flex-col justify-center items-center overflow-hidden bg-[#050806]"
    >
      {/* Subtle ambient radial glow behind the light bar */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full opacity-30 blur-3xl"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(6,182,212,0.15), rgba(168,85,247,0.08), transparent 70%)',
          }}
        />
      </div>

      {/* Top: Spaced Category Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6 }}
        className="font-mono-cad text-[11px] sm:text-xs tracking-[0.35em] uppercase text-neutral-500 mb-4"
      >
        AUTONOMOUS THREAT DEFENSE IN SECONDS
      </motion.div>

      {/* Main Headline (matching Pinterest Imagica / uploaded screenshot) */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, delay: 0.05 }}
        className="font-ios27 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.08] text-center max-w-4xl mb-4 relative"
      >
        {/* Floating Twinkling Celestial Star Dust */}
        <span className="absolute -left-4 sm:-left-10 top-1/2 w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_14px_#38bdf8] animate-mote pointer-events-none" />
        <span className="absolute right-4 sm:right-10 -top-2 w-1.5 h-1.5 rounded-full bg-emerald-300 shadow-[0_0_10px_#34d399] animate-mote pointer-events-none [animation-delay:1.5s]" />

        <span>Defend at the </span>
        <span className="animate-text-flow drop-shadow-[0_0_30px_rgba(6,182,212,0.65)] font-extrabold">
          Speed
        </span>{' '}
        <span>of</span>
        <br />
        <span className="animate-text-flow drop-shadow-[0_0_30px_rgba(16,185,129,0.65)] font-extrabold [animation-delay:0.8s]">
          Thought
        </span>
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="smooth-type text-sm sm:text-base text-neutral-400 text-center max-w-lg mb-8"
      >
        We execute the full threat scan in real-time — zero latency, zero storage.
      </motion.p>

      {/* CTA Button capsule */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, delay: 0.15 }}
        className="mb-10 sm:mb-12 z-30"
      >
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => (onAnalyzeClick ? onAnalyzeClick() : scrollTo('analyze'))}
          className="group relative inline-flex items-center gap-2.5 px-7 py-2.5 rounded-full bg-[#111813]/90 border border-white/[0.16] text-sm font-medium text-neutral-200 hover:text-white backdrop-blur-xl hover:bg-white/[0.12] hover:border-emerald-400/50 hover:shadow-[0_0_30px_rgba(0,229,117,0.3)] transition-all cursor-pointer overflow-hidden"
        >
          {/* Subtle light sweep reflection across button */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
          <span>Get started — it&apos;s free</span>
          <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1.5 transition-transform" />
        </motion.button>
      </motion.div>

      {/* ═══════════════ Floating Prismatic 3D Display Device ═══════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-3xl"
      >
        <PrismaticDisplay3D />
      </motion.div>

      {/* Watch How It Works link */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, delay: 0.35 }}
        whileHover={{ scale: 1.02 }}
        onClick={() => (onScanClick ? onScanClick() : scrollTo('scan'))}
        className="mt-6 sm:mt-8 inline-flex items-center gap-2 text-xs sm:text-sm text-neutral-400 hover:text-emerald-300 transition-colors cursor-pointer group"
      >
        <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20 group-hover:scale-125 group-hover:fill-emerald-400 transition-all" />
        <span className="font-mono-cad tracking-wider">Watch How It Works</span>
      </motion.button>

      {/* Bottom 3-Column Feature Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, delay: 0.5 }}
        className="w-full max-w-4xl mt-20 pt-10 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-3 gap-6 text-center"
      >
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          className="flex flex-col items-center gap-2.5 p-5 rounded-2xl glass-card border border-white/[0.06] hover:border-cyan-400/40 transition-all duration-300 group cursor-default"
        >
          <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-1 group-hover:scale-110 group-hover:border-cyan-400/50 transition-all">
            <Shield className="w-5 h-5 text-cyan-400 group-hover:drop-shadow-[0_0_10px_#06b6d4]" />
          </div>
          <span className="font-display text-sm font-semibold text-white">Instant Threat Scan</span>
          <span className="text-xs text-neutral-400 leading-relaxed">
            Paste any SMS, URL, or QR code. Our dual heuristic engine decodes the full attack vector in real-time.
          </span>
        </motion.div>

        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          className="flex flex-col items-center gap-2.5 p-5 rounded-2xl glass-card border border-white/[0.06] hover:border-emerald-400/40 transition-all duration-300 group cursor-default"
        >
          <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-1 group-hover:scale-110 group-hover:border-emerald-400/50 transition-all">
            <Scan className="w-5 h-5 text-emerald-400 group-hover:drop-shadow-[0_0_10px_#00e575]" />
          </div>
          <span className="font-display text-sm font-semibold text-white">Deep Neural Analysis</span>
          <span className="text-xs text-neutral-400 leading-relaxed">
            Multi-vector classification with financial coercion detection, malware fingerprinting, and phishing DNA.
          </span>
        </motion.div>

        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          className="flex flex-col items-center gap-2.5 p-5 rounded-2xl glass-card border border-white/[0.06] hover:border-cyan-400/40 transition-all duration-300 group cursor-default"
        >
          <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-1 group-hover:scale-110 group-hover:border-cyan-400/50 transition-all">
            <FileCheck className="w-5 h-5 text-cyan-400 group-hover:drop-shadow-[0_0_10px_#06b6d4]" />
          </div>
          <span className="font-display text-sm font-semibold text-white">Verified Certificate</span>
          <span className="text-xs text-neutral-400 leading-relaxed">
            Get a digitally signed neutralization proof with SEC-HASH and direct 1930 helpline integration.
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
};
