import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Goals from './components/Goals';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Footer from './components/Footer';
import TerminalConsole from './components/TerminalConsole';
import Loader from './components/Loader';
import DoorbellIntro from './components/DoorbellIntro';
import { SceneStage } from './components/3d/SceneStage';
import { VisitorProvider } from './context/VisitorContext';
import { WORKSHOP_STATIONS, ROOM_CONFIG } from './config/workshopConfig';

function PortfolioApp() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  
  // Intro Sequence Stages: 'doorbell' -> 'loader' -> 'ready'
  const [introStage, setIntroStage] = useState<'doorbell' | 'loader' | 'ready'>('doorbell');

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
      window.scrollTo({ top: 0, behavior: 'instant' as any });
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('pushstate-changed', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('pushstate-changed', handleLocationChange);
    };
  }, []);

  const handleNavigateSection = (sectionId: string) => {
    const idx = WORKSHOP_STATIONS.findIndex(s => s.id === sectionId);
    if (idx !== -1) {
      const targetCameraZ = -WORKSHOP_STATIONS[idx].z;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        const targetScrollY = (targetCameraZ / ROOM_CONFIG.maxCameraZ) * maxScroll;
        window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      {introStage === 'doorbell' && (
        <DoorbellIntro onComplete={() => setIntroStage('loader')} />
      )}

      {introStage === 'loader' && (
        <Loader onFinished={() => setIntroStage('ready')} />
      )}

      <div className="font-sans min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-between selection:bg-sky-500/30 selection:text-sky-200">
        {currentPath === '/journal' ? (
          <div>
            <Header 
              onOpenTerminal={() => setIsTerminalOpen(true)} 
              onNavigateSection={handleNavigateSection}
            />
            <main className="pt-24">
              <Blog teaser={false} />
            </main>
            <Footer onNavigateSection={handleNavigateSection} />
          </div>
        ) : (
          <div>
            {/* Interactive Z-Axis 3D Workshop Stage */}
            <SceneStage onOpenTerminal={() => setIsTerminalOpen(true)} />

            {/* Accessible hidden semantic DOM tree for SEO crawlers and screen readers */}
            <main className="sr-only" aria-hidden="true">
              <Hero />
              <About />
              <Projects />
              <Blog teaser={true} />
              <Goals />
              <Contact />
            </main>
          </div>
        )}
        <TerminalConsole isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />
      </div>
    </>
  );
}

function App() {
  return (
    <VisitorProvider>
      <PortfolioApp />
    </VisitorProvider>
  );
}

export default App;