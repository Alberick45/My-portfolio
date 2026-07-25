import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Cpu, HardDrive, Compass, BookOpen, Layers, Lightbulb } from 'lucide-react';

const About: React.FC = () => {
  const [mousePosPct, setMousePosPct] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);
  const [spotlightRadius, setSpotlightRadius] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const trailIdRef = useRef(0);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosPct({ x, y });
    setSpotlightRadius(0.05); // narrower active area

    setTrail((prev) => {
      const next = [...prev, { x, y, id: trailIdRef.current++ }];
      if (next.length > 12) next.shift(); // keep trail points
      return next;
    });

    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    inactivityTimerRef.current = setTimeout(() => {
      setSpotlightRadius(0); // Fade off spotlight when mouse is stable
    }, 250);
  };

  useEffect(() => {
    if (!isHovered) {
      setTrail([]);
      setSpotlightRadius(0);
      return;
    }
    const interval = setInterval(() => {
      setTrail((prev) => {
        if (prev.length === 0) return prev;
        return prev.slice(1); // Gradually fade tail (slower speed)
      });
    }, 110);
    return () => clearInterval(interval);
  }, [isHovered]);

  useEffect(() => {
    return () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, []);

  return (
    <section id="about" className="py-20 bg-blueprint-grid bg-[#090d16] border-t border-sky-950/40 relative">
      <div className="absolute inset-0 bg-dot-grid opacity-30 pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-6 z-10 relative">

        {/* Section Header */}
        <div className="mb-16 border-b border-sky-950/80 pb-6 flex flex-col md:flex-row md:items-end justify-between">
          <div>
            <span className="font-mono-tech text-xs text-sky-500 uppercase tracking-widest">// DECLASSIFIED DOSSIER</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mt-1">
              About <span className="text-sky-400">Albert</span>
            </h2>
          </div>
          <div className="text-slate-400 text-xs font-mono-tech flex items-center gap-4 mt-4 md:mt-0">
            <span>STATUS: ACTIVE_BUILDER</span>
            <span className="text-sky-500">//</span>
            <span>LOC: GH_ACCRA</span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Col 1: Bio Column */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
            <div className="panel-workshop p-6 rounded-xl border-sky-500/10 bg-slate-900/40 relative overflow-hidden flex-1 flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-3xl"></div>

              <div>
                <h3 className="font-mono-tech text-sky-400 text-sm mb-4 flex items-center">
                  <Terminal size={16} className="mr-2" />
                  IDENTITY_QUERY.sh
                </h3>
                <p className="text-slate-300 text-xs leading-relaxed mb-4">
                  I am a multidisciplinary engineer who loves building concrete physical interfaces and back-end architectures.
                  My projects focus on optimizing performance, learning from design iterations, and creating tactile digital experiences.
                </p>
                <p className="text-slate-300 text-xs leading-relaxed">
                  I believe in learning through building and documentation, creating systems that are both highly functional and visually clean.
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-sky-950/60">
                <h3 className="font-mono-tech text-sky-400 text-sm mb-3 flex items-center">
                  <Layers size={16} className="mr-2" />
                  CURRENT_FOCUS.log
                </h3>
                <p className="text-slate-300 leading-relaxed font-sans text-xs">
                  Right now, I like exploring embedded logic on ESP32 boards and building systems that bridge the gap between software services and the physical world.
                  I am currently experimenting with custom wireless communication protocols, local AI integrations, and structural CAD prototyping.
                </p>
              </div>
            </div>
          </div>

          {/* Col 2: Stylized Portrait Frame */}
          <div className="lg:col-span-4 flex">
            <div className="panel-workshop p-3 rounded-xl border-sky-500/10 relative overflow-hidden group w-full flex flex-col justify-between">
              <div className="absolute top-2 left-2 text-[8px] font-mono-tech text-sky-500/60 uppercase tracking-widest">// ALBERT_PORTRAIT.bin</div>
              <div className="absolute bottom-2 right-2 text-[8px] font-mono-tech text-sky-500/60 uppercase tracking-widest">SYS_REF: AB-45</div>

              <div
                ref={containerRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="relative overflow-hidden rounded-lg flex-1 min-h-[340px] bg-slate-950/40 cursor-crosshair group-hover:scale-[1.02] transition-transform duration-500"
              >
                {/* SVG Image masking container for fluid/acid effect */}
                <svg className="absolute inset-0 w-full h-full rounded-lg pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    {/* Acid distortion filter */}
                    <filter id="acid-distortion" x="-50%" y="-50%" width="200%" height="200%">
                      <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="4" result="noise" />
                      <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.22" xChannelSelector="R" yChannelSelector="G" />
                    </filter>
                    {/* Bounding box relative mask */}
                    <mask id="liquid-mask" maskContentUnits="objectBoundingBox">
                      <rect width="1" height="1" fill="black" />
                      {/* Active fluid trail circles */}
                      {trail.map((point, idx) => {
                        const ratio = (idx + 1) / trail.length;
                        return (
                          <circle
                            key={point.id}
                            cx={point.x / 100}
                            cy={point.y / 100}
                            r={0.07 * ratio}
                            fill="white"
                            filter="url(#acid-distortion)"
                          />
                        );
                      })}
                      {/* Cursor spotlight - shrinks when mouse stops */}
                      <circle
                        cx={mousePosPct.x / 100}
                        cy={mousePosPct.y / 100}
                        r={spotlightRadius}
                        fill="white"
                        filter="url(#acid-distortion)"
                        style={{ transition: 'r 0.35s cubic-bezier(0.19, 1, 0.22, 1)' }}
                      />
                    </mask>
                  </defs>

                  {/* Base Grayscale Image */}
                  {/* Base Grayscale Image */}
                  <image
                    href="/albert-transparent.png"
                    width="100%"
                    height="100%"
                    preserveAspectRatio="xMidYMid slice"
                    className="grayscale contrast-125 brightness-90 transition-all duration-500"
                  />

                  {/* Masked Color Image - matched scale, background removed */}
                  <image
                    href="/albert2-transparent.png"
                    width="100%"
                    height="100%"
                    preserveAspectRatio="xMidYMid slice"
                    mask="url(#liquid-mask)"
                  />
                </svg>

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 pointer-events-none z-20"></div>
                {/* Scanner/Scanline effect */}
                <div className="absolute inset-0 bg-scanline pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity z-30"></div>
                {/* Blueprint crosshairs / corners */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-sky-500/40 z-30 pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-sky-500/40 z-30 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-sky-500/40 z-30 pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-sky-500/40 z-30 pointer-events-none"></div>
              </div>
            </div>
          </div>

          {/* Col 3: Current Explorations Box */}
          <div className="lg:col-span-4 flex">
            <div className="panel-workshop p-6 rounded-xl border-amber-500/20 bg-slate-900/40 relative overflow-hidden h-full flex flex-col justify-between w-full">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl"></div>

              <div>
                <h3 className="font-mono-tech text-amber-400 text-sm mb-4 flex items-center">
                  <Lightbulb size={16} className="mr-2 animate-pulse" />
                  ACTIVE_EXPLORATIONS.md
                </h3>

                <p className="text-slate-300 text-xs leading-relaxed mb-4">
                  A showcase of active learning paths and technologies currently being tested in the workshop:
                </p>

                <div className="space-y-3 font-mono-tech text-[10px]">
                  <div className="flex items-start justify-between border-b border-sky-950/40 pb-2">
                    <span className="text-slate-400">1. Edge AI Hardware</span>
                    <span className="text-amber-400 font-semibold">TENSORFLOW_LITE</span>
                  </div>
                  <div className="flex items-start justify-between border-b border-sky-950/40 pb-2">
                    <span className="text-slate-400">2. Real-Time Kernels</span>
                    <span className="text-amber-400 font-semibold">FREERTOS_ESP32</span>
                  </div>
                  <div className="flex items-start justify-between border-b border-sky-950/40 pb-2">
                    <span className="text-slate-400">3. Generative UI Models</span>
                    <span className="text-amber-400 font-semibold">LLM_CODE_GEN</span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="text-slate-400">4. High-Freq Telemetry</span>
                    <span className="text-amber-400 font-semibold">LORA_PROTOCOLS</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg text-[9px] text-amber-500/80 font-mono-tech">
                // Growth mindset indicator: Albert values continuous exploration over rigid expertise metrics.
              </div>
            </div>
          </div>

        </div>

        {/* Grouped Capability Areas (No ratings/percentages) */}
        <div>
          <h3 className="font-mono-tech text-slate-400 text-xs uppercase tracking-widest mb-6">
            // CAPABILITY_MATRICES (ALPHABETICAL LISTING)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Hardware Card */}
            <div className="panel-workshop p-5 rounded-xl border-sky-500/10 hover:border-sky-500/30 transition-all">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-sky-950/50 rounded-lg border border-sky-500/20">
                  <Cpu size={16} className="text-sky-400" />
                </div>
                <h4 className="font-mono-tech font-bold text-sm text-white uppercase">01. Hardware</h4>
              </div>
              <ul className="space-y-1.5 font-mono-tech text-xs text-slate-400 pl-2 border-l border-sky-950">
                <li>ESP32 / ESP8266 Microcontrollers</li>
                <li>Arduino Prototyping Ecosystem</li>
                <li>I2C / SPI Communication Interfaces</li>
                <li>Sensor Telemetry Integration</li>
                <li>Basic Circuit Diagnostics</li>
              </ul>
            </div>

            {/* Software Card */}
            <div className="panel-workshop p-5 rounded-xl border-sky-500/10 hover:border-sky-500/30 transition-all">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-sky-950/50 rounded-lg border border-sky-500/20">
                  <Terminal size={16} className="text-sky-400" />
                </div>
                <h4 className="font-mono-tech font-bold text-sm text-white uppercase">02. Software</h4>
              </div>
              <ul className="space-y-1.5 font-mono-tech text-xs text-slate-400 pl-2 border-l border-sky-950">
                <li>TypeScript & JavaScript (React, Node)</li>
                <li>Python (Scripting & Automation)</li>
                <li>C / C++ (Firmware & Driver Logic)</li>
                <li>RESTful & WebSocket Protocol Endpoints</li>
                <li>Git Versioning Control</li>
              </ul>
            </div>

            {/* Artificial Intelligence Card */}
            <div className="panel-workshop p-5 rounded-xl border-sky-500/10 hover:border-sky-500/30 transition-all">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-sky-950/50 rounded-lg border border-sky-500/20">
                  <HardDrive size={16} className="text-sky-400" />
                </div>
                <h4 className="font-mono-tech font-bold text-sm text-white uppercase">03. Artificial Intelligence</h4>
              </div>
              <ul className="space-y-1.5 font-mono-tech text-xs text-slate-400 pl-2 border-l border-sky-950">
                <li>Prompt Design Patterns & Pipelines</li>
                <li>OpenAI / Anthropic SDK Integrations</li>
                <li>Vector Store Embeddings</li>
                <li>Local Model API Setups</li>
              </ul>
            </div>

            {/* CAD Card */}
            <div className="panel-workshop p-5 rounded-xl border-sky-500/10 hover:border-sky-500/30 transition-all">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-sky-950/50 rounded-lg border border-sky-500/20">
                  <Layers size={16} className="text-sky-400" />
                </div>
                <h4 className="font-mono-tech font-bold text-sm text-white uppercase">04. CAD & Fabrication</h4>
              </div>
              <ul className="space-y-1.5 font-mono-tech text-xs text-slate-400 pl-2 border-l border-sky-950">
                <li>Fusion 360 Solid Modeling</li>
                <li>3D Component Assembly Setup</li>
                <li>FDM 3D Printing Prototyping</li>
                <li>Enclosure Drafting & Slicing</li>
              </ul>
            </div>

            {/* Design Card */}
            <div className="panel-workshop p-5 rounded-xl border-sky-500/10 hover:border-sky-500/30 transition-all">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-sky-950/50 rounded-lg border border-sky-500/20">
                  <Compass size={16} className="text-sky-400" />
                </div>
                <h4 className="font-mono-tech font-bold text-sm text-white uppercase">05. Interface Design</h4>
              </div>
              <ul className="space-y-1.5 font-mono-tech text-xs text-slate-400 pl-2 border-l border-sky-950">
                <li>Figma Workspace Schematics</li>
                <li>Responsive Web Grid Systems</li>
                <li>Dark Mode Color Harmonics</li>
                <li>Interactive Micro-Animations</li>
              </ul>
            </div>

            {/* Tools Card */}
            <div className="panel-workshop p-5 rounded-xl border-sky-500/10 hover:border-sky-500/30 transition-all">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-sky-950/50 rounded-lg border border-sky-500/20">
                  <BookOpen size={16} className="text-sky-400" />
                </div>
                <h4 className="font-mono-tech font-bold text-sm text-white uppercase">06. Systems Tools</h4>
              </div>
              <ul className="space-y-1.5 font-mono-tech text-xs text-slate-400 pl-2 border-l border-sky-950">
                <li>Docker Container Containers</li>
                <li>Linux Terminal Environments</li>
                <li>Vite & Webpack Build Pipelines</li>
                <li>VS Code / PlatformIO IDEs</li>
              </ul>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default About;