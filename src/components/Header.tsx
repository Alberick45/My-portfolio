import React, { useState, useEffect } from 'react';
import { Menu, X, Terminal, Cpu } from 'lucide-react';

interface HeaderProps {
  onOpenTerminal: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenTerminal }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 font-mono-tech ${
      isScrolled 
        ? 'bg-slate-950/80 backdrop-blur-md border-b border-sky-950 py-2' 
        : 'bg-transparent py-4'
    }`}>
      <div className="container mx-auto px-4 md:px-6">
        <nav className="flex justify-between items-center bg-slate-900/60 border border-sky-950/50 rounded-xl px-4 py-2.5 shadow-lg backdrop-blur-sm">
          <a href="/#" className="flex items-center space-x-2 text-lg font-bold text-sky-400 tracking-wider">
            <Cpu size={18} className="text-sky-400 animate-pulse" />
            <span>ALBERT<span className="text-amber-400">.DEV</span></span>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-normal uppercase tracking-normal hidden sm:inline-block">Workshop v2.0</span>
          </a>
          
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-sky-400 hover:text-white"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="/#" className="text-slate-300 hover:text-sky-400 transition-colors text-sm uppercase tracking-wide">Home</a>
            <a href="/#about" className="text-slate-300 hover:text-sky-400 transition-colors text-sm uppercase tracking-wide">About</a>
            <a href="/#workshop" className="text-slate-300 hover:text-sky-400 transition-colors text-sm uppercase tracking-wide">Workshop</a>
            <a href="/#journal" className="text-slate-300 hover:text-sky-400 transition-colors text-sm uppercase tracking-wide">Journal</a>
            <a href="/#roadmap" className="text-slate-300 hover:text-sky-400 transition-colors text-sm uppercase tracking-wide">Roadmap</a>
            <a href="/#contact" className="text-slate-300 hover:text-sky-400 transition-colors text-sm uppercase tracking-wide">Contact</a>
            
            <button 
              onClick={onOpenTerminal}
              className="border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 px-3.5 py-1.5 rounded-lg text-xs uppercase tracking-wide flex items-center transition-all"
            >
              <Terminal size={12} className="mr-1.5" />
              Terminal.exe
            </button>
          </div>
        </nav>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-2 bg-slate-900 border border-sky-950/80 rounded-xl p-4 flex flex-col space-y-3.5 shadow-2xl">
            <a href="/#" className="text-slate-300 hover:text-sky-400 transition-colors text-sm uppercase tracking-wide" onClick={() => setIsMenuOpen(false)}>Home</a>
            <a href="/#about" className="text-slate-300 hover:text-sky-400 transition-colors text-sm uppercase tracking-wide" onClick={() => setIsMenuOpen(false)}>About</a>
            <a href="/#workshop" className="text-slate-300 hover:text-sky-400 transition-colors text-sm uppercase tracking-wide" onClick={() => setIsMenuOpen(false)}>Workshop</a>
            <a href="/#journal" className="text-slate-300 hover:text-sky-400 transition-colors text-sm uppercase tracking-wide" onClick={() => setIsMenuOpen(false)}>Journal</a>
            <a href="/#roadmap" className="text-slate-300 hover:text-sky-400 transition-colors text-sm uppercase tracking-wide" onClick={() => setIsMenuOpen(false)}>Roadmap</a>
            <a href="/#contact" className="text-slate-300 hover:text-sky-400 transition-colors text-sm uppercase tracking-wide" onClick={() => setIsMenuOpen(false)}>Contact</a>
            <button 
              onClick={() => {
                onOpenTerminal();
                setIsMenuOpen(false);
              }}
              className="border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 px-4 py-2 rounded-lg text-sm uppercase tracking-wide flex items-center justify-center transition-all w-full"
            >
              <Terminal size={14} className="mr-2" />
              Terminal.exe
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;