import React from 'react';
import { Heart, Github, Linkedin, Mail, Cpu, Terminal, Compass } from 'lucide-react';

interface FooterProps {
  onNavigateSection?: (sectionId: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigateSection }) => {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (id: string, e: React.MouseEvent) => {
    if (onNavigateSection) {
      e.preventDefault();
      onNavigateSection(id);
    }
  };

  return (
    <footer className="relative z-30 bg-[#070b12] bg-blueprint-grid text-slate-300 border-t-2 border-sky-500/40 shadow-[0_-15px_50px_rgba(56,189,248,0.12)] font-mono-tech text-xs overflow-hidden">
      {/* Cyan Floor Edge Light Bar */}
      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-sky-400 to-transparent" />

      {/* Decorative Blueprint Corner Markings */}
      <div className="absolute top-3 left-4 text-[9px] text-sky-500/30 uppercase pointer-events-none select-none hidden sm:block">
        [SYS_REF_FLOOR_END_PLATE]
      </div>
      <div className="absolute top-3 right-4 text-[9px] text-sky-500/30 uppercase pointer-events-none select-none hidden sm:block">
        WORKSHOP_TERMINAL_BASE
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-10">
          
          {/* Brand & Description */}
          <div className="md:col-span-2 space-y-4">
            <a 
              href="/#" 
              onClick={(e) => handleLinkClick('home', e)}
              className="inline-flex items-center space-x-2 text-base font-bold text-sky-400 tracking-wider group"
            >
              <Cpu size={18} className="text-sky-400 group-hover:rotate-180 transition-transform duration-500" />
              <span>ALBERT<span className="text-amber-400">.DEV</span></span>
              <span className="text-[10px] bg-slate-900 border border-sky-950 text-slate-400 px-2 py-0.5 rounded font-normal uppercase">
                Workshop v2.0
              </span>
            </a>
            <p className="text-slate-400 max-w-md leading-relaxed font-sans text-xs sm:text-sm">
              Albert is a builder of physical micro-systems, CAD assemblies, and responsive interfaces.
              This 3D workshop space documents iterations, blueprints, and failed prototypes.
            </p>
            <div className="flex space-x-3 pt-1">
              <a
                href="https://github.com/albertbaiden"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-slate-900/90 border border-sky-950 hover:border-sky-400/40 text-slate-400 hover:text-sky-300 rounded-lg transition-colors"
                aria-label="GitHub"
              >
                <Github size={16} />
              </a>
              <a
                href="https://linkedin.com/in/albert-baiden-amissah"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-slate-900/90 border border-sky-950 hover:border-sky-400/40 text-slate-400 hover:text-sky-300 rounded-lg transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
              <a
                href="mailto:albertbaidenamissah@proton.me"
                className="p-2 bg-slate-900/90 border border-sky-950 hover:border-sky-400/40 text-slate-400 hover:text-sky-300 rounded-lg transition-colors"
                aria-label="Email"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-wider mb-3 text-xs flex items-center">
              <Compass size={12} className="text-sky-400 mr-1.5" />
              // NAVIGATION
            </h3>
            <ul className="space-y-2 uppercase tracking-wide text-[11px] sm:text-xs">
              <li>
                <a href="/#" onClick={(e) => handleLinkClick('home', e)} className="text-slate-400 hover:text-sky-400 transition-colors">01. Home</a>
              </li>
              <li>
                <a href="/#about" onClick={(e) => handleLinkClick('about', e)} className="text-slate-400 hover:text-sky-400 transition-colors">02. About</a>
              </li>
              <li>
                <a href="/#workshop" onClick={(e) => handleLinkClick('workshop', e)} className="text-slate-400 hover:text-sky-400 transition-colors">03. Workshop</a>
              </li>
              <li>
                <a href="/#journal" onClick={(e) => handleLinkClick('journal', e)} className="text-slate-400 hover:text-sky-400 transition-colors">04. Journal</a>
              </li>
              <li>
                <a href="/#roadmap" onClick={(e) => handleLinkClick('roadmap', e)} className="text-slate-400 hover:text-sky-400 transition-colors">05. Roadmap</a>
              </li>
              <li>
                <a href="/#contact" onClick={(e) => handleLinkClick('contact', e)} className="text-slate-400 hover:text-sky-400 transition-colors">06. Contact</a>
              </li>
            </ul>
          </div>

          {/* Telemetry & CV Button */}
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-bold uppercase tracking-wider mb-3 text-xs flex items-center">
                <Terminal size={12} className="text-amber-400 mr-1.5" />
                // TELEMETRY
              </h3>
              <ul className="space-y-1.5 text-slate-400 font-sans text-xs">
                <li className="font-mono-tech text-[11px] text-sky-300">LOC: Tema, Ghana (5.6698° N)</li>
                <li className="font-mono-tech text-[10px] break-all text-slate-400">albertbaidenamissah@proton.me</li>
                <li className="font-mono-tech text-[11px] text-slate-400">+233 20 850 6317</li>
              </ul>
            </div>
            <a
              href="/resume.pdf"
              download
              className="inline-flex items-center space-x-2 border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 px-4 py-2 rounded-lg text-xs uppercase tracking-wide transition-all shadow-md"
            >
              <Terminal size={12} className="text-sky-400" />
              <span>Download CV (PDF)</span>
            </a>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-sky-950/80 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center text-slate-500 text-[10px] uppercase space-y-3 sm:space-y-0">
          <p>
            &copy; {currentYear} Albert Baiden-Amissah. [BUILD_STABLE_V2.0]
          </p>
          <p className="flex items-center">
            Fabricated with <Heart size={10} className="text-rose-500/80 mx-1 animate-pulse" /> in Tema, GH
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;