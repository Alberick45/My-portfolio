import React, { useState, useEffect } from 'react';
import { ROOM_CONFIG } from '../../config/workshopConfig';

// Dynamic Realtime Clock Component showing real local time
export const RealtimeClock: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'md' }) => {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes() + seconds / 60;
  const hours = (time.getHours() % 12) + minutes / 60;

  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6;
  const hourDeg = hours * 30;

  if (size === 'sm') {
    return (
      <div className="w-5 h-5 rounded-full border border-sky-400/80 bg-slate-950 flex items-center justify-center relative shadow-md">
        <div 
          className="w-0.5 h-1.5 bg-sky-300 absolute top-1 rounded-full"
          style={{ transform: `rotate(${hourDeg}deg)`, transformOrigin: '50% 100%' }}
        />
        <div 
          className="w-0.5 h-2 bg-amber-400 absolute top-0.5 rounded-full"
          style={{ transform: `rotate(${minuteDeg}deg)`, transformOrigin: '50% 100%' }}
        />
        <div 
          className="w-[1px] h-2.5 bg-rose-500 absolute top-0.5"
          style={{ transform: `rotate(${secondDeg}deg)`, transformOrigin: '50% 100%' }}
        />
        <div className="w-1 h-1 rounded-full bg-slate-100 z-10" />
      </div>
    );
  }

  return (
    <div className="w-16 h-16 rounded-full bg-slate-950 border-4 border-slate-700 shadow-[0_0_20px_rgba(56,189,248,0.4)] flex justify-center items-center relative">
      {/* 12, 3, 6, 9 Ticks */}
      <div className="w-1 h-1.5 bg-slate-500 absolute top-1 rounded-full" />
      <div className="w-1.5 h-1 bg-slate-500 absolute right-1 rounded-full" />
      <div className="w-1 h-1.5 bg-slate-500 absolute bottom-1 rounded-full" />
      <div className="w-1.5 h-1 bg-slate-500 absolute left-1 rounded-full" />

      {/* Hour hand */}
      <div 
        className="w-1 h-4 bg-slate-100 absolute top-4 rounded-full shadow-sm"
        style={{ transform: `rotate(${hourDeg}deg)`, transformOrigin: '50% 100%' }}
      />
      {/* Minute hand */}
      <div 
        className="w-0.5 h-5 bg-sky-400 absolute top-3 rounded-full shadow-sm"
        style={{ transform: `rotate(${minuteDeg}deg)`, transformOrigin: '50% 100%' }}
      />
      {/* Second hand */}
      <div 
        className="w-[1px] h-6 bg-amber-400 absolute top-2 shadow-sm"
        style={{ transform: `rotate(${secondDeg}deg)`, transformOrigin: '50% 100%' }}
      />
      {/* Pivot */}
      <div className="w-2 h-2 rounded-full bg-amber-400 z-10 border border-slate-900 shadow" />
    </div>
  );
};

export const Room: React.FC = () => {
  const { W, H, D, L, CZ } = ROOM_CONFIG;
  const halfW = W / 2; // 450
  const halfH = H / 2; // 300

  // 5 Hanging Lamp Z positions (matching station depths)
  const lampPositionsZ = [300, 1000, 1800, 2650, 3300];

  return (
    <div className="absolute pointer-events-none select-none" style={{ transformStyle: 'preserve-3d' }}>
      
      {/* ===================================================
          1. FLOOR PLANE (Concrete, Hazard Lines, Walkway, Light Pools)
          =================================================== */}
      <div
        className="absolute bg-[#0b0f19]"
        style={{
          width: `${W}px`,
          height: `${L}px`,
          left: `-${halfW}px`,
          top: `-${L / 2}px`,
          transform: `translate3d(0, ${halfH}px, ${CZ}px) rotateX(90deg)`,
          backgroundImage: `
            linear-gradient(to bottom, #090d16 0%, #111827 40%, #0c101a 100%),
            radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.03) 0%, transparent 80%)
          `,
          boxShadow: 'inset 0 0 120px rgba(0, 0, 0, 0.95)',
        }}
      >
        {/* Amber & Black Hazard Lines along Left Edge */}
        <div
          className="absolute inset-y-0 left-0 w-8"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #d97706, #d97706 12px, #0f172a 12px, #0f172a 24px)',
            borderRight: '1px solid rgba(245, 158, 11, 0.4)',
          }}
        />

        {/* Amber & Black Hazard Lines along Right Edge */}
        <div
          className="absolute inset-y-0 right-0 w-8"
          style={{
            backgroundImage: 'repeating-linear-gradient(-45deg, #d97706, #d97706 12px, #0f172a 12px, #0f172a 24px)',
            borderLeft: '1px solid rgba(245, 158, 11, 0.4)',
          }}
        />

        {/* Dashed Center Walkway Line */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-48 border-x border-sky-500/20 bg-slate-900/30">
          <svg className="w-full h-full" preserveAspectRatio="none">
            <line
              x1="50%"
              y1="0"
              x2="50%"
              y2="100%"
              stroke="#38bdf8"
              strokeWidth="2"
              strokeDasharray="16 16"
              opacity="0.4"
            />
          </svg>
        </div>

        {/* Warm Lamp Light Pools on Floor under hanging lamps */}
        {lampPositionsZ.map((posZ, idx) => (
          <div
            key={`light-pool-${idx}`}
            className="absolute left-1/2 -translate-x-1/2 w-80 h-80 rounded-full pointer-events-none"
            style={{
              top: `${posZ + 250}px`,
              background: 'radial-gradient(circle, rgba(251, 191, 36, 0.12) 0%, rgba(245, 158, 11, 0.04) 50%, transparent 75%)',
            }}
          />
        ))}

        {/* Floor Shadow Blobs */}
        <div className="absolute top-[900px] left-16 w-64 h-32 bg-black/60 rounded-full blur-md" />
        <div className="absolute top-[1700px] inset-x-16 h-40 bg-black/60 rounded-full blur-md" />
        <div className="absolute top-[2550px] right-16 w-80 h-36 bg-black/60 rounded-full blur-md" />
        <div className="absolute top-[3200px] left-16 w-64 h-32 bg-black/60 rounded-full blur-md" />
      </div>


      {/* CEILING PLANE */}
      <div
        className="absolute bg-[#060810]"
        style={{
          width: `${W}px`,
          height: `${L}px`,
          left: `-${halfW}px`,
          top: `-${L / 2}px`,
          transform: `translate3d(0, -${halfH}px, ${CZ}px) rotateX(-90deg)`,
          boxShadow: 'inset 0 0 100px rgba(0, 0, 0, 0.9)',
        }}
      >
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-16 bg-slate-900 border-x border-slate-700/50 flex flex-col justify-around">
          <div className="w-full h-full bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:8px_8px] opacity-40" />
        </div>

        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={`beam-${i}`}
            className="absolute inset-x-0 h-6 bg-slate-800 border-y border-slate-600/60 shadow-md"
            style={{ top: `${i * 500 + 150}px` }}
          >
            <div className="h-1 bg-slate-700/80 mt-1" />
          </div>
        ))}

        {lampPositionsZ.map((posZ, idx) => (
          <div
            key={`lamp-${idx}`}
            className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center"
            style={{ top: `${posZ + 250}px` }}
          >
            <div className="w-0.5 h-12 bg-slate-600" />
            <div className="w-12 h-6 bg-slate-800 border border-slate-600 rounded-t-full relative shadow-lg flex justify-center items-end pb-1">
              <div className="w-4 h-4 rounded-full bg-amber-200 shadow-[0_0_20px_rgba(251,191,36,0.9)] animate-pulse" />
            </div>
          </div>
        ))}
      </div>


      {/* LEFT WALL PLANE */}
      <div
        className="absolute bg-[#070a14]"
        style={{
          width: `${L}px`,
          height: `${H}px`,
          left: `-${L / 2}px`,
          top: `-${halfH}px`,
          transform: `translate3d(-${halfW}px, 0, ${CZ}px) rotateY(90deg)`,
        }}
      >
        <div className="absolute inset-0 bg-blueprint-grid opacity-30 pointer-events-none" />
        <div
          className="absolute bottom-0 inset-x-0 h-64 bg-slate-900 border-t-2 border-sky-500/30"
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, #0f172a, #0f172a 16px, #1e293b 16px, #1e293b 18px)',
          }}
        />
        <div className="absolute top-8 inset-x-8 h-72 rounded-lg bg-slate-950/60 border border-slate-800 p-4">
          <div className="w-full h-full bg-[radial-gradient(#1e293b_2px,transparent_2px)] [background-size:16px_16px] opacity-60 relative">
            <svg className="absolute inset-0 w-full h-full opacity-25 text-sky-400 stroke-current" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M120 40 L135 55 A15 15 0 1 0 155 35 L140 20 L120 40 Z" />
              <path d="M140 35 L220 115 A10 10 0 0 1 205 130 L125 50 Z" />
              <path d="M750 40 L780 90 M780 40 L750 90 M765 65 L730 140 M765 65 L800 140" strokeWidth="2" />
              <path d="M1500 30 L1500 150 M1500 40 L1560 40 M1500 70 L1540 70" strokeWidth="2" />
              <path d="M2300 40 L2380 40 L2420 50 M2380 40 L2390 30" strokeWidth="2" />
              <path d="M3150 30 L3210 30 L3210 50 L3150 50 Z M3180 50 L3180 140" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>


      {/* RIGHT WALL PLANE */}
      <div
        className="absolute bg-[#070a14]"
        style={{
          width: `${L}px`,
          height: `${H}px`,
          left: `-${L / 2}px`,
          top: `-${halfH}px`,
          transform: `translate3d(${halfW}px, 0, ${CZ}px) rotateY(-90deg)`,
        }}
      >
        <div className="absolute inset-0 bg-blueprint-grid opacity-30 pointer-events-none" />
        <div
          className="absolute bottom-0 inset-x-0 h-64 bg-slate-900 border-t-2 border-sky-500/30"
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, #0f172a, #0f172a 16px, #1e293b 16px, #1e293b 18px)',
          }}
        />
        <div className="absolute top-8 inset-x-8 h-72 rounded-lg bg-slate-950/60 border border-slate-800 p-4">
          <div className="w-full h-full bg-[radial-gradient(#1e293b_2px,transparent_2px)] [background-size:16px_16px] opacity-60 relative">
            <svg className="absolute inset-0 w-full h-full opacity-25 text-sky-400 stroke-current" fill="none" strokeWidth="1.5" strokeLinecap="round">
              <path d="M300 50 L300 130 M280 70 L320 70" strokeWidth="2" />
              <path d="M1100 40 L1140 120 L1110 120 Z" strokeWidth="2" />
              <path d="M2000 40 C2040 40 2040 100 2000 100 Z" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>


      {/* ===================================================
          5. BACK WALL PLANE (Half-raised Roller Shutter + Daylight + Sign)
          =================================================== */}
      <div
        className="absolute bg-[#050810] border-4 border-slate-800 flex flex-col items-center justify-between overflow-hidden shadow-2xl"
        style={{
          width: `${W}px`,
          height: `${H}px`,
          left: `-${halfW}px`,
          top: `-${halfH}px`,
          transform: `translate3d(0, 0, -${D}px)`,
        }}
      >
        {/* Top Half: Corrugated Industrial Roller Shutter */}
        <div
          className="w-full h-72 bg-slate-900 border-b-8 border-slate-700 relative flex flex-col justify-center items-center p-4 space-y-3"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, #0f172a, #0f172a 14px, #1e293b 14px, #1e293b 16px)',
          }}
        >
          {/* Dynamic Realtime Wall Clock */}
          <RealtimeClock size="md" />

          {/* Prominent High-Visibility A3PK LABS Signboard */}
          <div className="bg-slate-950/95 border-2 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.6)] rounded-xl px-8 py-2.5 text-center transition-all z-20">
            <div className="font-mono-tech font-extrabold text-base md:text-lg text-amber-400 tracking-[0.25em] drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]">
              A3PK LABS
            </div>
            <div className="font-mono-tech text-[10px] text-slate-300 tracking-widest mt-0.5 font-bold">
              BUILD · BREAK · LEARN · REPEAT
            </div>
          </div>
        </div>

        {/* Bottom Half: Opening showing Daylight Sky */}
        <div className="w-full h-80 bg-gradient-to-b from-sky-200 via-sky-100 to-slate-200 relative flex justify-center items-center shadow-[inset_0_20px_30px_rgba(0,0,0,0.5)]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(56,189,248,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(56,189,248,0.1)_1px,transparent_1px)] [background-size:20px_20px]" />
          <div className="font-mono-tech text-xs font-bold text-slate-600/40 uppercase tracking-[0.3em] z-10">
            // OUTSIDE DAYLIGHT ACCESS
          </div>
        </div>
      </div>


      {/* ===================================================
          6. ENTRANCE DOORWAY FRAME (z = 0)
          =================================================== */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: `${W + 40}px`,
          height: `${H + 40}px`,
          left: `-${(W + 40) / 2}px`,
          top: `-${(H + 40) / 2}px`,
          transform: `translate3d(0, 0, 0px)`,
        }}
      >
        <div
          className="absolute top-0 inset-x-0 h-10 bg-slate-900 border-b-2 border-amber-500/60 shadow-lg"
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, #d97706, #d97706 20px, #0f172a 20px, #0f172a 40px)',
          }}
        />
        <div
          className="absolute inset-y-0 left-0 w-5 bg-slate-900 border-r border-amber-500/50"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #d97706, #d97706 10px, #0f172a 10px, #0f172a 20px)',
          }}
        />
        <div
          className="absolute inset-y-0 right-0 w-5 bg-slate-900 border-l border-amber-500/50"
          style={{
            backgroundImage: 'repeating-linear-gradient(-45deg, #d97706, #d97706 10px, #0f172a 10px, #0f172a 20px)',
          }}
        />
      </div>

    </div>
  );
};
