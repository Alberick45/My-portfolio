import React from 'react';
import { Heart, Github, Linkedin, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <a href="#" className="text-2xl font-bold mb-4 inline-block">
              Albert<span className="text-emerald-400">.dev</span>
            </a>
            <p className="text-gray-400 max-w-md mb-6">
              A passionate tech enthusiast and developer from Ghana, building solutions that blend creativity with code and service with impact.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/albertbaiden" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a 
                href="https://linkedin.com/in/albert-baiden-amissah" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="mailto:ce-abaiden-amissah8423@st.umat.edu.gh"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="text-gray-400 hover:text-white transition-colors">About</a>
              </li>
              <li>
                <a href="#skills" className="text-gray-400 hover:text-white transition-colors">Skills</a>
              </li>
              <li>
                <a href="#projects" className="text-gray-400 hover:text-white transition-colors">Projects</a>
              </li>
              <li>
                <a href="#goals" className="text-gray-400 hover:text-white transition-colors">Goals</a>
              </li>
              <li>
                <a href="#blog" className="text-gray-400 hover:text-white transition-colors">Blog</a>
              </li>
              <li>
                <a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Tema, Ghana</li>
              <li>ce-abaiden-amissah8423@st.umat.edu.gh</li>
              <li>+233 20 850 6317</li>
            </ul>
            <a 
              href="/resume.pdf" 
              download
              className="mt-4 inline-block bg-indigo-700 hover:bg-indigo-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Download Resume
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {currentYear} Albert Baiden-Amissah. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm flex items-center">
            Made with <Heart size={14} className="text-red-500 mx-1" /> and code
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;