import React, { useEffect, useState } from 'react';
import { Settings, Cpu, HardDrive } from 'lucide-react';

const LOAD_MESSAGES = [
  { threshold: 0, text: '[ INIT ] BOOTING_WORKSHOP_OS v1.4.2...' },
  { threshold: 12, text: '[ CORE ] INDEXING_PORTFOLIO_DOCKETS...' },
  { threshold: 28, text: '[ ASSETS ] MOUNTING_CAD_ASSEMBLY_Blueprints...' },
  { threshold: 42, text: '[ FIRMWARE ] INITIALIZING_ESP32_TELEMETRY_BUFFERS...' },
  { threshold: 58, text: '[ SHADER ] PRECOMPILING_PORTRAIT_FLUID_TRANSITION...' },
  { threshold: 72, text: '[ MESH ] ESTABLISHING_HANDSHAKE_WITH_MASCOT_OK02...' },
  { threshold: 88, text: '[ NETWORK ] FETCHING_ROADMAP_GIT_COMMIT_CONFIG...' },
  { threshold: 96, text: '[ CONFIG ] ALIGNING_INTERFACE_BLUEPRINT_GRIDS...' },
  { threshold: 100, text: '[ OK ] SYSTEM_ONLINE. LAUNCHING WORKSHOP CONSOLE.' }
];

interface LoaderProps {
  onFinished: () => void;
}

const Loader: React.FC<LoaderProps> = ({ onFinished }) => {
  const [progress, setProgress] = useState(0);
  const [activeMessage, setActiveMessage] = useState(LOAD_MESSAGES[0].text);
  const [fadeAway, setFadeAway] = useState(false);

  useEffect(() => {
    // Total duration around 2.4 seconds
    const duration = 2400; 
    const intervalTime = 30; 
    const steps = duration / intervalTime;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + increment, 100);
        
        // Find the active loading message based on progress threshold
        const matched = LOAD_MESSAGES.reduce((acc, curr) => {
          if (next >= curr.threshold) return curr.text;
          return acc;
        }, LOAD_MESSAGES[0].text);
        
        setActiveMessage(matched);

        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setFadeAway(true);
            setTimeout(() => {
              onFinished();
            }, 600); // matches the transition duration
          }, 500); // pause at 100% to let the user see the OK state
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onFinished]);

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#090d16] bg-blueprint-grid text-slate-100 transition-all duration-500 ease-in-out ${
        fadeAway ? 'opacity-0 scale-[0.98] pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* CSS style block for self-contained, high-performance keyframe animations */}
      <style>{`
        @keyframes spin-cw {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spin-ccw {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        .animate-gear-cw {
          animation: spin-cw 12s linear infinite;
          transform-origin: 50px 50px;
        }
        .animate-gear-ccw {
          animation: spin-ccw 8s linear infinite;
          transform-origin: 30px 30px;
        }
        .animate-blink-fast {
          animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>

      {/* Grid Overlay Accent */}
      <div className="absolute inset-0 bg-dot-grid opacity-30 pointer-events-none"></div>

      <div className="relative flex flex-col items-center max-w-sm w-full px-6 text-center space-y-8 z-10">
        
        {/* Meshing Workshop Gears Animation */}
        <div className="relative w-40 h-40 flex items-center justify-center">
          {/* Main Gear (Large, Sky Blue, Clockwise) */}
          <div className="absolute left-6 top-6 w-28 h-28">
            <svg viewBox="0 0 100 100" className="w-full h-full text-sky-400/90 filter drop-shadow-[0_0_8px_rgba(56,189,248,0.2)] animate-gear-cw">
              {/* Hub */}
              <circle cx="50" cy="50" r="14" fill="none" stroke="currentColor" strokeWidth="3.5" />
              <circle cx="50" cy="50" r="5" fill="currentColor" />
              {/* Rim */}
              <circle cx="50" cy="50" r="34" fill="none" stroke="currentColor" strokeWidth="6" />
              {/* Spokes */}
              <line x1="50" y1="16" x2="50" y2="84" stroke="currentColor" strokeWidth="4" />
              <line x1="16" y1="50" x2="84" y2="50" stroke="currentColor" strokeWidth="4" />
              <line x1="26" y1="26" x2="74" y2="74" stroke="currentColor" strokeWidth="3" />
              <line x1="26" y1="74" x2="74" y2="26" stroke="currentColor" strokeWidth="3" />
              {/* Gear Teeth */}
              <g fill="currentColor">
                <rect x="47" y="8" width="6" height="12" rx="1.5" />
                <rect x="47" y="80" width="6" height="12" rx="1.5" />
                <rect x="8" y="47" width="12" height="6" rx="1.5" />
                <rect x="80" y="47" width="12" height="6" rx="1.5" />
                <rect x="47" y="8" width="6" height="12" rx="1.5" transform="rotate(30 50 50)" />
                <rect x="47" y="8" width="6" height="12" rx="1.5" transform="rotate(60 50 50)" />
                <rect x="47" y="8" width="6" height="12" rx="1.5" transform="rotate(120 50 50)" />
                <rect x="47" y="8" width="6" height="12" rx="1.5" transform="rotate(150 50 50)" />
                <rect x="47" y="8" width="6" height="12" rx="1.5" transform="rotate(210 50 50)" />
                <rect x="47" y="8" width="6" height="12" rx="1.5" transform="rotate(240 50 50)" />
                <rect x="47" y="8" width="6" height="12" rx="1.5" transform="rotate(300 50 50)" />
                <rect x="47" y="8" width="6" height="12" rx="1.5" transform="rotate(330 50 50)" />
              </g>
            </svg>
          </div>

          {/* Secondary Gear (Small, Amber, Counter-Clockwise, Offset & Meshed) */}
          <div className="absolute right-3 bottom-3 w-16 h-16">
            <svg viewBox="0 0 60 60" className="w-full h-full text-amber-500/80 filter drop-shadow-[0_0_6px_rgba(245,158,11,0.15)] animate-gear-ccw">
              {/* Hub */}
              <circle cx="30" cy="30" r="8" fill="none" stroke="currentColor" strokeWidth="2.5" />
              <circle cx="30" cy="30" r="3" fill="currentColor" />
              {/* Rim */}
              <circle cx="30" cy="30" r="20" fill="none" stroke="currentColor" strokeWidth="4" />
              {/* Spokes */}
              <line x1="30" y1="10" x2="30" y2="50" stroke="currentColor" strokeWidth="2.5" />
              <line x1="10" y1="30" x2="50" y2="30" stroke="currentColor" strokeWidth="2.5" />
              {/* Gear Teeth */}
              <g fill="currentColor">
                <rect x="28" y="4" width="4" height="8" rx="1" />
                <rect x="28" y="48" width="4" height="8" rx="1" />
                <rect x="4" y="28" width="8" height="4" rx="1" />
                <rect x="48" y="28" width="8" height="4" rx="1" />
                <rect x="28" y="4" width="4" height="8" rx="1" transform="rotate(45 30 30)" />
                <rect x="28" y="4" width="4" height="8" rx="1" transform="rotate(135 30 30)" />
                <rect x="28" y="4" width="4" height="8" rx="1" transform="rotate(225 30 30)" />
                <rect x="28" y="4" width="4" height="8" rx="1" transform="rotate(315 30 30)" />
              </g>
            </svg>
          </div>
        </div>

        {/* Loading readout details */}
        <div className="w-full space-y-4 font-mono-tech">
          <div>
            <h2 className="text-white text-xs uppercase tracking-widest font-bold">// WORKSHOP_INITIALIZATION</h2>
            <div className="mt-2 text-sky-400/90 text-[10px] uppercase min-h-[16px] select-none">
              {activeMessage}
            </div>
          </div>

          {/* Progress Bar Container */}
          <div className="space-y-1.5">
            <div className="relative w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-sky-950/60 shadow-inner">
              {/* Active filled progress bar */}
              <div 
                className="h-full bg-gradient-to-r from-sky-500 to-amber-500 rounded-full transition-all duration-100 ease-out shadow-[0_0_10px_rgba(56,189,248,0.5)]"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center text-[9px] text-slate-500 select-none">
              <span>EST. TIME COMPILING</span>
              <span className="text-sky-500 font-bold">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Loader;
