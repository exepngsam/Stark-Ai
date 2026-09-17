import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { TickerMarquee } from './components/TickerMarquee';
import { KineticHelixSection } from './components/KineticHelixSection';
import { HowItWorksFlow } from './components/HowItWorksFlow';
import { MessageAnalyzer } from './components/MessageAnalyzer';
import { ImageQrScanner } from './components/ImageQrScanner';
import { Simulator } from './components/Simulator';
import { SafetyGuidance } from './components/SafetyGuidance';
import { Footer } from './components/Footer';
import { MagneticReticle } from './components/MagneticReticle';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { fetchHealth } from './services/api';
import type { HealthResponse } from './types';

export function App() {
  useSmoothScroll();

  const [activeSection, setActiveSection] = useState('hero');
  const [health, setHealth] = useState<HealthResponse>({
    status: 'ok',
    app: 'STARK AI',
    version: '1.0.0',
    mode: 'Local Demo Mode',
    aws_connected: false,
    bedrock_model: null,
  });

  useEffect(() => {
    fetchHealth().then((h) => setHealth(h));
  }, []);

  // Unified intersection observer with highest ratio for zero jitter
  useEffect(() => {
    const sectionIds = ['hero', 'kinetic', 'workflow', 'analyze', 'scan', 'simulator', 'safety'];
    const elements = sectionIds.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        let maxRatio = 0;
        let bestId = '';
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            bestId = entry.target.id;
          }
        });
        if (bestId) {
          setActiveSection((prev) => (prev !== bestId ? bestId : prev));
        }
      },
      {
        threshold: [0.15, 0.4, 0.7],
        rootMargin: '-10% 0px -10% 0px',
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#050806] ambient-dappled-bg selection:bg-emerald-400 selection:text-neutral-950 text-white">
      {/* Interactive Magnetic Reticle Cursor */}
      <MagneticReticle />

      {/* Floating pill navigation */}
      <Navbar
        activeSection={activeSection}
        onNavigate={scrollToSection}
        statusMode={health.mode}
      />

      {/* Main scrollytelling sections matching Fxology video reference */}
      <main className="relative z-20 flex flex-col">
        <HeroSection
          onAnalyzeClick={() => scrollToSection('analyze')}
          onScannerClick={() => scrollToSection('scan')}
        />

        {/* Live Vector Telemetry Marquee */}
        <TickerMarquee />

        {/* Kinetic Repeating Typography & 3D Glass Helix Loop (Frame 33) */}
        <KineticHelixSection
          onAnalyzeClick={() => scrollToSection('analyze')}
          onScanClick={() => scrollToSection('scan')}
        />

        {/* 3-Step Workflow: Card Fan-Out, Neural Waveform, Certificate Seal (Frame 45/50) */}
        <HowItWorksFlow />

        {/* Interactive Threat Detection Engines */}
        <MessageAnalyzer />
        <ImageQrScanner />
        <Simulator />
        <SafetyGuidance />
      </main>

      {/* Minimal Footer */}
      <Footer
        statusMode={health.mode}
        awsConnected={health.aws_connected}
        bedrockModel={health.bedrock_model}
      />
    </div>
  );
}

export default App;
