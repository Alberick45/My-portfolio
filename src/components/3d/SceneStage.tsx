import React, { useState, useEffect, useCallback } from 'react';
import { useZScroll } from '../../hooks/useZScroll';
import { ROOM_CONFIG, WORKSHOP_STATIONS } from '../../config/workshopConfig';
import { WORKSHOP_DATA } from '../../config/workshopData';
import { Room } from './Room';
import { Box3D } from './Box3D';
import { WorkshopModal, ModalData } from './WorkshopModal';
import { MobileWorkshopStage } from './MobileWorkshopStage';
import { ChevronDown, ChevronLeft, ChevronRight, Cpu, Sparkles, Terminal, Flame, BookOpen, Layers, User, Zap } from 'lucide-react';

interface SceneStageProps {
  onOpenTerminal?: () => void;
}

export const SceneStage: React.FC<SceneStageProps> = ({ onOpenTerminal }) => {
  const [isMobile, setIsMobile] = useState<boolean>(() => typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const {
    curZ,
    rotX,
    rotY,
    introOpacity,
    prefersReducedMotion,
    scrollToStation,
  } = useZScroll();

  const activeStationIdx = WORKSHOP_STATIONS.reduce((acc, st, idx) => {
    const dist = Math.abs(curZ - (-st.z));
    const minDist = Math.abs(curZ - (-WORKSHOP_STATIONS[acc].z));
    return dist < minDist ? idx : acc;
  }, 0);

  // Mouse tracking for Robot Mascot head & eye pupil tracking inside Showcase Pedestal
  const [mascotMousePos, setMascotMousePos] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion || isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      // dx and dy range between -1 and +1
      setMascotMousePos({ x: dx * 8, y: dy * 6 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReducedMotion, isMobile]);

  // Periodic blinking interval for Mascot OK-02
  useEffect(() => {
    if (isMobile) return;
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 3200);

    return () => clearInterval(blinkInterval);
  }, [isMobile]);

  // Progressive Disclosure Modal State
  const [modalState, setModalState] = useState<ModalData>({
    isOpen: false,
    title: '',
    summary: '',
  });

  const closeModal = useCallback(() => setModalState((prev) => ({ ...prev, isOpen: false })), []);

  if (isMobile) {
    return <MobileWorkshopStage onOpenTerminal={onOpenTerminal} />;
  }

  // Helper to compute depth fog style (opacity & contrast based on distance from camera)
  const getPropFogStyle = (propZ: number) => {
    const dist = Math.abs(curZ + propZ);

    let opacity = 1;
    let isInteractive = false;

    if (dist > 1400) {
      opacity = 0;
    } else if (dist > 400) {
      opacity = (1400 - dist) / 1000;
      if (dist < 700) isInteractive = true;
    } else {
      opacity = 1;
      isInteractive = true;
    }

    opacity = Math.max(0, Math.min(1, Math.round(opacity * 50) / 50));
    const visibility = opacity > 0.01 ? 'visible' : 'hidden';

    return {
      opacity,
      visibility: visibility as 'visible' | 'hidden',
      pointerEvents: isInteractive ? ('auto' as const) : ('none' as const),
      filter: `brightness(${0.45 + opacity * 0.55}) contrast(${0.65 + opacity * 0.35})`,
      isInteractive,
    };
  };

  return (
    <div className="relative bg-[#050810] text-slate-100 selection:bg-sky-500/30 selection:text-sky-200">

      {/* Visually Hidden Skip Links for Keyboard & Screen Reader Users */}
      <div className="sr-only focus-within:not-sr-only">
        {WORKSHOP_STATIONS.map((st, idx) => (
          <button
            key={st.id}
            onClick={() => scrollToStation(idx)}
            className="focus:fixed focus:top-4 focus:left-4 focus:z-50 bg-slate-900 text-sky-300 border-2 border-sky-400 p-3 rounded-lg font-mono-tech text-xs shadow-2xl"
          >
            Skip to Station {idx}: {st.label}
          </button>
        ))}
      </div>

      {/* Tall Scroll Spacer (700vh scroll length) */}
      <div
        className="w-full pointer-events-none opacity-0 select-none"
        style={{ height: '700vh' }}
        aria-hidden="true"
      />

      {/* Fixed Viewport 3D Stage */}
      <div
        className="fixed inset-0 overflow-hidden pointer-events-auto"
        style={{
          perspective: `${ROOM_CONFIG.perspective}px`,
          WebkitPerspective: `${ROOM_CONFIG.perspective}px`,
        }}
      >
        {/* Zero-Size 3D World Container */}
        <div
          className="absolute top-1/2 left-1/2 w-0 h-0"
          style={{
            transformStyle: 'preserve-3d',
            transform: `translate3d(0, 0, ${curZ}px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
            willChange: 'transform',
          }}
        >
          {/* 3D Workshop Room Planes */}
          <Room />

          {/* ===================================================
              STATION 1: SHOWCASE OF FIRSTS (z = -700)
              =================================================== */}

          {/* LEFT: Lit Mascot OK-02 Glass Display Showcase */}
          {(() => {
            const fog = getPropFogStyle(-700);
            return (
              <div
                className="absolute transition-all duration-300"
                style={{
                  transform: 'translate3d(-280px, -20px, -700px) translate(-50%, -50%)',
                  transformStyle: 'preserve-3d',
                  ...fog,
                }}
                inert={fog.isInteractive ? undefined : ''}
              >
                <Box3D
                  width={160}
                  height={270}
                  depth={140}
                  ariaLabel="Mascot OK-02 Showcase"
                  onClick={() => {
                    setModalState({
                      isOpen: true,
                      title: WORKSHOP_DATA.mascot.title,
                      placard: WORKSHOP_DATA.mascot.placard,
                      summary: WORKSHOP_DATA.mascot.summary,
                      bullets: WORKSHOP_DATA.mascot.bullets,
                      tags: ["MASCOT", "OK-02", "EYE_TRACKING"],
                      fullDetails: {
                        overview: "Mascot OK-02 is an active sentinel unit equipped with real-time vector eye pupil tracking, micro-servo tilt joints, and optical radar sweep diagnostics.",
                        componentsList: ["Dual OLED Optical Eye Screens", "ESP32 Eye-Tracking Core", "Curved Glass Prism Enclosure", "Cyan & Gold Internal Wiring Harness"],
                        schematicNotes: [
                          "Pupil translate vector: [x: dx * 0.5, y: dy * 0.4] bound to viewport cursor",
                          "Eye blink timer: 3200ms interval triggering 160ms scaleY collapse ISR"
                        ],
                        firmwareHighlights: [
                          "Smooth linear interpolation pupil easing running inside active frame loop."
                        ]
                      }
                    });
                  }}
                  faceClassName="bg-slate-900/85 border-2 border-sky-400/50 shadow-[0_0_35px_rgba(56,189,248,0.3)] hover:border-sky-300 hover:shadow-[0_0_45px_rgba(56,189,248,0.5)] transition-all"
                  frontContent={
                    <div className="w-full h-full flex flex-col justify-between items-center p-3 select-none">
                      <div className="flex justify-between items-center w-full font-mono-tech text-[8px] text-sky-400">
                        <span>[PEDESTAL_01]</span>
                        <span className="flex items-center"><Sparkles size={8} className="mr-0.5 animate-spin text-amber-400" /> OK-02</span>
                      </div>

                      {/* SVG Robot Mascot with Real Eye Tracking + Blinking */}
                      <svg viewBox="0 0 200 220" className="w-28 h-32 filter drop-shadow-[0_0_10px_rgba(56,189,248,0.4)]">
                        {/* Antenna Pole & LED */}
                        <line x1="100" y1="36" x2="100" y2="18" stroke="#38bdf8" strokeWidth="3" />
                        <circle cx="100" cy="14" r="5" fill="#fb923c" className="animate-pulse" />

                        {/* Interactive Head Group (Tilts & Moves with Cursor) */}
                        <g style={{
                          transform: `translate(${mascotMousePos.x * 0.5}px, ${mascotMousePos.y * 0.5}px)`,
                          transition: 'transform 0.08s ease-out'
                        }}>
                          {/* Outer Head Frame */}
                          <rect x="44" y="36" width="112" height="56" rx="12" fill="#090d16" stroke="#38bdf8" strokeWidth="3" />

                          {/* Inner Screen Visor */}
                          <rect x="52" y="42" width="96" height="44" rx="8" fill="#020617" stroke="#0284c7" strokeWidth="1.5" />

                          {/* LEFT EYE */}
                          <g style={{ transformOrigin: '78px 64px', transform: isBlinking ? 'scaleY(0.1)' : 'scaleY(1)', transition: 'transform 0.08s ease' }}>
                            <circle cx="78" cy="64" r="10" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
                            {/* Eye Pupil (Tracks mouse movement) */}
                            <circle cx={78 + mascotMousePos.x * 0.4} cy={64 + mascotMousePos.y * 0.35} r="4.5" fill="#38bdf8" />
                            <circle cx={76 + mascotMousePos.x * 0.4} cy={62 + mascotMousePos.y * 0.35} r="1.5" fill="#ffffff" />
                          </g>

                          {/* RIGHT EYE */}
                          <g style={{ transformOrigin: '122px 64px', transform: isBlinking ? 'scaleY(0.1)' : 'scaleY(1)', transition: 'transform 0.08s ease' }}>
                            <circle cx="122" cy="64" r="10" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
                            {/* Eye Pupil (Tracks mouse movement) */}
                            <circle cx={122 + mascotMousePos.x * 0.4} cy={64 + mascotMousePos.y * 0.35} r="4.5" fill="#38bdf8" />
                            <circle cx={120 + mascotMousePos.x * 0.4} cy={62 + mascotMousePos.y * 0.35} r="1.5" fill="#ffffff" />
                          </g>

                          {/* Animated Mouth Line */}
                          <path d="M82,78 Q100,84 118,78" fill="none" stroke="#fb923c" strokeWidth="2.5" strokeLinecap="round" />
                        </g>

                        {/* Internal Wire Cables in Pedestal Base */}
                        <path d="M70,100 C70,120 60,140 70,160" fill="none" stroke="#fb923c" strokeWidth="2" strokeDasharray="3 3" />
                        <path d="M130,100 C130,120 140,140 130,160" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />

                        {/* Chest Body */}
                        <rect x="56" y="98" width="88" height="85" rx="10" fill="#090d16" stroke="#38bdf8" strokeWidth="3" />
                        <rect x="70" y="112" width="60" height="32" rx="4" fill="#020617" stroke="#38bdf8" strokeWidth="1.5" />
                        <path d="M74,128 Q84,118 94,128 T114,128 T124,128" fill="none" stroke="#fb923c" strokeWidth="2" />
                      </svg>

                      {/* Placard */}
                      <div className="bg-slate-950/90 border border-sky-400/40 rounded px-2.5 py-1 text-[9px] font-mono-tech font-bold text-sky-300 tracking-wider">
                        MASCOT OK-02
                      </div>
                    </div>
                  }
                />
              </div>
            );
          })()}

          {/* RIGHT: About Dossier Pinned Badge Panel */}
          {(() => {
            const fog = getPropFogStyle(-700);
            return (
              <div
                className="absolute transition-all duration-300"
                style={{
                  transform: 'translate3d(280px, -40px, -700px) translate(-50%, -50%)',
                  transformStyle: 'preserve-3d',
                  ...fog,
                }}
                inert={fog.isInteractive ? undefined : ''}
              >
                <Box3D
                  width={180}
                  height={150}
                  depth={20}
                  ariaLabel="About Albert Dossier"
                  onClick={() => {
                    setModalState({
                      isOpen: true,
                      title: WORKSHOP_DATA.about.title,
                      placard: WORKSHOP_DATA.about.placard,
                      summary: WORKSHOP_DATA.about.summary,
                      bullets: WORKSHOP_DATA.about.bullets,
                      tags: ["ABOUT", "BIO", "CAPABILITIES"],
                      fullDetails: {
                        overview: "Albert Baiden-Amissah is a multidisciplinary systems builder based in Ghana who combines microcontrollers, low-level firmware, solid CAD assemblies, and responsive interfaces.",
                        componentsList: WORKSHOP_DATA.about.capabilities.hardware,
                        schematicNotes: WORKSHOP_DATA.about.capabilities.software,
                        firmwareHighlights: WORKSHOP_DATA.about.capabilities.cad
                      }
                    });
                  }}
                  faceClassName="bg-slate-900/90 border-2 border-slate-400/40 shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:border-white hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all"
                  frontContent={
                    <div className="w-full h-full flex flex-col justify-between p-3 font-mono-tech select-none">
                      <div className="flex justify-between items-center text-[8px] text-slate-400">
                        <span>[DOSSIER_PIN]</span>
                        <span>AB-45</span>
                      </div>
                      <div className="flex items-center space-x-2 my-1">
                        <User className="w-6 h-6 text-sky-400 p-1 bg-slate-950 rounded border border-sky-500/30" />
                        <div>
                          <div className="text-xs font-bold text-white">ALBERT B.</div>
                          <div className="text-[8px] text-slate-400 font-sans">Systems Builder</div>
                        </div>
                      </div>
                      <div className="bg-slate-950 border border-slate-700 rounded p-1 text-[8px] text-slate-300 font-sans">
                        "Learning through building physical & digital systems."
                      </div>
                      <div className="self-center bg-white text-slate-950 rounded px-2 py-0.5 text-[9px] font-bold tracking-wider mt-1">
                        ABOUT DOSSIER
                      </div>
                    </div>
                  }
                />
              </div>
            );
          })()}


          {/* ===================================================
              STATION 2: FINISHED WORK & GRAVEYARD (z = -1500)
              =================================================== */}

          {WORKSHOP_DATA.finishedProjects.map((proj, idx) => {
            const isLeft = idx < 2;
            const xPos = isLeft ? -310 : 310;
            const zOffset = (idx % 2) * -220;
            const caseZ = -1400 + zOffset;
            const fog = getPropFogStyle(caseZ);

            return (
              <div
                key={proj.id}
                className="absolute transition-all duration-300"
                style={{
                  transform: `translate3d(${xPos}px, 30px, ${caseZ}px) translate(-50%, -50%)`,
                  transformStyle: 'preserve-3d',
                  ...fog,
                }}
                inert={fog.isInteractive ? undefined : ''}
              >
                <Box3D
                  width={135}
                  height={175}
                  depth={100}
                  ariaLabel={`Finished Project: ${proj.title}`}
                  onClick={() => {
                    setModalState({
                      isOpen: true,
                      title: proj.title,
                      placard: `FINISHED // ${proj.placard}`,
                      summary: proj.summary,
                      bullets: proj.bullets,
                      tags: proj.tags,
                      externalUrl: proj.githubUrl,
                      fullDetails: proj.fullDetails,
                      logEntries: proj.logEntries,
                    });
                  }}
                  faceClassName="bg-slate-900/90 border-2 border-cyan-400/50 shadow-[0_0_25px_rgba(56,189,248,0.3)] hover:border-cyan-300 hover:shadow-[0_0_35px_rgba(56,189,248,0.5)] transition-all"
                  frontContent={
                    <div className="w-full h-full flex flex-col justify-between items-center p-2.5 font-mono-tech select-none">
                      <div className="text-[8px] text-cyan-400 font-bold uppercase tracking-widest">// FINISHED</div>

                      {/* Physical Prop Graphics: Microchip + PCB Trace Lines */}
                      <div className="relative p-3 bg-slate-950 rounded-lg border border-cyan-500/40 text-cyan-400 shadow-inner w-full flex flex-col items-center">
                        <Cpu className="w-6 h-6 animate-pulse z-10" />
                        <svg viewBox="0 0 100 40" className="w-full h-6 absolute inset-0 opacity-40 pointer-events-none">
                          <path d="M10,20 L30,20 L40,10 L70,10 L80,20 L90,20" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
                          <circle cx="30" cy="20" r="2" fill="#38bdf8" />
                          <circle cx="70" cy="10" r="2" fill="#38bdf8" />
                        </svg>
                      </div>

                      <div className="text-center w-full">
                        <div className="text-[10px] font-bold text-white line-clamp-1">{proj.title}</div>
                        <div className="mt-1 inline-block bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-[8px] font-bold px-2 py-0.5 rounded">
                          {proj.placard}
                        </div>
                      </div>
                    </div>
                  }
                />
              </div>
            );
          })}

          {/* FLOOR: Physical Failed Prototypes Crate with Wires & Fried IC Chips (z = -1500) */}
          {(() => {
            const fog = getPropFogStyle(-1500);
            return (
              <div
                className="absolute transition-all duration-300"
                style={{
                  transform: 'translate3d(-240px, 190px, -1500px) translate(-50%, -50%)',
                  transformStyle: 'preserve-3d',
                  ...fog,
                }}
                inert={fog.isInteractive ? undefined : ''}
              >
                <Box3D
                  width={130}
                  height={105}
                  depth={120}
                  ariaLabel="Failed Prototypes Crate"
                  onClick={() => {
                    setModalState({
                      isOpen: true,
                      title: WORKSHOP_DATA.failedCrate.title,
                      placard: WORKSHOP_DATA.failedCrate.placard,
                      summary: WORKSHOP_DATA.failedCrate.summary,
                      bullets: WORKSHOP_DATA.failedCrate.bullets,
                      tags: ["GRAVEYARD", "FAILURES", "LESSONS"],
                      fullDetails: {
                        overview: "Every failure in this crate represents a concrete lesson in electrical tolerances, thermals, and mechanical load engineering.",
                        componentsList: [
                          "Fried ESP8266 Regulator (12V overvoltage burn)",
                          "Reversed MOSFET P-Channel Driver Layout",
                          "Cracked PETG Enclosure Stand-off Lugs"
                        ],
                        schematicNotes: [
                          "Lesson 1: Always probe power rail voltage with multimeter before slotting ICs into sockets.",
                          "Lesson 2: Print 1:1 paper PCB trace templates before ordering board fab runs.",
                          "Lesson 3: Use 100% solid infill on structural screw mounting standoffs."
                        ]
                      },
                      logEntries: WORKSHOP_DATA.failedCrate.logEntries,
                    });
                  }}
                  faceClassName="bg-amber-950/90 border-2 border-amber-500/60 shadow-[0_0_25px_rgba(245,158,11,0.3)] hover:border-amber-400 hover:shadow-[0_0_35px_rgba(245,158,11,0.5)] transition-all"
                  frontContent={
                    <div className="w-full h-full flex flex-col justify-between items-center p-2 font-mono-tech select-none">
                      <div className="text-[8px] text-amber-400 font-bold uppercase tracking-widest flex items-center">
                        <Flame className="w-3 h-3 mr-1 animate-pulse" /> GRAVEYARD
                      </div>

                      {/* SVG Fried Components & Spilling Jumper Wires Graphics */}
                      <svg viewBox="0 0 120 50" className="w-full h-10">
                        {/* Spilling Jumper Wires */}
                        <path d="M10,40 Q25,10 40,35 T70,15" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                        <path d="M20,45 Q40,5 65,30 T95,10" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
                        <path d="M50,45 Q70,10 85,40 T110,20" fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round" />
                        {/* Fried DIP IC Chip */}
                        <rect x="45" y="18" width="30" height="16" rx="2" fill="#18181b" stroke="#71717a" strokeWidth="1" />
                        {/* Burn mark */}
                        <circle cx="60" cy="26" r="5" fill="#dc2626" opacity="0.6" />
                        {/* Pins */}
                        <line x1="48" y1="14" x2="48" y2="18" stroke="#a1a1aa" strokeWidth="1.5" />
                        <line x1="54" y1="14" x2="54" y2="18" stroke="#a1a1aa" strokeWidth="1.5" />
                        <line x1="60" y1="14" x2="60" y2="18" stroke="#a1a1aa" strokeWidth="1.5" />
                        <line x1="66" y1="14" x2="66" y2="18" stroke="#a1a1aa" strokeWidth="1.5" />
                      </svg>

                      <div className="bg-amber-950 border border-amber-500/50 text-amber-300 text-[8px] font-bold px-2 py-0.5 rounded">
                        FAILED CRATE
                      </div>
                    </div>
                  }
                />
              </div>
            );
          })()}


          {/* ===================================================
              STATION 3: THE WORKSTATION (IN PROGRESS) (z = -2350)
              =================================================== */}

          {/* RIGHT: Main Workbench with Breadboard, Multimeter & Jumper Wires */}
          {(() => {
            const proj = WORKSHOP_DATA.inProgressProjects[0];
            const fog = getPropFogStyle(-2350);
            return (
              <div
                className="absolute transition-all duration-300"
                style={{
                  transform: 'translate3d(250px, 70px, -2350px) translate(-50%, -50%)',
                  transformStyle: 'preserve-3d',
                  ...fog,
                }}
                inert={fog.isInteractive ? undefined : ''}
              >
                <Box3D
                  width={310}
                  height={170}
                  depth={150}
                  ariaLabel={`In Progress Project: ${proj.title}`}
                  onClick={() => {
                    setModalState({
                      isOpen: true,
                      title: proj.title,
                      placard: `BUILDING // ${proj.progress}`,
                      summary: proj.summary,
                      bullets: proj.bullets,
                      tags: proj.tags,
                      externalUrl: proj.githubUrl,
                      fullDetails: proj.fullDetails,
                      logEntries: proj.logEntries,
                    });
                  }}
                  faceClassName="bg-slate-900/95 border-2 border-amber-400/60 shadow-[0_0_35px_rgba(245,158,11,0.35)] hover:border-amber-300 hover:shadow-[0_0_45px_rgba(245,158,11,0.5)] transition-all"
                  frontContent={
                    <div className="w-full h-full flex flex-col justify-between p-3 font-mono-tech select-none">
                      <div className="flex justify-between items-center text-[8px]">
                        <span className="text-slate-400">// CURRENTLY BUILDING</span>
                        <span className="text-amber-400 font-bold bg-amber-950 border border-amber-500/40 px-1.5 py-0.5 rounded">
                          {proj.progress}
                        </span>
                      </div>

                      {/* SVG Detailed Workstation Layout: Breadboard + Multimeter + Jumper Wires */}
                      <svg viewBox="0 0 280 80" className="w-full h-20 my-1 bg-slate-950 rounded border border-amber-500/30 p-1">
                        {/* WHITE BREADBOARD */}
                        <rect x="10" y="10" width="130" height="60" rx="3" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
                        <line x1="15" y1="22" x2="135" y2="22" stroke="#ef4444" strokeWidth="1" strokeDasharray="2 2" />
                        <line x1="15" y1="58" x2="135" y2="58" stroke="#3b82f6" strokeWidth="1" strokeDasharray="2 2" />

                        {/* DIP-16 Microchip on Breadboard */}
                        <rect x="50" y="30" width="50" height="20" rx="2" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
                        <circle cx="56" cy="40" r="2" fill="#38bdf8" />
                        <text x="64" y="43" fill="#38bdf8" fontSize="6" fontFamily="monospace">ESP32</text>

                        {/* COLORED JUMPER WIRES */}
                        <path d="M30,22 Q40,5 55,30" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                        <path d="M35,58 Q50,75 65,50" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
                        <path d="M80,30 Q95,10 115,22" fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round" />
                        <path d="M95,50 Q110,70 125,58" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />

                        {/* DIGITAL MULTIMETER */}
                        <rect x="160" y="10" width="110" height="60" rx="6" fill="#ca8a04" stroke="#facc15" strokeWidth="1.5" />
                        <rect x="170" y="16" width="90" height="22" rx="3" fill="#020617" stroke="#475569" strokeWidth="1" />
                        <text x="180" y="31" fill="#4ade80" fontSize="10" fontFamily="monospace" fontWeight="bold">3.30 V</text>
                        {/* Rotary Knob */}
                        <circle cx="215" cy="52" r="10" fill="#1e293b" stroke="#94a3b8" strokeWidth="1" />
                        <line x1="215" y1="52" x2="215" y2="44" stroke="#facc15" strokeWidth="2" />

                        {/* Probe leads */}
                        <path d="M175,55 C160,70 140,50 100,40" fill="none" stroke="#ef4444" strokeWidth="1.5" />
                        <path d="M185,55 C170,75 145,55 90,50" fill="none" stroke="#0f172a" strokeWidth="1.5" />
                      </svg>

                      <div className="flex justify-between items-center">
                        <div className="text-xs font-bold text-white">{proj.title}</div>
                        <div className="bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded text-[8px] tracking-wider">
                          {proj.placard}
                        </div>
                      </div>
                    </div>
                  }
                />
              </div>
            );
          })()}

          {/* LEFT: Soldering Iron Bench with Glowing Tip */}
          {(() => {
            const proj = WORKSHOP_DATA.inProgressProjects[1];
            const fog = getPropFogStyle(-2350);
            return (
              <div
                className="absolute transition-all duration-300"
                style={{
                  transform: 'translate3d(-280px, 90px, -2350px) translate(-50%, -50%)',
                  transformStyle: 'preserve-3d',
                  ...fog,
                }}
                inert={fog.isInteractive ? undefined : ''}
              >
                <Box3D
                  width={220}
                  height={150}
                  depth={130}
                  ariaLabel={`In Progress Project: ${proj.title}`}
                  onClick={() => {
                    setModalState({
                      isOpen: true,
                      title: proj.title,
                      placard: `BUILDING // ${proj.progress}`,
                      summary: proj.summary,
                      bullets: proj.bullets,
                      tags: proj.tags,
                      externalUrl: proj.githubUrl,
                      fullDetails: proj.fullDetails,
                      logEntries: proj.logEntries,
                    });
                  }}
                  faceClassName="bg-slate-900/95 border-2 border-amber-400/60 shadow-[0_0_35px_rgba(245,158,11,0.35)] hover:border-amber-300 hover:shadow-[0_0_45px_rgba(245,158,11,0.5)] transition-all"
                  frontContent={
                    <div className="w-full h-full flex flex-col justify-between p-2.5 font-mono-tech select-none">
                      <div className="flex justify-between items-center text-[8px]">
                        <span className="text-slate-400">// SOLDERING RIG</span>
                        <span className="text-amber-400 font-bold flex items-center">
                          <Zap size={10} className="mr-0.5 text-amber-400 animate-pulse" /> {proj.progress}
                        </span>
                      </div>

                      {/* SVG Soldering Station Graphics with Hot Tip Glow */}
                      <svg viewBox="0 0 200 65" className="w-full h-16 bg-slate-950 rounded border border-amber-500/30 p-1">
                        {/* Soldering Base Station */}
                        <rect x="10" y="10" width="80" height="48" rx="4" fill="#0f172a" stroke="#475569" strokeWidth="1" />
                        <rect x="18" y="16" width="64" height="18" rx="2" fill="#020617" stroke="#334155" strokeWidth="1" />
                        <text x="24" y="29" fill="#fb923c" fontSize="9" fontFamily="monospace" fontWeight="bold">380°C</text>
                        <circle cx="30" cy="46" r="5" fill="#334155" />
                        <circle cx="50" cy="46" r="5" fill="#334155" />

                        {/* Soldering Iron Pencil */}
                        <path d="M100,45 L160,25" stroke="#475569" strokeWidth="5" strokeLinecap="round" />
                        <path d="M160,25 L180,18" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
                        {/* Glowing Tip */}
                        <circle cx="180" cy="18" r="4" fill="#ff6600" className="animate-ping" opacity="0.7" />
                        <circle cx="180" cy="18" r="2.5" fill="#ffffff" />

                        {/* Solder Wire Reel */}
                        <circle cx="130" cy="50" r="10" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
                        <circle cx="130" cy="50" r="4" fill="#0f172a" />
                      </svg>

                      <div className="flex justify-between items-center">
                        <div className="text-xs font-bold text-white">{proj.title}</div>
                        <div className="bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded text-[8px]">
                          {proj.placard}
                        </div>
                      </div>
                    </div>
                  }
                />
              </div>
            );
          })()}


          {/* ===================================================
              STATION 4: LOGBOOK AND PLANS (z = -3000)
              =================================================== */}

          {/* LEFT: Whiteboard Roadmap Sheet */}
          {(() => {
            const fog = getPropFogStyle(-3000);
            return (
              <div
                className="absolute transition-all duration-300"
                style={{
                  transform: 'translate3d(-250px, -30px, -3000px) translate(-50%, -50%)',
                  transformStyle: 'preserve-3d',
                  ...fog,
                }}
                inert={fog.isInteractive ? undefined : ''}
              >
                <Box3D
                  width={250}
                  height={155}
                  depth={15}
                  ariaLabel="Roadmap Whiteboard"
                  onClick={() => {
                    setModalState({
                      isOpen: true,
                      title: "Roadmap Milestones",
                      placard: "ROADMAP PLANS",
                      summary: "Active roadmap plans and technical milestones planned for the workshop:",
                      bullets: WORKSHOP_DATA.roadmap.map(rm => `[${rm.quarter}] ${rm.title}: ${rm.description}`),
                      tags: ["ROADMAP", "MILESTONES", "PLANS"],
                      fullDetails: {
                        overview: "The active workshop roadmap details strategic milestones across wireless mesh networks, edge AI vision nodes, and custom PCB fabrication.",
                        componentsList: WORKSHOP_DATA.roadmap.map(r => `${r.quarter}: ${r.title} (${r.status})`),
                        schematicNotes: WORKSHOP_DATA.roadmap.map(r => r.description)
                      }
                    });
                  }}
                  faceClassName="bg-slate-900/90 border-2 border-slate-400/40 shadow-[0_0_25px_rgba(255,255,255,0.15)] hover:border-white transition-all"
                  frontContent={
                    <div className="w-full h-full flex flex-col justify-between p-3 font-mono-tech select-none">
                      <div className="flex justify-between items-center text-[8px] text-slate-400">
                        <span>// WHITEBOARD</span>
                        <Layers size={12} className="text-sky-400" />
                      </div>
                      <div className="space-y-1 my-1">
                        <div className="text-xs font-bold text-white">ROADMAP MILESTONES</div>
                        <div className="text-[8px] text-sky-300">• Q1 2026: LoRa Mesh Fleet</div>
                        <div className="text-[8px] text-amber-300">• Q2 2026: Edge AI Vision</div>
                      </div>
                      <div className="self-center bg-white text-slate-950 font-bold px-2 py-0.5 rounded text-[8px]">
                        ROADMAP PLANS
                      </div>
                    </div>
                  }
                />
              </div>
            );
          })()}

          {/* RIGHT: Journal Notebook Wall Shelf */}
          {(() => {
            const fog = getPropFogStyle(-3000);
            return (
              <div
                className="absolute transition-all duration-300"
                style={{
                  transform: 'translate3d(280px, 20px, -3000px) translate(-50%, -50%)',
                  transformStyle: 'preserve-3d',
                  ...fog,
                }}
                inert={fog.isInteractive ? undefined : ''}
              >
                <Box3D
                  width={210}
                  height={175}
                  depth={90}
                  ariaLabel="Journal Notebook Shelf"
                  onClick={() => {
                    let allJournals = WORKSHOP_DATA.journal;
                    const stored = localStorage.getItem('albert-portfolio-posts');
                    if (stored) {
                      try {
                        const parsed = JSON.parse(stored);
                        if (Array.isArray(parsed) && parsed.length > 0) {
                          allJournals = parsed.map((p: any) => ({
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
                        console.warn("Could not parse dynamic posts in 3D stage:", e);
                      }
                    }

                    const latest = allJournals[0];
                    const formattedLogs = allJournals.flatMap(j =>
                      (j.logEntries && j.logEntries.length > 0) ? j.logEntries.map(l => ({
                        ...l,
                        content: l.content || j.content
                      })) : [{
                        id: j.id,
                        date: j.date,
                        title: j.title,
                        abstract: j.summary,
                        content: j.content,
                        thumbnailType: (j.category === 'Hardware' ? 'oscilloscope' : j.category === 'Development' ? 'code' : j.category === 'Life & Tech' ? 'vision' : 'circuit') as any,
                        tags: [j.category, j.readTime]
                      }]
                    );

                    setModalState({
                      isOpen: true,
                      title: latest.title,
                      placard: `LOGBOOK // LAB JOURNAL (${allJournals.length} POSTS)`,
                      summary: latest.summary,
                      bullets: latest.bullets,
                      tags: ["JOURNAL", latest.category, latest.readTime],
                      fullDetails: {
                        overview: latest.content,
                        schematicNotes: [
                          `Published: ${latest.date}`,
                          `Estimated Read Time: ${latest.readTime}`,
                          `Category: ${latest.category}`
                        ]
                      },
                      logEntries: formattedLogs,
                    });
                  }}
                  faceClassName="bg-slate-900/90 border-2 border-slate-400/40 shadow-[0_0_25px_rgba(255,255,255,0.15)] hover:border-white transition-all"
                  frontContent={
                    <div className="w-full h-full flex flex-col justify-between p-3 font-mono-tech select-none">
                      <div className="flex justify-between items-center text-[8px] text-slate-400">
                        <span>// LAB NOTEBOOKS</span>
                        <BookOpen size={12} className="text-amber-400" />
                      </div>
                      <div className="my-1">
                        <div className="text-xs font-bold text-white">RESEARCH JOURNAL</div>
                        <div className="text-[8px] text-slate-300 mt-1 line-clamp-2">
                          "{WORKSHOP_DATA.journal[0].title}"
                        </div>
                      </div>
                      <div className="self-center bg-white text-slate-950 font-bold px-2 py-0.5 rounded text-[8px]">
                        READ LOGBOOK
                      </div>
                    </div>
                  }
                />
              </div>
            );
          })()}


          {/* ===================================================
              STATION 5: THE TERMINAL (z = -3600)
              =================================================== */}

          {/* CENTER: CRT Terminal Control Desk */}
          {(() => {
            const fog = getPropFogStyle(-3600);
            return (
              <div
                className="absolute transition-all duration-300"
                style={{
                  transform: 'translate3d(0px, 20px, -3600px) translate(-50%, -50%) scale(1.22)',
                  transformStyle: 'preserve-3d',
                  ...fog,
                }}
                inert={fog.isInteractive ? undefined : ''}
              >
                <Box3D
                  width={300}
                  height={190}
                  depth={150}
                  ariaLabel="CRT Terminal Control Desk"
                  onClick={() => {
                    setModalState({
                      isOpen: true,
                      title: WORKSHOP_DATA.contact.title,
                      placard: WORKSHOP_DATA.contact.placard,
                      summary: WORKSHOP_DATA.contact.summary,
                      bullets: WORKSHOP_DATA.contact.bullets,
                      tags: ["CONTACT", "TERMINAL", "COMMS"],
                      onOpenTerminal: onOpenTerminal,
                      fullDetails: {
                        overview: "The CRT Control Desk provides an interactive command line interface (CLI) to query visitor session telemetry, inspect developer dossiers, or launch admin tools.",
                        componentsList: [
                          `Email: ${WORKSHOP_DATA.contact.email}`,
                          `Phone: ${WORKSHOP_DATA.contact.phone}`,
                          `Location: ${WORKSHOP_DATA.contact.location}`
                        ],
                        schematicNotes: [
                          "Type '/help' or 'help' inside terminal console to list registry commands.",
                          "Type 'whoami' to view your current visitor session token.",
                          "Type 'projects' or 'skills' to fetch JSON telemetry payloads."
                        ]
                      }
                    });
                  }}
                  faceClassName="bg-slate-900/95 border-2 border-sky-400/80 shadow-[0_0_45px_rgba(56,189,248,0.5)] hover:border-sky-300 hover:shadow-[0_0_60px_rgba(56,189,248,0.7)] transition-all"
                  frontContent={
                    <div className="w-full h-full flex flex-col justify-between items-center p-3 font-mono-tech select-none">
                      <div className="flex justify-between items-center w-full text-[8px]">
                        <span className="font-extrabold text-amber-400 text-[10px] tracking-widest bg-slate-950 border border-amber-500/60 px-2 py-0.5 rounded shadow-[0_0_10px_rgba(245,158,11,0.5)]">
                          A3PK LABS
                        </span>
                        <span className="flex items-center text-emerald-400 font-bold"><Terminal size={10} className="mr-1 animate-pulse" /> /HELP ACTIVE</span>
                      </div>

                      {/* CRT Screen Graphics with Scanlines & Green Prompt */}
                      <div className="relative bg-slate-950 border-2 border-sky-500/50 rounded-lg p-2 text-center w-full my-1 overflow-hidden shadow-inner">
                        {/* Scanline overlay */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-60" />
                        <div className="flex items-center justify-center space-x-1.5 mb-0.5">
                          <Terminal className="w-5 h-5 text-emerald-400 animate-pulse" />
                          <span className="text-[11px] font-extrabold text-amber-400 tracking-widest">A3PK LABS // CLI</span>
                        </div>
                        <div className="text-xs font-bold text-white">CONTACT & TERMINAL</div>
                        <div className="text-[9px] text-emerald-400 font-mono-tech mt-0.5">&gt; CLICK TO LAUNCH CLI</div>
                      </div>

                      {/* Explicit Interactive Terminal Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onOpenTerminal) onOpenTerminal();
                        }}
                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-1.5 rounded text-[9px] tracking-wider transition-colors shadow-lg"
                      >
                        LAUNCH TERMINAL (/HELP)
                      </button>
                    </div>
                  }
                />
              </div>
            );
          })()}

        </div>
      </div>

      {/* Faint Entrance Hint Overlay (Fades out completely in first 10-12% scroll) */}
      {introOpacity > 0.01 && (
        <div
          className="fixed inset-0 flex flex-col items-center justify-center p-6 text-center select-none font-mono-tech transition-opacity duration-200 pointer-events-none z-30"
          style={{ opacity: introOpacity }}
        >
          <div className="bg-slate-950/80 border border-sky-500/30 rounded-2xl p-6 sm:p-8 max-w-lg shadow-[0_0_60px_rgba(0,0,0,0.8)] backdrop-blur-md">
            <span className="text-xs text-sky-400 uppercase tracking-[0.25em] block mb-2">
              // Albert Baiden-Amissah
            </span>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-3 font-sans">
              The Engineering <span className="text-sky-400">Workshop</span>
            </h1>
            <div className="text-xs sm:text-sm text-amber-400 font-mono-tech mb-6 bg-slate-900/80 px-3 py-1.5 rounded border border-amber-500/20 inline-block">
              &gt; Exploring New Technologies
            </div>
            <p className="text-slate-400 text-xs sm:text-sm font-sans leading-relaxed mb-6">
              Step into the garage-lab. Walk through the physical workspace to observe prototypes, build logs, and research notes.
            </p>
            <div className="flex flex-col items-center text-sky-400 text-xs animate-bounce">
              <span className="text-[10px] tracking-widest uppercase">// SCROLL TO WALK IN</span>
              <ChevronDown className="w-4 h-4 mt-1" />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Floating Station Quick Navigator Pill Bar */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-slate-950/90 border border-sky-500/50 rounded-full px-3 py-1.5 shadow-[0_0_30px_rgba(56,189,248,0.25)] backdrop-blur-md md:hidden font-mono-tech select-none">
        <button
          type="button"
          onClick={() => scrollToStation(Math.max(0, activeStationIdx - 1))}
          disabled={activeStationIdx === 0}
          aria-label="Previous Station"
          className="p-1 rounded-full text-sky-400 hover:text-white disabled:opacity-30 transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="text-[10px] font-bold text-white uppercase tracking-wider px-1 text-center whitespace-nowrap">
          <span className="text-amber-400 mr-1 font-bold">[{activeStationIdx + 1}/5]</span>
          {WORKSHOP_STATIONS[activeStationIdx].label}
        </div>
        <button
          type="button"
          onClick={() => scrollToStation(Math.min(WORKSHOP_STATIONS.length - 1, activeStationIdx + 1))}
          disabled={activeStationIdx === WORKSHOP_STATIONS.length - 1}
          aria-label="Next Station"
          className="p-1 rounded-full text-sky-400 hover:text-white disabled:opacity-30 transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Dark Radial Vignette Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-20"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 55%, rgba(4, 6, 12, 0.85) 100%)',
        }}
      />

      {/* Progressive Disclosure Modal */}
      <WorkshopModal data={modalState} onClose={closeModal} />

    </div>
  );
};
