import React from 'react';
import { WORKSHOP_SECTIONS } from '../../config/workshopConfig';
import { Sparkles, Compass, ChevronDown } from 'lucide-react';

interface HUDProps {
  activeSectionIndex: number;
  progress: number;
  scrollToSection: (index: number) => void;
  curZ: number;
  onOpenTerminal?: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  activeSectionIndex,
  progress,
  scrollToSection,
  curZ,
  onOpenTerminal,
}) => {
  const activeSection = WORKSHOP_SECTIONS[activeSectionIndex] || WORKSHOP_SECTIONS[0];

  return (
    <div className="fixed inset-0 pointer-events-none z-40 select-none font-mono-tech overflow-hidden">
      {/* Top Progress Bar */}
      <div className="absolute top-0 inset-x-0 h-1 bg-slate-900 z-50">
        <div
          className="h-full bg-gradient-to-r from-sky-500 via-cyan-400 to-amber-400 transition-all duration-150 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
        />
      </div>

      {/* Sleek Top Floating HUD Control Bar (No Header clutter) */}
      <div className="absolute top-4 inset-x-4 sm:inset-x-6 flex justify-between items-center pointer-events-auto z-50">
        <div className="flex items-center space-x-3 bg-slate-950/80 border border-sky-900/60 rounded-xl px-3.5 py-1.5 backdrop-blur-md shadow-lg">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          <span className="text-xs font-bold text-sky-400 tracking-wider">ALBERT<span className="text-amber-400">.DEV</span></span>
          <span className="text-[9px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded border border-sky-950 uppercase hidden sm:inline-block">3D WORKSHOP</span>
        </div>

        {onOpenTerminal && (
          <button
            onClick={onOpenTerminal}
            className="border border-sky-500/30 bg-slate-950/80 hover:bg-sky-500/20 text-sky-300 px-3 py-1.5 rounded-xl text-xs uppercase tracking-wide flex items-center transition-all backdrop-blur-md shadow-lg"
          >
            <span className="text-amber-400 mr-1.5 font-bold">&gt;_</span>
            <span>TERMINAL.EXE</span>
          </button>
        )}
      </div>

      {/* Top Left System Reference Tag */}
      <div className="absolute top-16 left-6 text-sky-500/40 text-[10px] sm:text-xs flex items-center space-x-2">
        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
        <span>{activeSection.tag}</span>
      </div>

      {/* Top Right Location & Scale Tag */}
      <div className="absolute top-16 right-6 text-sky-500/40 text-[10px] sm:text-xs text-right hidden sm:block">
        <div>SCALE 1:1 / LOC: GHANA</div>
        <div className="text-[9px] text-slate-500 font-sans">Z-DEPTH: {Math.round(curZ)}px</div>
      </div>

      {/* Right Side Dot Rail Navigation */}
      <nav
        aria-label="Section depth navigation"
        className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 pointer-events-auto flex flex-col items-center space-y-2.5 sm:space-y-3 bg-slate-950/80 border border-sky-950/80 rounded-full py-3 px-1.5 sm:py-4 sm:px-2 backdrop-blur-md shadow-xl z-50"
      >
        {WORKSHOP_SECTIONS.map((sec, idx) => {
          const isActive = activeSectionIndex === idx;
          return (
            <button
              key={sec.id}
              onClick={() => scrollToSection(idx)}
              aria-label={`Jump to ${sec.label}`}
              aria-current={isActive ? 'step' : undefined}
              className={`group relative flex items-center justify-center transition-all duration-300 ${
                isActive ? 'scale-125' : 'hover:scale-110 opacity-60 hover:opacity-100'
              }`}
            >
              {/* Dot */}
              <span
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border transition-all ${
                  isActive
                    ? 'bg-sky-400 border-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.8)]'
                    : 'bg-slate-800 border-sky-900 group-hover:border-sky-400'
                }`}
              />

              {/* Tooltip on hover */}
              <span className="absolute right-8 px-2.5 py-1 bg-slate-900 text-sky-300 border border-sky-500/30 rounded text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg hidden sm:block">
                {sec.shortLabel}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Left Active Section Badge */}
      <div
        className={`absolute bottom-3 left-3 sm:bottom-6 sm:left-6 pointer-events-auto bg-slate-950/90 border border-sky-900/60 backdrop-blur-md rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 flex items-center space-x-2.5 sm:space-x-3 shadow-lg transition-all duration-300 ${
          progress > 0.92 ? 'opacity-30 hover:opacity-100' : 'opacity-100'
        }`}
      >
        <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400 animate-spin" style={{ animationDuration: '10s' }} />
        <div>
          <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-widest">// SECTION</div>
          <div className="text-[11px] sm:text-sm font-bold text-sky-300">{activeSection.label}</div>
        </div>
      </div>

      {/* Bottom Scroll Hint on Entrance */}
      {activeSectionIndex === 0 && progress < 0.1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-slate-400 text-xs animate-bounce pointer-events-none">
          <span className="text-[10px] tracking-widest text-sky-400 uppercase">// SCROLL TO DESCEND WORKSHOP</span>
          <ChevronDown className="w-4 h-4 text-sky-400 mt-1" />
        </div>
      )}
    </div>
  );
};
