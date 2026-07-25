import React, { useState } from 'react';
import { useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Goals from './components/Goals';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Footer from './components/Footer';
import TerminalConsole from './components/TerminalConsole';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
      window.scrollTo({ top: 0, behavior: 'instant' as any });
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('pushstate-changed', handleLocationChange);

    // Global interceptor for client-side navigation
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor && anchor.href) {
        const url = new URL(anchor.href);
        if (url.origin === window.location.origin) {
          const path = url.pathname;
          const hash = url.hash;

          // If moving to/from journal or across pages
          if (path === '/journal' || (path === '/' && window.location.pathname !== '/')) {
            e.preventDefault();
            window.history.pushState({}, '', path + hash);
            window.dispatchEvent(new Event('pushstate-changed'));

            // If navigating back to homepage with a hash, scroll to that element
            if (path === '/' && hash) {
              setTimeout(() => {
                const element = document.getElementById(hash.substring(1));
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }, 150);
            }
          } else if (path === '/' && hash) {
            // Already on home page, handle smooth scroll
            e.preventDefault();
            const element = document.getElementById(hash.substring(1));
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('pushstate-changed', handleLocationChange);
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  // Intersection Observer for scroll reveal animations
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -10% 0px', // triggers when element is 10% inside the viewport
      threshold: 0.02
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
        } else {
          // Reset when scrolling away to make scroll transition exciting on repeat
          entry.target.classList.remove('reveal-active');
        }
      });
    }, observerOptions);

    const observeElements = () => {
      const elements = document.querySelectorAll('.reveal-element');
      elements.forEach(el => observer.observe(el));
    };

    // Wait slightly for components to fully paint
    const timer = setTimeout(observeElements, 150);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [currentPath]);

  return (
    <div className="font-sans min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-between selection:bg-sky-500/30 selection:text-sky-200">
      <div>
        <Header onOpenTerminal={() => setIsTerminalOpen(true)} />
        <main>
          {currentPath === '/journal' ? (
            <Blog teaser={false} />
          ) : (
            <>
              <Hero />
              <About />
              <Projects />
              <Blog teaser={true} />
              <Goals />
              <Contact />
            </>
          )}
        </main>
      </div>
      <Footer />
      <TerminalConsole isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />
    </div>
  );
}

export default App;