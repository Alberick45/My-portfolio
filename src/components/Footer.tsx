import React from 'react';
import { Heart, Github, Linkedin, Mail, Cpu } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-slate-950 text-slate-400 py-12 border-t border-sky-950/60 font-mono-tech text-xs">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-4">
            <a href="/#" className="flex items-center space-x-2 text-base font-bold text-sky-400 tracking-wider">
              <Cpu size={16} className="text-sky-400" />
              <span>ALBERT<span className="text-amber-400">.DEV</span></span>
            </a>
            <p className="text-slate-500 max-w-md leading-relaxed font-sans">
              Albert is a builder of systems, custom IoT modules, and clean user interfaces. Step into the workshop and observe the design iterations.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/albertbaiden" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-sky-400 transition-colors"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
              <a 
                href="https://linkedin.com/in/albert-baiden-amissah" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-sky-400 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a 
                href="mailto:ce-abaiden-amissah8423@st.umat.edu.gh"
                className="text-slate-500 hover:text-sky-400 transition-colors"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-bold uppercase tracking-wider mb-4">// NAVIGATION</h3>
            <ul className="space-y-2 uppercase tracking-wide text-[10px]">
              <li>
                <a href="/#" className="text-slate-500 hover:text-sky-400 transition-colors">Home</a>
              </li>
              <li>
                <a href="/#about" className="text-slate-500 hover:text-sky-400 transition-colors">About</a>
              </li>
              <li>
                <a href="/#workshop" className="text-slate-500 hover:text-sky-400 transition-colors">Workshop</a>
              </li>
              <li>
                <a href="/#journal" className="text-slate-500 hover:text-sky-400 transition-colors">Journal</a>
              </li>
              <li>
                <a href="/#roadmap" className="text-slate-500 hover:text-sky-400 transition-colors">Roadmap</a>
              </li>
              <li>
                <a href="/#contact" className="text-slate-500 hover:text-sky-400 transition-colors">Contact</a>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-bold uppercase tracking-wider mb-4">// TELEMETRY</h3>
              <ul className="space-y-2 text-slate-500 font-sans">
                <li>Tema, Ghana</li>
                <li className="font-mono-tech text-[10px]">ce-abaiden-amissah8423@st.umat.edu.gh</li>
                <li>+233 20 850 6317</li>
              </ul>
            </div>
            <a 
              href="/resume.pdf" 
              download
              className="inline-block border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 px-4 py-2 rounded-lg text-xs uppercase tracking-wide transition-all"
            >
              Terminal.exe (CV)
            </a>
          </div>
        </div>
        
        <div className="border-t border-sky-950/40 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-slate-600 text-[10px] uppercase">
          <p className="mb-4 md:mb-0">
            &copy; {currentYear} Albert Baiden-Amissah. [BUILD_STABLE]
          </p>
          <p className="flex items-center">
            Fabricated with <Heart size={10} className="text-rose-500/60 mx-1 animate-pulse" /> in Tema, GH
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;