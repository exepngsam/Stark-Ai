import React from 'react';

const TICKER_ITEMS = [
  { label: 'UPI REFUND FRAUD', status: 'DEFANGED', delta: '0ms', type: 'safe' },
  { label: 'ELECTRICITY CUTOFF SMS', status: 'BLOCKED', delta: '100% BLOCKED', type: 'danger' },
  { label: 'BANK KYC TROJAN APK', status: 'NEUTRALIZED', delta: 'CRC32 ISOLATED', type: 'warn' },
  { label: 'TELEGRAM TASK SCAMS', status: 'FLAGGED', delta: 'DECEPTION DETECTED', type: 'danger' },
  { label: '1930 HELPLINE', status: 'ONLINE', delta: 'INDIA DIRECT', type: 'safe' },
  { label: 'ZERO-STORAGE AUDIT', status: '100% PRIVATE', delta: 'RAM-ONLY', type: 'safe' },
  { label: 'BEDROCK NEURAL MODEL', status: 'CONNECTED', delta: 'ACTIVE', type: 'safe' },
  { label: 'OPENCV QR PARSER', status: 'RUNNING', delta: 'LOCAL ENGINE', type: 'safe' },
];

export const TickerMarquee: React.FC = () => {
  return (
    <div
      className="relative w-full border-y border-white/[0.06] bg-[#070b08]/90 backdrop-blur-md overflow-hidden py-2.5 z-30 select-none"
      aria-label="Live threat telemetry ticker"
    >
      {/* Edge gradient masks for seamless fade */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#050806] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#050806] to-transparent z-10 pointer-events-none" />

      {/* Marquee Track */}
      <div className="animate-marquee flex items-center gap-8">
        {/* Render twice for seamless infinite loop */}
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2.5 font-mono-cad text-[11px] whitespace-nowrap text-neutral-300 hover:text-white transition-colors cursor-default"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                item.type === 'safe'
                  ? 'bg-emerald-400 shadow-[0_0_6px_#00e575]'
                  : item.type === 'warn'
                  ? 'bg-amber-400 shadow-[0_0_6px_#f59e0b]'
                  : 'bg-rose-400 shadow-[0_0_6px_#f43f5e]'
              }`}
            />
            <span className="font-semibold text-neutral-200">{item.label}</span>
            <span className="px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-[10px] text-emerald-400">
              {item.status}
            </span>
            <span className="text-[10px] text-neutral-500 font-light">{item.delta}</span>
            <span className="text-neutral-700 ml-4">/</span>
          </div>
        ))}
      </div>
    </div>
  );
};
