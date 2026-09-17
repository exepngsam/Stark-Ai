import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  RotateCcw,
  Check,
  Copy,
  Info
} from 'lucide-react';
import { analyzeTextMessage } from '../services/api';
import type { ThreatAnalysisResult } from '../types';

const PRESET_MESSAGES = [
  {
    label: 'Fake UPI Refund',
    category: 'UPI Scam',
    text: 'Congratulations! ₹4,999 cashback has been approved for your recent GPay transaction. Click http://gpay-rewards.site/claim and enter your UPI PIN to claim and credit into your bank account immediately.',
  },
  {
    label: 'Electricity Power Cut',
    category: 'Utility Phishing',
    text: 'Dear consumer your electricity power will be disconnected tonight at 9:30 PM from electricity office because your previous month bill was not updated. Please immediately contact our electricity officer at 9876543210.',
  },
  {
    label: 'Bank KYC APK Trojan',
    category: 'Malicious APK',
    text: 'Dear SBI customer, your YONO NetBanking account has been deactivated due to pending KYC verification. Download http://sbi-secure.top/kyc.apk to update PAN card and avoid permanent card blockage.',
  },
  {
    label: 'Telegram Task Job',
    category: 'Part-Time Scam',
    text: 'Earn ₹3,000 to ₹5,000 daily from home! Like YouTube videos and rate Google Maps hotels. We have already credited ₹150 for trial task. Deposit ₹1,000 registration fee to start VIP merchant tasks.',
  },
  {
    label: 'Guaranteed 100% Crypto',
    category: 'Investment Fraud',
    text: 'Exclusive VIP Investment: Our proprietary AI arbitrage algorithm guarantees 15% daily returns with 0% risk. Deposit ₹5,000 today to start automated trading. Join https://t.me/crypto_wealth_vip',
  },
];

export const MessageAnalyzer: React.FC = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ThreatAnalysisResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async () => {
    if (!inputMessage.trim()) return;
    setLoading(true);
    try {
      const res = await analyzeTextMessage(inputMessage);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPreset = (text: string) => {
    setInputMessage(text);
    setResult(null);
  };

  const handleCopyReport = () => {
    if (!result) return;
    const report = `STARK AI THREAT REPORT\nVerdict: ${result.verdict}\nRisk: ${result.risk_score}%\nCategory: ${result.scam_category}\nSummary: ${result.summary}\n${result.critical_warning ? '\n' + result.critical_warning : ''}`;
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="analyze"
      className="relative min-h-screen w-full px-6 md:px-16 lg:px-24 py-28 z-20 flex flex-col justify-center"
    >
      <div className="w-full max-w-7xl mx-auto">
        {/* Section Header with Reference CAD styling */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-white/[0.08] gap-4">
          <div>
            <div className="font-mono-cad text-xs text-neutral-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <span>[02]</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#00e575]" />
              <span className="text-neutral-300">MESSAGE THREAT ANALYZER</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight">
              Evaluate suspicious text in seconds.
            </h2>
          </div>
          <p className="text-sm text-neutral-400 max-w-md">
            Paste any SMS, WhatsApp notification, or Telegram prompt. STARK AI flags coercion tactics, fake payment requests, and defangs malicious links.
          </p>
        </div>

        {/* Floating Preset Cards (Fxology Dark Rhythm) */}
        <div className="mb-8">
          <div className="text-xs font-mono-cad text-neutral-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span>QUICK PRESETS</span>
            <span className="text-neutral-500">— Tap to inspect real scam vectors</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {PRESET_MESSAGES.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPreset(preset.text)}
                className="group p-3.5 rounded-2xl glass-card text-left transition-all duration-300 hover:border-emerald-400/50 hover:shadow-[0_0_20px_rgba(0,229,117,0.12)] focus:outline-none cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono-cad text-[10px] text-neutral-500">0{idx + 1}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] font-mono-cad text-emerald-400">
                    {preset.category}
                  </span>
                </div>
                <div className="font-medium text-xs text-neutral-200 line-clamp-1 group-hover:text-emerald-400 transition-colors">
                  {preset.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Input & Live Result Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Input Panel */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="p-6 rounded-3xl glass-card shadow-2xl relative border border-white/[0.08]">
              <label htmlFor="message-input" className="block text-xs font-mono-cad uppercase text-neutral-400 tracking-wider mb-2">
                Paste SMS, WhatsApp message, or Email
              </label>
              <textarea
                id="message-input"
                rows={7}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Example: Dear customer, your electricity bill is unpaid. Power will be cut tonight at 9:30 PM. Call officer..."
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl p-4 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 resize-none font-normal leading-relaxed"
              />

              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={() => {
                    setInputMessage('');
                    setResult(null);
                  }}
                  className="text-xs font-mono-cad text-neutral-500 hover:text-neutral-300 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>

                <button
                  onClick={handleAnalyze}
                  disabled={loading || !inputMessage.trim()}
                  className="btn-fxology-primary inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                      <span>Scanning...</span>
                    </>
                  ) : (
                    <>
                      <span>Inspect Threat</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Zero-logging assurance */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs text-neutral-400 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">Zero-Retention Policy:</strong> OTPs, PINs, card numbers, and messages are scrubbed instantly in memory and never stored or logged.
              </span>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="p-6 md:p-8 rounded-3xl glass-card shadow-2xl border border-white/[0.1] flex flex-col gap-6"
                >
                  {/* Verdict Header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
                    <div>
                      <div className="font-mono-cad text-[11px] text-neutral-400 uppercase tracking-wider mb-1">
                        ANALYSIS VERDICT
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold font-mono-cad ${
                            result.verdict.includes('DANGER')
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                              : result.verdict.includes('HIGH')
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          }`}
                        >
                          {result.verdict.includes('DANGER') || result.verdict.includes('HIGH') ? (
                            <ShieldAlert className="w-3.5 h-3.5" />
                          ) : (
                            <ShieldCheck className="w-3.5 h-3.5" />
                          )}
                          {result.verdict}
                        </span>
                        <span className="text-xs font-medium text-neutral-300">
                          {result.scam_category}
                        </span>
                      </div>
                    </div>

                    {/* Risk Meter Gauge */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-mono-cad text-[10px] text-neutral-400 uppercase">RISK LEVEL</div>
                        <div className="font-mono-cad text-lg font-bold text-white">
                          {result.risk_score}%
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-white/[0.05] flex items-center justify-center p-1 relative">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-white/10"
                            strokeWidth="3.5"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className={
                              result.risk_score > 70
                                ? 'text-rose-500'
                                : result.risk_score > 40
                                ? 'text-amber-400'
                                : 'text-emerald-400'
                            }
                            strokeDasharray={`${result.risk_score}, 100`}
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Critical UPI Warning if applicable */}
                  {result.critical_warning && (
                    <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                      <div>{result.critical_warning}</div>
                    </div>
                  )}

                  {/* Summary */}
                  <div>
                    <h4 className="text-xs font-mono-cad text-neutral-400 uppercase tracking-wider mb-2">
                      EXECUTIVE SUMMARY
                    </h4>
                    <p className="text-sm text-neutral-200 leading-relaxed bg-white/[0.02] p-3.5 rounded-xl border border-white/[0.06]">
                      {result.summary}
                    </p>
                  </div>

                  {/* Red Flags Breakdown */}
                  {result.red_flags.length > 0 && (
                    <div>
                      <h4 className="text-xs font-mono-cad text-neutral-400 uppercase tracking-wider mb-2">
                        DETECTED RED FLAGS ({result.red_flags.length})
                      </h4>
                      <div className="flex flex-col gap-2">
                        {result.red_flags.map((flag, i) => (
                          <div
                            key={i}
                            className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs flex flex-col gap-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-white flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                                {flag.indicator}
                              </span>
                              <span className="font-mono-cad text-[9px] px-2 py-0.5 rounded bg-white/[0.08] text-neutral-300">
                                {flag.severity}
                              </span>
                            </div>
                            <div className="text-neutral-400 font-mono-cad text-[11px] pl-3 border-l border-white/20">
                              "{flag.evidence}"
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Defanged URLs if any */}
                  {result.defanged_urls.length > 0 && (
                    <div>
                      <h4 className="text-xs font-mono-cad text-neutral-400 uppercase tracking-wider mb-2">
                        DEFANGED SUSPICIOUS LINKS
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.defanged_urls.map((u, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 rounded-lg bg-white/[0.04] font-mono-cad text-xs text-emerald-400 select-all border border-white/[0.08]"
                          >
                            {u}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommended Actions */}
                  <div>
                    <h4 className="text-xs font-mono-cad text-neutral-400 uppercase tracking-wider mb-2">
                      RECOMMENDED IMMEDIATE ACTIONS
                    </h4>
                    <ul className="flex flex-col gap-2">
                      {result.recommended_actions.map((act, i) => (
                        <li key={i} className="text-xs text-neutral-300 flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Footer Bar with Copy & Engine Indicator */}
                  <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-neutral-400 font-mono-cad">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      <span>{result.engine_used}</span>
                    </div>

                    <button
                      onClick={handleCopyReport}
                      className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy Report'}</span>
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full min-h-[380px] rounded-3xl border border-dashed border-white/[0.1] bg-white/[0.01] flex flex-col items-center justify-center p-8 text-center text-neutral-500">
                  <div className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-3 text-emerald-400">
                    <Info className="w-5 h-5" />
                  </div>
                  <div className="font-display font-medium text-white text-sm mb-1">
                    Ready for analysis
                  </div>
                  <p className="text-xs text-neutral-400 max-w-sm">
                    Select a preset scenario above or enter your own custom message to inspect psychological coercion and financial deception vectors.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
