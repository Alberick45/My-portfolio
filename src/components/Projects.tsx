import React from 'react';
import { Github, ExternalLink, Code, Cpu, MessageSquare, Server, Globe, Sparkles } from 'lucide-react';

interface Project {
  title: string;
  description: string;
  tags: string[];
  icon: React.ReactNode;
  color: string;
  link?: string;
  github?: string;
  inProgress?: boolean;
}

const Projects: React.FC = () => {
  const projects: Project[] = [
    {
      title: 'BuzzChat Support',
      description: 'Volunteer position providing customer support and troubleshooting for BuzzChat users, helping resolve technical issues and improve user experience.',
      tags: ['Customer Support', 'Troubleshooting', 'User Experience'],
      icon: <MessageSquare size={24} />,
      color: 'bg-yellow-500',
      link: 'https://Buzzchat.site'
    },
    {
      title: 'Shadowfox Internship',
      description: 'Python development internship focused on building automation tools and implementing object-oriented programming principles for real-world applications.',
      tags: ['Python', 'Automation', 'OOP'],
      icon: <Cpu size={24} />,
      color: 'bg-blue-600',
      github: 'https://github.com/Alberick45/ShadowFox.git'
    },
    {
      title: 'Personal Manager Website',
      description: 'A comprehensive productivity and organization tool designed to help users manage tasks, schedule events, and organize their personal and professional lives.',
      tags: ['Web Development', 'Productivity', 'Organization'],
      icon: <Globe size={24} />,
      color: 'bg-indigo-600',
      inProgress: true,
      link: 'https://personal-manager-olive.vercel.app/'
    },
    {
      title: 'The Mood Match',
      description: 'An innovative concept platform that intelligently matches users with music, movies, or activities based on their current mood and preferences.',
      tags: ['Concept', 'Matching Algorithm', 'User Experience'],
      icon: <Sparkles size={24} />,
      color: 'bg-purple-600',
      inProgress: true,
      link: 'https://mood-match-phi.vercel.app/'
    },
    {
      title: 'Birthday Wishing Site',
      description: 'An automated message system that sends personalized birthday wishes to friends and family members, designed to maintain connections even during busy times.',
      tags: ['Automation', 'Web Development'],
      icon: <Server size={24} />,
      color: 'bg-rose-500',
      github: 'https://github.com/Alberick45/BirthdayWishAutomation.git'
    },
    {
      title: 'Prayer Platform',
      description: 'A spiritually centered social platform for reflection, connection, and community building, allowing users to share and receive prayer support.',
      tags: ['Community', 'Spiritual', 'Social Platform'],
      icon: <Code size={24} />,
      color: 'bg-emerald-500',
      github: '#'
    }
  ];

  return (
    <section id="projects" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">My Projects</h2>
          <div className="w-20 h-1 bg-indigo-700 mx-auto mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            A collection of my current and past projects, internships, and volunteer experiences.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div 
              key={index} 
              className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1"
            >
              <div className={`h-2 ${project.color}`}></div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${project.color.replace('bg-', 'bg-').replace('500', '100')} ${project.color.replace('bg-', 'text-')}`}>
                    {project.icon}
                  </div>
                  {project.inProgress && (
                    <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      In Progress
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                <p className="text-gray-700 mb-4">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, idx) => (
                    <span 
                      key={idx} 
                      className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex space-x-3 mt-4">
                  {project.github && (
                    <a 
                      href={project.github} 
                      className="text-gray-700 hover:text-indigo-700 transition-colors"
                      aria-label={`GitHub repository for ${project.title}`}
                    >
                      <Github size={20} />
                    </a>
                  )}
                  {project.link && (
                    <a 
                      href={project.link} 
                      className="text-gray-700 hover:text-indigo-700 transition-colors"
                      aria-label={`Live link for ${project.title}`}
                    >
                      <ExternalLink size={20} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <a 
            href="https://github.com/Alberick45" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-md font-medium transition-colors"
          >
            <Github size={20} className="mr-2" />
            See More on GitHub
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;