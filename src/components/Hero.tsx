import React, { useEffect, useState, useRef } from 'react';
import { Code, BookOpen, Terminal, Sparkles } from 'lucide-react';

const HERO_PHRASES = [
  "Building Intelligent Systems",
  "Exploring New Technologies",
  "Turning Ideas Into Prototypes",
  "Build. Break. Learn. Repeat."
];

const Hero: React.FC = () => {
  const [typedText, setTypedText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);
  const [statusText] = useState("Exploring New Ideas"); // Configurable via dashboard state in future
  
  // Robot tracking states
  const robotRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  // Typewriter effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentFullPhrase = HERO_PHRASES[phraseIndex];

    const handleTyping = () => {
      if (!isDeleting) {
        // Typing
        setTypedText(currentFullPhrase.substring(0, typedText.length + 1));
        setTypingSpeed(100);

        if (typedText === currentFullPhrase) {
          // Pause before deleting
          timer = setTimeout(() => setIsDeleting(true), 2500);
          return;
        }
      } else {
        // Deleting
        setTypedText(currentFullPhrase.substring(0, typedText.length - 1));
        setTypingSpeed(50);

        if (typedText === "") {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % HERO_PHRASES.length);
          return;
        }
      }

      timer = setTimeout(handleTyping, typingSpeed);
    };

    timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [typedText, isDeleting, phraseIndex, typingSpeed]);

  // Detect touch/mobile
  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Mouse tracking for Robot head (only on non-touch devices)
  useEffect(() => {
    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!robotRef.current) return;
      const rect = robotRef.current.getBoundingClientRect();
      const robotCenterX = rect.left + rect.width / 2;
      const robotCenterY = rect.top + rect.height / 2;
      
      const dx = e.clientX - robotCenterX;
      const dy = e.clientY - robotCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Normalize and limit tracking movement
      const maxDist = 300;
      const factor = Math.min(distance / maxDist, 1.0) * 12; // Max offset in pixels
      const angle = Math.atan2(dy, dx);
      
      setMousePos({
        x: Math.cos(angle) * factor,
        y: Math.sin(angle) * factor
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isTouch]);

  // Mobile idle sway and scroll tracking
  useEffect(() => {
    if (!isTouch) return;

    let animationFrameId: number;

    const handleScroll = () => {
      if (!robotRef.current) return;
      const scrollY = window.scrollY;
      const threshold = window.innerHeight; // Max scroll depth for tilt
      const scrollFactor = Math.min(scrollY / threshold, 1);
      
      // Target Y goes from 0 (centered) to 9 (looking down)
      const targetY = scrollFactor * 9;
      setMousePos(prev => ({ ...prev, y: targetY }));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const updateIdle = (time: number) => {
      const seconds = time / 1000;
      // Gentle horizontal looking back and forth using sine wave
      const targetX = Math.sin(seconds * 0.5) * 6; // Max 6px horizontal offset
      
      setMousePos(prev => ({ ...prev, x: targetX }));
      animationFrameId = requestAnimationFrame(updateIdle);
    };

    animationFrameId = requestAnimationFrame(updateIdle);
    handleScroll(); // Initial position check

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isTouch]);

  // Blinking loop
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 4000);

    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-16 bg-blueprint-grid bg-[#090d16]">
      {/* Blueprint Grid layout overlay */}
      <div className="absolute inset-0 bg-dot-grid opacity-40 pointer-events-none"></div>
      
      {/* Decorative Blueprint Corner Markings */}
      <div className="absolute top-24 left-6 text-sky-500/20 font-mono-tech text-xs pointer-events-none select-none">
        [SYS_REF_001_HP]
      </div>
      <div className="absolute bottom-6 right-6 text-sky-500/20 font-mono-tech text-xs pointer-events-none select-none">
        SCALE: 1:1 / LOC: GHANA
      </div>

      <div className="container mx-auto px-4 md:px-6 z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Mission, Title, and Buttons */}
        <div className="lg:col-span-7 space-y-6 text-left">
          
          {/* Status Badge */}
          <div className="inline-flex items-center space-x-2 bg-slate-900 border border-sky-500/30 rounded-lg px-3 py-1.5 text-xs font-mono-tech text-sky-400">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span>STATUS: {statusText.toUpperCase()}</span>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-mono-tech uppercase tracking-[0.25em] text-slate-400">
              // Albert Baiden-Amissah
            </h2>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
              The Engineering <span className="text-sky-400 underline decoration-sky-500/30 underline-offset-8">Workshop</span>
            </h1>
          </div>

          {/* Typewriter text phrase display */}
          <div className="h-12 flex items-center bg-slate-950/60 border border-sky-950/50 rounded-lg px-4 font-mono-tech text-lg md:text-xl text-amber-400">
            <span>&gt; {typedText}</span>
            <span className="ml-1 w-2.5 h-5 bg-amber-400 animate-[typewriter-blink_1s_infinite]"></span>
          </div>

          <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-xl font-sans">
            Welcome to the laboratory. This space showcases real-world systems, CAD blueprints, custom firmware iterations, and failed prototypes.
            Explore engineering thinking behind autonomous designs and custom-built IoT nodes.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <a 
              href="#workshop" 
              className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-mono-tech font-bold uppercase tracking-wider text-xs px-6 py-3.5 rounded-lg transition-all flex items-center shadow-lg shadow-sky-500/10"
            >
              <Code size={16} className="mr-2" />
              Explore Workshop
            </a>
            <a 
              href="#journal" 
              className="bg-slate-900 hover:bg-slate-850 text-sky-400 border border-sky-500/20 font-mono-tech font-bold uppercase tracking-wider text-xs px-6 py-3.5 rounded-lg transition-all flex items-center"
            >
              <BookOpen size={16} className="mr-2" />
              Read Journal
            </a>
          </div>
          
          <div className="flex items-center space-x-2 text-xs font-mono-tech text-slate-500 pt-4">
            <Terminal size={12} className="text-sky-500/50" />
            <span>Type `/help` to query capabilities. Scroll to descend.</span>
          </div>

        </div>

        {/* Right Column: Interactive Robot Mascot */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <div 
            ref={robotRef} 
            className="relative w-72 h-80 md:w-80 md:h-96 panel-workshop rounded-2xl flex flex-col justify-center items-center p-6 border-sky-500/10 select-none group hover:border-sky-500/30 transition-all duration-500"
          >
            {/* Corner Bracket Accents */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-sky-500/30"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-sky-500/30"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-sky-500/30"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-sky-500/30"></div>
            
            {/* HUD Overlay Stats */}
            <div className="absolute top-4 left-4 right-4 flex justify-between font-mono-tech text-[10px] text-slate-500">
              <span className="flex items-center"><Sparkles size={10} className="mr-1 text-amber-500 animate-spin" /> MASCOT: OK-02</span>
              <span>ANGLE: {(Math.atan2(mousePos.y, mousePos.x) * 180 / Math.PI).toFixed(0)}°</span>
            </div>

            {/* Robot SVG */}
            <svg 
              viewBox="0 0 200 240" 
              className="w-48 h-56 md:w-56 md:h-64 filter drop-shadow-[0_0_12px_rgba(56,189,248,0.1)]"
            >
              {/* Neck Connector */}
              <rect x="90" y="85" width="20" height="20" rx="3" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
              <line x1="94" y1="90" x2="106" y2="90" stroke="#38bdf8" strokeWidth="2" strokeDasharray="2 1" />
              <line x1="94" y1="96" x2="106" y2="96" stroke="#38bdf8" strokeWidth="2" strokeDasharray="2 1" />

              {/* Antenna / Receivers */}
              <line x1="100" y1="40" x2="100" y2="20" stroke="#38bdf8" strokeWidth="3" />
              <circle cx="100" cy="17" r="4" fill="#fb923c" className="animate-ping" />
              <circle cx="100" cy="17" r="4" fill="#fb923c" />

              {/* Head Base & Cap - Tracks cursor coordinates */}
              <g style={{ transform: `translate(${mousePos.x * 0.8}px, ${mousePos.y * 0.8}px)`, transition: 'transform 0.1s ease-out' }}>
                {/* Ears */}
                <rect x="42" y="47" width="8" height="22" rx="2" fill="#334155" stroke="#38bdf8" strokeWidth="2" />
                <rect x="150" y="47" width="8" height="22" rx="2" fill="#334155" stroke="#38bdf8" strokeWidth="2" />
                
                {/* Head Body */}
                <rect x="48" y="38" width="104" height="50" rx="12" fill="#0f172a" stroke="#38bdf8" strokeWidth="3" />
                
                {/* Eyes Tracking Panel */}
                <g style={{ transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)` }}>
                  {isBlinking ? (
                    // Blink State (Horizontal lines)
                    <>
                      <line x1="68" y1="62" x2="88" y2="62" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
                      <line x1="112" y1="62" x2="132" y2="62" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
                    </>
                  ) : (
                    // Regular Eyes
                    <>
                      {/* Left Eye Socket */}
                      <circle cx="78" cy="62" r="10" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
                      {/* Left Pupil */}
                      <circle cx={78 + mousePos.x * 0.25} cy={62 + mousePos.y * 0.25} r="5" fill="#38bdf8" className="animate-pulse" />
                      
                      {/* Right Eye Socket */}
                      <circle cx="122" cy="62" r="10" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
                      {/* Right Pupil */}
                      <circle cx={122 + mousePos.x * 0.25} cy={62 + mousePos.y * 0.25} r="5" fill="#38bdf8" className="animate-pulse" />
                    </>
                  )}
                </g>

                {/* Mouth Line */}
                <line x1="85" y1="78" x2="115" y2="78" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 2" />
              </g>

              {/* Main Body */}
              <rect x="58" y="102" width="84" height="100" rx="14" fill="#0f172a" stroke="#38bdf8" strokeWidth="3" />

              {/* Chest Screen LED Matrix */}
              <rect x="70" y="116" width="60" height="34" rx="6" fill="#020617" stroke="#38bdf8" strokeWidth="2" />
              
              {/* Floating Waves Inside Chest Screen */}
              <path 
                d="M74,133 Q82,123 90,133 T106,133 T122,133" 
                fill="none" 
                stroke="#fb923c" 
                strokeWidth="2" 
                className="animate-pulse"
              />

              {/* Status Screws */}
              <circle cx="68" cy="188" r="3" fill="#334155" stroke="#38bdf8" strokeWidth="1" />
              <circle cx="132" cy="188" r="3" fill="#334155" stroke="#38bdf8" strokeWidth="1" />
              
              {/* Limbs / Arms */}
              {/* Left Shoulder & Arm */}
              <circle cx="48" cy="120" r="6" fill="#334155" stroke="#38bdf8" strokeWidth="2" />
              <path d="M42,120 L26,145 L32,160" fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
              
              {/* Right Shoulder & Arm */}
              <circle cx="152" cy="120" r="6" fill="#334155" stroke="#38bdf8" strokeWidth="2" />
              <path d="M158,120 L174,145 L168,160" fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
            </svg>

            {/* Bottom Mascots Stats Terminal */}
            <div className="w-full mt-4 bg-slate-950/80 rounded-lg p-2.5 border border-sky-950 font-mono-tech text-[10px] text-sky-400 space-y-0.5">
              <div className="flex justify-between">
                <span>SYSTEM MODE:</span>
                <span className="text-amber-400">{isTouch ? "AUTO_PATROL_SCROLL" : "MONITOR_CURSOR"}</span>
              </div>
              <div className="flex justify-between">
                <span>MASCOT COORDS:</span>
                <span>X: {mousePos.x.toFixed(1)}, Y: {mousePos.y.toFixed(1)}</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;