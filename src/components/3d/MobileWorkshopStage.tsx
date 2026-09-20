import React, { useState, useEffect, useRef, useCallback } from 'react';
import { WORKSHOP_DATA, LogArticle } from '../../config/workshopData';
import { WorkshopModal, ModalData } from './WorkshopModal';
import { 
  ChevronLeft, ChevronRight, X, Terminal, BookOpen, 
  Cpu, Flame, Layers, User, Zap, Sparkles, ExternalLink 
} from 'lucide-react';

interface MobileWorkshopStageProps {
  onOpenTerminal?: () => void;
}

export interface MobileObjectConfig {
  id: string;
  label: string;
  placard: string;
  accent: 'cyan' | 'amber' | 'white';
  pos: { x: number; y: number; z: number };
  focusTransform: string;
}

export const MOBILE_OBJECTS: MobileObjectConfig[] = [
  {
    id: 'about',
    label: 'Figure at Desk',
    placard: 'ABOUT DOSSIER',
    accent: 'cyan',
    pos: { x: 0, y: -20, z: 20 },
    focusTransform: 'translate3d(0px, 40px, 120px) scale(1.35)'
  },
  {
    id: 'journal',
    label: 'Notebooks',
    placard: 'RESEARCH JOURNAL',
    accent: 'white',
    pos: { x: -45, y: 70, z: 10 },
    focusTransform: 'translate3d(60px, -60px, 140px) scale(1.4)'
  },
  {
    id: 'projects',
    label: 'Glass Shelves',
    placard: 'FINISHED PROJECTS',
    accent: 'cyan',
    pos: { x: -80, y: -90, z: 60 },
    focusTransform: 'translate3d(100px, 90px, 130px) scale(1.35)'
  },
  {
    id: 'mascot',
    label: 'Mascot OK-02',
    placard: 'MASCOT OK-02',
    accent: 'cyan',
    pos: { x: -135, y: -35, z: 35 },
    focusTransform: 'translate3d(140px, 40px, 140px) scale(1.45)'
  },
  {
    id: 'workstation',
    label: 'Workbench',
    placard: 'IN-PROGRESS BENCH',
    accent: 'amber',
    pos: { x: 90, y: -70, z: 40 },
    focusTransform: 'translate3d(-90px, 70px, 130px) scale(1.35)'
  },
  {
    id: 'roadmap',
    label: 'Whiteboard',
    placard: 'ROADMAP & GOALS',
    accent: 'white',
    pos: { x: -115, y: -130, z: 90 },
    focusTransform: 'translate3d(120px, 130px, 130px) scale(1.35)'
  },
  {
    id: 'terminal',
    label: 'CRT Terminal',
    placard: 'TERMINAL & CONTACT',
    accent: 'white',
    pos: { x: 130, y: 15, z: 20 },
    focusTransform: 'translate3d(-130px, -15px, 140px) scale(1.4)'
  },
  {
    id: 'failed',
    label: 'Failed Crate',
    placard: 'FAILED CRATE',
    accent: 'amber',
    pos: { x: 45, y: 110, z: 0 },
    focusTransform: 'translate3d(-45px, -110px, 140px) scale(1.4)'
  }
];

export const MobileWorkshopStage: React.FC<MobileWorkshopStageProps> = ({ onOpenTerminal }) => {
  // Mobile Interaction States
  const [focusedObjectId, setFocusedObjectId] = useState<string | null>(null);
  const [hasTapped, setHasTapped] = useState(false);
  const [tappedObjects, setTappedObjects] = useState<Set<string>>(new Set());
  const [dragRotY, setDragRotY] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);

  // Touch drag tracking for room horizontal parallax
  const touchStartX = useRef<number | null>(null);

  // Full Technical Modal State (from sheet "See full details")
  const [modalState, setModalState] = useState<ModalData>({
    isOpen: false,
    title: '',
    summary: '',
  });

  const closeModal = useCallback(() => setModalState((prev) => ({ ...prev, isOpen: false })), []);

  // Mascot blinking loop
  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  // Browser & Android Back Button Integration via history.pushState
  useEffect(() => {
    if (focusedObjectId) {
      window.history.pushState({ mobileFocus: focusedObjectId }, '');
    }

    const handlePopState = (e: PopStateEvent) => {
      if (focusedObjectId) {
        setFocusedObjectId(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [focusedObjectId]);

  // Touch Drag Parallax Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartX.current = e.touches[0].clientX;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current !== null && e.touches.length === 1) {
      const deltaX = e.touches[0].clientX - touchStartX.current;
      // Clamp rotation within +/- 15 degrees
      const clamped = Math.max(-15, Math.min(15, deltaX * 0.15));
      setDragRotY(clamped);
    }
  };

  const handleTouchEnd = () => {
    touchStartX.current = null;
    // Spring back to center
    setDragRotY(0);
  };

  const handleObjectTap = (id: string) => {
    if (!hasTapped) setHasTapped(true);
    setTappedObjects((prev) => new Set(prev).add(id));
    setFocusedObjectId(id);
  };

  const handleCloseSheet = () => {
    setFocusedObjectId(null);
  };

  const currentObjIndex = focusedObjectId 
    ? MOBILE_OBJECTS.findIndex(o => o.id === focusedObjectId) 
    : -1;

  const focusedConfig = focusedObjectId 
    ? MOBILE_OBJECTS.find(o => o.id === focusedObjectId) 
    : null;

  // Derive active sheet content based on focusedObjectId
  const getSheetContent = () => {
    if (!focusedObjectId) return null;

    switch (focusedObjectId) {
      case 'about':
        return {
          title: WORKSHOP_DATA.about.title,
          placard: WORKSHOP_DATA.about.placard,
          category: 'SYSTEMS BUILDER',
          summary: WORKSHOP_DATA.about.summary,
          bullets: WORKSHOP_DATA.about.bullets.slice(0, 3),
          onOpenFull: () => {
            setModalState({
              isOpen: true,
              title: WORKSHOP_DATA.about.title,
              placard: WORKSHOP_DATA.about.placard,
              summary: WORKSHOP_DATA.about.summary,
              bullets: WORKSHOP_DATA.about.bullets,
              tags: ["ESP32", "LoRa", "Fusion 360", "FreeRTOS", "React"],
              fullDetails: {
                overview: `Role: ${WORKSHOP_DATA.about.role}\nLocation: ${WORKSHOP_DATA.about.location}`,
                componentsList: WORKSHOP_DATA.about.capabilities.hardware,
                schematicNotes: WORKSHOP_DATA.about.capabilities.software,
                firmwareHighlights: WORKSHOP_DATA.about.capabilities.cad
              }
            });
          }
        };

      case 'journal':
        const latestJournal = WORKSHOP_DATA.journal[0];
        return {
          title: latestJournal.title,
          placard: 'RESEARCH JOURNAL',
          category: latestJournal.category,
          summary: latestJournal.summary,
          bullets: latestJournal.bullets.slice(0, 3),
          onOpenFull: () => {
            setModalState({
              isOpen: true,
              title: latestJournal.title,
              placard: `JOURNAL // ${latestJournal.category}`,
              summary: latestJournal.summary,
              bullets: latestJournal.bullets,
              tags: ["JOURNAL", latestJournal.category, latestJournal.readTime],
              fullDetails: {
                overview: latestJournal.content,
                schematicNotes: [
                  `Published: ${latestJournal.date}`,
                  `Read Time: ${latestJournal.readTime}`
                ]
              },
              logEntries: WORKSHOP_DATA.journal.flatMap(j => j.logEntries || [])
            });
          }
        };

      case 'projects':
        const finishedProj = WORKSHOP_DATA.finishedProjects[0];
        return {
          title: finishedProj.title,
          placard: finishedProj.placard,
          category: 'FINISHED PROJECT',
          summary: finishedProj.summary,
          bullets: finishedProj.bullets.slice(0, 3),
          onOpenFull: () => {
            setModalState({
              isOpen: true,
              title: finishedProj.title,
              placard: finishedProj.placard,
              summary: finishedProj.summary,
              bullets: finishedProj.bullets,
              tags: finishedProj.tags,
              externalUrl: finishedProj.githubUrl,
              fullDetails: finishedProj.fullDetails,
              logEntries: finishedProj.logEntries
            });
          }
        };

      case 'mascot':
        return {
          title: WORKSHOP_DATA.mascot.title,
          placard: WORKSHOP_DATA.mascot.placard,
          category: 'AUTONOMOUS UNIT',
          summary: WORKSHOP_DATA.mascot.summary,
          bullets: WORKSHOP_DATA.mascot.bullets.slice(0, 3),
          onOpenFull: () => {
            setModalState({
              isOpen: true,
              title: WORKSHOP_DATA.mascot.title,
              placard: WORKSHOP_DATA.mascot.placard,
              summary: WORKSHOP_DATA.mascot.summary,
              bullets: WORKSHOP_DATA.mascot.bullets,
              tags: ["Mascot OK-02", "Vector Math", "Gaze Tracking"],
              logEntries: WORKSHOP_DATA.mascot.logEntries
            });
          }
        };

      case 'workstation':
        const inProgressProj = WORKSHOP_DATA.inProgressProjects[0];
        return {
          title: inProgressProj.title,
          placard: inProgressProj.placard,
          category: 'IN-PROGRESS BENCH',
          summary: inProgressProj.summary,
          bullets: inProgressProj.bullets.slice(0, 3),
          onOpenFull: () => {
            setModalState({
              isOpen: true,
              title: inProgressProj.title,
              placard: inProgressProj.placard,
              summary: inProgressProj.summary,
              bullets: inProgressProj.bullets,
              tags: inProgressProj.tags,
              fullDetails: inProgressProj.fullDetails,
              logEntries: inProgressProj.logEntries
            });
          }
        };

      case 'roadmap':
        const firstRm = WORKSHOP_DATA.roadmap[0];
        return {
          title: '2026 Engineering Roadmap',
          placard: 'ROADMAP & GOALS',
          category: 'PLANNED MILESTONES',
          summary: 'Active quarterly engineering milestones and open-source lab goals.',
          bullets: WORKSHOP_DATA.roadmap.map(r => `[${r.quarter}] ${r.title}: ${r.description}`),
          onOpenFull: () => {
            setModalState({
              isOpen: true,
              title: '2026 Engineering Roadmap',
              placard: 'ROADMAP & GOALS',
              summary: 'Active quarterly engineering milestones and open-source lab goals.',
              bullets: WORKSHOP_DATA.roadmap.map(r => `[${r.quarter}] ${r.title}: ${r.description}`),
              tags: ["ROADMAP", "Q1 2026 - Q3 2026", "A3PK LABS"]
            });
          }
        };

      case 'terminal':
        return {
          title: WORKSHOP_DATA.contact.title,
          placard: WORKSHOP_DATA.contact.placard,
          category: 'CRT CLI TERMINAL',
          summary: WORKSHOP_DATA.contact.summary,
          bullets: WORKSHOP_DATA.contact.bullets.slice(0, 3),
          onOpenFull: () => {
            setModalState({
              isOpen: true,
              title: WORKSHOP_DATA.contact.title,
              placard: WORKSHOP_DATA.contact.placard,
              summary: WORKSHOP_DATA.contact.summary,
              bullets: WORKSHOP_DATA.contact.bullets,
              tags: ["CONTACT", "TERMINAL", "COMMS"],
              onOpenTerminal: onOpenTerminal,
              fullDetails: {
                overview: "The CRT Control Desk provides an interactive command line interface (CLI) to query visitor session telemetry or launch admin tools.",
                componentsList: [
                  `Email: ${WORKSHOP_DATA.contact.email}`,
                  `Phone: ${WORKSHOP_DATA.contact.phone}`,
                  `Location: ${WORKSHOP_DATA.contact.location}`
                ]
              }
            });
          }
        };

      case 'failed':
        return {
          title: WORKSHOP_DATA.failedCrate.title,
          placard: WORKSHOP_DATA.failedCrate.placard,
          category: 'PROTOTYPE FAILURES',
          summary: WORKSHOP_DATA.failedCrate.summary,
          bullets: WORKSHOP_DATA.failedCrate.bullets.slice(0, 3),
          onOpenFull: () => {
            setModalState({
              isOpen: true,
              title: WORKSHOP_DATA.failedCrate.title,
              placard: WORKSHOP_DATA.failedCrate.placard,
              summary: WORKSHOP_DATA.failedCrate.summary,
              bullets: WORKSHOP_DATA.failedCrate.bullets,
              tags: ["FAILURES", "LESSONS LEARNED", "HARDWARE"],
              logEntries: WORKSHOP_DATA.failedCrate.logEntries
            });
          }
        };

      default:
        return null;
    }
  };

  const sheetData = getSheetContent();

  return (
    <div 
      className="fixed inset-0 overflow-hidden bg-[#050810] text-slate-100 select-none font-mono-tech flex flex-col justify-between"
      style={{
        // Viewport reference unit: --u = min(100vw / 390, 100dvh / 720)
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background blueprint grid */}
      <div className="absolute inset-0 bg-blueprint-grid opacity-20 pointer-events-none" />
      
      {/* Room Stage (Occupies upper 60% of viewport) */}
      <div className="relative w-full h-[62dvh] flex items-center justify-center overflow-hidden">
        
        {/* Room 3D World Stage with Dolly Camera Focus Transform */}
        <div 
          className="relative transition-all duration-700 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            perspective: '1000px',
            transform: focusedConfig 
              ? `${focusedConfig.focusTransform} rotateY(${dragRotY}deg)`
              : `rotateX(42deg) rotateZ(-45deg) rotateY(${dragRotY}deg) scale(0.92)`,
          }}
        >

          {/* ISOMETRIC ROOM CONTAINER (320px x 320px isometric base) */}
          <div className="relative w-[320px] h-[320px] rounded-xl bg-slate-950/90 border-2 border-sky-500/30 shadow-[0_0_50px_rgba(0,0,0,0.9)]">
            
            {/* Back Wall Hazard Stripe Border */}
            <div className="absolute top-0 inset-x-0 h-4 bg-[repeating-linear-gradient(45deg,#000,#000_10px,#eab308_10px,#eab308_20px)] opacity-70" />
            
            {/* Wall Text Signage */}
            <div className="absolute top-6 left-6 text-[9px] font-mono-tech font-bold text-amber-400 tracking-widest uppercase">
              BUILD · BREAK · LEARN · REPEAT
            </div>

            {/* 1. OBJECT: FIGURE AT DESK (About) */}
            {(() => {
              const id = 'about';
              const isFocused = focusedObjectId === id;
              const isOtherFocused = focusedObjectId !== null && !isFocused;
              const hasBeenTapped = tappedObjects.has(id);

              return (
                <button
                  type="button"
                  aria-label="About Dossier (Figure at Desk)"
                  onClick={() => handleObjectTap(id)}
                  className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 min-w-[48px] min-h-[48px] flex items-center justify-center rounded-full transition-all duration-500 cursor-pointer ${
                    isOtherFocused ? 'opacity-35 scale-90' : 'opacity-100 scale-100'
                  }`}
                >
                  <div className="relative flex flex-col items-center">
                    {!hasBeenTapped && !focusedObjectId && (
                      <span className="absolute -top-3 w-3 h-3 rounded-full bg-sky-400 animate-ping" />
                    )}
                    <div className="w-12 h-12 rounded-full bg-slate-900 border-2 border-sky-400/80 flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.4)]">
                      <User size={22} className="text-sky-300" />
                    </div>
                    <span className="text-[8px] bg-slate-950/90 text-sky-400 border border-sky-500/40 px-1.5 py-0.5 rounded mt-1 font-bold">
                      ABOUT
                    </span>
                  </div>
                </button>
              );
            })()}

            {/* 2. OBJECT: NOTEBOOKS (Journal) */}
            {(() => {
              const id = 'journal';
              const isFocused = focusedObjectId === id;
              const isOtherFocused = focusedObjectId !== null && !isFocused;
              const hasBeenTapped = tappedObjects.has(id);

              return (
                <button
                  type="button"
                  aria-label="Research Journal (Notebooks)"
                  onClick={() => handleObjectTap(id)}
                  className={`absolute left-[70px] bottom-[60px] min-w-[48px] min-h-[48px] flex items-center justify-center transition-all duration-500 cursor-pointer ${
                    isOtherFocused ? 'opacity-35 scale-90' : 'opacity-100 scale-100'
                  }`}
                >
                  <div className="relative flex flex-col items-center">
                    {!hasBeenTapped && !focusedObjectId && (
                      <span className="absolute -top-3 w-3 h-3 rounded-full bg-white animate-ping" />
                    )}
                    <div className="w-10 h-10 rounded-lg bg-slate-900 border-2 border-slate-300/80 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                      <BookOpen size={18} className="text-amber-400" />
                    </div>
                    <span className="text-[8px] bg-slate-950/90 text-slate-200 border border-slate-600 px-1.5 py-0.5 rounded mt-1 font-bold">
                      JOURNAL
                    </span>
                  </div>
                </button>
              );
            })()}

            {/* 3. OBJECT: GLASS SHELVES (Projects) */}
            {(() => {
              const id = 'projects';
              const isFocused = focusedObjectId === id;
              const isOtherFocused = focusedObjectId !== null && !isFocused;
              const hasBeenTapped = tappedObjects.has(id);

              return (
                <button
                  type="button"
                  aria-label="Finished Projects (Glass Shelves)"
                  onClick={() => handleObjectTap(id)}
                  className={`absolute left-[30px] top-[70px] min-w-[48px] min-h-[48px] flex items-center justify-center transition-all duration-500 cursor-pointer ${
                    isOtherFocused ? 'opacity-35 scale-90' : 'opacity-100 scale-100'
                  }`}
                >
                  <div className="relative flex flex-col items-center">
                    {!hasBeenTapped && !focusedObjectId && (
                      <span className="absolute -top-3 w-3 h-3 rounded-full bg-sky-400 animate-ping" />
                    )}
                    <div className="w-10 h-12 rounded-lg bg-sky-950/60 border-2 border-sky-400/80 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.3)]">
                      <Layers size={18} className="text-sky-300" />
                    </div>
                    <span className="text-[8px] bg-slate-950/90 text-sky-400 border border-sky-500/40 px-1.5 py-0.5 rounded mt-1 font-bold">
                      PROJECTS
                    </span>
                  </div>
                </button>
              );
            })()}

            {/* 4. OBJECT: MASCOT OK-02 (Pedestal) */}
            {(() => {
              const id = 'mascot';
              const isFocused = focusedObjectId === id;
              const isOtherFocused = focusedObjectId !== null && !isFocused;
              const hasBeenTapped = tappedObjects.has(id);

              return (
                <button
                  type="button"
                  aria-label="Mascot OK-02 Showcase"
                  onClick={() => handleObjectTap(id)}
                  className={`absolute left-[25px] top-[160px] min-w-[48px] min-h-[48px] flex items-center justify-center transition-all duration-500 cursor-pointer ${
                    isOtherFocused ? 'opacity-35 scale-90' : 'opacity-100 scale-100'
                  }`}
                >
                  <div className="relative flex flex-col items-center">
                    {!hasBeenTapped && !focusedObjectId && (
                      <span className="absolute -top-3 w-3 h-3 rounded-full bg-sky-400 animate-ping" />
                    )}
                    <div className="w-11 h-11 rounded-full bg-slate-950 border-2 border-sky-400/80 flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.5)]">
                      <div className={`w-4 h-4 rounded-full bg-sky-400 transition-transform ${isBlinking ? 'scale-y-[0.1]' : 'scale-y-100'}`} />
                    </div>
                    <span className="text-[8px] bg-slate-950/90 text-sky-300 border border-sky-500/40 px-1.5 py-0.5 rounded mt-1 font-bold">
                      MASCOT
                    </span>
                  </div>
                </button>
              );
            })()}

            {/* 5. OBJECT: WORKBENCH (Workstation / In-Progress) */}
            {(() => {
              const id = 'workstation';
              const isFocused = focusedObjectId === id;
              const isOtherFocused = focusedObjectId !== null && !isFocused;
              const hasBeenTapped = tappedObjects.has(id);

              return (
                <button
                  type="button"
                  aria-label="In-Progress Workstation Bench"
                  onClick={() => handleObjectTap(id)}
                  className={`absolute right-[30px] top-[80px] min-w-[48px] min-h-[48px] flex items-center justify-center transition-all duration-500 cursor-pointer ${
                    isOtherFocused ? 'opacity-35 scale-90' : 'opacity-100 scale-100'
                  }`}
                >
                  <div className="relative flex flex-col items-center">
                    {!hasBeenTapped && !focusedObjectId && (
                      <span className="absolute -top-3 w-3 h-3 rounded-full bg-amber-400 animate-ping" />
                    )}
                    <div className="w-12 h-10 rounded-lg bg-amber-950/70 border-2 border-amber-500/80 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                      <Zap size={18} className="text-amber-400 animate-pulse" />
                    </div>
                    <span className="text-[8px] bg-slate-950/90 text-amber-400 border border-amber-500/40 px-1.5 py-0.5 rounded mt-1 font-bold">
                      WORKBENCH
                    </span>
                  </div>
                </button>
              );
            })()}

            {/* 6. OBJECT: WHITEBOARD (Roadmap) */}
            {(() => {
              const id = 'roadmap';
              const isFocused = focusedObjectId === id;
              const isOtherFocused = focusedObjectId !== null && !isFocused;
              const hasBeenTapped = tappedObjects.has(id);

              return (
                <button
                  type="button"
                  aria-label="Engineering Roadmap (Whiteboard)"
                  onClick={() => handleObjectTap(id)}
                  className={`absolute left-[90px] top-[25px] min-w-[48px] min-h-[48px] flex items-center justify-center transition-all duration-500 cursor-pointer ${
                    isOtherFocused ? 'opacity-35 scale-90' : 'opacity-100 scale-100'
                  }`}
                >
                  <div className="relative flex flex-col items-center">
                    {!hasBeenTapped && !focusedObjectId && (
                      <span className="absolute -top-3 w-3 h-3 rounded-full bg-white animate-ping" />
                    )}
                    <div className="w-12 h-8 rounded bg-slate-100 border-2 border-slate-400 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                      <span className="text-[7px] font-bold text-slate-950">ROADMAP</span>
                    </div>
                    <span className="text-[8px] bg-slate-950/90 text-slate-300 border border-slate-600 px-1.5 py-0.5 rounded mt-1 font-bold">
                      WHITEBOARD
                    </span>
                  </div>
                </button>
              );
            })()}

            {/* 7. OBJECT: CRT TERMINAL (Terminal & Contact) */}
            {(() => {
              const id = 'terminal';
              const isFocused = focusedObjectId === id;
              const isOtherFocused = focusedObjectId !== null && !isFocused;
              const hasBeenTapped = tappedObjects.has(id);

              return (
                <button
                  type="button"
                  aria-label="CRT Terminal Desk"
                  onClick={() => handleObjectTap(id)}
                  className={`absolute right-[25px] bottom-[70px] min-w-[48px] min-h-[48px] flex items-center justify-center transition-all duration-500 cursor-pointer ${
                    isOtherFocused ? 'opacity-35 scale-90' : 'opacity-100 scale-100'
                  }`}
                >
                  <div className="relative flex flex-col items-center">
                    {!hasBeenTapped && !focusedObjectId && (
                      <span className="absolute -top-3 w-3 h-3 rounded-full bg-white animate-ping" />
                    )}
                    <div className="w-11 h-11 rounded-lg bg-slate-950 border-2 border-sky-400/90 flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.5)]">
                      <Terminal size={18} className="text-emerald-400 animate-pulse" />
                    </div>
                    <span className="text-[8px] bg-slate-950/90 text-emerald-400 border border-emerald-500/40 px-1.5 py-0.5 rounded mt-1 font-bold">
                      TERMINAL
                    </span>
                  </div>
                </button>
              );
            })()}

            {/* 8. OBJECT: FAILED CRATE (Failed Prototypes) */}
            {(() => {
              const id = 'failed';
              const isFocused = focusedObjectId === id;
              const isOtherFocused = focusedObjectId !== null && !isFocused;
              const hasBeenTapped = tappedObjects.has(id);

              return (
                <button
                  type="button"
                  aria-label="Failed Prototypes Crate"
                  onClick={() => handleObjectTap(id)}
                  className={`absolute right-[110px] bottom-[30px] min-w-[48px] min-h-[48px] flex items-center justify-center transition-all duration-500 cursor-pointer ${
                    isOtherFocused ? 'opacity-35 scale-90' : 'opacity-100 scale-100'
                  }`}
                >
                  <div className="relative flex flex-col items-center">
                    {!hasBeenTapped && !focusedObjectId && (
                      <span className="absolute -top-3 w-3 h-3 rounded-full bg-amber-500 animate-ping" />
                    )}
                    <div className="w-10 h-10 rounded-lg bg-amber-950/80 border-2 border-amber-600/80 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                      <Flame size={18} className="text-amber-500" />
                    </div>
                    <span className="text-[8px] bg-slate-950/90 text-amber-500 border border-amber-600/40 px-1.5 py-0.5 rounded mt-1 font-bold">
                      FAILED CRATE
                    </span>
                  </div>
                </button>
              );
            })()}

          </div>
        </div>

      </div>

      {/* Faint Bottom Entrance Hint (Fades out after first tap) */}
      {!hasTapped && !focusedObjectId && (
        <div className="absolute bottom-6 inset-x-0 flex flex-col items-center pointer-events-none z-20 animate-pulse text-center">
          <span className="text-[10px] font-mono-tech text-sky-400 uppercase tracking-widest">
            TAP ANYTHING IN THE ROOM
          </span>
        </div>
      )}

      {/* MOBILE BOTTOM SHEET (Slides up in lower ~40% of viewport when an object is tapped) */}
      {focusedObjectId && sheetData && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-sheet-title"
          className="relative w-full bg-[#0b1220] border-t-2 border-sky-500/50 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.9)] p-5 z-40 animate-slide-up flex flex-col justify-between max-h-[44dvh]"
        >
          {/* Sheet Top Drag Handle Bar */}
          <div 
            onClick={handleCloseSheet}
            className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-3 cursor-pointer hover:bg-sky-400 transition-colors shrink-0" 
          />

          {/* Sheet Header: Placard, Title, Close X */}
          <div className="flex justify-between items-start border-b border-sky-950 pb-3 mb-2 shrink-0">
            <div>
              <span className="text-[9px] font-mono-tech text-sky-400 uppercase tracking-widest font-bold">
                // {sheetData.placard}
              </span>
              <h2 id="mobile-sheet-title" className="text-lg font-bold text-white font-sans tracking-tight">
                {sheetData.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={handleCloseSheet}
              aria-label="Close sheet"
              className="p-1.5 rounded-lg bg-slate-950 border border-sky-950 text-slate-400 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>

          {/* Sheet Content: 1-line summary + max 3 bullets */}
          <div className="overflow-y-auto space-y-2 text-xs font-sans pr-1 flex-1">
            <p className="text-slate-300 leading-relaxed font-medium">
              {sheetData.summary}
            </p>

            {sheetData.bullets && sheetData.bullets.length > 0 && (
              <ul className="space-y-1 font-mono-tech text-[11px] text-slate-300 border-l-2 border-sky-500/40 pl-3 py-0.5">
                {sheetData.bullets.slice(0, 3).map((b, idx) => (
                  <li key={idx}>• {b}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Action Row: See Full Details + Left/Right Chevron Navigation Bar */}
          <div className="mt-3 pt-3 border-t border-sky-950/80 flex justify-between items-center shrink-0">
            {/* Previous / Next Object Chevron Nav */}
            <div className="flex items-center space-x-1 font-mono-tech text-[10px]">
              <button
                type="button"
                aria-label="Previous workshop object"
                disabled={currentObjIndex <= 0}
                onClick={() => {
                  if (currentObjIndex > 0) {
                    handleObjectTap(MOBILE_OBJECTS[currentObjIndex - 1].id);
                  }
                }}
                className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-sky-400 disabled:opacity-30 hover:border-sky-500"
              >
                <ChevronLeft size={14} />
              </button>

              <span className="text-[10px] text-slate-400 font-bold px-1">
                {currentObjIndex + 1}/{MOBILE_OBJECTS.length}
              </span>

              <button
                type="button"
                aria-label="Next workshop object"
                disabled={currentObjIndex >= MOBILE_OBJECTS.length - 1}
                onClick={() => {
                  if (currentObjIndex < MOBILE_OBJECTS.length - 1) {
                    handleObjectTap(MOBILE_OBJECTS[currentObjIndex + 1].id);
                  }
                }}
                className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-sky-400 disabled:opacity-30 hover:border-sky-500"
              >
                <ChevronRight size={14} />
              </button>
            </div>

            {/* See Full Details Button */}
            <button
              type="button"
              onClick={sheetData.onOpenFull}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs font-bold rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all"
            >
              <span>SEE FULL DETAILS</span>
              <ExternalLink size={12} />
            </button>
          </div>
        </div>
      )}

      {/* Shared Technical Details Modal (Opened via "See full details") */}
      <WorkshopModal data={modalState} onClose={closeModal} />
    </div>
  );
};
