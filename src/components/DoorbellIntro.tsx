import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Bell, Terminal, ArrowRight, Check } from 'lucide-react';
import { useVisitor } from '../context/VisitorContext';

interface DoorbellIntroProps {
  onComplete: () => void;
}

export const DoorbellIntro: React.FC<DoorbellIntroProps> = ({ onComplete }) => {
  const { visitorName, setVisitor } = useVisitor();

  // Audio mute state (muted by default to respect browser autoplay policies)
  const [isMuted, setIsMuted] = useState(true);

  // Flow State: 'idle' | 'prompt_name' | 'prompt_email' | 'opening' | 'finished'
  const [step, setStep] = useState<'idle' | 'prompt_name' | 'prompt_email' | 'opening' | 'finished'>('idle');

  // Input states
  const [inputName, setInputName] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Motion preference check
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Web Audio Synthesized Chime (Ding-Dong sound)
  const playDoorbellChime = () => {
    if (isMuted) return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Note 1: High tone (E5 ~659 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, ctx.currentTime);

      gain1.gain.setValueAtTime(0.25, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.6);

      // Note 2: Low tone (C5 ~523 Hz) after 250ms
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(523.25, ctx.currentTime + 0.25);

      gain2.gain.setValueAtTime(0.3, ctx.currentTime + 0.25);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime + 0.25);
      osc2.stop(ctx.currentTime + 1.2);
    } catch (e) {
      console.warn("Audio Context playback error:", e);
    }
  };

  // Handle doorbell button click
  const handleRingDoorbell = () => {
    playDoorbellChime();

    if (visitorName) {
      // Returning visitor: directly trigger door opening
      triggerDoorOpen(visitorName, '');
    } else {
      // New visitor: open terminal prompt for name
      setStep('prompt_name');
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
    }
  };

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = inputName.trim() || visitorName || 'Guest Visitor';
    setIsSubmitting(true);
    await triggerDoorOpen(finalName);
  };

  const triggerDoorOpen = async (name: string) => {
    setVisitor(name);

    // POST entry securely to backend API (/api/visitors) without email telemetry
    try {
      await fetch('/api/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          timestamp: new Date().toISOString()
        })
      });
    } catch (err) {
      console.warn("Could not log visitor to backend:", err);
    }

    setStep('opening');

    // Handoff duration: 750ms matches door swing transition
    setTimeout(() => {
      setStep('finished');
      onComplete();
    }, 850);
  };

  return (
    <div className={`fixed inset-0 z-[10000] bg-[#070b12] flex flex-col justify-between overflow-hidden select-none font-mono-tech transition-opacity duration-700 ${step === 'finished' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      
      {/* Background Mansion & Terminal Grid Blueprint */}
      <div className="absolute inset-0 bg-blueprint-grid opacity-25 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-sky-950/20 via-transparent to-[#070b12]" />

      {/* Top Controls Bar */}
      <div className="relative z-20 flex justify-between items-center p-4 md:p-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center space-x-2 text-sky-400 text-xs tracking-wider uppercase font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>A3PK_MANSION // ACCESS_GATE</span>
        </div>

        {/* Audio Mute Toggle */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-sky-950/50 border border-sky-800/40 text-sky-300 hover:text-white hover:border-sky-500/60 transition-all text-xs"
          title={isMuted ? "Unmute doorbell chime" : "Mute doorbell chime"}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />}
          <span>{isMuted ? 'AUDIO: MUTED' : 'AUDIO: ON'}</span>
        </button>
      </div>

      {/* Main Mansion Scene Canvas */}
      <div className="relative flex-1 flex flex-col items-center justify-end pb-0 px-4 z-10">

        {/* Floating Terminal Prompt Overlay */}
        <div className="absolute top-12 md:top-20 max-w-md w-full px-4 z-30">
          {visitorName && step === 'idle' && (
            <div className="p-4 rounded-xl bg-[#0b1322]/90 border border-sky-500/40 shadow-[0_0_25px_rgba(56,189,248,0.15)] text-center space-y-2 backdrop-blur-md animate-fade-in">
              <div className="flex items-center justify-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Terminal className="w-4 h-4" />
                <span>IDENT_VERIFIED</span>
              </div>
              <p className="text-slate-200 text-xs">
                &gt; Good to see you again, <span className="text-sky-300 font-bold">{visitorName}</span>.
              </p>
              <p className="text-[11px] text-sky-400/80 animate-pulse">
                [ RING DOORBELL BELOW TO ENTER WORKSHOP ]
              </p>
            </div>
          )}

          {step === 'prompt_name' && (
            <form onSubmit={handleNameSubmit} className="p-5 rounded-xl bg-[#0b1322]/95 border border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.2)] space-y-4 backdrop-blur-md animate-slide-down">
              <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Terminal className="w-4 h-4" />
                <span>GATEKEEPER_PROMPT</span>
              </div>
              <div>
                <label className="block text-slate-300 text-xs mb-2">
                  &gt; WHO&apos;S THERE? ENTER YOUR NAME: <span className="text-rose-400">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-amber-400 text-xs">&gt;</span>
                  <input
                    ref={nameInputRef}
                    type="text"
                    required
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    placeholder="e.g. Alex"
                    className="w-full pl-7 pr-4 py-2 bg-slate-950/80 border border-slate-700/60 rounded-lg text-white text-xs focus:outline-none focus:border-amber-400 transition-all"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!inputName.trim() || isSubmitting}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs rounded-lg hover:brightness-110 disabled:opacity-40 transition-all shadow-md"
                >
                  <span>ENTER WORKSHOP</span>
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Illustrated Mansion Front Silhouette & Door Scene Structure */}
        <div className="relative w-full max-w-lg h-[420px] md:h-[480px] flex justify-center items-end">

          {/* Mansion Roof & Arch Structure */}
          <div className="absolute top-0 w-full flex flex-col items-center pointer-events-none">
            {/* Peak Roofline */}
            <div className="w-0 h-0 border-l-[140px] md:border-l-[180px] border-r-[140px] md:border-r-[180px] border-b-[60px] md:border-b-[80px] border-l-transparent border-r-transparent border-b-sky-950/40 filter drop-shadow-[0_0_15px_rgba(56,189,248,0.2)]" />
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />
          </div>

          {/* Mansion Pillars Left & Right */}
          <div className="absolute left-6 md:left-12 bottom-0 w-8 md:w-12 h-80 bg-gradient-to-b from-sky-950/40 via-slate-900/60 to-slate-950 border-x border-sky-900/40 rounded-t-sm" />
          <div className="absolute right-6 md:right-12 bottom-0 w-8 md:w-12 h-80 bg-gradient-to-b from-sky-950/40 via-slate-900/60 to-slate-950 border-x border-sky-900/40 rounded-t-sm" />

          {/* Center Doorway Frame (3D Perspective Container) */}
          <div className="relative w-44 md:w-52 h-64 md:h-72 border-t-8 border-x-8 border-slate-800 rounded-t-xl bg-slate-950 shadow-[0_0_40px_rgba(0,0,0,0.8)] flex justify-center items-end" style={{ perspective: '1200px' }}>
            
            {/* Inside Workshop Glow Revealed when door swings open */}
            <div className="absolute inset-0 bg-gradient-to-t from-amber-500/30 via-sky-500/20 to-indigo-900/40 flex flex-col items-center justify-center space-y-2 p-4 text-center">
              <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
              <span className="text-[10px] text-amber-300 font-bold uppercase tracking-widest">
                WORKSHOP_ONLINE
              </span>
            </div>

            {/* 3D Hinge Swinging Door Panel */}
            <div
              className={`absolute inset-0 bg-gradient-to-b from-slate-900 via-[#0e1726] to-slate-950 border-2 border-slate-700/80 rounded-t-lg shadow-2xl flex flex-col justify-between p-4 ${
                prefersReducedMotion ? 'transition-opacity duration-700' : 'transition-transform duration-700 ease-in-out'
              }`}
              style={{
                transformOrigin: 'left center',
                transform: step === 'opening' || step === 'finished'
                  ? (prefersReducedMotion ? 'none' : 'rotateY(-115deg)')
                  : 'rotateY(0deg)',
                opacity: (prefersReducedMotion && (step === 'opening' || step === 'finished')) ? 0 : 1,
                backfaceVisibility: 'hidden'
              }}
            >
              {/* Door Glass Panel Accent */}
              <div className="w-full h-16 border border-sky-500/30 rounded bg-sky-950/30 flex items-center justify-center">
                <div className="w-full h-0.5 bg-sky-400/30" />
              </div>

              {/* Door Center Plaque */}
              <div className="self-center px-3 py-1 border border-amber-500/30 rounded bg-slate-950/80 text-[9px] text-amber-400 tracking-widest font-bold">
                A3PK // 01
              </div>

              {/* Doorknob */}
              <div className="self-end w-3.5 h-3.5 rounded-full bg-amber-400 border border-amber-200 shadow-[0_0_8px_rgba(245,158,11,0.6)] mb-4" />
            </div>

            {/* Doorbell Trigger Button (Positioned on right door frame) */}
            <div className="absolute right-[-45px] md:right-[-55px] bottom-28 flex flex-col items-center space-y-1.5 z-40">
              <button
                onClick={handleRingDoorbell}
                disabled={step === 'opening' || step === 'finished'}
                className="group relative w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-900 border-2 border-amber-400/80 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:shadow-[0_0_25px_rgba(245,158,11,0.8)] hover:scale-110 active:scale-95 transition-all duration-300"
                title="Ring Doorbell to Enter"
              >
                {/* Glowing Pulse Rings */}
                <span className="absolute inset-0 rounded-full border border-amber-400/60 animate-ping opacity-75 pointer-events-none" />
                <Bell className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-12 transition-transform" />
              </button>

              <span className="text-[9px] text-amber-400 font-bold uppercase tracking-wider bg-slate-950/90 px-1.5 py-0.5 rounded border border-amber-500/30 shadow">
                RING
              </span>
            </div>

          </div>

          {/* Welcome Mat at base of door */}
          <div className="absolute bottom-0 w-52 md:w-60 h-4 bg-slate-900 border-t border-x border-amber-500/40 rounded-t flex items-center justify-center">
            <span className="text-[8px] text-slate-400 tracking-[0.2em] font-bold uppercase">
              WELCOME MAT // ENTER
            </span>
          </div>

        </div>

      </div>

      {/* Bottom Footer Telemetry */}
      <div className="relative z-20 flex justify-between items-center p-4 max-w-7xl mx-auto w-full text-[10px] text-slate-500 border-t border-slate-900">
        <span>STATUS: GATEWAY_STANDBY</span>
        <span className="text-sky-400/80 font-mono">BUILD. BREAK. LEARN. REPEAT.</span>
      </div>

    </div>
  );
};

export default DoorbellIntro;
