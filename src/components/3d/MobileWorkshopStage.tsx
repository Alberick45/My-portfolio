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
    pos: { x: 0, y: -10, z: 20 },
    focusTransform: 'translate3d(0px, 35px, 140px) scale(1.4)'
  },
  {
    id: 'journal',
    label: 'Notebooks',
    placard: 'RESEARCH JOURNAL',
    accent: 'white',
    pos: { x: -45, y: 65, z: 10 },
    focusTransform: 'translate3d(60px, -60px, 150px) scale(1.45)'
  },
  {
    id: 'projects',
    label: 'Glass Shelves',
    placard: 'FINISHED PROJECTS',
    accent: 'cyan',
    pos: { x: -75, y: -85, z: 50 },
    focusTransform: 'translate3d(95px, 90px, 140px) scale(1.4)'
  },
  {
    id: 'mascot',
    label: 'Mascot OK-02',
    placard: 'MASCOT OK-02',
    accent: 'cyan',
    pos: { x: -130, y: -30, z: 30 },
    focusTransform: 'translate3d(140px, 40px, 150px) scale(1.45)'
  },
  {
    id: 'workstation',
    label: 'Workbench',
    placard: 'IN-PROGRESS BENCH',
    accent: 'amber',
    pos: { x: 85, y: -65, z: 35 },
    focusTransform: 'translate3d(-90px, 70px, 140px) scale(1.4)'
  },
  {
    id: 'roadmap',
    label: 'Whiteboard',
    placard: 'ROADMAP & GOALS',
    accent: 'white',
    pos: { x: -110, y: -125, z: 85 },
    focusTransform: 'translate3d(125px, 130px, 140px) scale(1.4)'
  },
  {
    id: 'terminal',
    label: 'CRT Terminal',
    placard: 'TERMINAL & CONTACT',
    accent: 'white',
    pos: { x: 125, y: 20, z: 15 },
    focusTransform: 'translate3d(-130px, -20px, 150px) scale(1.45)'
  },
  {
    id: 'failed',
    label: 'Failed Crate',
    placard: 'FAILED CRATE',
    accent: 'amber',
    pos: { x: 45, y: 105, z: 0 },
    focusTransform: 'translate3d(-45px, -110px, 150px) scale(1.45)'
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

    const handlePopState = () => {
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
      const clamped = Math.max(-15, Math.min(15, deltaX * 0.15));
      setDragRotY(clamped);
    }
  };

  const handleTouchEnd = () => {
    touchStartX.current = null;
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
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background blueprint grid */}
      <div className="absolute inset-0 bg-blueprint-grid opacity-20 pointer-events-none" />
      
      {/* Upper Section: Full Responsive 3D Isometric Workshop Room */}
      <div className="relative w-full h-[62dvh] flex items-center justify-center overflow-hidden">
        
        {/* 3D Isometric Perspective Viewport */}
        <div 
          className="relative transition-all duration-700 ease-out flex items-center justify-center"
          style={{
            perspective: '900px',
            transformStyle: 'preserve-3d',
            transform: focusedConfig 
              ? `${focusedConfig.focusTransform} rotateY(${dragRotY}deg)`
              : `rotateX(28deg) rotateY(-22deg) rotateZ(0deg) rotateY(${dragRotY}deg)`,
          }}
        >

          {/* REAL 3D ISOMETRIC WORKSHOP ROOM CONTAINER (Scales to phone width: 94vw max 360px) */}
          <div className="relative w-[94vw] max-w-[360px] aspect-square rounded-2xl bg-[#0d1527] border-2 border-sky-500/40 shadow-[0_0_60px_rgba(0,0,0,0.95)] overflow-visible">
            
            {/* 3D FLOOR GRID WITH HAZARD BORDER */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />
            <div className="absolute bottom-0 inset-x-0 h-3 bg-[repeating-linear-gradient(45deg,#000,#000_10px,#eab308_10px,#eab308_20px)] opacity-90 rounded-b-xl" />

            {/* 3D BACK WALL: HEADER SIGNAGE & CLOCK */}
            <div className="absolute top-0 inset-x-0 h-10 border-b border-sky-950 bg-slate-950/80 flex items-center justify-between px-3">
              <span className="text-[8px] font-bold text-amber-400 tracking-widest uppercase">
                BUILD · BREAK · LEARN · REPEAT
              </span>
              {/* Round Wall Clock */}
              <div className="w-5 h-5 rounded-full border border-sky-400/60 bg-slate-900 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
              </div>
            </div>

            {/* 3D LEFT WALL: WHITEBOARD WITH STICKY NOTES (Roadmap) */}
            {(() => {
              const id = 'roadmap';
              const isFocused = focusedObjectId === id;
              const isOtherFocused = focusedObjectId !== null && !isFocused;
              const hasBeenTapped = tappedObjects.has(id);

              return (
                <button
                  type="button"
                  aria-label="Engineering Roadmap Whiteboard"
                  onClick={() => handleObjectTap(id)}
                  className={`absolute left-3 top-14 w-28 h-18 bg-slate-100 border-2 border-slate-400 rounded-lg p-1.5 shadow-[0_0_15px_rgba(255,255,255,0.25)] text-slate-950 transition-all duration-500 cursor-pointer ${
                    isOtherFocused ? 'opacity-35 scale-90' : 'opacity-100 scale-100'
                  }`}
                >
                  <div className="relative w-full h-full flex flex-col justify-between">
                    <div className="text-[7px] font-mono-tech font-bold uppercase tracking-wider text-slate-800 flex justify-between">
                      <span>ROADMAP</span>
                      <span className="text-sky-600 font-bold">2026</span>
                    </div>
                    {/* 4 Colored Sticky Note Cards */}
                    <div className="grid grid-cols-2 gap-1 my-0.5">
                      <div className="h-3.5 bg-amber-300 rounded border border-amber-400 shadow-sm" />
                      <div className="h-3.5 bg-cyan-300 rounded border border-cyan-400 shadow-sm" />
                      <div className="h-3.5 bg-rose-300 rounded border border-rose-400 shadow-sm" />
                      <div className="h-3.5 bg-emerald-300 rounded border border-emerald-400 shadow-sm" />
                    </div>
                    {!hasBeenTapped && !focusedObjectId && (
                      <span className="absolute -top-2 -right-2 w-3.5 h-3.5 rounded-full bg-white animate-ping" />
                    )}
                  </div>
                </button>
              );
            })()}

            {/* GLASS DISPLAY TOWER SHELVES (Projects) */}
            {(() => {
              const id = 'projects';
              const isFocused = focusedObjectId === id;
              const isOtherFocused = focusedObjectId !== null && !isFocused;
              const hasBeenTapped = tappedObjects.has(id);

              return (
                <button
                  type="button"
                  aria-label="Finished Projects Glass Tower"
                  onClick={() => handleObjectTap(id)}
                  className={`absolute left-4 top-36 w-14 h-32 bg-sky-950/40 border-2 border-sky-400/80 rounded-xl p-1.5 flex flex-col justify-between shadow-[0_0_25px_rgba(56,189,248,0.3)] transition-all duration-500 cursor-pointer ${
                    isOtherFocused ? 'opacity-35 scale-90' : 'opacity-100 scale-100'
                  }`}
                >
                  <div className="relative w-full h-full flex flex-col justify-between items-center">
                    {!hasBeenTapped && !focusedObjectId && (
                      <span className="absolute -top-2 -right-2 w-3.5 h-3.5 rounded-full bg-sky-400 animate-ping" />
                    )}
                    {/* 3D Floating Artifact Cubes Inside Glass Tower */}
                    <div className="w-8 h-8 rounded bg-sky-500/30 border border-sky-300 flex items-center justify-center shadow-md">
                      <Layers size={14} className="text-sky-300 animate-pulse" />
                    </div>
                    <div className="w-8 h-8 rounded bg-indigo-500/30 border border-indigo-300 flex items-center justify-center shadow-md">
                      <Cpu size={14} className="text-indigo-300" />
                    </div>
                    <div className="w-8 h-8 rounded bg-emerald-500/30 border border-emerald-300 flex items-center justify-center shadow-md">
                      <Zap size={14} className="text-emerald-300" />
                    </div>
                    <span className="text-[7px] font-bold bg-slate-950 text-sky-400 border border-sky-500/40 px-1 py-0.5 rounded">
                      PROJECTS
                    </span>
                  </div>
                </button>
              );
            })()}

            {/* MASCOT OK-02 SHOWCASE PEDESTAL (Mascot) */}
            {(() => {
              const id = 'mascot';
              const isFocused = focusedObjectId === id;
              const isOtherFocused = focusedObjectId !== null && !isFocused;
              const hasBeenTapped = tappedObjects.has(id);

              return (
                <button
                  type="button"
                  aria-label="Mascot OK-02 Pedestal"
                  onClick={() => handleObjectTap(id)}
                  className={`absolute left-4 bottom-5 w-14 h-20 bg-slate-950 border-2 border-sky-400/90 rounded-xl p-1.5 flex flex-col items-center justify-between shadow-[0_0_25px_rgba(56,189,248,0.4)] transition-all duration-500 cursor-pointer ${
                    isOtherFocused ? 'opacity-35 scale-90' : 'opacity-100 scale-100'
                  }`}
                >
                  <div className="relative w-full h-full flex flex-col items-center justify-between">
                    {!hasBeenTapped && !focusedObjectId && (
                      <span className="absolute -top-2 -right-2 w-3.5 h-3.5 rounded-full bg-sky-400 animate-ping" />
                    )}
                    {/* Robot Mascot Unit */}
                    <div className="w-9 h-11 rounded-lg bg-sky-950/80 border border-sky-400 flex flex-col items-center justify-center p-1">
                      <div className="w-2 h-1 bg-amber-400 rounded-full mb-0.5" />
                      <div className={`w-6 h-5 rounded-md bg-slate-950 border border-sky-300 flex items-center justify-center transition-transform ${isBlinking ? 'scale-y-[0.1]' : 'scale-y-100'}`}>
                        <div className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]" />
                      </div>
                    </div>
                    <span className="text-[7px] font-bold bg-slate-950 text-sky-300 border border-sky-500/40 px-1 py-0.5 rounded">
                      MASCOT
                    </span>
                  </div>
                </button>
              );
            })()}

            {/* CENTER DESK & SEATED CHARACTER FIGURE (About) */}
            {(() => {
              const id = 'about';
              const isFocused = focusedObjectId === id;
              const isOtherFocused = focusedObjectId !== null && !isFocused;
              const hasBeenTapped = tappedObjects.has(id);

              return (
                <button
                  type="button"
                  aria-label="About Dossier (Figure Seated at Desk)"
                  onClick={() => handleObjectTap(id)}
                  className={`absolute left-[125px] top-[110px] w-24 h-24 flex flex-col items-center justify-center transition-all duration-500 cursor-pointer ${
                    isOtherFocused ? 'opacity-35 scale-90' : 'opacity-100 scale-100'
                  }`}
                >
                  <div className="relative flex flex-col items-center">
                    {!hasBeenTapped && !focusedObjectId && (
                      <span className="absolute -top-3 w-4 h-4 rounded-full bg-sky-400 animate-ping" />
                    )}
                    {/* 3D Seated Character Figure + Computer Desk */}
                    <div className="relative w-20 h-16 bg-[#634125] border-2 border-[#8b5a2b] rounded-lg p-1.5 flex justify-between items-center shadow-[0_5px_15px_rgba(0,0,0,0.6)]">
                      {/* Laptop with cyan glowing screen */}
                      <div className="w-7 h-6 rounded bg-slate-950 border border-sky-400 flex items-center justify-center shadow-md">
                        <div className="w-4 h-3 bg-sky-400/90 rounded-sm animate-pulse" />
                      </div>
                      {/* Character Head & Shoulders (Albert) */}
                      <div className="relative flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-[#5c3a21] border-2 border-[#8b5a2b] shadow-md flex items-center justify-center">
                          <User size={12} className="text-slate-100" />
                        </div>
                        <div className="w-8 h-4 rounded-t-md bg-slate-900 border border-sky-500/60 mt-0.5" />
                      </div>
                    </div>
                    <span className="text-[8px] font-bold bg-slate-950 text-sky-400 border border-sky-500/40 px-2 py-0.5 rounded mt-1.5 shadow-md">
                      ABOUT ALBERT
                    </span>
                  </div>
                </button>
              );
            })()}

            {/* COFFEE TABLE & NOTEBOOKS (Journal) */}
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
                  className={`absolute left-[135px] bottom-5 w-20 h-14 flex flex-col items-center justify-center transition-all duration-500 cursor-pointer ${
                    isOtherFocused ? 'opacity-35 scale-90' : 'opacity-100 scale-100'
                  }`}
                >
                  <div className="relative flex flex-col items-center">
                    {!hasBeenTapped && !focusedObjectId && (
                      <span className="absolute -top-3 w-3.5 h-3.5 rounded-full bg-white animate-ping" />
                    )}
                    {/* Low Coffee Table + Stacked Colorful 3D Books */}
                    <div className="w-16 h-9 rounded-lg bg-[#59391e] border border-[#7a4f2b] p-1 flex items-center justify-center shadow-md">
                      <div className="w-12 h-6 bg-amber-500 rounded border border-amber-300 flex items-center justify-center shadow-inner">
                        <BookOpen size={13} className="text-slate-950" />
                      </div>
                    </div>
                    <span className="text-[7.5px] font-bold bg-slate-950 text-slate-100 border border-slate-600 px-1.5 py-0.5 rounded mt-1 shadow-md">
                      JOURNAL
                    </span>
                  </div>
                </button>
              );
            })()}

            {/* MAIN WORKBENCH & OVERHEAD LAMP (Workstation) */}
            {(() => {
              const id = 'workstation';
              const isFocused = focusedObjectId === id;
              const isOtherFocused = focusedObjectId !== null && !isFocused;
              const hasBeenTapped = tappedObjects.has(id);

              return (
                <button
                  type="button"
                  aria-label="In-Progress Workbench"
                  onClick={() => handleObjectTap(id)}
                  className={`absolute right-3 top-16 w-28 h-28 flex flex-col items-center justify-center transition-all duration-500 cursor-pointer ${
                    isOtherFocused ? 'opacity-35 scale-90' : 'opacity-100 scale-100'
                  }`}
                >
                  <div className="relative flex flex-col items-center">
                    {!hasBeenTapped && !focusedObjectId && (
                      <span className="absolute -top-3 w-4 h-4 rounded-full bg-amber-400 animate-ping" />
                    )}
                    {/* Slate Gray Workbench + Green Mat + Glowing Amber Lamp */}
                    <div className="relative w-24 h-16 rounded-xl bg-slate-800 border-2 border-slate-600 p-1.5 flex flex-col justify-between shadow-[0_0_25px_rgba(245,158,11,0.3)]">
                      {/* Overhead Lamp Cone Glow */}
                      <div className="absolute -top-4 right-2 w-5 h-5 rounded-full bg-amber-400/90 border border-amber-300 shadow-[0_0_15px_#f59e0b] animate-pulse" />
                      <div className="w-full h-8 bg-emerald-950/80 rounded border border-emerald-500/60 p-1 flex justify-between items-center">
                        <div className="w-5 h-4 bg-slate-900 rounded border border-slate-600" />
                        <Zap size={14} className="text-amber-400 animate-pulse" />
                      </div>
                    </div>
                    <span className="text-[7.5px] font-bold bg-slate-950 text-amber-400 border border-amber-500/40 px-1.5 py-0.5 rounded mt-1.5 shadow-md">
                      WORKBENCH
                    </span>
                  </div>
                </button>
              );
            })()}

            {/* CRT TERMINAL CONTROL DESK (Terminal & Contact) */}
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
                  className={`absolute right-3 bottom-16 w-20 h-16 flex flex-col items-center justify-center transition-all duration-500 cursor-pointer ${
                    isOtherFocused ? 'opacity-35 scale-90' : 'opacity-100 scale-100'
                  }`}
                >
                  <div className="relative flex flex-col items-center">
                    {!hasBeenTapped && !focusedObjectId && (
                      <span className="absolute -top-3 w-3.5 h-3.5 rounded-full bg-white animate-ping" />
                    )}
                    {/* Dark Side Table + CRT Monitor */}
                    <div className="w-16 h-11 rounded-lg bg-slate-900 border-2 border-sky-400/80 p-1 flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.4)]">
                      <Terminal size={18} className="text-emerald-400 animate-pulse" />
                    </div>
                    <span className="text-[7.5px] font-bold bg-slate-950 text-emerald-400 border border-emerald-500/40 px-1.5 py-0.5 rounded mt-1 shadow-md">
                      TERMINAL
                    </span>
                  </div>
                </button>
              );
            })()}

            {/* FAILED PROTOTYPES CRATE (Failed) */}
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
                  className={`absolute right-6 bottom-3 w-16 h-12 flex flex-col items-center justify-center transition-all duration-500 cursor-pointer ${
                    isOtherFocused ? 'opacity-35 scale-90' : 'opacity-100 scale-100'
                  }`}
                >
                  <div className="relative flex flex-col items-center">
                    {!hasBeenTapped && !focusedObjectId && (
                      <span className="absolute -top-3 w-3.5 h-3.5 rounded-full bg-amber-500 animate-ping" />
                    )}
                    {/* Wooden Crate with Hazard Stripe Label */}
                    <div className="w-13 h-8 rounded bg-amber-950/90 border-2 border-amber-600 p-0.5 flex items-center justify-center shadow-md">
                      <Flame size={14} className="text-amber-500" />
                    </div>
                    <span className="text-[7px] font-bold bg-slate-950 text-amber-500 border border-amber-600/40 px-1 py-0.5 rounded mt-0.5">
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

      {/* MOBILE BOTTOM SHEET (Slides up in lower ~38% of viewport when an object is tapped) */}
      {focusedObjectId && sheetData && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-sheet-title"
          className="relative w-full bg-[#0b1220] border-t-2 border-sky-500/50 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.9)] p-5 z-40 animate-slide-up flex flex-col justify-between max-h-[42dvh]"
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
