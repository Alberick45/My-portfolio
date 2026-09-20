import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
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
  shortLabel: string;
  placard: string;
  accent: 'cyan' | 'amber' | 'white';
  pos: { x: number; y: number; z: number }; // Ground point + box height
  boxSize: { w: number; d: number; h: number };
  focusTransform: string;
  defaultSide: 'below' | 'left' | 'right' | 'above';
}

export const MOBILE_OBJECTS: MobileObjectConfig[] = [
  {
    id: 'about',
    label: 'Figure at Desk',
    shortLabel: 'About',
    placard: 'ABOUT DOSSIER',
    accent: 'cyan',
    pos: { x: 84, y: 62, z: 28 },
    boxSize: { w: 66, d: 34, h: 28 },
    focusTransform: 'translate3d(0px, 25px, 120px) scale(1.45)',
    defaultSide: 'below'
  },
  {
    id: 'journal',
    label: 'Notebook Table',
    shortLabel: 'Journal',
    placard: 'RESEARCH JOURNAL',
    accent: 'white',
    pos: { x: 40, y: 142, z: 18 },
    boxSize: { w: 46, d: 30, h: 18 },
    focusTransform: 'translate3d(70px, -65px, 130px) scale(1.5)',
    defaultSide: 'right'
  },
  {
    id: 'projects',
    label: 'Glass Cabinet',
    shortLabel: 'Finished',
    placard: 'FINISHED PROJECTS',
    accent: 'cyan',
    pos: { x: 190, y: 8, z: 94 },
    boxSize: { w: 54, d: 40, h: 94 },
    focusTransform: 'translate3d(-90px, 90px, 130px) scale(1.5)',
    defaultSide: 'left'
  },
  {
    id: 'mascot',
    label: 'Mascot Showcase',
    shortLabel: 'OK-02',
    placard: 'MASCOT OK-02',
    accent: 'cyan',
    pos: { x: 16, y: 8, z: 66 },
    boxSize: { w: 36, d: 36, h: 66 },
    focusTransform: 'translate3d(120px, 80px, 130px) scale(1.5)',
    defaultSide: 'right'
  },
  {
    id: 'workstation',
    label: 'Workbench',
    shortLabel: 'Building',
    placard: 'IN-PROGRESS BENCH',
    accent: 'amber',
    pos: { x: 184, y: 78, z: 34 },
    boxSize: { w: 62, d: 112, h: 34 },
    focusTransform: 'translate3d(-85px, -20px, 130px) scale(1.5)',
    defaultSide: 'left'
  },
  {
    id: 'roadmap',
    label: 'Whiteboard',
    shortLabel: 'Roadmap',
    placard: 'ROADMAP & GOALS',
    accent: 'white',
    pos: { x: 74, y: 0, z: 70 },
    boxSize: { w: 84, d: 4, h: 50 },
    focusTransform: 'translate3d(10px, 110px, 110px) scale(1.5)',
    defaultSide: 'below'
  },
  {
    id: 'terminal',
    label: 'CRT Terminal',
    shortLabel: 'Contact',
    placard: 'TERMINAL & CONTACT',
    accent: 'white',
    pos: { x: 192, y: 204, z: 56 },
    boxSize: { w: 44, d: 32, h: 56 },
    focusTransform: 'translate3d(-80px, -90px, 130px) scale(1.5)',
    defaultSide: 'left'
  },
  {
    id: 'failed',
    label: 'Failed Crate',
    shortLabel: 'Failed',
    placard: 'FAILED CRATE',
    accent: 'amber',
    pos: { x: 18, y: 196, z: 18 },
    boxSize: { w: 36, d: 28, h: 18 },
    focusTransform: 'translate3d(100px, -100px, 130px) scale(1.5)',
    defaultSide: 'right'
  }
];

// PROBLEM 1: EXACT 3D Box Helper Component Bx
interface BxProps {
  x: number;
  y: number;
  w: number;
  d: number;
  h: number;
  color: string;
  z?: number;
  frontColor?: string;
  children?: React.ReactNode;
}

const Bx: React.FC<BxProps> = ({
  x, y, w, d, h, color, z = 0, frontColor, children
}) => {
  return (
    <div
      className="bx"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${w}px`,
        height: `${d}px`,
        transform: `translateZ(${z}px)`,
        '--c': color,
        '--fc': frontColor || color,
      } as React.CSSProperties}
    >
      {/* Top face (lighter) */}
      <div className="p t" style={{ width: `${w}px`, height: `${d}px`, transform: `translateZ(${h}px)` }} />
      {/* Front face (mid) */}
      <div className="p f" style={{ top: `${d - h}px`, width: `${w}px`, height: `${h}px`, transformOrigin: '0 100%', transform: 'rotateX(-90deg)' }} />
      {/* Left face (darker) */}
      <div className="p l" style={{ width: `${h}px`, height: `${d}px`, transformOrigin: '0 0', transform: 'rotateY(-90deg)' }} />
      {children}
    </div>
  );
};

export const MobileWorkshopStage: React.FC<MobileWorkshopStageProps> = ({ onOpenTerminal }) => {
  const roomRef = useRef<HTMLDivElement>(null);
  const [scaleS, setScaleS] = useState(1);
  const [measuredBounds, setMeasuredBounds] = useState<{ width: number; height: number }>({ width: 350, height: 260 });
  const [focusedObjectId, setFocusedObjectId] = useState<string | null>(null);
  const [hasTapped, setHasTapped] = useState(false);
  const [tappedObjects, setTappedObjects] = useState<Set<string>>(new Set());
  const [dragRotZ, setDragRotZ] = useState(0);
  const [isIntroLoaded, setIsIntroLoaded] = useState(false);

  // Label Collision State
  const [labelSides, setLabelSides] = useState<Record<string, 'below' | 'left' | 'right' | 'above'>>(() => {
    const initial: Record<string, 'below' | 'left' | 'right' | 'above'> = {};
    MOBILE_OBJECTS.forEach(obj => { initial[obj.id] = obj.defaultSide; });
    return initial;
  });

  const labelRefs = useRef<Record<string, HTMLSpanElement | null>>({});
  const touchStartX = useRef<number | null>(null);

  // Full Technical Modal State
  const [modalState, setModalState] = useState<ModalData>({
    isOpen: false,
    title: '',
    summary: '',
  });

  const closeModal = useCallback(() => setModalState((prev) => ({ ...prev, isOpen: false })), []);

  // PROBLEM 4: Measure, don't guess! Dynamic viewport bounding box calculation
  const updateScaleAndBounds = useCallback(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    
    // Target maximums: 92% viewport width, 58% viewport height
    const targetW = vw * 0.92;
    const targetH = vh * 0.58;

    if (roomRef.current) {
      const rect = roomRef.current.getBoundingClientRect();
      const currentScale = scaleS || 1;
      const unscaledW = rect.width / currentScale;
      const unscaledH = rect.height / currentScale;

      const calcScale = Math.min(targetW / Math.max(unscaledW, 320), targetH / Math.max(unscaledH, 240), 2.2);
      setScaleS(calcScale);
      setMeasuredBounds({ width: Math.round(rect.width), height: Math.round(rect.height) });
    } else {
      const calcScale = Math.min(targetW / 350, targetH / 260, 2.2);
      setScaleS(calcScale);
    }
  }, [scaleS]);

  useLayoutEffect(() => {
    updateScaleAndBounds();
    window.addEventListener('resize', updateScaleAndBounds);
    window.addEventListener('orientationchange', updateScaleAndBounds);
    return () => {
      window.removeEventListener('resize', updateScaleAndBounds);
      window.removeEventListener('orientationchange', updateScaleAndBounds);
    };
  }, [updateScaleAndBounds]);

  // PROBLEM 3: Collision Pass for Labels
  useLayoutEffect(() => {
    const checkLabelCollisions = () => {
      const nodes = Object.entries(labelRefs.current);
      const rects: { id: string; rect: DOMRect }[] = [];
      
      nodes.forEach(([id, el]) => {
        if (el) {
          rects.push({ id, rect: el.getBoundingClientRect() });
        }
      });

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const margin = 8;
      const updated = { ...labelSides };
      let changed = false;

      rects.forEach(({ id, rect }) => {
        let currentSide = updated[id] || 'below';
        const isOutOfBounds = rect.left < margin || rect.right > vw - margin || rect.top < margin || rect.bottom > vh - margin;
        
        const overlaps = rects.some(other => {
          if (other.id === id) return false;
          return !(
            rect.right < other.rect.left ||
            rect.left > other.rect.right ||
            rect.bottom < other.rect.top ||
            rect.top > other.rect.bottom
          );
        });

        if (isOutOfBounds || overlaps) {
          const cycle: ('below' | 'left' | 'right' | 'above')[] = ['left', 'right', 'below', 'above'];
          const nextSide = cycle[(cycle.indexOf(currentSide) + 1) % cycle.length];
          updated[id] = nextSide;
          changed = true;
        }
      });

      if (changed) {
        setLabelSides(updated);
      }
    };

    const timer = setTimeout(checkLabelCollisions, 100);
    return () => clearTimeout(timer);
  }, [scaleS, labelSides]);

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

  // Active sheet content mapping
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
      {/* Dynamic Keyframes and Mandatory CSS Rule from Prompt */}
      <style>{`
        .bx, .g, #room { transform-style: preserve-3d; }
        .p, .bx { position: absolute; }
        .t { background: linear-gradient(rgba(255,255,255,0.15), rgba(255,255,255,0.15)), var(--c); }
        .f { background: linear-gradient(rgba(0,0,0,0.12), rgba(0,0,0,0.12)), var(--fc, var(--c)); }
        .l { background: linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), var(--c); }

        @keyframes mascotHeadTurn {
          0%, 100% { transform: rotate(0deg); }
          40%, 60% { transform: rotate(-10deg); }
          70%, 90% { transform: rotate(10deg); }
        }
        @keyframes solderGlow {
          0%, 100% { opacity: 0.6; filter: drop-shadow(0 0 2px #f97316); }
          50% { opacity: 1; filter: drop-shadow(0 0 6px #ea580c); }
        }
        .animate-mascot-head {
          animation: mascotHeadTurn 6s ease-in-out infinite;
          transform-origin: 50% 70%;
        }
        .animate-solder-glow {
          animation: solderGlow 2.5s ease-in-out infinite;
        }
      `}</style>

      {/* Blueprint grid background */}
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
            top: '38%', // Upper 60% of viewport
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
            ref={roomRef}
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
                  radial-gradient(circle at 50% 40%, rgba(251, 191, 36, 0.14) 0%, transparent 70%),
                  linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
                `,
                backgroundSize: '100% 100%, 25px 25px, 25px 25px',
                boxShadow: 'inset 0 0 40px rgba(0,0,0,0.85)',
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

              {/* Hazard Edge Strip (x=0) */}
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

              {/* Hazard Edge Strip (y=250) */}
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

            {/* PROBLEM 4 FIX: WALL A LOWERED TO 90px HEIGHT (Back Left, y=0) */}
            <div
              style={{
                position: 'absolute',
                width: '250px',
                height: '90px',
                left: 0,
                top: '-90px',
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
                  left: '12px',
                  top: '8px',
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
                  top: '10px',
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

              {/* Tool Silhouettes */}
              <div style={{ position: 'absolute', left: '165px', top: '35px', opacity: 0.6 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
              </div>

              {/* Whiteboard on Wall A (Roadmap) */}
              <div
                style={{
                  position: 'absolute',
                  left: '74px',
                  top: '16px',
                  width: '84px',
                  height: '50px',
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

            {/* PROBLEM 4 FIX: WALL B LOWERED TO 90px HEIGHT (Back Right, x=250) */}
            <div
              style={{
                position: 'absolute',
                width: '250px',
                height: '90px',
                left: '250px',
                top: '-90px',
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
              <div style={{ position: 'absolute', bottom: 0, insetX: 0, height: '30px', background: '#090d16', borderTop: '1px solid #1e293b' }} />
              <div style={{ position: 'absolute', left: '30px', top: '20px', opacity: 0.5, display: 'flex', gap: '12px' }}>
                <div style={{ width: '3px', height: '22px', background: '#64748b' }} />
                <div style={{ width: '4px', height: '18px', background: '#64748b' }} />
                <div style={{ width: '3px', height: '26px', background: '#64748b' }} />
              </div>
            </div>


            {/* PROBLEM 1: OBJECTS BUILT ENTIRELY FROM Bx HELPER WITH 3 SHADED FACES */}

            {/* OBJECT 1: MASCOT SHOWCASE (Plinth + Glass Box + Robot Billboard) */}
            <div style={{ '--o': focusedObjectId === 'mascot' || !focusedObjectId ? 1 : 0.28 } as React.CSSProperties}>
              {/* Plinth Box (h=16) */}
              <Bx x={16} y={8} w={36} d={36} h={16} color="#0f172a" frontColor="#020617" />
              {/* Glass Case Box (h=50, z=16) */}
              <Bx x={16} y={8} w={36} d={36} h={50} z={16} color="rgba(56,189,248,0.2)" frontColor="rgba(56,189,248,0.3)" />
              {/* Animated Robot Mascot Billboard */}
              <div
                style={{
                  position: 'absolute',
                  left: '34px',
                  top: '26px',
                  width: '26px',
                  height: '36px',
                  transformOrigin: '50% 100%',
                  transform: 'translateZ(16px) rotateZ(45deg) rotateX(-58deg)',
                  transformStyle: 'preserve-3d',
                  pointerEvents: 'none',
                }}
              >
                <svg width="26" height="36" viewBox="0 0 32 44" fill="none" className="drop-shadow-[0_0_6px_#38bdf8]">
                  <g className="animate-mascot-head">
                    <rect x="8" y="4" width="16" height="12" rx="3" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
                    <circle cx="12" cy="10" r="2.5" fill="#38bdf8" />
                    <circle cx="20" cy="10" r="2.5" fill="#38bdf8" />
                    <rect x="14" y="0" width="4" height="4" fill="#fbbf24" />
                  </g>
                  <rect x="6" y="18" width="20" height="18" rx="4" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
                  <circle cx="16" cy="27" r="2.5" fill="#4ade80" />
                </svg>
              </div>
            </div>

            {/* OBJECT 2: FINISHED PROJECTS GLASS CABINET (Plinth + Translucent Cabinet + Cubes) */}
            <div style={{ '--o': focusedObjectId === 'projects' || !focusedObjectId ? 1 : 0.28 } as React.CSSProperties}>
              {/* Plinth Base Box (h=14) */}
              <Bx x={190} y={8} w={54} d={40} h={14} color="#0f172a" frontColor="#020617" />
              {/* Glass Cabinet Box (h=80, z=14) */}
              <Bx x={190} y={8} w={54} d={40} h={80} z={14} color="rgba(56,189,248,0.22)" frontColor="rgba(56,189,248,0.32)" />
              {/* Internal Glowing Artifact Cubes */}
              <Bx x={200} y={18} w={14} d={14} h={14} z={22} color="#38bdf8" frontColor="#0284c7" />
              <Bx x={222} y={22} w={14} d={14} h={14} z={54} color="#4ade80" frontColor="#16a34a" />
            </div>

            {/* OBJECT 3: LONG WORKBENCH (Mat + PCB + Breadboard + Multimeter + Soldering Iron) */}
            <div style={{ '--o': focusedObjectId === 'workstation' || !focusedObjectId ? 1 : 0.28 } as React.CSSProperties}>
              {/* Main Workbench Frame Box (h=34) */}
              <Bx x={184} y={78} w={62} d={112} h={34} color="#064e3b" frontColor="#1e293b" />
              {/* Green PCB Box */}
              <Bx x={194} y={90} w={24} d={32} h={4} z={34} color="#15803d" frontColor="#166534" />
              {/* White Breadboard Box */}
              <Bx x={222} y={100} w={18} d={26} h={5} z={34} color="#f8fafc" frontColor="#cbd5e1" />
              {/* Yellow Multimeter Box */}
              <Bx x={196} y={135} w={14} d={20} h={8} z={34} color="#eab308" frontColor="#ca8a04" />
              {/* Soldering Iron Stand Box */}
              <Bx x={224} y={160} w={12} d={16} h={8} z={34} color="#334155" frontColor="#1e293b" />
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
                  transform: 'translateZ(43px)',
                  transformStyle: 'preserve-3d',
                }}
              />
            </div>

            {/* OBJECT 4: DESK, LAPTOP, CHAIR & SEATED CHARACTER */}
            <div style={{ '--o': focusedObjectId === 'about' || !focusedObjectId ? 1 : 0.28 } as React.CSSProperties}>
              {/* Desk Top Box (h=28) */}
              <Bx x={84} y={62} w={66} d={34} h={28} color="#78350f" frontColor="#451a03" />
              {/* Laptop Base Box (h=3, z=28) */}
              <Bx x={104} y={70} w={20} d={14} h={3} z={28} color="#334155" frontColor="#1e293b" />
              {/* Upright Laptop Screen Box with Glowing Cyan Front Face (--fc: #00f0ff) */}
              <Bx x={104} y={70} w={20} d={3} h={14} z={31} color="#0f172a" frontColor="#00f0ff" />
              {/* Chair Seat Box (h=14) */}
              <Bx x={108} y={86} w={20} d={18} h={14} color="#1e293b" frontColor="#0f172a" />
              {/* Seated Person SVG Billboard */}
              <div
                style={{
                  position: 'absolute',
                  left: '114px',
                  top: '88px',
                  width: '30px',
                  height: '42px',
                  transformOrigin: '50% 100%',
                  transform: 'translateZ(14px) rotateZ(45deg) rotateX(-58deg)',
                  transformStyle: 'preserve-3d',
                  pointerEvents: 'none',
                }}
              >
                <svg width="30" height="42" viewBox="0 0 32 46" fill="none">
                  <path d="M6 18 C6 10, 26 10, 26 18" stroke="#38bdf8" strokeWidth="2.5" fill="none" />
                  <circle cx="16" cy="14" r="7" fill="#78350f" stroke="#fde047" strokeWidth="1" />
                  <path d="M8 24 C8 20, 24 20, 24 24 L26 44 L6 44 Z" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.2" />
                  <path d="M8 26 L14 34 L20 34 L24 26" stroke="#94a3b8" strokeWidth="2" fill="none" />
                </svg>
              </div>
            </div>

            {/* OBJECT 5: NOTEBOOK TABLE & STACKED NOTEBOOKS */}
            <div style={{ '--o': focusedObjectId === 'journal' || !focusedObjectId ? 1 : 0.28 } as React.CSSProperties}>
              {/* Table Box (h=18) */}
              <Bx x={40} y={142} w={46} d={30} h={18} color="#475569" frontColor="#334155" />
              {/* 3 Stacked Colored Notebook Boxes */}
              <Bx x={48} y={148} w={18} d={16} h={4} z={18} color="#38bdf8" />
              <Bx x={50} y={150} w={18} d={16} h={4} z={22} color="#f59e0b" />
              <Bx x={46} y={152} w={18} d={16} h={4} z={26} color="#a855f7" />
            </div>

            {/* OBJECT 6: WOODEN CRATE & BROKEN PCB */}
            <div style={{ '--o': focusedObjectId === 'failed' || !focusedObjectId ? 1 : 0.28 } as React.CSSProperties}>
              {/* Crate Box (h=14) */}
              <Bx x={18} y={196} w={36} d={28} h={14} color="#78350f" frontColor="#451a03" />
              {/* Broken PCB Box (h=4, z=14) */}
              <Bx x={24} y={202} w={18} d={14} h={4} z={14} color="#991b1b" frontColor="#7f1d1d" />
            </div>

            {/* OBJECT 7: CRT TERMINAL ON STAND */}
            <div style={{ '--o': focusedObjectId === 'terminal' || !focusedObjectId ? 1 : 0.28 } as React.CSSProperties}>
              {/* Stand Box (h=30) */}
              <Bx x={192} y={204} w={44} d={32} h={30} color="#334155" frontColor="#1e293b" />
              {/* CRT Monitor Box with Green Glowing Front Face (--fc: #00ff66) */}
              <Bx x={196} y={208} w={36} d={24} h={26} z={30} color="#1e293b" frontColor="#00ff66" />
            </div>


            {/* PROBLEM 2 & 3: HOTSPOTS ANCHORED AT OBJECT GROUND POINT & NON-OVERLAPPING LABELS */}
            {MOBILE_OBJECTS.map((obj) => {
              const isFocused = focusedObjectId === obj.id;
              const hasBeenTapped = tappedObjects.has(obj.id);
              const accentColor = obj.accent === 'cyan' ? '#38bdf8' : obj.accent === 'amber' ? '#f59e0b' : '#f8fafc';
              
              // Ground center point
              const cx = obj.pos.x + obj.boxSize.w / 2;
              const cy = obj.pos.y + obj.boxSize.d / 2;
              const totalBoxH = obj.boxSize.h;
              
              // Height of hotspot button in billboard space (~0.85 * totalBoxH)
              const buttonH = Math.max(44, Math.round(totalBoxH * 0.85));
              const currentSide = labelSides[obj.id] || obj.defaultSide;

              return (
                <div
                  key={obj.id}
                  style={{
                    position: 'absolute',
                    left: `${cx}px`,
                    top: `${cy}px`,
                    transformOrigin: '50% 100%',
                    transform: `translateZ(0px) rotateZ(45deg) rotateX(-58deg)`,
                    transformStyle: 'preserve-3d',
                    zIndex: 50,
                  }}
                >
                  {/* Invisible Button Anchored at Bottom-Centre Ground Point */}
                  <button
                    type="button"
                    aria-label={obj.placard}
                    onClick={() => handleObjectTap(obj.id)}
                    style={{
                      position: 'relative',
                      width: '44px',
                      height: `${buttonH}px`,
                      transform: 'translate(-50%, -100%)',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                  >
                    {/* Pulsing Dot at TOP-CENTRE of Button (Visually rests on top of the 3D box) */}
                    <div 
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {!hasBeenTapped && !focusedObjectId && (
                        <span 
                          className="absolute w-4 h-4 rounded-full animate-ping opacity-75"
                          style={{ backgroundColor: accentColor }}
                        />
                      )}
                      <span 
                        className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]"
                        style={{ backgroundColor: accentColor, color: accentColor }}
                      />
                    </div>
                  </button>

                  {/* PROBLEM 3: Max 10 Char One-Line Label Belonging to Dot/Ground Point */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      pointerEvents: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transform: currentSide === 'left' 
                        ? `translate(calc(-100% - 6px), -${buttonH}px)` 
                        : currentSide === 'right'
                        ? `translate(6px, -${buttonH}px)`
                        : currentSide === 'above'
                        ? `translate(-50%, -${buttonH + 16}px)`
                        : `translate(-50%, 6px)`, // 'below' ground point
                    }}
                  >
                    <span 
                      ref={el => labelRefs.current[obj.id] = el}
                      className="text-[8px] font-bold font-mono-tech px-1.5 py-0.5 rounded shadow-md uppercase tracking-wider whitespace-nowrap"
                      style={{
                        background: '#030712',
                        color: accentColor,
                        border: `1px solid ${accentColor}88`,
                        fontSize: '8px',
                        lineHeight: '1',
                        maxWidth: '80px',
                      }}
                    >
                      {obj.shortLabel}
                    </span>
                  </div>
                </div>
              );
            })}

          </div>
        </div>
      </div>

      {/* Faint hint line at bottom */}
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
