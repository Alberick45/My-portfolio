import React from 'react';
import { useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Goals from './components/Goals';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  // Smooth scroll to section when clicking on nav links
  useEffect(() => {
    const handleScrollToElement = (e: Event) => {
      e.preventDefault();
      const target = e.currentTarget as HTMLAnchorElement;
      const id = target.getAttribute('href')?.substring(1);
      if (id) {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }
    };

    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', handleScrollToElement);
    });

    return () => {
      links.forEach(link => {
        link.removeEventListener('click', handleScrollToElement);
      });
    };
  }, []);

  return (
    <div className="font-sans min-h-screen bg-gray-50">
      <Header />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Goals />
        <Blog />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;