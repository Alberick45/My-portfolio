import React from 'react';
import { Heart, BookOpen, Coffee, Globe } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">About Me</h2>
          <div className="w-20 h-1 bg-indigo-700 mx-auto mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get to know me better and discover my passion for technology and innovation.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="relative">
              <div className="relative overflow-hidden rounded-lg shadow-xl">
                <img 
                src="/albert.jpg" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
                
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-emerald-100 rounded-full -z-10"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-indigo-100 rounded-full -z-10"></div>
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Hi, I'm Albert</h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              I'm a lifelong learner, passionate about technology, solving problems, and building tools that serve both people and purpose. Whether it's automating tasks with Python or designing web platforms, I find joy in blending creativity with code and service with impact.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center">
                <Heart size={20} className="text-indigo-700 mr-2" />
                <span className="text-gray-700">20 Years Old</span>
              </div>
              <div className="flex items-center">
                <Globe size={20} className="text-indigo-700 mr-2" />
                <span className="text-gray-700">Tema, Ghana</span>
              </div>
              <div className="flex items-center">
                <BookOpen size={20} className="text-indigo-700 mr-2" />
                <span className="text-gray-700">English, French (Beginner)</span>
              </div>
              <div className="flex items-center">
                <Coffee size={20} className="text-indigo-700 mr-2" />
                <span className="text-gray-700">Tech Enthusiast</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <a 
                href="#contact" 
                className="btn-primary bg-indigo-700 hover:bg-indigo-800 text-white px-6 py-3 rounded-md font-medium transition-colors"
              >
                Contact Me
              </a>
              <a 
                href="/resume.pdf" 
                className="btn-secondary bg-white hover:bg-gray-100 text-indigo-700 border border-indigo-700 px-6 py-3 rounded-md font-medium transition-colors"
                download
              >
                Download Resume
              </a>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-indigo-50 p-6 rounded-lg transition-transform hover:scale-105">
            <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <Heart size={24} className="text-indigo-700" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">My Story</h3>
            <p className="text-gray-700">
              From creating tech accounts in primary school to developing Python applications today, my journey has been driven by curiosity and a desire to solve problems.
            </p>
          </div>
          
          <div className="bg-emerald-50 p-6 rounded-lg transition-transform hover:scale-105">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <BookOpen size={24} className="text-emerald-700" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Education</h3>
            <p className="text-gray-700">
              Currently studying and enhancing my skills through hands-on experiences, internships, and personal projects that challenge and inspire me.
            </p>
          </div>
          
          <div className="bg-amber-50 p-6 rounded-lg transition-transform hover:scale-105">
            <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <Coffee size={24} className="text-amber-700" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Interests</h3>
            <p className="text-gray-700">
              Beyond coding, I love peace and nature. I'm passionate about creating technology that helps others find happiness and makes a positive impact.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;