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
    pos: { x: 117, y: 79, z: 36 },
    focusTransform: 'translate3d(0px, 25px, 120px) scale(1.45)'
  },
  {
    id: 'journal',
    label: 'Notebook Table',
    placard: 'RESEARCH JOURNAL',
    accent: 'white',
    pos: { x: 63, y: 157, z: 26 },
    focusTransform: 'translate3d(70px, -65px, 130px) scale(1.5)'
  },
  {
    id: 'projects',
    label: 'Glass Cabinet',
    placard: 'FINISHED PROJECTS',
    accent: 'cyan',
    pos: { x: 217, y: 28, z: 95 },
    focusTransform: 'translate3d(-90px, 90px, 130px) scale(1.5)'
  },
  {
    id: 'mascot',
    label: 'Mascot Showcase',
    placard: 'MASCOT OK-02',
    accent: 'cyan',
    pos: { x: 34, y: 26, z: 70 },
    focusTransform: 'translate3d(120px, 80px, 130px) scale(1.5)'
  },
  {
    id: 'workstation',
    label: 'Workbench',
    placard: 'IN-PROGRESS BENCH',
    accent: 'amber',
    pos: { x: 215, y: 134, z: 35 },
    focusTransform: 'translate3d(-85px, -20px, 130px) scale(1.5)'
  },
  {
    id: 'roadmap',
    label: 'Whiteboard',
    placard: 'ROADMAP & GOALS',
    accent: 'white',
    pos: { x: 116, y: 0, z: 70 },
    focusTransform: 'translate3d(10px, 110px, 110px) scale(1.5)'
  },
  {
    id: 'terminal',
    label: 'CRT Terminal',
    placard: 'TERMINAL & CONTACT',
    accent: 'white',
    pos: { x: 214, y: 220, z: 62 },
    focusTransform: 'translate3d(-80px, -90px, 130px) scale(1.5)'
  },
  {
    id: 'failed',
    label: 'Failed Crate',
    placard: 'FAILED CRATE',
    accent: 'amber',
    pos: { x: 36, y: 210, z: 30 },
    focusTransform: 'translate3d(100px, -100px, 130px) scale(1.5)'
  }
];

// Helper component to construct a real 3D Box with Top, Front, and Left faces
interface Box3DProps {
  x: number;
  y: number;
  w: number;
  d: number;
  h: number;
  topBg: string;
  frontBg: string;
  leftBg: string;
  zOffset?: number;
  children?: React.ReactNode;
}

const Box3D: React.FC<Box3DProps> = ({
  x, y, w, d, h, topBg, frontBg, leftBg, zOffset = 0, children
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        width: `${w}px`,
        height: `${d}px`,
        transformStyle: 'preserve-3d',
        transform: zOffset ? `translateZ(${zOffset}px)` : undefined,
      }}
    >
      {/* Top face */}
      <div
        style={{
          position: 'absolute',
          width: `${w}px`,
          height: `${d}px`,
          left: 0,
          top: 0,
          transform: `translateZ(${h}px)`,
          background: topBg,
          opacity: 'var(--o, 1)',
          transformStyle: 'preserve-3d',
        }}
      />
      {/* Front face (+y) */}
      <div
        style={{
          position: 'absolute',
          width: `${w}px`,
          height: `${h}px`,
          left: 0,
          top: `${d - h}px`,
          transformOrigin: '0 100%',
          transform: 'rotateX(-90deg)',
          background: frontBg,
          opacity: 'var(--o, 1)',
          transformStyle: 'preserve-3d',
        }}
      />
      {/* Left face (-x) */}
      <div
        style={{
          position: 'absolute',
          width: `${h}px`,
          height: `${d}px`,
          left: 0,
          top: 0,
          transformOrigin: '0 0',
          transform: 'rotateY(-90deg)',
          background: leftBg,
          opacity: 'var(--o, 1)',
          transformStyle: 'preserve-3d',
        }}
      />
      {children}
    </div>
  );
};

export const MobileWorkshopStage: React.FC<MobileWorkshopStageProps> = ({ onOpenTerminal }) => {
  // Scale calculation: --s = min(viewportWidth / 380, viewportHeight / 640, 2.2)
  const [scaleS, setScaleS] = useState(1);
  const [focusedObjectId, setFocusedObjectId] = useState<string | null>(null);
  const [hasTapped, setHasTapped] = useState(false);
  const [tappedObjects, setTappedObjects] = useState<Set<string>>(new Set());
  const [dragRotZ, setDragRotZ] = useState(0);
  const [isIntroLoaded, setIsIntroLoaded] = useState(false);

  const touchStartX = useRef<number | null>(null);

  // Full Technical Modal State
  const [modalState, setModalState] = useState<ModalData>({
    isOpen: false,
    title: '',
    summary: '',
  });

  const closeModal = useCallback(() => setModalState((prev) => ({ ...prev, isOpen: false })), []);

  // Update room scale on resize
  useEffect(() => {
    const updateScale = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const s = Math.min(vw / 380, vh / 640, 2.2);
      setScaleS(s);
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  // Intro animation trigger
  useEffect(() => {
    const timer = setTimeout(() => setIsIntroLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Android back button & Escape handling
  useEffect(() => {
    if (focusedObjectId) {
      window.history.pushState({ mobileFocus: focusedObjectId }, '');
    }

    const handlePopState = () => {
      if (focusedObjectId) {
        setFocusedObjectId(null);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (modalState.isOpen) {
          closeModal();
        } else if (focusedObjectId) {
          setFocusedObjectId(null);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [focusedObjectId, modalState.isOpen, closeModal]);

  // Touch parallax drag handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartX.current = e.touches[0].clientX;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current !== null && e.touches.length === 1) {
      const deltaX = e.touches[0].clientX - touchStartX.current;
      const clamped = Math.max(-12, Math.min(12, deltaX * 0.12));
      setDragRotZ(clamped);
    }
  };

  const handleTouchEnd = () => {
    touchStartX.current = null;
    setDragRotZ(0);
  };

  const handleObjectTap = (id: string) => {
    if (navigator.vibrate) {
      try { navigator.vibrate(8); } catch (_) {}
    }
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
      {/* Dynamic Keyframes for Idle Life & Mascot Animations */}
      <style>{`
        @keyframes mascotHeadTurn {
          0%, 100% { transform: rotate(0deg); }
          40%, 60% { transform: rotate(-10deg); }
          70%, 90% { transform: rotate(10deg); }
        }
        @keyframes solderGlow {
          0%, 100% { opacity: 0.6; filter: drop-shadow(0 0 2px #f97316); }
          50% { opacity: 1; filter: drop-shadow(0 0 6px #ea580c); }
        }
        @keyframes screenFlicker {
          0%, 100% { opacity: 0.92; }
          48% { opacity: 1; }
          50% { opacity: 0.75; }
          52% { opacity: 0.98; }
        }
        .animate-mascot-head {
          animation: mascotHeadTurn 6s ease-in-out infinite;
          transform-origin: 50% 70%;
        }
        .animate-solder-glow {
          animation: solderGlow 2.5s ease-in-out infinite;
        }
        .animate-screen-flicker {
          animation: screenFlicker 4s ease-in-out infinite;
        }
      `}</style>

      {/* Background blueprint grid pattern */}
      <div className="absolute inset-0 bg-blueprint-grid opacity-15 pointer-events-none" />

      {/* 1. THE ENGINE (#stage) */}
      <div 
        id="stage"
        className="fixed inset-0"
        style={{
          perspective: '1800px',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* #world */}
        <div
          id="world"
          className="transition-transform duration-700 ease-out"
          style={{
            position: 'absolute',
            left: '50%',
            top: '44%',
            width: 0,
            height: 0,
            transformStyle: 'preserve-3d',
            transform: focusedConfig
              ? `${focusedConfig.focusTransform} rotateZ(${dragRotZ}deg)`
              : `scale(${scaleS * (isIntroLoaded ? 1 : 0.7)}) rotateX(58deg) rotateZ(${-45 + dragRotZ}deg)`,
            opacity: isIntroLoaded ? 1 : 0,
            transition: 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1), opacity 1200ms ease-out',
          }}
        >
          {/* #room: 250x250, left/top -125px */}
          <div
            id="room"
            style={{
              position: 'absolute',
              width: '250px',
              height: '250px',
              left: '-125px',
              top: '-125px',
              transformStyle: 'preserve-3d',
            }}
          >

            {/* 2. THE ROOM SHELL (Five Real 3D Planes) */}

            {/* FLOOR PLANE (250x250) */}
            <div
              style={{
                position: 'absolute',
                width: '250px',
                height: '250px',
                left: 0,
                top: 0,
                transformStyle: 'preserve-3d',
                background: '#141a26',
                backgroundImage: `
                  radial-gradient(circle at 50% 40%, rgba(251, 191, 36, 0.12) 0%, transparent 70%),
                  linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
                `,
                backgroundSize: '100% 100%, 25px 25px, 25px 25px',
                boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8)',
              }}
            >
              {/* Cyan glow plane under Finished Projects Cabinet */}
              <div
                style={{
                  position: 'absolute',
                  left: '185px',
                  top: '5px',
                  width: '64px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(56, 189, 248, 0.35) 0%, transparent 70%)',
                  transform: 'translateZ(0.2px)',
                  transformStyle: 'preserve-3d',
                }}
              />

              {/* Amber glow plane under Workbench */}
              <div
                style={{
                  position: 'absolute',
                  left: '175px',
                  top: '70px',
                  width: '75px',
                  height: '125px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(245, 158, 11, 0.3) 0%, transparent 70%)',
                  transform: 'translateZ(0.2px)',
                  transformStyle: 'preserve-3d',
                }}
              />

              {/* Front Floor Edge Hazard Strip (x=0) */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: '4px',
                  height: '250px',
                  transform: 'translateZ(0.6px)',
                  background: 'repeating-linear-gradient(45deg, #000, #000 6px, #eab308 6px, #eab308 12px)',
                  transformStyle: 'preserve-3d',
                }}
              />

              {/* Front Floor Edge Hazard Strip (y=250) */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: '246px',
                  width: '250px',
                  height: '4px',
                  transform: 'translateZ(0.6px)',
                  background: 'repeating-linear-gradient(45deg, #000, #000 6px, #eab308 6px, #eab308 12px)',
                  transformStyle: 'preserve-3d',
                }}
              />
            </div>

            {/* WALL A (Back Left, y=0): width 250, height 120, left 0, top -120 */}
            <div
              style={{
                position: 'absolute',
                width: '250px',
                height: '120px',
                left: 0,
                top: '-120px',
                transformOrigin: '0 100%',
                transform: 'rotateX(-90deg)',
                transformStyle: 'preserve-3d',
                background: '#0f172a',
                backgroundImage: `
                  linear-gradient(180deg, #1e293b 0%, #0f172a 60%, #090d16 100%),
                  radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)
                `,
                backgroundSize: '100% 100%, 12px 12px',
                borderBottom: '2px solid #334155',
              }}
            >
              {/* Signboard on Wall A */}
              <div 
                style={{
                  position: 'absolute',
                  left: '15px',
                  top: '12px',
                  padding: '2px 6px',
                  background: '#020617',
                  border: '1px solid #eab308',
                  borderRadius: '3px',
                  color: '#eab308',
                  fontSize: '6px',
                  fontWeight: 'bold',
                  letterSpacing: '0.8px',
                }}
              >
                BUILD · BREAK · LEARN · REPEAT
              </div>

              {/* Wall Clock */}
              <div 
                style={{
                  position: 'absolute',
                  left: '215px',
                  top: '14px',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  border: '1.5px solid #38bdf8',
                  background: '#090d16',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div style={{ width: '4px', height: '1.5px', background: '#38bdf8', transform: 'rotate(45deg)' }} />
              </div>

              {/* Pegboard Tool Silhouettes */}
              <div style={{ position: 'absolute', left: '165px', top: '45px', opacity: 0.6 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
              </div>

              {/* Interactive Whiteboard on Wall A (Roadmap) */}
              <div
                style={{
                  position: 'absolute',
                  left: '74px',
                  top: '24px', // z=44 to z=96 (height 52)
                  width: '84px',
                  height: '52px',
                  background: '#f8fafc',
                  border: '2px solid #94a3b8',
                  borderRadius: '4px',
                  padding: '4px',
                  boxShadow: '0 0 10px rgba(255,255,255,0.2)',
                  '--o': focusedObjectId === 'roadmap' || !focusedObjectId ? 1 : 0.28,
                } as React.CSSProperties}
              >
                <div style={{ fontSize: '6px', fontWeight: 'bold', color: '#0f172a', marginBottom: '2px' }}>
                  2026 ROADMAP
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
                  <div style={{ background: '#fef08a', height: '14px', borderRadius: '2px', padding: '1px', fontSize: '5px', color: '#854d0e', fontWeight: 'bold' }}>Q1: IoT</div>
                  <div style={{ background: '#bae6fd', height: '14px', borderRadius: '2px', padding: '1px', fontSize: '5px', color: '#0369a1', fontWeight: 'bold' }}>Q2: Robot</div>
                  <div style={{ background: '#fecdd3', height: '14px', borderRadius: '2px', padding: '1px', fontSize: '5px', color: '#be123c', fontWeight: 'bold' }}>Q3: ML</div>
                  <div style={{ background: '#a7f3d0', height: '14px', borderRadius: '2px', padding: '1px', fontSize: '5px', color: '#047857', fontWeight: 'bold' }}>Q4: OSS</div>
                </div>
              </div>
            </div>

            {/* WALL B (Back Right, x=250): width 250, height 120, left 250, top -120 */}
            <div
              style={{
                position: 'absolute',
                width: '250px',
                height: '120px',
                left: '250px',
                top: '-120px',
                transformOrigin: '0 100%',
                transform: 'rotateZ(90deg) rotateX(-90deg)',
                transformStyle: 'preserve-3d',
                background: '#0f172a',
                backgroundImage: `
                  linear-gradient(180deg, #1e293b 0%, #0f172a 60%, #090d16 100%),
                  radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)
                `,
                backgroundSize: '100% 100%, 12px 12px',
                borderBottom: '2px solid #334155',
              }}
            >
              {/* Lower darker band */}
              <div style={{ position: 'absolute', bottom: 0, insetX: 0, height: '40px', background: '#090d16', borderTop: '1px solid #1e293b' }} />
              {/* Tool Rack silhouettes on Wall B */}
              <div style={{ position: 'absolute', left: '30px', top: '25px', opacity: 0.5, display: 'flex', gap: '12px' }}>
                <div style={{ width: '3px', height: '24px', background: '#64748b' }} />
                <div style={{ width: '4px', height: '20px', background: '#64748b' }} />
                <div style={{ width: '3px', height: '28px', background: '#64748b' }} />
              </div>
            </div>


            {/* 3. REAL 3D OBJECT ASSEMBLIES */}

            {/* OBJECT 1: MASCOT SHOWCASE (Wall A x 16-52 | y 8-44 | w 36, d 36) */}
            <div 
              style={{ 
                '--o': focusedObjectId === 'mascot' || !focusedObjectId ? 1 : 0.28 
              } as React.CSSProperties}
            >
              {/* Showcase Plinth Box (h=16) */}
              <Box3D 
                x={16} y={8} w={36} d={36} h={16}
                topBg="linear-gradient(135deg, #1e293b, #0f172a)"
                frontBg="linear-gradient(180deg, #0f172a, #020617)"
                leftBg="linear-gradient(180deg, #090d16, #020617)"
              />
              {/* Glass Case Box (h=50, translateZ=16) */}
              <Box3D 
                x={16} y={8} w={36} d={36} h={50} zOffset={16}
                topBg="rgba(56, 189, 248, 0.2)"
                frontBg="linear-gradient(180deg, rgba(56,189,248,0.25), rgba(56,189,248,0.05))"
                leftBg="linear-gradient(180deg, rgba(56,189,248,0.2), rgba(56,189,248,0.02))"
              />
              {/* Robot Mascot Screen-Facing Billboard (inside showcase) */}
              <div
                style={{
                  position: 'absolute',
                  left: '34px',
                  top: '26px',
                  width: '28px',
                  height: '38px',
                  transformOrigin: '50% 100%',
                  transform: 'translateZ(18px) rotateZ(45deg) rotateX(-58deg)',
                  transformStyle: 'preserve-3d',
                  pointerEvents: 'none',
                }}
              >
                <svg width="28" height="38" viewBox="0 0 32 44" fill="none" className="drop-shadow-[0_0_8px_#38bdf8]">
                  {/* Robot Head with turn animation */}
                  <g className="animate-mascot-head">
                    <rect x="8" y="4" width="16" height="12" rx="3" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
                    <circle cx="12" cy="10" r="2.5" fill="#38bdf8" />
                    <circle cx="20" cy="10" r="2.5" fill="#38bdf8" />
                    <rect x="14" y="0" width="4" height="4" fill="#fbbf24" />
                  </g>
                  {/* Robot Body */}
                  <rect x="6" y="18" width="20" height="18" rx="4" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
                  <rect x="10" y="22" width="12" height="8" rx="1" fill="#020617" stroke="#38bdf8" strokeWidth="0.8" />
                  <circle cx="16" cy="26" r="2" fill="#4ade80" />
                </svg>
              </div>
            </div>


            {/* OBJECT 2: FINISHED-PROJECTS GLASS CABINET (Corner x 190-244, y 8-48 | w 54, d 40, h 90) */}
            <div 
              style={{ 
                '--o': focusedObjectId === 'projects' || !focusedObjectId ? 1 : 0.28 
              } as React.CSSProperties}
            >
              {/* Plinth Base Box (h=14) */}
              <Box3D 
                x={190} y={8} w={54} d={40} h={14}
                topBg="linear-gradient(135deg, #1e293b, #0f172a)"
                frontBg="linear-gradient(180deg, #0f172a, #020617)"
                leftBg="linear-gradient(180deg, #090d16, #020617)"
              />
              {/* Glass Cabinet Frame Box (h=76, zOffset=14) */}
              <Box3D 
                x={190} y={8} w={54} d={40} h={76} zOffset={14}
                topBg="rgba(56, 189, 248, 0.25)"
                frontBg="linear-gradient(180deg, rgba(56,189,248,0.3), rgba(56,189,248,0.08))"
                leftBg="linear-gradient(180deg, rgba(56,189,248,0.2), rgba(56,189,248,0.05))"
              />
              {/* Glowing internal 3D artifact cubes on shelves */}
              <Box3D 
                x={200} y={18} w={14} d={14} h={14} zOffset={22}
                topBg="#38bdf8" frontBg="#0284c7" leftBg="#0369a1"
              />
              <Box3D 
                x={222} y={22} w={14} d={14} h={14} zOffset={52}
                topBg="#4ade80" frontBg="#16a34a" leftBg="#15803d"
              />
            </div>


            {/* OBJECT 3: WORKBENCH (Wall B x 184-246, y 78-190 | w 62, d 112) */}
            <div 
              style={{ 
                '--o': focusedObjectId === 'workstation' || !focusedObjectId ? 1 : 0.28 
              } as React.CSSProperties}
            >
              {/* Workbench Main Frame Box (h=26) */}
              <Box3D 
                x={184} y={78} w={62} d={112} h={26}
                topBg="linear-gradient(135deg, #064e3b, #022c22)" // Green anti-static mat top
                frontBg="linear-gradient(180deg, #1e293b, #0f172a)"
                leftBg="linear-gradient(180deg, #0f172a, #020617)"
              />
              {/* Green PCB on Workbench (h=4, zOffset=26) */}
              <Box3D 
                x={194} y={90} w={24} d={32} h={4} zOffset={26}
                topBg="linear-gradient(135deg, #15803d, #166534)"
                frontBg="#14532d" leftBg="#111827"
              />
              {/* White Breadboard (h=5, zOffset=26) */}
              <Box3D 
                x={222} y={100} w={18} d={26} h={5} zOffset={26}
                topBg="#f8fafc" frontBg="#cbd5e1" leftBg="#94a3b8"
              />
              {/* Yellow Multimeter (h=8, zOffset=26) */}
              <Box3D 
                x={196} y={135} w={14} d={20} h={8} zOffset={26}
                topBg="#eab308" frontBg="#ca8a04" leftBg="#854d0e"
              />
              {/* Soldering Iron Stand with glowing orange tip */}
              <Box3D 
                x={224} y={160} w={12} d={16} h={8} zOffset={26}
                topBg="#334155" frontBg="#1e293b" leftBg="#0f172a"
              />
              {/* Glowing Soldering Tip */}
              <div 
                className="animate-solder-glow"
                style={{
                  position: 'absolute',
                  left: '228px',
                  top: '166px',
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: '#f97316',
                  transform: 'translateZ(35px)',
                  transformStyle: 'preserve-3d',
                }}
              />
            </div>


            {/* OBJECT 4: DESK, CHAIR & SEATED CHARACTER (Center x 84-150, y 62-96 | w 66, d 34) */}
            <div 
              style={{ 
                '--o': focusedObjectId === 'about' || !focusedObjectId ? 1 : 0.28 
              } as React.CSSProperties}
            >
              {/* Wooden Desk Top Box (h=24) */}
              <Box3D 
                x={84} y={62} w={66} d={34} h={24}
                topBg="linear-gradient(135deg, #854d0e, #713f12)"
                frontBg="linear-gradient(180deg, #713f12, #451a03)"
                leftBg="linear-gradient(180deg, #54260d, #271004)"
              />
              {/* Laptop Base Box on Desk (h=3, zOffset=24) */}
              <Box3D 
                x={96} y={70} w={20} d={14} h={3} zOffset={24}
                topBg="#334155" frontBg="#1e293b" leftBg="#0f172a"
              />
              {/* Upright Laptop Screen (h=14, zOffset=27, rotateX -90deg) */}
              <div
                className="animate-screen-flicker"
                style={{
                  position: 'absolute',
                  left: '96px',
                  top: '70px',
                  width: '20px',
                  height: '14px',
                  transformOrigin: '0 0',
                  transform: 'translateZ(27px) rotateX(-90deg)',
                  transformStyle: 'preserve-3d',
                  background: 'linear-gradient(180deg, #38bdf8, #0284c7)',
                  border: '1px solid #0284c7',
                  boxShadow: '0 0 8px #38bdf8',
                }}
              />
              {/* Chair Seat Box (h=14, placed in front of desk) */}
              <Box3D 
                x={106} y={84} w={22} d={18} h={14}
                topBg="#1e293b" frontBg="#0f172a" leftBg="#020617"
              />
              {/* Seated Person Screen-Facing Billboard (Albert) */}
              <div
                style={{
                  position: 'absolute',
                  left: '102px',
                  top: '86px',
                  width: '32px',
                  height: '46px',
                  transformOrigin: '50% 100%',
                  transform: 'translateZ(14px) rotateZ(45deg) rotateX(-58deg)',
                  transformStyle: 'preserve-3d',
                  pointerEvents: 'none',
                }}
              >
                <svg width="32" height="46" viewBox="0 0 32 46" fill="none">
                  {/* Headphones around neck */}
                  <path d="M6 18 C6 10, 26 10, 26 18" stroke="#38bdf8" strokeWidth="2.5" fill="none" />
                  {/* Head */}
                  <circle cx="16" cy="14" r="7" fill="#78350f" stroke="#fde047" strokeWidth="1" />
                  {/* Body / Hoodie */}
                  <path d="M8 24 C8 20, 24 20, 24 24 L26 44 L6 44 Z" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.2" />
                  {/* Seated Arms typing on laptop */}
                  <path d="M8 26 L14 34 L20 34 L24 26" stroke="#94a3b8" strokeWidth="2" fill="none" />
                </svg>
              </div>
            </div>


            {/* OBJECT 5: NOTEBOOK TABLE (Front Left x 40-86, y 142-172 | w 46, d 30) */}
            <div 
              style={{ 
                '--o': focusedObjectId === 'journal' || !focusedObjectId ? 1 : 0.28 
              } as React.CSSProperties}
            >
              {/* Side Table Box (h=18) */}
              <Box3D 
                x={40} y={142} w={46} d={30} h={18}
                topBg="linear-gradient(135deg, #475569, #334155)"
                frontBg="linear-gradient(180deg, #334155, #1e293b)"
                leftBg="linear-gradient(180deg, #1e293b, #0f172a)"
              />
              {/* Stacked Colored Notebooks on Table (h=4 each) */}
              <Box3D 
                x={46} y={148} w={18} d={16} h={4} zOffset={18}
                topBg="#38bdf8" frontBg="#0284c7" leftBg="#0369a1"
              />
              <Box3D 
                x={48} y={150} w={18} d={16} h={4} zOffset={22}
                topBg="#f59e0b" frontBg="#d97706" leftBg="#b45309"
              />
              <Box3D 
                x={45} y={152} w={18} d={16} h={4} zOffset={26}
                topBg="#a855f7" frontBg="#9333ea" leftBg="#7e22ce"
              />
            </div>


            {/* OBJECT 6: FAILED-PROTOTYPES CRATE (Front Left x 18-54, y 196-224 | w 36, d 28) */}
            <div 
              style={{ 
                '--o': focusedObjectId === 'failed' || !focusedObjectId ? 1 : 0.28 
              } as React.CSSProperties}
            >
              {/* Wooden Crate Box (h=22) */}
              <Box3D 
                x={18} y={196} w={36} d={28} h={22}
                topBg="linear-gradient(135deg, #78350f, #451a03)"
                frontBg="repeating-linear-gradient(180deg, #78350f, #78350f 4px, #451a03 4px, #451a03 6px)"
                leftBg="repeating-linear-gradient(180deg, #54260d, #54260d 4px, #271004 4px, #271004 6px)"
              />
              {/* Tilted Broken PCB on crate top */}
              <Box3D 
                x={24} y={202} w={18} d={14} h={3} zOffset={22}
                topBg="linear-gradient(135deg, #15803d, #b91c1c)"
                frontBg="#991b1b" leftBg="#7f1d1d"
              />
            </div>


            {/* OBJECT 7: CRT TERMINAL ON STAND (Front Right x 192-236, y 204-236 | w 44, d 32) */}
            <div 
              style={{ 
                '--o': focusedObjectId === 'terminal' || !focusedObjectId ? 1 : 0.28 
              } as React.CSSProperties}
            >
              {/* Terminal Pedestal Stand Box (h=28) */}
              <Box3D 
                x={192} y={204} w={44} d={32} h={28}
                topBg="linear-gradient(135deg, #334155, #1e293b)"
                frontBg="linear-gradient(180deg, #1e293b, #0f172a)"
                leftBg="linear-gradient(180deg, #0f172a, #020617)"
              />
              {/* CRT Monitor Box (h=26, zOffset=28) */}
              <Box3D 
                x={196} y={208} w={36} d={24} h={26} zOffset={28}
                topBg="#1e293b" 
                frontBg="linear-gradient(180deg, #22c55e, #15803d)" // Glowing Green CRT Screen face (+y)
                leftBg="#0f172a"
              />
            </div>


            {/* 4. SCREEN-FACING INTERACTION BUTTONS & LABELS */}
            {MOBILE_OBJECTS.map((obj) => {
              const isFocused = focusedObjectId === obj.id;
              const hasBeenTapped = tappedObjects.has(obj.id);
              const accentColor = obj.accent === 'cyan' ? '#38bdf8' : obj.accent === 'amber' ? '#f59e0b' : '#f8fafc';

              return (
                <div
                  key={obj.id}
                  style={{
                    position: 'absolute',
                    left: `${obj.pos.x}px`,
                    top: `${obj.pos.y}px`,
                    transformOrigin: '50% 100%',
                    transform: `translateZ(${obj.pos.z}px) rotateZ(45deg) rotateX(-58deg)`,
                    transformStyle: 'preserve-3d',
                    zIndex: 50,
                  }}
                >
                  <button
                    type="button"
                    aria-label={obj.placard}
                    onClick={() => handleObjectTap(obj.id)}
                    style={{
                      minWidth: '48px',
                      minHeight: '48px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      outline: 'none',
                      transform: isFocused ? 'scale(1.15)' : 'scale(1)',
                      transition: 'transform 300ms ease-out',
                    }}
                  >
                    {/* Soft accent pulsing dot (stops pulsing after first tap) */}
                    <div className="relative mb-1 flex items-center justify-center">
                      {!hasBeenTapped && !focusedObjectId && (
                        <span 
                          className="absolute w-5 h-5 rounded-full animate-ping opacity-75"
                          style={{ backgroundColor: accentColor }}
                        />
                      )}
                      <span 
                        className="w-3 h-3 rounded-full shadow-[0_0_8px_currentColor]"
                        style={{ backgroundColor: accentColor, color: accentColor }}
                      />
                    </div>

                    {/* Label Chip Underneath */}
                    <span 
                      className="text-[7.5px] font-bold font-mono-tech px-1.5 py-0.5 rounded shadow-md uppercase tracking-wider whitespace-nowrap"
                      style={{
                        background: '#030712',
                        color: accentColor,
                        border: `1px solid ${accentColor}66`,
                      }}
                    >
                      {obj.placard}
                    </span>
                  </button>
                </div>
              );
            })}

          </div>
        </div>
      </div>

      {/* Faint hint line at bottom (fades after first tap) */}
      {!hasTapped && !focusedObjectId && (
        <div className="fixed bottom-6 inset-x-0 flex flex-col items-center pointer-events-none z-30 animate-pulse text-center">
          <span className="text-[10px] font-mono-tech text-sky-400 uppercase tracking-widest bg-slate-950/80 px-3 py-1 rounded-full border border-sky-500/30 shadow-lg">
            TAP ANY OBJECT TO INSPECT WORKSTATION
          </span>
        </div>
      )}

      {/* MOBILE BOTTOM SHEET */}
      {focusedObjectId && sheetData && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-sheet-title"
          className="fixed bottom-0 inset-x-0 bg-[#0b1220] border-t-2 border-sky-500/60 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.95)] p-5 z-50 animate-slide-up flex flex-col justify-between max-h-[46dvh]"
        >
          {/* Sheet Top Drag Handle Bar */}
          <div 
            onClick={handleCloseSheet}
            className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-3 cursor-pointer hover:bg-sky-400 transition-colors shrink-0" 
          />

          {/* Sheet Header */}
          <div className="flex justify-between items-start border-b border-sky-950 pb-2.5 mb-2 shrink-0">
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

          {/* Sheet Content Body */}
          <div className="overflow-y-auto space-y-2 text-xs font-sans pr-1 flex-1">
            <p className="text-slate-300 leading-relaxed font-medium">
              {sheetData.summary}
            </p>

            {sheetData.bullets && sheetData.bullets.length > 0 && (
              <ul className="space-y-1 font-mono-tech text-[11px] text-slate-300 border-l-2 border-sky-500/40 pl-3 py-0.5">
                {sheetData.bullets.map((b, idx) => (
                  <li key={idx}>• {b}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Bottom Action Bar */}
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

            {/* Action button to open full technical dossier modal */}
            <button
              type="button"
              onClick={sheetData.onOpenFull}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold font-mono-tech text-xs shadow-md transition-all"
            >
              <span>EXPLORE DETAILS</span>
              <ExternalLink size={13} />
            </button>
          </div>
        </div>
      )}

      {/* Full Technical Details Modal */}
      <WorkshopModal data={modalState} onClose={closeModal} />
    </div>
  );
};
