import React, { useEffect, useRef } from 'react';
import { Code, Cpu, MessageSquare } from 'lucide-react';

const Hero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.color = `rgba(99, 102, 241, ${Math.random() * 0.3 + 0.1})`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    // Create particle array
    const particles: Particle[] = [];
    for (let i = 0; i < 50; i++) {
      particles.push(new Particle());
    }

    // Draw lines between particles
    const drawLines = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            if (!ctx) return;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 - distance/1000})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    };

    // Animation loop
    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      drawLines();
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full -z-10"></canvas>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/80 to-transparent -z-10"></div>
      
      <div className="container mx-auto px-4 md:px-6 z-10 mt-16">
        <div className="text-center">
          <p className="text-indigo-700 font-medium mb-4 animate-fade-in">Tech Enthusiast & Developer</p>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Hello, I'm <span className="text-indigo-700">Albert</span> Baiden-Amissah
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-8">
            A passionate tech enthusiast and developer from Ghana, building solutions that blend creativity with code and service with impact.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="#projects" 
              className="btn-primary bg-indigo-700 hover:bg-indigo-800 text-white px-6 py-3 rounded-md font-medium transition-colors flex items-center"
            >
              <Code size={20} className="mr-2" />
              View Projects
            </a>
            <a 
              href="#contact" 
              className="btn-secondary bg-white hover:bg-gray-100 text-indigo-700 border border-indigo-700 px-6 py-3 rounded-md font-medium transition-colors flex items-center"
            >
              <MessageSquare size={20} className="mr-2" />
              Get in Touch
            </a>
          </div>
          
          <div className="flex justify-center mt-16 space-x-8">
            <div className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-full shadow-md mb-3">
                <Code size={24} className="text-indigo-700" />
              </div>
              <p className="text-gray-700">Web Development</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-full shadow-md mb-3">
                <Cpu size={24} className="text-indigo-700" />
              </div>
              <p className="text-gray-700">Python Development</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-full shadow-md mb-3">
                <MessageSquare size={24} className="text-indigo-700" />
              </div>
              <p className="text-gray-700">Tech Support</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;