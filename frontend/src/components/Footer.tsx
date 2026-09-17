import React from 'react';
import { Server, Cloud } from 'lucide-react';

interface FooterProps {
  statusMode: string;
  awsConnected: boolean;
  bedrockModel: string | null;
}

export const Footer: React.FC<FooterProps> = ({ statusMode, awsConnected, bedrockModel }) => {
  return (
    <footer className="relative w-full px-6 md:px-16 lg:px-24 py-16 z-20 border-t border-white/[0.08] bg-[#050806]">
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        {/* Left: Product & Tagline */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 text-[11px] font-bold shadow-[0_0_10px_rgba(0,229,117,0.3)]">
              S
            </div>
            <span className="font-display font-semibold text-sm text-white">
              STARK AI
            </span>
            <span className="text-xs text-neutral-400 font-mono-cad">— Smart Threat Analysis & Risk Knowledge</span>
          </div>
          <p className="text-xs text-neutral-400">
            Detect the threat. Protect your trust.
          </p>
        </div>

        {/* Center: Legal / Regulatory Disclaimer */}
        <div className="text-xs text-neutral-400 max-w-md font-sans leading-relaxed">
          STARK AI provides AI-assisted awareness guidance. Verify independently before taking action.
        </div>

        {/* Right: Engine Status Pill */}
        <div className="flex items-center gap-3 font-mono-cad text-xs">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-neutral-300 shadow-sm">
            {awsConnected ? (
              <>
                <Cloud className="w-3.5 h-3.5 text-indigo-400" />
                <span>AWS Bedrock Connected {bedrockModel ? `(${bedrockModel})` : ''}</span>
              </>
            ) : (
              <>
                <Server className="w-3.5 h-3.5 text-emerald-400" />
                <span>{statusMode} (Active)</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto mt-8 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono-cad text-neutral-400">
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <span>© 2026 STARK AI PROTOCOL. ALL RIGHTS RESERVED.</span>
          <span className="hidden sm:inline text-white/20">•</span>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] shadow-[0_0_15px_rgba(0,245,255,0.08)]">
            <span className="text-neutral-400">Developed with</span>
            <span className="inline-block text-red-500 animate-pulse text-xs">❤️</span>
            <span className="text-neutral-400">by</span>
            <span className="font-bold bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent tracking-wide">
              Team Apex
            </span>
            <span className="text-neutral-400">• Defending Digital India 🇮🇳</span>
          </div>
        </div>
        <div className="text-emerald-400/90 font-mono-cad">ZERO-STORAGE VERIFIED // 100% PRIVATE</div>
      </div>
    </footer>
  );
};
