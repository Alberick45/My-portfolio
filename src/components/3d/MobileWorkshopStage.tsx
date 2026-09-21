import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { WORKSHOP_DATA } from '../../config/workshopData';
import { WorkshopModal, ModalData } from './WorkshopModal';
import { ChevronLeft, ChevronRight, X, ExternalLink } from 'lucide-react';

interface MobileWorkshopStageProps {
  onOpenTerminal?: () => void;
}

type Side = 'below' | 'left' | 'right' | 'above';

export interface MobileObjectConfig {
  id: string;
  label: string;
  shortLabel: string;
  placard: string;
  accent: 'cyan' | 'amber' | 'white';
  /** Footprint of the main box (floor coordinates). Used to find the ground centre. */
  pos: { x: number; y: number; z: number };
  boxSize: { w: number; d: number; h: number };
  /** Optional ground point for the hotspot. Defaults to the footprint centre. */
  anchor?: { x: number; y: number };
  /** Hotspot button size in billboard (screen) px. Height ~ 0.85 x object height. */
  hitW: number;
  hitH: number;
  /** Lift the hotspot off the floor (for wall-mounted things). */
  lift?: number;
  defaultSide: Side;
}

export const MOBILE_OBJECTS: MobileObjectConfig[] = [
  {
    id: 'about', label: 'Figure at Desk', shortLabel: 'About', placard: 'ABOUT DOSSIER',
    accent: 'cyan', pos: { x: 84, y: 62, z: 30 }, boxSize: { w: 70, d: 36, h: 30 },
    anchor: { x: 119, y: 108 }, hitW: 56, hitH: 62, defaultSide: 'below',
  },
  {
    id: 'journal', label: 'Notebook Table', shortLabel: 'Journal', placard: 'RESEARCH JOURNAL',
    accent: 'white', pos: { x: 40, y: 142, z: 20 }, boxSize: { w: 48, d: 32, h: 35 },
    hitW: 52, hitH: 44, defaultSide: 'right',
  },
  {
    id: 'projects', label: 'Glass Cabinet', shortLabel: 'Finished', placard: 'FINISHED PROJECTS',
    accent: 'cyan', pos: { x: 190, y: 8, z: 78 }, boxSize: { w: 56, d: 42, h: 78 },
    hitW: 56, hitH: 70, defaultSide: 'left',
  },
  {
    id: 'mascot', label: 'Mascot Showcase', shortLabel: 'OK-02', placard: 'MASCOT OK-02',
    accent: 'cyan', pos: { x: 16, y: 8, z: 72 }, boxSize: { w: 38, d: 38, h: 72 },
    hitW: 44, hitH: 64, defaultSide: 'right',
  },
  {
    id: 'workstation', label: 'Workbench', shortLabel: 'Building', placard: 'IN-PROGRESS BENCH',
    accent: 'amber', pos: { x: 184, y: 78, z: 44 }, boxSize: { w: 66, d: 116, h: 44 },
    hitW: 60, hitH: 42, defaultSide: 'left',
  },
  {
    id: 'roadmap', label: 'Whiteboard', shortLabel: 'Roadmap', placard: 'ROADMAP & GOALS',
    accent: 'white', pos: { x: 74, y: 0, z: 70 }, boxSize: { w: 86, d: 4, h: 52 },
    anchor: { x: 117, y: 1 }, lift: 18, hitW: 70, hitH: 44, defaultSide: 'below',
  },
  {
    id: 'terminal', label: 'CRT Terminal', shortLabel: 'Contact', placard: 'TERMINAL & CONTACT',
    accent: 'white', pos: { x: 192, y: 204, z: 60 }, boxSize: { w: 46, d: 34, h: 60 },
    hitW: 50, hitH: 54, defaultSide: 'left',
  },
  {
    id: 'failed', label: 'Failed Crate', shortLabel: 'Failed', placard: 'FAILED CRATE',
    accent: 'amber', pos: { x: 18, y: 196, z: 25 }, boxSize: { w: 38, d: 30, h: 25 },
    hitW: 44, hitH: 44, defaultSide: 'right',
  },
];

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */
const WALL_H = 90;
// Projected size of floor + both walls at scale 1 (58deg tilt, -45deg turn), with margin.
const ROOM_W = 366;
const ROOM_H = 272;
const DIM = 0.28;
const CAM_ZOOM = 2.2;

/* ------------------------------------------------------------------ */
/* 3D building blocks                                                  */
/* ------------------------------------------------------------------ */
const face = (extra: React.CSSProperties): React.CSSProperties => ({
  position: 'absolute',
  // Dimming is done per-face through the --o custom property set on a <Group>.
  // Never put opacity/filter on a container inside the 3D tree: it flattens the scene.
  opacity: 'var(--o, 1)' as unknown as number,
  pointerEvents: 'none',
  backfaceVisibility: 'visible',
  ...extra,
});

interface Box3DProps {
  x: number; y: number; w: number; d: number; h: number;
  topColor: string; frontColor: string; leftColor: string;
  z?: number;
}

const Box3DInner: React.FC<Box3DProps> = ({ x, y, w, d, h, topColor, frontColor, leftColor, z = 0 }) => (
  <div
    style={{
      position: 'absolute', left: x, top: y, width: w, height: d,
      transform: `translateZ(${z}px)`, transformStyle: 'preserve-3d',
      pointerEvents: 'none',
    }}
  >
    {/* Top (lighter) */}
    <div style={face({
      width: w, height: d, left: 0, top: 0, transform: `translateZ(${h}px)`,
      backgroundColor: topColor,
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.22), rgba(255,255,255,0.06))',
      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.3)',
    })} />
    {/* Front, +y (mid) */}
    <div style={face({
      width: w, height: h, left: 0, top: d - h,
      transformOrigin: '0 100%', transform: 'rotateX(-90deg)',
      backgroundColor: frontColor,
      backgroundImage: 'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.3))',
      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.2)',
    })} />
    {/* Left, -x (darker) */}
    <div style={face({
      width: h, height: d, left: 0, top: 0,
      transformOrigin: '0 0', transform: 'rotateY(-90deg)',
      backgroundColor: leftColor,
      backgroundImage: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.55))',
      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.15)',
    })} />
  </div>
);
const Box3D = React.memo(Box3DInner);

/** Zero-size 3D group. Dimming works through the inherited --o variable. */
const Group: React.FC<{ dim: boolean; children: React.ReactNode }> = ({ dim, children }) => (
  <div
    style={{
      position: 'absolute', left: 0, top: 0, width: 0, height: 0,
      transformStyle: 'preserve-3d', pointerEvents: 'none',
      ['--o' as string]: dim ? DIM : 1,
    } as React.CSSProperties}
  >
    {children}
  </div>
);

/** Screen-facing plane. Its bottom-centre sits exactly on the ground point (gx, gy). */
const Billboard: React.FC<{
  gx: number; gy: number; w: number; h: number; z?: number; children: React.ReactNode;
}> = ({ gx, gy, w, h, z = 0, children }) => (
  <div
    style={{
      position: 'absolute', left: gx - w / 2, top: gy - h, width: w, height: h,
      transformOrigin: '50% 100%',
      transform: `translateZ(${z}px) rotateZ(45deg) rotateX(-58deg)`,
      opacity: 'var(--o, 1)' as unknown as number,
      pointerEvents: 'none',
    }}
  >
    {children}
  </div>
);

/* ------------------------------------------------------------------ */
/* Sheet content                                                       */
/* ------------------------------------------------------------------ */
interface SheetData {
  title: string;
  placard: string;
  summary: string;
  bullets: string[];
  onOpenFull: () => void;
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */
export const MobileWorkshopStage: React.FC<MobileWorkshopStageProps> = ({ onOpenTerminal }) => {
  const [scaleS, setScaleS] = useState(1);
  const [focusedObjectId, setFocusedObjectId] = useState<string | null>(null);
  const [hasTapped, setHasTapped] = useState(false);
  const [tappedObjects, setTappedObjects] = useState<Set<string>>(new Set());
  const [isIntroLoaded, setIsIntroLoaded] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [cam, setCam] = useState({ x: 0, y: 0, k: 1 });
  const [labelSides, setLabelSides] = useState<Record<string, Side>>(() => {
    const initial: Record<string, Side> = {};
    MOBILE_OBJECTS.forEach((o) => { initial[o.id] = o.defaultSide; });
    return initial;
  });
  const [modalState, setModalState] = useState<ModalData>({ isOpen: false, title: '', summary: '' });

  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = now.getSeconds();
  const minutes = now.getMinutes() + seconds / 60;
  const hours = (now.getHours() % 12) + minutes / 60;

  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6;
  const hourDeg = hours * 30;


  const focusedRef = useRef<string | null>(null);
  focusedRef.current = focusedObjectId;

  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const labelRefs = useRef<Record<string, HTMLSpanElement | null>>({});
  const rest = useRef<Record<string, { x: number; y: number }>>({});
  const passes = useRef(0);
  const pushed = useRef(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef<number | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const sheetY0 = useRef<number | null>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const lastFocused = useRef<string | null>(null);

  const closeModal = useCallback(() => setModalState((p) => ({ ...p, isOpen: false })), []);

  /* ---------- scale: deterministic, no measuring during the intro ---------- */
  const updateScale = useCallback(() => {
    passes.current = 0;
    setScaleS(Math.min((window.innerWidth * 0.92) / ROOM_W, (window.innerHeight * 0.58) / ROOM_H, 2.2));
  }, []);

  useEffect(() => {
    updateScale();
    window.addEventListener('resize', updateScale);
    window.addEventListener('orientationchange', updateScale);
    return () => {
      window.removeEventListener('resize', updateScale);
      window.removeEventListener('orientationchange', updateScale);
    };
  }, [updateScale]);

  useEffect(() => {
    const a = setTimeout(() => setIsIntroLoaded(true), 100);
    const b = setTimeout(() => setIntroDone(true), 1400);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, []);

  /* ---------- measure hotspot positions at rest (camera identity) ---------- */
  const measureRest = useCallback(() => {
    if (focusedRef.current) return;
    MOBILE_OBJECTS.forEach((o) => {
      const el = btnRefs.current[o.id];
      if (!el) return;
      const r = el.getBoundingClientRect();
      rest.current[o.id] = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });
  }, []);

  useEffect(() => {
    if (!introDone) return;
    const raf = requestAnimationFrame(measureRest);
    return () => cancelAnimationFrame(raf);
  }, [introDone, scaleS, measureRest]);

  /* ---------- camera push-in: outer wrapper, world transform stays constant ---------- */
  useEffect(() => {
    if (!focusedObjectId) { setCam({ x: 0, y: 0, k: 1 }); return; }
    const p = rest.current[focusedObjectId];
    if (!p) return;
    setCam({
      x: window.innerWidth / 2 - CAM_ZOOM * p.x,
      y: window.innerHeight * 0.27 - CAM_ZOOM * p.y,
      k: CAM_ZOOM,
    });
  }, [focusedObjectId, scaleS]);

  /* ---------- label collision pass (one offender per pass, capped) ---------- */
  useEffect(() => {
    if (!introDone) return;
    const t = setTimeout(() => {
      if (focusedRef.current || passes.current >= 12) return;
      const items = MOBILE_OBJECTS
        .map((o) => ({ id: o.id, r: labelRefs.current[o.id]?.getBoundingClientRect() }))
        .filter((i): i is { id: string; r: DOMRect } => !!i.r);
      const m = 8;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const overlaps = (a: DOMRect, b: DOMRect) =>
        !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
      const bad = items.find((a) =>
        a.r.left < m || a.r.right > vw - m || a.r.top < m || a.r.bottom > vh - m ||
        items.some((b) => b.id !== a.id && overlaps(a.r, b.r)));
      passes.current += 1;
      if (!bad) return;
      const cycle: Side[] = ['left', 'right', 'below', 'above'];
      setLabelSides((prev) => ({
        ...prev,
        [bad.id]: cycle[(cycle.indexOf(prev[bad.id]) + 1) % cycle.length],
      }));
    }, 120);
    return () => clearTimeout(t);
  }, [introDone, scaleS, labelSides]);

  /* ---------- focus + history (push once, pop only when closing via the UI) ---------- */
  const focusObject = useCallback((id: string) => {
    if (!introDone) return;
    if (navigator.vibrate) { try { navigator.vibrate(8); } catch { /* ignore */ } }
    setHasTapped(true);
    setTappedObjects((prev) => new Set(prev).add(id));
    setFocusedObjectId(id);
    if (!pushed.current) {
      window.history.pushState({ mobileFocus: true }, '');
      pushed.current = true;
    }
  }, [introDone]);

  const closeFocus = useCallback(() => {
    setFocusedObjectId(null);
    if (pushed.current) {
      pushed.current = false;
      window.history.back();
    }
  }, []);

  useEffect(() => {
    const onPop = () => {
      if (pushed.current) {
        pushed.current = false;
        setFocusedObjectId(null);
      }
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (modalState.isOpen) closeModal();
      else if (focusedRef.current) closeFocus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modalState.isOpen, closeModal, closeFocus]);

  // Move focus into the sheet on open, back to the object on close.
  useEffect(() => {
    if (focusedObjectId) {
      lastFocused.current = focusedObjectId;
      const t = setTimeout(() => titleRef.current?.focus({ preventScroll: true }), 80);
      return () => clearTimeout(t);
    }
    if (lastFocused.current) {
      btnRefs.current[lastFocused.current]?.focus({ preventScroll: true });
      lastFocused.current = null;
    }
  }, [focusedObjectId]);

  /* ---------- drag-to-rotate (writes a style directly, no re-renders) ---------- */
  const setDrag = (deg: number, spring: boolean) => {
    const el = dragRef.current;
    if (!el) return;
    el.style.transition = spring ? 'transform 500ms cubic-bezier(.16,1,.3,1)' : 'transform 90ms linear';
    el.style.transform = `rotateZ(${deg}deg)`;
  };
  const onTouchStart = (e: React.TouchEvent) => {
    if (focusedRef.current || e.touches.length !== 1) return;
    dragStartX.current = e.touches[0].clientX;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (dragStartX.current === null || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStartX.current;
    if (Math.abs(dx) < 6) return;
    setDrag(Math.max(-12, Math.min(12, dx * 0.12)), false);
  };
  const onTouchEnd = () => {
    if (dragStartX.current === null) return;
    dragStartX.current = null;
    setDrag(0, true);
  };

  /* ---------- sheet swipe-down ---------- */
  const onHandleDown = (e: React.PointerEvent<HTMLDivElement>) => {
    sheetY0.current = e.clientY;
    e.currentTarget.setPointerCapture(e.pointerId);
    if (sheetRef.current) sheetRef.current.style.transition = 'none';
  };
  const onHandleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (sheetY0.current === null || !sheetRef.current) return;
    sheetRef.current.style.transform = `translateY(${Math.max(0, e.clientY - sheetY0.current)}px)`;
  };
  const onHandleUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (sheetY0.current === null) return;
    const dy = e.clientY - sheetY0.current;
    sheetY0.current = null;
    const el = sheetRef.current;
    if (el) { el.style.transition = 'transform 250ms ease-out'; el.style.transform = ''; }
    if (dy > 80 || Math.abs(dy) < 6) closeFocus();
  };

  /* ---------- sheet content ---------- */
  const openModal = useCallback((data: Omit<ModalData, 'isOpen'>) => {
    setModalState({ ...data, isOpen: true } as ModalData);
  }, []);

  const sheetData: SheetData | null = useMemo(() => {
    if (!focusedObjectId) return null;
    const W = WORKSHOP_DATA;

    switch (focusedObjectId) {
      case 'about': {
        const a = W.about;
        return {
          title: a.title, placard: a.placard, summary: a.summary,
          bullets: (a.bullets ?? []).slice(0, 3),
          onOpenFull: () => openModal({
            title: a.title, placard: a.placard, summary: a.summary, bullets: a.bullets,
            tags: ['ESP32', 'LoRa', 'Fusion 360', 'FreeRTOS', 'React'],
            fullDetails: {
              overview: `Role: ${a.role}\nLocation: ${a.location}`,
              componentsList: a.capabilities.hardware,
              schematicNotes: a.capabilities.software,
              firmwareHighlights: a.capabilities.cad,
            },
          }),
        };
      }
      case 'journal': {
        let journalList = W.journal;
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('albert-portfolio-posts');
          if (stored) {
            try {
              const parsed = JSON.parse(stored);
              if (Array.isArray(parsed) && parsed.length > 0) {
                journalList = parsed.map((p: any) => ({
                  id: p.id,
                  title: p.title,
                  date: p.date,
                  readTime: p.readTime || '5 min read',
                  category: p.category || 'Journal',
                  summary: p.excerpt || (p.content ? p.content.slice(0, 150) + '...' : ''),
                  bullets: [p.title, `Published: ${p.date}`, `Category: ${p.category || 'Development'}`],
                  content: p.content,
                  logEntries: [
                    {
                      id: `log-${p.id}`,
                      date: p.date,
                      title: p.title,
                      abstract: p.excerpt || (p.content ? p.content.slice(0, 140) + '...' : ''),
                      content: p.content,
                      thumbnailType: (p.category === 'Hardware' ? 'oscilloscope' : p.category === 'Development' ? 'code' : 'vision') as any,
                      tags: [p.category || 'Journal', p.readTime || '5 min read']
                    }
                  ]
                }));
              }
            } catch (e) {
              console.warn("Could not parse dynamic posts in mobile stage:", e);
            }
          }
        }

        const j = journalList[0];
        if (!j) return null;

        const formattedLogs = journalList.flatMap(item => 
          (item.logEntries && item.logEntries.length > 0) ? item.logEntries.map(l => ({
            ...l,
            content: l.content || item.content
          })) : [{
            id: item.id,
            date: item.date,
            title: item.title,
            abstract: item.summary,
            content: item.content,
            thumbnailType: (item.category === 'Hardware' ? 'oscilloscope' : item.category === 'Development' ? 'code' : item.category === 'Life & Tech' ? 'vision' : 'circuit') as any,
            tags: [item.category, item.readTime]
          }]
        );

        return {
          title: j.title, placard: `RESEARCH JOURNAL (${journalList.length} POSTS)`, summary: j.summary,
          bullets: (j.bullets ?? []).slice(0, 3),
          onOpenFull: () => openModal({
            title: j.title, placard: `JOURNAL // ${j.category}`, summary: j.summary, bullets: j.bullets,
            tags: ['JOURNAL', j.category, j.readTime],
            fullDetails: {
              overview: j.content,
              schematicNotes: [`Published: ${j.date}`, `Read Time: ${j.readTime}`, `Total Posts: ${journalList.length}`],
            },
            logEntries: formattedLogs,
          }),
        };
      }
      case 'projects': {
        const p = W.finishedProjects?.[0];
        if (!p) return null;
        return {
          title: p.title, placard: p.placard, summary: p.summary,
          bullets: (p.bullets ?? []).slice(0, 3),
          onOpenFull: () => openModal({
            title: p.title, placard: p.placard, summary: p.summary, bullets: p.bullets,
            tags: p.tags, externalUrl: p.githubUrl,
            fullDetails: p.fullDetails, logEntries: p.logEntries,
          }),
        };
      }
      case 'mascot': {
        const m = W.mascot;
        return {
          title: m.title, placard: m.placard, summary: m.summary,
          bullets: (m.bullets ?? []).slice(0, 3),
          onOpenFull: () => openModal({
            title: m.title, placard: m.placard, summary: m.summary, bullets: m.bullets,
            tags: ['Mascot OK-02', 'Vector Math', 'Gaze Tracking'],
            logEntries: m.logEntries,
          }),
        };
      }
      case 'workstation': {
        const p = W.inProgressProjects?.[0];
        if (!p) return null;
        return {
          title: p.title, placard: p.placard, summary: p.summary,
          bullets: (p.bullets ?? []).slice(0, 3),
          onOpenFull: () => openModal({
            title: p.title, placard: p.placard, summary: p.summary, bullets: p.bullets,
            tags: p.tags, fullDetails: p.fullDetails, logEntries: p.logEntries,
          }),
        };
      }
      case 'roadmap': {
        const bullets = (W.roadmap ?? []).map((r) => `[${r.quarter}] ${r.title}: ${r.description}`);
        const summary = 'Active quarterly engineering milestones and open-source lab goals.';
        return {
          title: '2026 Engineering Roadmap', placard: 'ROADMAP & GOALS', summary,
          bullets: bullets.slice(0, 3),
          onOpenFull: () => openModal({
            title: '2026 Engineering Roadmap', placard: 'ROADMAP & GOALS', summary, bullets,
            tags: ['ROADMAP', 'Q1 2026 - Q3 2026', 'A3PK LABS'],
          }),
        };
      }
      case 'terminal': {
        const c = W.contact;
        return {
          title: c.title, placard: c.placard, summary: c.summary,
          bullets: (c.bullets ?? []).slice(0, 3),
          onOpenFull: () => openModal({
            title: c.title, placard: c.placard, summary: c.summary, bullets: c.bullets,
            tags: ['CONTACT', 'TERMINAL', 'COMMS'],
            onOpenTerminal,
            fullDetails: {
              overview: 'The CRT Control Desk provides an interactive command line interface (CLI) to query visitor session telemetry or launch admin tools.',
              componentsList: [`Email: ${c.email}`, `Phone: ${c.phone}`, `Location: ${c.location}`],
            },
          }),
        };
      }
      case 'failed': {
        const f = W.failedCrate;
        return {
          title: f.title, placard: f.placard, summary: f.summary,
          bullets: (f.bullets ?? []).slice(0, 3),
          onOpenFull: () => openModal({
            title: f.title, placard: f.placard, summary: f.summary, bullets: f.bullets,
            tags: ['FAILURES', 'LESSONS LEARNED', 'HARDWARE'],
            logEntries: f.logEntries,
          }),
        };
      }
      default:
        return null;
    }
  }, [focusedObjectId, onOpenTerminal, openModal]);

  const currentIdx = focusedObjectId ? MOBILE_OBJECTS.findIndex((o) => o.id === focusedObjectId) : -1;
  const step = (n: number) => {
    const len = MOBILE_OBJECTS.length;
    focusObject(MOBILE_OBJECTS[(currentIdx + n + len) % len].id);
  };
  const dimFor = (id: string) => !!focusedObjectId && focusedObjectId !== id;

  /* ------------------------------------------------------------------ */
  /* Render                                                              */
  /* ------------------------------------------------------------------ */
  return (
    <div
      className="fixed inset-0 overflow-hidden bg-[#050810] text-slate-100 select-none font-mono-tech"
      style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)', touchAction: 'manipulation' }}
    >
      <style>{`
        @keyframes mascotHeadTurn { 0%,100%{transform:rotate(0)} 40%,60%{transform:rotate(-10deg)} 70%,90%{transform:rotate(10deg)} }
        @keyframes solderGlow { 0%,100%{opacity:.6;filter:drop-shadow(0 0 2px #f97316)} 50%{opacity:1;filter:drop-shadow(0 0 6px #ea580c)} }
        @keyframes sheetIn { from{transform:translateY(105%)} to{transform:translateY(0)} }
        .animate-mascot-head{animation:mascotHeadTurn 6s ease-in-out infinite;transform-origin:50% 70%}
        .animate-solder-glow{animation:solderGlow 2.5s ease-in-out infinite}
        .sheet-in{animation:sheetIn .35s cubic-bezier(.3,.8,.2,1)}
        @media (prefers-reduced-motion: reduce){
          .animate-mascot-head,.animate-solder-glow,.animate-ping,.sheet-in{animation:none!important}
          .cam-anim,#mobile-world{transition:none!important}
        }
      `}</style>

      <div className="absolute inset-0 bg-blueprint-grid opacity-15 pointer-events-none" />

      {/* CAMERA WRAPPER: the push-in happens here, so the 3D world transform never changes */}
      <div
        className="cam-anim absolute inset-0"
        style={{
          transformOrigin: '0 0',
          transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.k})`,
          transition: 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onTransitionEnd={(e) => { if (e.target === e.currentTarget && !focusedRef.current) measureRest(); }}
        onClick={(e) => {
          if (focusedRef.current && !(e.target as HTMLElement).closest('button')) closeFocus();
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
      >
        {/* STAGE: perspective only (no preserve-3d here) */}
        <div id="mobile-stage" className="absolute inset-0" style={{ perspective: '1800px' }}>
          {/* WORLD: scale + tilt + turn */}
          <div
            id="mobile-world"
            style={{
              position: 'absolute', left: '50%', top: '40%', width: 0, height: 0,
              transformStyle: 'preserve-3d',
              transform: `scale(${scaleS * (isIntroLoaded ? 1 : 0.7)}) rotateX(58deg) rotateZ(-45deg)`,
              opacity: isIntroLoaded ? 1 : 0,
              transition: 'transform 900ms cubic-bezier(0.16, 1, 0.3, 1), opacity 1200ms ease-out',
            }}
          >
            {/* DRAG LAYER: parallax rotation, driven by direct style writes */}
            <div
              ref={dragRef}
              style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0, transformStyle: 'preserve-3d' }}
            >
              {/* ROOM: 250 x 250 */}
              <div
                id="mobile-room"
                style={{
                  position: 'absolute', width: 250, height: 250, left: -125, top: -125,
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* ---------------- FLOOR ---------------- */}
                <div
                  style={{
                    position: 'absolute', width: 250, height: 250, left: 0, top: 0,
                    transformStyle: 'preserve-3d', pointerEvents: 'none',
                    background: '#141a26',
                    backgroundImage: `
                      radial-gradient(circle at 50% 40%, rgba(251,191,36,0.14) 0%, transparent 70%),
                      linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
                    backgroundSize: '100% 100%, 25px 25px, 25px 25px',
                    boxShadow: 'inset 0 0 40px rgba(0,0,0,0.85)',
                  }}
                >
                  {/* cyan glow under the cabinet */}
                  <div style={{
                    position: 'absolute', left: 185, top: 5, width: 64, height: 48, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(56,189,248,0.35) 0%, transparent 70%)',
                    transform: 'translateZ(0.2px)',
                  }} />
                  {/* amber glow under the bench */}
                  <div style={{
                    position: 'absolute', left: 175, top: 70, width: 75, height: 125, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(245,158,11,0.3) 0%, transparent 70%)',
                    transform: 'translateZ(0.2px)',
                  }} />
                  {/* hazard edges */}
                  <div style={{
                    position: 'absolute', left: 0, top: 0, width: 4, height: 250, transform: 'translateZ(0.6px)',
                    background: 'repeating-linear-gradient(45deg, #000, #000 6px, #eab308 6px, #eab308 12px)',
                  }} />
                  <div style={{
                    position: 'absolute', left: 0, top: 246, width: 250, height: 4, transform: 'translateZ(0.6px)',
                    background: 'repeating-linear-gradient(45deg, #000, #000 6px, #eab308 6px, #eab308 12px)',
                  }} />
                </div>

                {/* ---------------- WALL A (y = 0) ---------------- */}
                <div
                  style={{
                    position: 'absolute', width: 250, height: WALL_H, left: 0, top: -WALL_H,
                    transformOrigin: '0 100%', transform: 'rotateX(-90deg)',
                    transformStyle: 'preserve-3d', pointerEvents: 'none',
                    background: '#0f172a',
                    backgroundImage: `
                      linear-gradient(180deg, #1e293b 0%, #0f172a 60%, #090d16 100%),
                      radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)`,
                    backgroundSize: '100% 100%, 12px 12px',
                    borderBottom: '2px solid #334155',
                  }}
                >
                  {/* Prominent High-Visibility A3PK LABS Signboard */}
                  <div style={{
                    position: 'absolute', left: 8, top: 8, padding: '3px 8px', background: '#020617',
                    border: '1.5px solid #f59e0b', borderRadius: 4,
                    boxShadow: '0 0 14px rgba(245, 158, 11, 0.6)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    transform: 'translateZ(0.5px)',
                  }}>
                    <div style={{
                      color: '#fbbf24', fontSize: 8, fontWeight: 900, fontFamily: 'monospace',
                      letterSpacing: '1.2px', textShadow: '0 0 6px rgba(245, 158, 11, 0.8)',
                      lineHeight: 1,
                    }}>
                      A3PK LABS
                    </div>
                    <div style={{
                      color: '#cbd5e1', fontSize: 5, fontWeight: 700, fontFamily: 'monospace',
                      letterSpacing: '0.6px', marginTop: 2, whiteSpace: 'nowrap',
                    }}>
                      BUILD · BREAK · LEARN · REPEAT
                    </div>
                  </div>

                  {/* Dynamic Realtime Wall Clock */}
                  <div style={{
                    position: 'absolute', left: 205, top: 8, width: 24, height: 24, borderRadius: '50%',
                    border: '2px solid #475569', background: '#020617',
                    boxShadow: '0 0 10px rgba(56,189,248,0.4)',
                    transform: 'translateZ(0.5px)', pointerEvents: 'none',
                  }}>
                    {/* Hour hand */}
                    <div style={{
                      position: 'absolute', left: 11, top: 6, width: 2, height: 6,
                      background: '#f8fafc', borderRadius: 1,
                      transformOrigin: '50% 100%', transform: `rotate(${hourDeg}deg)`
                    }} />
                    {/* Minute hand */}
                    <div style={{
                      position: 'absolute', left: 11.25, top: 4, width: 1.5, height: 8,
                      background: '#38bdf8', borderRadius: 1,
                      transformOrigin: '50% 100%', transform: `rotate(${minuteDeg}deg)`
                    }} />
                    {/* Second hand */}
                    <div style={{
                      position: 'absolute', left: 11.5, top: 3, width: 1, height: 9,
                      background: '#f59e0b',
                      transformOrigin: '50% 100%', transform: `rotate(${secondDeg}deg)`
                    }} />
                    {/* Center pin */}
                    <div style={{
                      position: 'absolute', left: 10.5, top: 10.5, width: 3, height: 3,
                      borderRadius: '50%', background: '#f59e0b', zIndex: 5
                    }} />
                  </div>

                  <div style={{ position: 'absolute', left: 175, top: 35, opacity: 0.6 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5">
                      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                    </svg>
                  </div>

                  {/* Whiteboard: a flat panel on the wall. World height 18 to 70 => wall-local top = 90 - 70 */}
                  <div
                    style={{
                      position: 'absolute', left: 74, top: WALL_H - 70, width: 86, height: 52,
                      transform: 'translateZ(0.5px)', boxSizing: 'border-box', padding: 4,
                      background: '#f8fafc', border: '3px solid #94a3b8', borderRadius: 2,
                      opacity: dimFor('roadmap') ? DIM : 1,
                    }}
                  >
                    <div style={{ fontSize: 6, fontWeight: 'bold', color: '#0f172a', marginBottom: 2 }}>2026 ROADMAP</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                      <div style={{ background: '#fef08a', height: 14, borderRadius: 2, padding: 1, fontSize: 5, color: '#854d0e', fontWeight: 'bold' }}>Q1: IoT</div>
                      <div style={{ background: '#bae6fd', height: 14, borderRadius: 2, padding: 1, fontSize: 5, color: '#0369a1', fontWeight: 'bold' }}>Q2: Robot</div>
                      <div style={{ background: '#fecdd3', height: 14, borderRadius: 2, padding: 1, fontSize: 5, color: '#be123c', fontWeight: 'bold' }}>Q3: ML</div>
                      <div style={{ background: '#a7f3d0', height: 14, borderRadius: 2, padding: 1, fontSize: 5, color: '#047857', fontWeight: 'bold' }}>Q4: OSS</div>
                    </div>
                  </div>
                </div>

                {/* ---------------- WALL B (x = 250) ---------------- */}
                <div
                  style={{
                    position: 'absolute', width: 250, height: WALL_H, left: 250, top: -WALL_H,
                    transformOrigin: '0 100%', transform: 'rotateZ(90deg) rotateX(-90deg)',
                    transformStyle: 'preserve-3d', pointerEvents: 'none',
                    background: '#0f172a',
                    backgroundImage: `
                      linear-gradient(180deg, #1e293b 0%, #0f172a 60%, #090d16 100%),
                      radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)`,
                    backgroundSize: '100% 100%, 12px 12px',
                    borderBottom: '2px solid #334155',
                  }}
                >
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 30, background: '#090d16', borderTop: '1px solid #1e293b' }} />
                  <div style={{ position: 'absolute', left: 30, top: 20, opacity: 0.5, display: 'flex', gap: 12 }}>
                    <div style={{ width: 3, height: 22, background: '#64748b' }} />
                    <div style={{ width: 4, height: 18, background: '#64748b' }} />
                    <div style={{ width: 3, height: 26, background: '#64748b' }} />
                  </div>
                </div>

                {/* ---------------- OBJECTS ---------------- */}

                {/* Mascot showcase: plinth 18 + glass 54 = 72 */}
                <Group dim={dimFor('mascot')}>
                  <Box3D x={16} y={8} w={38} d={38} h={18} topColor="#334155" frontColor="#1e293b" leftColor="#0f172a" />
                  <Billboard gx={35} gy={27} w={32} h={44} z={18}>
                    <svg width="32" height="44" viewBox="0 0 32 44" fill="none" className="drop-shadow-[0_0_8px_#38bdf8]">
                      <g className="animate-mascot-head">
                        <rect x="6" y="2" width="20" height="14" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.8" />
                        <circle cx="11" cy="9" r="3" fill="#38bdf8" />
                        <circle cx="21" cy="9" r="3" fill="#38bdf8" />
                        <rect x="14" y="0" width="4" height="3" fill="#fbbf24" />
                      </g>
                      <rect x="4" y="18" width="24" height="22" rx="5" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.8" />
                      <rect x="8" y="22" width="16" height="10" rx="2" fill="#090d16" stroke="#38bdf8" strokeWidth="1" />
                      <circle cx="16" cy="27" r="3" fill="#4ade80" />
                    </svg>
                  </Billboard>
                  {/* glass last, so it tints what is inside */}
                  <Box3D x={16} y={8} w={38} d={38} h={54} z={18} topColor="rgba(56,189,248,0.35)" frontColor="rgba(56,189,248,0.25)" leftColor="rgba(3,105,161,0.2)" />
                </Group>

                {/* Finished-projects cabinet: plinth 12 + glass 66 = 78 (under the 90px walls) */}
                <Group dim={dimFor('projects')}>
                  <Box3D x={190} y={8} w={56} d={42} h={12} topColor="#334155" frontColor="#1e293b" leftColor="#0f172a" />
                  <Box3D x={192} y={10} w={52} d={38} h={3} z={34} topColor="rgba(56,189,248,0.5)" frontColor="#0284c7" leftColor="#0369a1" />
                  <Box3D x={192} y={10} w={52} d={38} h={3} z={56} topColor="rgba(56,189,248,0.5)" frontColor="#0284c7" leftColor="#0369a1" />
                  <Box3D x={202} y={20} w={14} d={14} h={14} z={37} topColor="#38bdf8" frontColor="#0284c7" leftColor="#0369a1" />
                  <Box3D x={224} y={22} w={14} d={14} h={14} z={59} topColor="#4ade80" frontColor="#16a34a" leftColor="#15803d" />
                  <Box3D x={190} y={8} w={56} d={42} h={66} z={12} topColor="rgba(56,189,248,0.35)" frontColor="rgba(56,189,248,0.25)" leftColor="rgba(3,105,161,0.2)" />
                </Group>

                {/* Workbench */}
                <Group dim={dimFor('workstation')}>
                  <Box3D x={184} y={78} w={66} d={116} h={34} topColor="#065f46" frontColor="#1e293b" leftColor="#0f172a" />
                  <Box3D x={194} y={90} w={26} d={34} h={5} z={34} topColor="#16a34a" frontColor="#15803d" leftColor="#14532d" />
                  <Box3D x={222} y={100} w={20} d={28} h={6} z={34} topColor="#ffffff" frontColor="#cbd5e1" leftColor="#94a3b8" />
                  <Box3D x={196} y={135} w={14} d={22} h={10} z={34} topColor="#facc15" frontColor="#eab308" leftColor="#ca8a04" />
                  <Box3D x={224} y={160} w={14} d={18} h={10} z={34} topColor="#475569" frontColor="#334155" leftColor="#1e293b" />
                  <div
                    className="animate-solder-glow"
                    style={{
                      position: 'absolute', left: 229, top: 167, width: 5, height: 5, borderRadius: '50%',
                      background: '#f97316', transform: 'translateZ(44.5px)', pointerEvents: 'none',
                      opacity: 'var(--o, 1)' as unknown as number,
                    }}
                  />
                </Group>

                {/* Desk, laptop, chair seat and Albert */}
                <Group dim={dimFor('about')}>
                  <Box3D x={84} y={62} w={70} d={36} h={30} topColor="#92400e" frontColor="#78350f" leftColor="#451a03" />
                  <Box3D x={104} y={70} w={22} d={16} h={4} z={30} topColor="#475569" frontColor="#334155" leftColor="#1e293b" />
                  <Box3D x={104} y={70} w={22} d={4} h={16} z={34} topColor="#1e293b" frontColor="#00f0ff" leftColor="#0f172a" />
                  <Box3D x={108} y={100} w={22} d={20} h={16} topColor="#334155" frontColor="#1e293b" leftColor="#0f172a" />
                  <Billboard gx={119} gy={110} w={34} h={48} z={16}>
                    <svg width="34" height="48" viewBox="0 0 34 48" fill="none">
                      <path d="M7 18 C7 9, 27 9, 27 18" stroke="#38bdf8" strokeWidth="2.8" fill="none" />
                      <circle cx="17" cy="14" r="7.5" fill="#78350f" stroke="#fde047" strokeWidth="1.2" />
                      <path d="M8 24 C8 20, 26 20, 26 24 L28 46 L6 46 Z" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
                      <path d="M8 26 L15 35 L21 35 L26 26" stroke="#94a3b8" strokeWidth="2.2" fill="none" />
                    </svg>
                  </Billboard>
                </Group>

                {/* Notebook table */}
                <Group dim={dimFor('journal')}>
                  <Box3D x={40} y={142} w={48} d={32} h={20} topColor="#64748b" frontColor="#475569" leftColor="#334155" />
                  <Box3D x={48} y={148} w={20} d={18} h={5} z={20} topColor="#38bdf8" frontColor="#0284c7" leftColor="#0369a1" />
                  <Box3D x={50} y={150} w={20} d={18} h={5} z={25} topColor="#fbbf24" frontColor="#d97706" leftColor="#b45309" />
                  <Box3D x={46} y={152} w={20} d={18} h={5} z={30} topColor="#c084fc" frontColor="#9333ea" leftColor="#7e22ce" />
                </Group>

                {/* Failed-prototypes crate */}
                <Group dim={dimFor('failed')}>
                  <Box3D x={18} y={196} w={38} d={30} h={20} topColor="#92400e" frontColor="#78350f" leftColor="#451a03" />
                  <Box3D x={24} y={202} w={20} d={16} h={5} z={20} topColor="#dc2626" frontColor="#b91c1c" leftColor="#7f1d1d" />
                </Group>

                {/* CRT terminal */}
                <Group dim={dimFor('terminal')}>
                  <Box3D x={192} y={204} w={46} d={34} h={32} topColor="#475569" frontColor="#334155" leftColor="#1e293b" />
                  <Box3D x={196} y={208} w={38} d={26} h={28} z={32} topColor="#1e293b" frontColor="#22c55e" leftColor="#0f172a" />
                  <Billboard gx={215} gy={221} w={56} h={26} z={60}>
                    <div style={{
                      background: '#020617', border: '1.5px solid #f59e0b', borderRadius: 4,
                      boxShadow: '0 0 10px rgba(245, 158, 11, 0.6)', padding: '2px 4px',
                      textAlign: 'center', fontFamily: 'monospace',
                    }}>
                      <div style={{ color: '#fbbf24', fontSize: 7, fontWeight: 900, letterSpacing: '1px' }}>
                        A3PK LABS
                      </div>
                      <div style={{ color: '#4ade80', fontSize: 6, fontWeight: 700, letterSpacing: '0.5px' }}>
                        &gt; CRT TERMINAL
                      </div>
                    </div>
                  </Billboard>
                </Group>

                {/* ---------------- HOTSPOTS ---------------- */}
                {MOBILE_OBJECTS.map((obj) => {
                  const gx = obj.anchor?.x ?? obj.pos.x + obj.boxSize.w / 2;
                  const gy = obj.anchor?.y ?? obj.pos.y + obj.boxSize.d / 2;
                  const color = obj.accent === 'cyan' ? '#38bdf8' : obj.accent === 'amber' ? '#f59e0b' : '#f8fafc';
                  const tapped = tappedObjects.has(obj.id);
                  const side = labelSides[obj.id] ?? obj.defaultSide;
                  const dotY = obj.hitH;

                  const labelTransform =
                    side === 'left' ? `translate(calc(-100% - 12px), calc(-50% - ${dotY}px))`
                    : side === 'right' ? `translate(12px, calc(-50% - ${dotY}px))`
                    : side === 'above' ? `translate(-50%, calc(-100% - ${dotY + 10}px))`
                    : 'translate(-50%, 6px)';

                  return (
                    <div
                      key={obj.id}
                      style={{
                        position: 'absolute', left: gx, top: gy, width: 0, height: 0,
                        transformOrigin: '0 0',
                        transform: `translateZ(${obj.lift ?? 0}px) rotateZ(45deg) rotateX(-58deg)`,
                      }}
                    >
                      <button
                        type="button"
                        ref={(el) => { btnRefs.current[obj.id] = el; }}
                        aria-label={obj.placard}
                        onClick={() => focusObject(obj.id)}
                        className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-400"
                        style={{
                          position: 'absolute', left: -obj.hitW / 2, top: -obj.hitH,
                          width: obj.hitW, height: obj.hitH,
                          background: 'transparent', border: 'none', cursor: 'pointer',
                          opacity: dimFor(obj.id) ? 0.35 : 1,
                        }}
                      >
                        <span style={{
                          position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -50%)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
                        }}>
                          {!tapped && !focusedObjectId && introDone && (
                            <span className="absolute w-4 h-4 rounded-full animate-ping opacity-75" style={{ backgroundColor: color }} />
                          )}
                          <span className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: color, color }} />
                        </span>
                      </button>

                      <div style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none', transform: labelTransform }}>
                        <span
                          ref={(el) => { labelRefs.current[obj.id] = el; }}
                          className="font-bold font-mono-tech px-1.5 py-0.5 rounded shadow-md uppercase tracking-wider whitespace-nowrap"
                          style={{
                            display: 'block', background: '#030712', color,
                            border: `1px solid ${color}88`, fontSize: 8, lineHeight: 1, maxWidth: 80,
                            opacity: dimFor(obj.id) ? 0.35 : 1,
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
        </div>
      </div>

      {/* Hint */}
      {!hasTapped && !focusedObjectId && introDone && (
        <div className="fixed bottom-6 inset-x-0 flex flex-col items-center pointer-events-none z-30 text-center">
          <span className="text-[10px] font-mono-tech text-sky-400 uppercase tracking-widest bg-slate-950/80 px-3 py-1 rounded-full border border-sky-500/30 shadow-lg">
            Tap any object to inspect the workshop
          </span>
        </div>
      )}

      {/* Bottom sheet */}
      {focusedObjectId && sheetData && (
        <div
          ref={sheetRef}
          role="dialog"
          aria-labelledby="mobile-sheet-title"
          className="sheet-in fixed bottom-0 inset-x-0 bg-[#0b1220] border-t-2 border-sky-500/60 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.95)] px-5 pt-1 z-50 flex flex-col max-h-[46dvh]"
          style={{ paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom))' }}
        >
          {/* Drag handle: swipe down or tap to close */}
          <div
            onPointerDown={onHandleDown}
            onPointerMove={onHandleMove}
            onPointerUp={onHandleUp}
            onPointerCancel={onHandleUp}
            className="h-7 flex items-center justify-center shrink-0 cursor-grab"
            style={{ touchAction: 'none' }}
            aria-hidden="true"
          >
            <div className="w-12 h-1.5 bg-slate-700 rounded-full" />
          </div>

          <div className="flex justify-between items-start border-b border-sky-950 pb-2.5 mb-2 shrink-0">
            <div>
              <span className="text-[9px] font-mono-tech text-sky-400 uppercase tracking-widest font-bold">
                // {sheetData.placard}
              </span>
              <h2 id="mobile-sheet-title" ref={titleRef} tabIndex={-1} className="text-lg font-bold text-white font-sans tracking-tight outline-none">
                {sheetData.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={closeFocus}
              aria-label="Close sheet"
              className="min-w-[44px] min-h-[44px] -mt-1 -mr-2 flex items-center justify-center rounded-lg text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          <div className="overflow-y-auto space-y-2 text-xs font-sans pr-1 flex-1">
            <p className="text-slate-300 leading-relaxed font-medium">{sheetData.summary}</p>
            {sheetData.bullets.length > 0 && (
              <ul className="space-y-1 font-mono-tech text-[11px] text-slate-300 border-l-2 border-sky-500/40 pl-3 py-0.5">
                {sheetData.bullets.map((b, i) => <li key={i}>• {b}</li>)}
              </ul>
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-sky-950/80 flex justify-between items-center shrink-0">
            <div className="flex items-center space-x-1 font-mono-tech text-[10px]">
              <button
                type="button" aria-label="Previous workshop object" onClick={() => step(-1)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg bg-slate-950 border border-slate-800 text-sky-400 hover:border-sky-500"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-[10px] text-slate-400 font-bold px-1">{currentIdx + 1}/{MOBILE_OBJECTS.length}</span>
              <button
                type="button" aria-label="Next workshop object" onClick={() => step(1)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg bg-slate-950 border border-slate-800 text-sky-400 hover:border-sky-500"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <button
              type="button"
              onClick={sheetData.onOpenFull}
              className="flex items-center space-x-1.5 px-3 min-h-[44px] rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold font-mono-tech text-xs shadow-md transition-all"
            >
              <span>EXPLORE DETAILS</span>
              <ExternalLink size={13} />
            </button>
          </div>
        </div>
      )}

      <WorkshopModal data={modalState} onClose={closeModal} />
    </div>
  );
};
