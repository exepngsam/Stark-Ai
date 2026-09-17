import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  statusMode: string;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate, statusMode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(() => (activeSection === 'hero' ? 'analyze' : activeSection));
  const isClickNavigating = useRef(false);
  const clickTimeout = useRef<number | null>(null);

  const navLinks = [
    { id: 'analyze', label: 'Analyze' },
    { id: 'scan', label: 'Scan' },
    { id: 'simulator', label: 'Simulator' },
    { id: 'safety', label: 'Safety' },
  ];

  // Keep selected tab in sync with scroll position when not actively navigating by click
  useEffect(() => {
    if (!isClickNavigating.current) {
      if (activeSection && activeSection !== 'hero') {
        setSelectedTab(activeSection);
      } else if (activeSection === 'hero') {
        setSelectedTab('analyze');
      }
    }
  }, [activeSection]);

  const handleLinkClick = (id: string) => {
    setSelectedTab(id);
    isClickNavigating.current = true;
    if (clickTimeout.current) clearTimeout(clickTimeout.current);
    clickTimeout.current = window.setTimeout(() => {
      isClickNavigating.current = false;
    }, 700);

    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 px-4 md:px-8 py-5 flex items-center justify-between pointer-events-none">
      {/* Brand Mark (Left) */}
      <div className="pointer-events-auto flex items-center gap-3">
        <button
          onClick={() => handleLinkClick('hero')}
          className="flex items-center gap-2.5 group text-left focus:outline-none rounded-lg p-1"
        >
          <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 text-xs font-bold shadow-[0_0_12px_rgba(0,229,117,0.3)]">
            S
          </div>
          <span className="font-display font-semibold text-base tracking-tight text-white group-hover:text-emerald-400 transition-colors">
            stark<span className="text-emerald-400 font-bold">.ai</span>
          </span>
        </button>

        {/* Minimal Mode Indicator Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono-cad text-neutral-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#00e575]" />
          <span>{statusMode.includes('AWS') ? 'AWS Bedrock' : 'Local Heuristic Mode'}</span>
        </div>
      </div>

      {/* Floating Center iOS 27 Liquid Glass Navbar */}
      <nav
        className="pointer-events-auto hidden md:flex items-center gap-1.5 p-1.5 rounded-full ios27-liquid-glass relative overflow-visible shadow-2xl"
      >
        {/* Top Specular Arc Glint */}
        <div className="absolute top-0 left-6 right-6 h-[1.5px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none rounded-full" />
        
        {/* Soft Tint Ambient Sheen */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none" />

        {navLinks.map((link) => {
          const isActive = selectedTab === link.id;

          return (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className={`relative px-4 py-2 rounded-full text-[13px] tracking-tight smooth-type transition-colors duration-200 focus:outline-none select-none z-10 ${
                isActive
                  ? 'text-white font-medium'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              {/* Active Morphing Liquid Glass Pill */}
              {isActive && (
                <motion.div
                  layoutId="liquidActivePill"
                  transition={{
                    type: 'spring',
                    stiffness: 380,
                    damping: 28,
                    mass: 0.7,
                  }}
                  style={{ borderRadius: 9999 }}
                  className="absolute inset-0 rounded-full ios27-active-pill -z-10"
                />
              )}

              <span className="relative z-10 flex items-center justify-center gap-1.5">
                <span className="leading-none">{link.label}</span>
                <span
                  aria-hidden="true"
                  className={`w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#00e575] transition-all duration-300 ease-out ${
                    isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                  }`}
                />
              </span>
            </button>
          );
        })}
      </nav>

      {/* Action Button (Right) */}
      <div className="pointer-events-auto flex items-center gap-3">
        <button
          onClick={() => handleLinkClick('analyze')}
          className="group hidden sm:flex items-center gap-2.5 pl-4 pr-1.5 py-1.5 rounded-full ios27-liquid-glass text-white text-xs font-medium smooth-type hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus:outline-none relative overflow-visible select-none cursor-pointer"
        >
          {/* Top Specular Arc Glint */}
          <div className="absolute top-0 left-3 right-3 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none rounded-full" />
          <span>Analyze Now</span>
          <div className="w-6 h-6 rounded-full bg-white/15 border border-white/25 text-white flex items-center justify-center group-hover:bg-emerald-400 group-hover:text-neutral-950 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 shadow-sm">
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </button>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          className="md:hidden w-9 h-9 rounded-full bg-white/[0.08] border border-white/[0.1] backdrop-blur-md flex items-center justify-center text-white focus:outline-none cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto md:hidden absolute top-20 left-4 right-4 p-5 rounded-2xl glass-card-dark text-white shadow-2xl flex flex-col gap-3 animate-in fade-in slide-in-from-top-4 duration-200 border border-white/10">
          <div className="text-[11px] font-mono-cad text-neutral-400 border-b border-white/10 pb-2 flex items-center justify-between">
            <span>NAVIGATION</span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>{statusMode}</span>
            </div>
          </div>
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeSection === link.id ? 'bg-white/15 text-white' : 'text-neutral-300 hover:bg-white/10'
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => handleLinkClick('analyze')}
            className="w-full mt-2 py-2.5 rounded-xl ios27-liquid-glass text-white font-medium text-xs smooth-type flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
          >
            <span>Analyze Now</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </header>
  );
};
