import React, { useState, useEffect } from 'react';
import { Menu, X, Download } from 'lucide-react';

const Header: React.FC = () => {
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
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
    }`}>
      <div className="container mx-auto px-4 md:px-6">
        <nav className="flex justify-between items-center">
          <a href="#" className="text-2xl font-bold text-indigo-900 transition-colors">
            Albert<span className="text-emerald-600">.dev</span>
          </a>
          
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-800"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#about" className="text-gray-700 hover:text-indigo-700 transition-colors">About</a>
            <a href="#skills" className="text-gray-700 hover:text-indigo-700 transition-colors">Skills</a>
            <a href="#projects" className="text-gray-700 hover:text-indigo-700 transition-colors">Projects</a>
            <a href="#goals" className="text-gray-700 hover:text-indigo-700 transition-colors">Goals</a>
            <a href="#blog" className="text-gray-700 hover:text-indigo-700 transition-colors">Blog</a>
            <a href="#contact" className="text-gray-700 hover:text-indigo-700 transition-colors">Contact</a>
            <a 
              href="/resume.pdf" 
              className="bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center hover:bg-indigo-800 transition-colors"
              download
            >
              <Download size={16} className="mr-2" />
              Resume
            </a>
          </div>
        </nav>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white absolute top-full left-0 w-full shadow-md py-4 px-4 flex flex-col space-y-4">
            <a href="#about" className="text-gray-700 hover:text-indigo-700 transition-colors" onClick={() => setIsMenuOpen(false)}>About</a>
            <a href="#skills" className="text-gray-700 hover:text-indigo-700 transition-colors" onClick={() => setIsMenuOpen(false)}>Skills</a>
            <a href="#projects" className="text-gray-700 hover:text-indigo-700 transition-colors" onClick={() => setIsMenuOpen(false)}>Projects</a>
            <a href="#goals" className="text-gray-700 hover:text-indigo-700 transition-colors" onClick={() => setIsMenuOpen(false)}>Goals</a>
            <a href="#blog" className="text-gray-700 hover:text-indigo-700 transition-colors" onClick={() => setIsMenuOpen(false)}>Blog</a>
            <a href="#contact" className="text-gray-700 hover:text-indigo-700 transition-colors" onClick={() => setIsMenuOpen(false)}>Contact</a>
            <a 
              href="/resume.pdf" 
              className="bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center hover:bg-indigo-800 transition-colors w-fit"
              download
            >
              <Download size={16} className="mr-2" />
              Resume
            </a>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;