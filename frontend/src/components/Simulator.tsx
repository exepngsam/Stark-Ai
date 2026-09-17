import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Award,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { fetchSimulatorScenarios, verifySimulatorOption } from '../services/api';
import type { SimulatorScenario, SimulatorVerifyResponse } from '../types';
import { AuroraRibbon } from './AuroraRibbon';

export const Simulator: React.FC = () => {
  const [scenarios, setScenarios] = useState<SimulatorScenario[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [verification, setVerification] = useState<SimulatorVerifyResponse | null>(null);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSimulatorScenarios().then((data) => {
      setScenarios(data);
    });
  }, []);

  const currentScenario = scenarios[currentIndex];

  const handleSelectOption = async (optionId: string) => {
    if (verification || loading) return;
    setSelectedOption(optionId);
    setLoading(true);

    try {
      const res = await verifySimulatorOption(currentScenario.id, optionId);
      setVerification(res);
      if (res.is_safe) {
        setScore((prev) => prev + 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < scenarios.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setVerification(null);
    } else {
      setIsCompleted(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setVerification(null);
    setScore(0);
    setIsCompleted(false);
  };

  if (!currentScenario && !isCompleted) {
    return (
      <div className="min-h-[400px] flex items-center justify-center font-mono-cad text-xs text-neutral-500">
        INITIALIZING THREAT SIMULATOR...
      </div>
    );
  }

  return (
    <section
      id="simulator"
      className="relative min-h-screen w-full px-6 md:px-16 lg:px-24 py-28 z-20 flex flex-col justify-center overflow-hidden"
    >
      {/* Background Animated Flowing Aurora Ribbon (from Fxology How Does It Work section) */}
      <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center opacity-70">
        <AuroraRibbon className="h-[500px]" />
      </div>

      <div className="w-full max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-white/[0.08] gap-4">
          <div>
            <div className="font-mono-cad text-xs text-neutral-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <span>[04]</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#00e575]" />
              <span className="text-neutral-300">AWARENESS SIMULATOR</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight">
              Test your threat reflexes.
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="font-mono-cad text-[10px] text-neutral-400 uppercase">AWARENESS SCORE</div>
              <div className="font-mono-cad text-base font-bold text-white">
                {score} / {scenarios.length}
              </div>
            </div>
            {/* Step progress pills */}
            <div className="flex items-center gap-1.5">
              {scenarios.map((_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    i === currentIndex && !isCompleted
                      ? 'bg-emerald-400 scale-125 shadow-[0_0_8px_#00e575]'
                      : i < currentIndex || isCompleted
                      ? 'bg-emerald-500/80'
                      : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Completion Screen or Interactive Step */}
        <AnimatePresence mode="wait">
          {isCompleted ? (
            <motion.div
              key="completed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-8 md:p-12 rounded-3xl glass-card text-center max-w-2xl mx-auto shadow-2xl flex flex-col items-center border border-white/[0.1]"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(0,229,117,0.3)]">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">
                Simulation Completed
              </h3>
              <p className="text-sm text-neutral-300 mb-6 max-w-md">
                You scored <strong className="text-emerald-400">{score} out of {scenarios.length}</strong> on real-world Indian cyber scam vectors.
                {score === 5
                  ? ' Outstanding vigilance! You demonstrated complete resistance to social engineering attacks.'
                  : ' Good effort! Review the core rules: UPI PIN is strictly for debits, and never install APKs sent via SMS.'}
              </p>

              <button
                onClick={handleRestart}
                className="btn-fxology-primary inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Simulation</span>
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={currentScenario.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Left Column: Situation Prompt */}
              <div className="lg:col-span-6 flex flex-col gap-4">
                <div className="p-6 md:p-8 rounded-3xl glass-card shadow-2xl relative border border-white/[0.1]">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono-cad text-xs px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-emerald-400">
                      CASE 0{currentScenario.id} // {currentScenario.category}
                    </span>
                    <span className="font-mono-cad text-xs text-neutral-400">
                      {currentIndex + 1} of {scenarios.length}
                    </span>
                  </div>

                  <h3 className="font-display text-xl sm:text-2xl font-semibold text-white mb-3">
                    {currentScenario.title}
                  </h3>

                  <div className="font-mono-cad text-[11px] text-neutral-400 mb-4 pb-2 border-b border-white/[0.06] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    <span>{currentScenario.sender}</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] font-sans text-sm text-neutral-200 leading-relaxed italic mb-6">
                    "{currentScenario.situation}"
                  </div>

                  <div className="text-xs font-mono-cad text-neutral-400 uppercase tracking-wider mb-3">
                    HOW WOULD YOU RESPOND?
                  </div>

                  {/* Decision Options */}
                  <div className="flex flex-col gap-2.5">
                    {currentScenario.options.map((opt) => {
                      const isSelected = selectedOption === opt.id;
                      return (
                        <motion.button
                          key={opt.id}
                          whileHover={!verification ? { x: 4, scale: 1.01 } : undefined}
                          whileTap={!verification ? { scale: 0.99 } : undefined}
                          onClick={() => handleSelectOption(opt.id)}
                          disabled={!!verification}
                          className={`p-4 rounded-2xl text-left text-xs sm:text-sm font-medium transition-all duration-200 border flex items-start gap-3 border-beam-glow ${
                            isSelected
                              ? 'bg-emerald-500/20 text-white border-emerald-400 shadow-[0_0_20px_rgba(0,229,117,0.25)]'
                              : 'bg-white/[0.02] hover:bg-white/[0.06] text-neutral-300 border-white/[0.08] hover:border-emerald-400/40'
                          } ${verification ? 'cursor-default' : 'cursor-pointer'}`}
                        >
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs font-mono-cad transition-all ${
                              isSelected
                                ? 'bg-emerald-400 text-neutral-950 font-bold scale-110 shadow-[0_0_8px_#00e575]'
                                : 'bg-white/10 text-neutral-400'
                            }`}
                          >
                            {opt.id.slice(-1).toUpperCase()}
                          </span>
                          <span className="leading-snug">{opt.text}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Educational Breakdown & Feedback */}
              <div className="lg:col-span-6">
                <AnimatePresence mode="wait">
                  {verification ? (
                    <motion.div
                      key="verification"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`p-6 md:p-8 rounded-3xl glass-card shadow-2xl border flex flex-col gap-5 ${
                        verification.is_safe
                          ? 'border-emerald-500/40 bg-emerald-950/20'
                          : 'border-rose-500/40 bg-rose-950/20'
                      }`}
                    >
                      {/* Verdict Banner */}
                      <div className="flex items-center gap-3">
                        {verification.is_safe ? (
                          <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                        ) : (
                          <XCircle className="w-7 h-7 text-rose-400" />
                        )}
                        <div>
                          <div className="font-mono-cad text-[10px] text-neutral-400 uppercase">
                            SIMULATOR VERDICT
                          </div>
                          <div
                            className={`font-display text-lg font-bold ${
                              verification.is_safe ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {verification.verdict}
                          </div>
                        </div>
                      </div>

                      {/* Technical Explanation */}
                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                        <div className="text-xs font-mono-cad text-neutral-400 uppercase tracking-wider mb-1.5">
                          TACTICAL ANALYSIS
                        </div>
                        <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
                          {verification.explanation}
                        </p>
                      </div>

                      {/* Golden Safety Principle */}
                      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                        <div className="text-xs font-mono-cad text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5 font-bold">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>CORE SAFETY PRINCIPLE</span>
                        </div>
                        <p className="text-xs sm:text-sm text-amber-200 font-medium leading-relaxed">
                          {verification.safety_principle}
                        </p>
                      </div>

                      {/* Scammer Psychology Breakdown */}
                      <div className="text-xs text-neutral-400">
                        <span className="font-semibold text-neutral-200">Deception Mechanics: </span>
                        {verification.scam_breakdown}
                      </div>

                      {/* Continue CTA */}
                      <button
                        onClick={handleNext}
                        className="btn-fxology-primary mt-2 inline-flex items-center justify-center gap-2 py-3 text-xs font-semibold cursor-pointer"
                      >
                        <span>
                          {currentIndex < scenarios.length - 1 ? 'Next Threat Scenario' : 'View Final Score'}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ) : (
                    <div className="relative h-full min-h-[360px] rounded-3xl border border-dashed border-white/[0.12] bg-white/[0.015] flex flex-col items-center justify-center p-8 text-center text-neutral-500 overflow-hidden group">
                      {/* Background Cyber Radar Rings & Sweeping Beam */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
                        <div className="w-64 h-64 rounded-full border border-emerald-400/30 animate-radar" />
                        <div className="w-44 h-44 rounded-full border border-dashed border-cyan-400/30 animate-radar [animation-direction:reverse] [animation-duration:9s] absolute" />
                        <div className="w-24 h-24 rounded-full border border-white/10 absolute" />
                        <div className="w-1 h-32 bg-gradient-to-t from-emerald-400/40 to-transparent absolute animate-radar origin-bottom" />
                      </div>

                      {/* Central Shield Sensor Node */}
                      <div className="relative z-10 w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.1] flex items-center justify-center mb-4 text-emerald-400 shadow-[0_0_25px_rgba(0,229,117,0.2)] group-hover:scale-105 group-hover:border-emerald-400/50 transition-all duration-300">
                        <span className="absolute inset-0 rounded-2xl border border-emerald-400/30 animate-ping pointer-events-none opacity-40" />
                        <ShieldCheck className="w-7 h-7" />
                      </div>

                      <div className="relative z-10 font-display font-medium text-white text-sm mb-1.5 flex items-center gap-2">
                        <span>Threat Reflex Sandbox</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#06b6d4]" />
                      </div>

                      <p className="relative z-10 text-xs text-neutral-400 max-w-sm leading-relaxed">
                        Experience real scam pressure in a zero-risk sandbox. Select an action on the left to test your threat reflexes.
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
