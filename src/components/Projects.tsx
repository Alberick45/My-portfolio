import React, { useState, useEffect } from 'react';
import { Github, ExternalLink, Code, Cpu, MessageSquare, Server, Globe, Sparkles, Terminal, BookOpen } from 'lucide-react';

interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  updated_at: string;
}

interface ProjectCardData {
  title: string;
  description: string;
  tags: string[];
  icon: React.ReactNode;
  gradient: string;
  badgeColor: string;
  github: string;
  link?: string;
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<ProjectCardData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Helper to format repo names (e.g. "my-awesome-repo" -> "My Awesome Repo")
  const formatTitle = (name: string): string => {
    return name
      .split(/[-_]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Helper to assign icons based on project properties
  const getIcon = (language: string | null, name: string): React.ReactNode => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('chat') || lowerName.includes('message')) return <MessageSquare size={22} />;
    if (lowerName.includes('bot') || lowerName.includes('automation') || lowerName.includes('wish')) return <Server size={22} />;
    if (lowerName.includes('portfolio') || lowerName.includes('website') || lowerName.includes('web')) return <Globe size={22} />;
    if (lowerName.includes('algorithm') || lowerName.includes('match') || lowerName.includes('game')) return <Sparkles size={22} />;
    
    const lang = language?.toLowerCase();
    if (lang === 'python') return <Cpu size={22} />;
    if (lang === 'typescript' || lang === 'javascript') return <Code size={22} />;
    if (lang === 'shell' || lang === 'batchfile') return <Terminal size={22} />;
    
    return <BookOpen size={22} />;
  };

  // Harmonious gradients and theme classes for 6 cards
  const CARD_THEMES = [
    {
      gradient: 'from-blue-500 to-indigo-600',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-100',
      iconBg: 'bg-blue-50 text-blue-600'
    },
    {
      gradient: 'from-emerald-400 to-teal-600',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      iconBg: 'bg-emerald-50 text-emerald-600'
    },
    {
      gradient: 'from-purple-500 to-indigo-500',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-100',
      iconBg: 'bg-purple-50 text-purple-600'
    },
    {
      gradient: 'from-pink-500 to-rose-500',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-100',
      iconBg: 'bg-rose-50 text-rose-600'
    },
    {
      gradient: 'from-amber-400 to-orange-500',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-100',
      iconBg: 'bg-amber-50 text-amber-600'
    },
    {
      gradient: 'from-violet-500 to-fuchsia-600',
      badgeColor: 'bg-violet-50 text-violet-700 border-violet-100',
      iconBg: 'bg-violet-50 text-violet-600'
    }
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        // Fetch repositories sorted by pushed/updated date
        const res = await fetch('https://api.github.com/users/Alberick45/repos?sort=pushed&per_page=12');
        if (!res.ok) {
          throw new Error('Failed to fetch projects from GitHub.');
        }
        const data: Repo[] = await res.json();
        
        // Filter out fork repositories (optional but usually preferred for main works)
        const userRepos = data
          .filter((repo: any) => !repo.fork)
          .slice(0, 6);

        const mappedProjects: ProjectCardData[] = userRepos.map((repo, index) => {
          const theme = CARD_THEMES[index % CARD_THEMES.length];
          
          // Generate tags: language + top topics
          const tags: string[] = [];
          if (repo.language) tags.push(repo.language);
          if (repo.topics) {
            repo.topics.slice(0, 2).forEach(t => {
              if (t.toLowerCase() !== repo.language?.toLowerCase()) {
                tags.push(t.charAt(0).toUpperCase() + t.slice(1));
              }
            });
          }
          if (tags.length === 0) tags.push('Project');

          return {
            title: formatTitle(repo.name),
            description: repo.description || 'A software project developed to solve real-world tasks. Click GitHub to see more details.',
            tags: tags,
            icon: getIcon(repo.language, repo.name),
            gradient: theme.gradient,
            badgeColor: theme.badgeColor,
            github: repo.html_url,
            link: repo.homepage || undefined
          };
        });

        setProjects(mappedProjects);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching projects.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section id="projects" className="py-16 md:py-24 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">My Projects</h2>
          <div className="w-20 h-1 bg-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            A dynamic showcase of my 6 most recent active GitHub projects, fetched directly from my profile.
          </p>
        </div>

        {loading ? (
          // Skeleton Loading UI
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white border border-gray-150 rounded-xl overflow-hidden shadow-sm animate-pulse">
                <div className="h-2 bg-gray-200"></div>
                <div className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          // Error Fallback State
          <div className="text-center py-8">
            <p className="text-red-500 font-medium mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          // Main dynamic Projects Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => {
              const theme = CARD_THEMES[index % CARD_THEMES.length];
              return (
                <div 
                  key={index} 
                  className="group bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
                >
                  <div>
                    {/* Top gradient strip */}
                    <div className={`h-2 bg-gradient-to-r ${project.gradient}`}></div>
                    
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        {/* Styled Icon Container */}
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${theme.iconBg}`}>
                          {project.icon}
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-slate-800 mb-2.5 group-hover:text-indigo-600 transition-colors">
                        {project.title}
                      </h3>
                      
                      <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tags.map((tag, idx) => (
                        <span 
                          key={idx} 
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${project.badgeColor}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center space-x-4 pt-2 border-t border-slate-50">
                      <a 
                        href={project.github} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors"
                        aria-label={`GitHub repository for ${project.title}`}
                      >
                        <Github size={18} className="mr-1" />
                        Code
                      </a>
                      {project.link && (
                        <a 
                          href={project.link} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors"
                          aria-label={`Live demo for ${project.title}`}
                        >
                          <ExternalLink size={18} className="mr-1" />
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        <div className="text-center mt-12">
          <a 
            href="https://github.com/Alberick45" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-medium shadow-md transition-all duration-200 hover:shadow-lg"
          >
            <Github size={20} className="mr-2" />
            Explore Full GitHub Profile
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;