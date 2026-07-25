import React, { useState, useEffect } from 'react';
import { 
  Code, Github, ExternalLink, Cpu, Hammer, 
  Lightbulb, Layers, Settings, FileText, 
  AlertTriangle, CheckCircle, Info, Flame,
  Maximize2, Minimize2, ArrowLeft, Download, Wrench, Plus, Trash2, Edit2
} from 'lucide-react';

interface TimelineEvent {
  id: string;
  type: 'idea' | 'doc' | 'prototype' | 'firmware' | 'cad' | 'feature' | 'removal' | 'bug' | 'fix' | 'release' | 'media';
  title: string;
  date: string;
  description: string;
  milestone?: boolean;
}

interface BuildLog {
  id: string;
  title: string;
  version: string;
  completion: string;
  startedDate: string;
  updatedDate: string;
  status: 'In Progress' | 'Stable' | 'Deprecated';
  tags: string[];
  mission: string;
  specifications: {
    hardware?: string[];
    software?: string[];
    tools?: string[];
    ai?: string[];
    cad?: string[];
  };
  timeline: TimelineEvent[];
  lessons: {
    worked: string;
    failed: string;
    changed: string;
    learned: string;
  };
  downloads?: { label: string; url: string }[];
  githubUrl: string;
  demoUrl?: string;
}

const DEFAULT_PROJECTS: BuildLog[] = [
  {
    id: 'morse-messenger',
    title: 'Wireless Morse Code Messenger',
    version: 'v1.4-beta',
    completion: '85%',
    startedDate: 'Oct 2025',
    updatedDate: 'Jan 2026',
    status: 'In Progress',
    tags: ['ESP32', 'C++', 'LoRa RF', 'CAD Assembly', 'Morse Protocol'],
    mission: 'To create a completely off-grid, distraction-free text communication transceiver that operates independently of cellular networks or internet infrastructures.',
    specifications: {
      hardware: ['ESP32-WROOM-32E', 'LoRa SX1278 RF Transceiver', 'SSD1306 0.96" OLED Screen', 'Mechanical Key Switches'],
      software: ['C++ / Arduino IDE', 'LoRa.h Library', 'U8g2 Graphics Engine'],
      cad: ['Fusion 360 Enclosure Model', 'Custom PCB Outline Drafting'],
      tools: ['FDM 3D Printing (PETG)', 'TS100 Soldering Iron']
    },
    timeline: [
      { id: 'e1', type: 'idea', title: 'Concept Formulated', date: '2025-10-15', description: 'Brainstormed off-grid communication using low-frequency radio modules and manual Morse keypads.', milestone: true },
      { id: 'e2', type: 'cad', title: 'Enclosure V1 Designed', date: '2025-10-22', description: 'Drafted a pocket-sized shell in Fusion 360 featuring mounting holes for ESP32 and OLED.' },
      { id: 'e3', type: 'prototype', title: 'First Breadboard Prototype', date: '2025-11-02', description: 'Wired ESP32 module to the SX1278 transceiver. Verified point-to-point text signals.' },
      { id: 'e4', type: 'bug', title: 'RF Transmission Packet Loss', date: '2025-11-10', description: 'Discovered high packet drops at 500m due to poor antenna trace impedance.' },
      { id: 'e5', type: 'fix', title: 'SMA Antenna Mounting', date: '2025-11-14', description: 'Solder-modified a dedicated SMA whip antenna mount. Boosted range to 1.8km.' },
      { id: 'e6', type: 'firmware', title: 'Custom Morse Parser Engine', date: '2025-12-05', description: 'Coded a real-time interrupt timer system to translate button durations into text.' },
      { id: 'e7', type: 'release', title: 'Firmware Beta Release', date: '2026-01-20', description: 'Released v1.4 firmware with OLED history logs and low-power sleep states.', milestone: true }
    ],
    lessons: {
      worked: 'LoRa RF link is extremely robust in line-of-sight environments. Range exceeded expectations.',
      failed: 'Initial mechanical keys suffered from heavy contact bounce, triggering random double characters.',
      changed: 'Replaced simple pushbuttons with high-quality tactile switches and implemented a software-based debounce window (40ms).',
      learned: 'Hardware diagnostics are heavily dependent on reliable oscilloscopes. Software emulation only gets you halfway.'
    },
    downloads: [
      { label: 'Enclosure STL Files (Zip)', url: '#' },
      { label: 'Schematics PDF', url: '#' }
    ],
    githubUrl: 'https://github.com/Alberick45/wireless-morse-messenger'
  },
  {
    id: 'mood-match',
    title: 'The Mood Match Engine',
    version: 'v2.1.0',
    completion: '100%',
    startedDate: 'May 2025',
    updatedDate: 'Sep 2025',
    status: 'Stable',
    tags: ['React', 'TypeScript', 'Node.js', 'NLP Sentiment', 'Web Audio APIs'],
    mission: 'Overcome the limitations of static genre-based playlists by analyzing input user text for real-time emotional metrics and generating active matching audio queues.',
    specifications: {
      software: ['React 18', 'TypeScript', 'Tailwind CSS', 'Express.js Node API'],
      ai: ['HuggingFace Sentiment Transformers', 'OpenAI Embedding Pipelines'],
      tools: ['Vite Bundler', 'Postman API Agent']
    },
    timeline: [
      { id: 'm1', type: 'idea', title: 'Initial Prototype Concept', date: '2025-05-12', description: 'Conceptualized parsing diary text logs to match song telemetry (valence, energy).' },
      { id: 'm2', type: 'doc', title: 'API Contract Defined', date: '2025-05-20', description: 'Documented JSON API payloads for sentiment extraction and song catalog lookups.' },
      { id: 'm3', type: 'bug', title: 'API Rate Limits Block', date: '2025-06-08', description: 'Token request overhead triggered rate-limits on parallel text processing.' },
      { id: 'm4', type: 'fix', title: 'Local Caching System', date: '2025-06-15', description: 'Implemented Redis-backed caches for extracted sentence profiles.' },
      { id: 'm5', type: 'release', title: 'Production Rollout', date: '2025-09-02', description: 'Deployed stable builds on cloud services. Verified low latency responses.', milestone: true }
    ],
    lessons: {
      worked: 'Sentiment analysis was highly accurate for long-form user inputs.',
      failed: 'Single-word inputs returned highly erratic sentiment scores due to lack of surrounding context.',
      changed: 'Integrated an LLM-assisted fallback prompt to expand sparse inputs into descriptive paragraphs before evaluation.',
      learned: 'Always build fallback paths when exposing third-party microservices to public-facing applications.'
    },
    githubUrl: 'https://github.com/Alberick45/the-mood-match',
    demoUrl: '#'
  }
];

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<BuildLog[]>(() => {
    const saved = localStorage.getItem('workshop_projects');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_PROJECTS;
  });

  const [selectedProject, setSelectedProject] = useState<BuildLog | null>(null);
  const [timelineFilter, setTimelineFilter] = useState<string>('all');
  const [zoomLevel, setZoomLevel] = useState<'normal' | 'compact'>('normal');

  // Admin state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('isAdminLoggedIn') === 'true';
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAdminLoggedIn(localStorage.getItem('isAdminLoggedIn') === 'true');
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Modal Editor state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [version, setVersion] = useState('');
  const [completion, setCompletion] = useState('');
  const [status, setStatus] = useState<'In Progress' | 'Stable' | 'Deprecated'>('In Progress');
  const [tags, setTags] = useState('');
  const [mission, setMission] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  
  // Specs comma-separated inputs
  const [hardwareSpecs, setHardwareSpecs] = useState('');
  const [softwareSpecs, setSoftwareSpecs] = useState('');
  const [cadSpecs, setCadSpecs] = useState('');
  const [toolsSpecs, setToolsSpecs] = useState('');

  // Lessons
  const [lessonWorked, setLessonWorked] = useState('');
  const [lessonFailed, setLessonFailed] = useState('');
  const [lessonChanged, setLessonChanged] = useState('');
  const [lessonLearned, setLessonLearned] = useState('');

  // Timeline events JSON template
  const [timelineJson, setTimelineJson] = useState('[]');

  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'idea': return <Lightbulb className="w-3.5 h-3.5 text-amber-400" />;
      case 'doc': return <FileText className="w-3.5 h-3.5 text-blue-400" />;
      case 'prototype': return <Hammer className="w-3.5 h-3.5 text-purple-400" />;
      case 'firmware': return <Settings className="w-3.5 h-3.5 text-teal-400" />;
      case 'cad': return <Layers className="w-3.5 h-3.5 text-indigo-400" />;
      case 'feature': return <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />;
      case 'removal': return <Flame className="w-3.5 h-3.5 text-rose-400" />;
      case 'bug': return <AlertTriangle className="w-3.5 h-3.5 text-orange-400 animate-pulse" />;
      case 'fix': return <Wrench className="w-3.5 h-3.5 text-lime-400" />;
      case 'release': return <CheckCircle className="w-3.5 h-3.5 text-green-400" />;
      default: return <Info className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const handleOpenCreateModal = () => {
    setEditingProjectId(null);
    setTitle('');
    setVersion('v1.0');
    setCompletion('50%');
    setStatus('In Progress');
    setTags('ESP32, C++, LoRa');
    setMission('');
    setGithubUrl('');
    setDemoUrl('');
    setHardwareSpecs('');
    setSoftwareSpecs('');
    setCadSpecs('');
    setToolsSpecs('');
    setLessonWorked('');
    setLessonFailed('');
    setLessonChanged('');
    setLessonLearned('');
    setTimelineJson(JSON.stringify([
      { id: 'evt-1', type: 'idea', title: 'Initial Concept', date: new Date().toISOString().split('T')[0], description: 'Idea conceived in the workshop.', milestone: true }
    ], null, 2));
    setIsEditorOpen(true);
  };

  const handleOpenEditModal = (proj: BuildLog, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingProjectId(proj.id);
    setTitle(proj.title);
    setVersion(proj.version);
    setCompletion(proj.completion);
    setStatus(proj.status);
    setTags(proj.tags.join(', '));
    setMission(proj.mission);
    setGithubUrl(proj.githubUrl);
    setDemoUrl(proj.demoUrl || '');
    setHardwareSpecs((proj.specifications?.hardware || []).join(', '));
    setSoftwareSpecs((proj.specifications?.software || []).join(', '));
    setCadSpecs((proj.specifications?.cad || []).join(', '));
    setToolsSpecs((proj.specifications?.tools || []).join(', '));
    setLessonWorked(proj.lessons?.worked || '');
    setLessonFailed(proj.lessons?.failed || '');
    setLessonChanged(proj.lessons?.changed || '');
    setLessonLearned(proj.lessons?.learned || '');
    setTimelineJson(JSON.stringify(proj.timeline || [], null, 2));
    setIsEditorOpen(true);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    let parsedTimeline = [];
    try {
      parsedTimeline = JSON.parse(timelineJson);
    } catch (err) {
      alert('Error parsing timeline JSON schema. Please check syntax.');
      return;
    }

    const payload: BuildLog = {
      id: editingProjectId || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title,
      version,
      completion,
      status,
      startedDate: editingProjectId ? (projects.find(p => p.id === editingProjectId)?.startedDate || 'Today') : 'Today',
      updatedDate: new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' }),
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      mission,
      specifications: {
        hardware: hardwareSpecs.split(',').map(s => s.trim()).filter(Boolean),
        software: softwareSpecs.split(',').map(s => s.trim()).filter(Boolean),
        cad: cadSpecs.split(',').map(s => s.trim()).filter(Boolean),
        tools: toolsSpecs.split(',').map(s => s.trim()).filter(Boolean)
      },
      timeline: parsedTimeline,
      lessons: {
        worked: lessonWorked,
        failed: lessonFailed,
        changed: lessonChanged,
        learned: lessonLearned
      },
      githubUrl,
      demoUrl: demoUrl || undefined
    };

    let updatedList;
    if (editingProjectId) {
      updatedList = projects.map(p => p.id === editingProjectId ? payload : p);
      if (selectedProject?.id === editingProjectId) {
        setSelectedProject(payload);
      }
    } else {
      updatedList = [...projects, payload];
    }

    setProjects(updatedList);
    localStorage.setItem('workshop_projects', JSON.stringify(updatedList));
    setIsEditorOpen(false);
  };

  const handleDeleteProject = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Confirm deletion of this build log file?')) return;
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    localStorage.setItem('workshop_projects', JSON.stringify(updated));
    if (selectedProject?.id === id) {
      setSelectedProject(null);
    }
  };

  return (
    <section id="workshop" className="py-20 bg-blueprint-grid bg-[#090d16] border-t border-sky-950/40 relative">
      <div className="absolute inset-0 bg-dot-grid opacity-30 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 md:px-6 z-10 relative">
        
        {!selectedProject ? (
          <>
            {/* List View */}
            <div className="mb-12 border-b border-sky-950/80 pb-6 flex flex-col md:flex-row md:items-end justify-between relative">
              <div>
                <span className="font-mono-tech text-xs text-sky-500 uppercase tracking-widest">// REPOSITORY INDEX</span>
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mt-1">
                  The Engineering <span className="text-sky-400">Workshop</span>
                </h2>
              </div>
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <p className="text-slate-400 text-xs max-w-xs font-sans leading-relaxed hidden lg:block">
                  Each project is documented as a living Build Log. Click to view timelines, fail states, and blueprints.
                </p>
                {isAdminLoggedIn && (
                  <button
                    onClick={handleOpenCreateModal}
                    className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold uppercase tracking-wider text-xs px-4 py-2 rounded-lg flex items-center transition-all font-mono-tech"
                  >
                    <Plus size={14} className="mr-1.5" />
                    New Build Log
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((project) => (
                <div 
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="panel-workshop p-6 rounded-xl border-sky-500/10 hover:border-sky-400/40 cursor-pointer transition-all duration-300 group flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <span className="font-mono-tech text-[10px] text-slate-500 uppercase tracking-wider">{project.version}</span>
                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] font-mono-tech px-2 py-0.5 rounded border ${
                          project.status === 'Stable' 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        }`}>
                          {project.status.toUpperCase()}
                        </span>
                        {isAdminLoggedIn && (
                          <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                            <button 
                              onClick={(e) => handleOpenEditModal(project, e)}
                              className="p-1 bg-slate-900 border border-sky-950 text-slate-400 hover:text-white rounded"
                            >
                              <Edit2 size={10} />
                            </button>
                            <button 
                              onClick={(e) => handleDeleteProject(project.id, e)}
                              className="p-1 bg-slate-900 border border-sky-950 text-slate-400 hover:text-rose-400 rounded"
                            >
                              <Trash2 size={10} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white group-hover:text-sky-400 transition-colors font-sans">
                      {project.title}
                    </h3>
                    
                    <p className="text-slate-400 text-xs line-clamp-3 font-sans leading-relaxed">
                      {project.mission}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-sky-950/60 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="font-mono-tech text-[10px] bg-slate-900 text-sky-400 border border-sky-950 px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="font-mono-tech text-[10px] text-slate-500">+{project.tags.length - 3} more</span>
                      )}
                    </div>

                    <span className="font-mono-tech text-xs text-sky-400 group-hover:underline flex items-center">
                      Open Log File <Maximize2 size={12} className="ml-1.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Detail / Build Log View */}
            <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
              <button 
                onClick={() => setSelectedProject(null)}
                className="inline-flex items-center space-x-2 text-sky-400 hover:text-white font-mono-tech text-xs bg-slate-900 border border-sky-950 rounded-lg px-3.5 py-2 transition-all"
              >
                <ArrowLeft size={14} />
                <span>Back to Workshop Directory</span>
              </button>

              {isAdminLoggedIn && (
                <div className="flex space-x-2 font-mono-tech">
                  <button 
                    onClick={() => handleOpenEditModal(selectedProject)}
                    className="bg-slate-900 border border-sky-950 text-sky-400 hover:bg-slate-850 px-3.5 py-2 rounded-lg text-xs flex items-center transition-all"
                  >
                    <Edit2 size={12} className="mr-1.5" /> Edit Log
                  </button>
                  <button 
                    onClick={() => handleDeleteProject(selectedProject.id)}
                    className="bg-slate-950 border border-rose-950 text-rose-400 hover:bg-rose-950/20 px-3.5 py-2 rounded-lg text-xs flex items-center transition-all"
                  >
                    <Trash2 size={12} className="mr-1.5" /> Delete Log
                  </button>
                </div>
              )}
            </div>

            {/* Build Log Box */}
            <div className="panel-workshop p-6 md:p-8 rounded-2xl border-sky-400/20 space-y-8">
              
              {/* Log Header */}
              <div className="border-b border-sky-950/80 pb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-[10px] bg-sky-500/10 border border-sky-500/20 text-sky-400 px-2 py-0.5 rounded font-mono-tech font-bold">{selectedProject.version}</span>
                    <span className="text-xs font-mono-tech text-slate-500">// BUILD LOG: {selectedProject.id.toUpperCase()}</span>
                  </div>
                  <h1 className="text-3xl font-bold text-white tracking-tight font-sans">{selectedProject.title}</h1>
                </div>

                {/* Spec badges grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/80 border border-sky-950/50 rounded-xl p-3.5 font-mono-tech text-xs">
                  <div className="px-2">
                    <span className="block text-slate-500 text-[10px] uppercase">STATUS</span>
                    <span className="text-sky-400 font-semibold">{selectedProject.status}</span>
                  </div>
                  <div className="px-2 border-l border-sky-950">
                    <span className="block text-slate-500 text-[10px] uppercase">STARTED</span>
                    <span className="text-slate-300 font-semibold">{selectedProject.startedDate}</span>
                  </div>
                  <div className="px-2 border-l border-sky-950">
                    <span className="block text-slate-500 text-[10px] uppercase">COMPLETION</span>
                    <span className="text-amber-400 font-semibold">{selectedProject.completion}</span>
                  </div>
                  <div className="px-2 border-l border-sky-950">
                    <span className="block text-slate-500 text-[10px] uppercase">UPDATED</span>
                    <span className="text-slate-300 font-semibold">{selectedProject.updatedDate}</span>
                  </div>
                </div>
              </div>

              {/* Mission Statement */}
              <div className="space-y-2.5">
                <h3 className="font-mono-tech text-xs uppercase tracking-wider text-slate-500">// PROJECT_MISSION</h3>
                <div className="bg-sky-500/5 border border-sky-500/20 p-4 rounded-xl font-sans text-slate-300 text-sm leading-relaxed">
                  {selectedProject.mission}
                </div>
              </div>

              {/* Grid: Timetree & Specifications */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Timeline Tree Column (7/12) */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex items-center justify-between border-b border-sky-950/50 pb-3">
                    <h3 className="font-mono-tech text-xs uppercase tracking-wider text-slate-500">// ITERATIVE_TIMETREE</h3>
                    
                    {/* Controls */}
                    <div className="flex items-center space-x-3 text-[10px] font-mono-tech">
                      <select 
                        value={timelineFilter}
                        onChange={(e) => setTimelineFilter(e.target.value)}
                        className="bg-slate-950 border border-sky-950 text-slate-400 rounded px-2 py-1 focus:outline-none"
                      >
                        <option value="all">ALL EVENTS</option>
                        <option value="milestones">MILESTONES</option>
                        <option value="failures">FAILURES & FIXES</option>
                        <option value="hardware">HARDWARE & CAD</option>
                      </select>
                      
                      <button 
                        onClick={() => setZoomLevel(zoomLevel === 'normal' ? 'compact' : 'normal')}
                        className="bg-slate-900 border border-sky-950 text-slate-400 px-2.5 py-1 rounded hover:text-white"
                      >
                        {zoomLevel === 'normal' ? 'COMPACT' : 'NORMAL'}
                      </button>
                    </div>
                  </div>

                  {/* Vertical Line Container */}
                  <div className="relative pl-6 border-l border-sky-950/60 ml-3 space-y-6 py-2">
                    {selectedProject.timeline
                      .filter(evt => {
                        if (timelineFilter === 'milestones') return evt.milestone;
                        if (timelineFilter === 'failures') return evt.type === 'bug' || evt.type === 'fix' || evt.type === 'removal';
                        if (timelineFilter === 'hardware') return evt.type === 'cad' || evt.type === 'prototype' || evt.type === 'firmware';
                        return true;
                      })
                      .map((evt) => (
                        <div key={evt.id} className="relative group/node">
                          
                          {/* Node Icon Indicator */}
                          <div className="absolute -left-[35px] top-0.5 bg-slate-950 border border-sky-950 p-1 rounded-full z-10">
                            {getEventIcon(evt.type)}
                          </div>

                          {/* Node Card */}
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="text-[10px] font-mono-tech text-slate-500">{evt.date}</span>
                              {evt.milestone && (
                                <span className="text-[8px] bg-amber-500/10 border border-amber-500/20 text-amber-400 px-1.5 py-0.2 rounded font-mono-tech font-bold uppercase tracking-wider">
                                  MILESTONE
                                </span>
                              )}
                            </div>
                            <h4 className="text-sm font-bold text-slate-200 font-mono-tech group-hover/node:text-sky-400 transition-colors uppercase">
                              {evt.title}
                            </h4>
                            {zoomLevel === 'normal' && (
                              <p className="text-slate-400 text-xs leading-relaxed font-sans pt-0.5">
                                {evt.description}
                              </p>
                            )}
                          </div>
                        </div>
                    ))}
                  </div>
                </div>

                {/* Specs Block Column (5/12) */}
                <div className="lg:col-span-5 space-y-6">
                  <h3 className="font-mono-tech text-xs uppercase tracking-wider text-slate-500">// TECHNICAL_SPECIFICATIONS</h3>
                  
                  <div className="bg-slate-950/60 border border-sky-950/50 rounded-xl p-5 space-y-4 font-mono-tech text-xs">
                    
                    {selectedProject.specifications.hardware && selectedProject.specifications.hardware.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-slate-500 text-[10px] uppercase block">// Hardware Layer</span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedProject.specifications.hardware.map((item, idx) => (
                            <span key={idx} className="bg-slate-900 border border-sky-950 px-2 py-1 rounded text-slate-300">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedProject.specifications.software && selectedProject.specifications.software.length > 0 && (
                      <div className="space-y-1.5 pt-3 border-t border-sky-950/30">
                        <span className="text-slate-500 text-[10px] uppercase block">// Software Stack</span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedProject.specifications.software.map((item, idx) => (
                            <span key={idx} className="bg-slate-900 border border-sky-950 px-2 py-1 rounded text-slate-300">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedProject.specifications.cad && selectedProject.specifications.cad.length > 0 && (
                      <div className="space-y-1.5 pt-3 border-t border-sky-950/30">
                        <span className="text-slate-500 text-[10px] uppercase block">// CAD Models & Layouts</span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedProject.specifications.cad.map((item, idx) => (
                            <span key={idx} className="bg-slate-900 border border-sky-950 px-2 py-1 rounded text-slate-300">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedProject.specifications.tools && selectedProject.specifications.tools.length > 0 && (
                      <div className="space-y-1.5 pt-3 border-t border-sky-950/30">
                        <span className="text-slate-500 text-[10px] uppercase block">// Workshop Tools</span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedProject.specifications.tools.map((item, idx) => (
                            <span key={idx} className="bg-slate-900 border border-sky-950 px-2 py-1 rounded text-slate-300">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                </div>

              </div>

              {/* Outcomes & Lessons Log */}
              <div className="space-y-4 pt-4 border-t border-sky-950/60">
                <h3 className="font-mono-tech text-xs uppercase tracking-wider text-slate-500">// RETROSPECTIVE_OUTCOMES</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans text-xs">
                  
                  {/* Worked */}
                  <div className="bg-emerald-950/10 border border-emerald-900/30 p-4 rounded-xl space-y-2">
                    <span className="font-mono-tech text-emerald-400 font-bold block uppercase">// WHAT_WORKED.log</span>
                    <p className="text-slate-300 leading-relaxed">{selectedProject.lessons.worked}</p>
                  </div>

                  {/* Failed */}
                  <div className="bg-rose-950/10 border border-rose-900/30 p-4 rounded-xl space-y-2">
                    <span className="font-mono-tech text-rose-400 font-bold block uppercase">// WHAT_FAILED.log</span>
                    <p className="text-slate-300 leading-relaxed">{selectedProject.lessons.failed}</p>
                  </div>

                  {/* Changed */}
                  <div className="bg-sky-950/15 border border-sky-900/30 p-4 rounded-xl space-y-2">
                    <span className="font-mono-tech text-sky-400 font-bold block uppercase">// ITERATIVE_CHANGES.log</span>
                    <p className="text-slate-300 leading-relaxed">{selectedProject.lessons.changed}</p>
                  </div>

                  {/* Learned */}
                  <div className="bg-amber-950/10 border border-amber-950/20 p-4 rounded-xl space-y-2">
                    <span className="font-mono-tech text-amber-400 font-bold block uppercase">// KEY_LEARNED.log</span>
                    <p className="text-slate-300 leading-relaxed">{selectedProject.lessons.learned}</p>
                  </div>

                </div>
              </div>

              {/* Downloads & External Links */}
              <div className="pt-6 border-t border-sky-950/60 flex flex-wrap items-center justify-between gap-4 font-mono-tech">
                <div className="flex flex-wrap gap-3">
                  <a 
                    href={selectedProject.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="border border-sky-500/20 hover:border-sky-400 bg-sky-500/5 text-sky-400 hover:text-white text-xs px-4 py-2.5 rounded-lg flex items-center transition-all"
                  >
                    <Github size={14} className="mr-2" />
                    Source Code
                  </a>
                  {selectedProject.demoUrl && (
                    <a 
                      href={selectedProject.demoUrl} 
                      className="border border-sky-500/20 hover:border-sky-400 bg-sky-500/5 text-sky-400 hover:text-white text-xs px-4 py-2.5 rounded-lg flex items-center transition-all"
                    >
                      <ExternalLink size={14} className="mr-2" />
                      Live Sandbox
                    </a>
                  )}
                </div>

                {selectedProject.downloads && (
                  <div className="flex flex-wrap gap-2 text-xs">
                    {selectedProject.downloads.map((dl, idx) => (
                      <a 
                        key={idx} 
                        href={dl.url} 
                        className="bg-slate-900 hover:bg-slate-850 border border-sky-950 text-slate-300 px-3.5 py-2.5 rounded-lg flex items-center transition-all"
                      >
                        <Download size={12} className="mr-2 text-sky-400" />
                        {dl.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </>
        )}

      </div>

      {/* Editor Modal Overlay */}
      {isEditorOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="panel-workshop rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-sky-500/20 animate-in fade-in duration-200">
            <div className="p-6 border-b border-sky-950/60 flex justify-between items-center bg-slate-900 rounded-t-xl">
              <h3 className="text-sm font-bold text-white flex items-center font-mono-tech uppercase">
                <Plus size={16} className="text-sky-400 mr-2" />
                {editingProjectId ? 'Modify Build Log' : 'Create New Build Log'}
              </h3>
              <button 
                onClick={() => setIsEditorOpen(false)}
                className="text-slate-400 hover:text-white p-1 bg-slate-950 border border-sky-950 rounded"
              >
                <Maximize2 size={12} className="rotate-45" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="p-6 space-y-4 text-slate-300 font-mono-tech text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-slate-400 mb-1">// Title</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-sky-950 bg-slate-950 text-white font-sans"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">// Version</label>
                  <input 
                    type="text" 
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-sky-950 bg-slate-950 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">// Completion (%)</label>
                  <input 
                    type="text" 
                    value={completion}
                    onChange={(e) => setCompletion(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-sky-950 bg-slate-950 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">// Status</label>
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded border border-sky-950 bg-slate-950 text-white"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Stable">Stable</option>
                    <option value="Deprecated">Deprecated</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">// Tags (comma separated)</label>
                  <input 
                    type="text" 
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-sky-950 bg-slate-950 text-white font-sans"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">// Mission Statement / Abstract</label>
                <textarea 
                  value={mission}
                  onChange={(e) => setMission(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded border border-sky-950 bg-slate-950 text-white font-sans text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">// GitHub Repository URL</label>
                  <input 
                    type="url" 
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-sky-950 bg-slate-950 text-white font-sans"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">// Demo SandBox URL (Optional)</label>
                  <input 
                    type="text" 
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-sky-950 bg-slate-950 text-white font-sans"
                  />
                </div>
              </div>

              {/* Specifications Card inputs */}
              <div className="bg-slate-950 p-4 rounded-lg border border-sky-950/60 space-y-3">
                <span className="text-sky-400 font-bold block">// Specifications Arrays (Comma separated list)</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Hardware specs</label>
                    <input 
                      type="text" 
                      value={hardwareSpecs}
                      onChange={(e) => setHardwareSpecs(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded border border-sky-950 bg-slate-900 text-white font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Software components</label>
                    <input 
                      type="text" 
                      value={softwareSpecs}
                      onChange={(e) => setSoftwareSpecs(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded border border-sky-950 bg-slate-900 text-white font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">CAD models / Fab</label>
                    <input 
                      type="text" 
                      value={cadSpecs}
                      onChange={(e) => setCadSpecs(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded border border-sky-950 bg-slate-900 text-white font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Workshop Tools</label>
                    <input 
                      type="text" 
                      value={toolsSpecs}
                      onChange={(e) => setToolsSpecs(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded border border-sky-950 bg-slate-900 text-white font-sans"
                    />
                  </div>
                </div>
              </div>

              {/* Retrospective Lessons */}
              <div className="bg-slate-950 p-4 rounded-lg border border-sky-950/60 space-y-3">
                <span className="text-sky-400 font-bold block">// Retrospective Lessons Logs</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">What Worked</label>
                    <textarea 
                      value={lessonWorked}
                      onChange={(e) => setLessonWorked(e.target.value)}
                      rows={2}
                      className="w-full px-2.5 py-1.5 rounded border border-sky-950 bg-slate-900 text-white text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">What Failed</label>
                    <textarea 
                      value={lessonFailed}
                      onChange={(e) => setLessonFailed(e.target.value)}
                      rows={2}
                      className="w-full px-2.5 py-1.5 rounded border border-sky-950 bg-slate-900 text-white text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">What Was Changed</label>
                    <textarea 
                      value={lessonChanged}
                      onChange={(e) => setLessonChanged(e.target.value)}
                      rows={2}
                      className="w-full px-2.5 py-1.5 rounded border border-sky-950 bg-slate-900 text-white text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">What Was Learned</label>
                    <textarea 
                      value={lessonLearned}
                      onChange={(e) => setLessonLearned(e.target.value)}
                      rows={2}
                      className="w-full px-2.5 py-1.5 rounded border border-sky-950 bg-slate-900 text-white text-xs"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Timeline JSON */}
              <div>
                <label className="block text-slate-400 mb-1">// Iterative Timetree Events (JSON list)</label>
                <textarea 
                  value={timelineJson}
                  onChange={(e) => setTimelineJson(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 rounded border border-sky-950 bg-slate-950 text-white font-mono text-[10px] leading-normal"
                  required
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Format: Array of {"{ id, type ('idea'|'doc'|'prototype'|'firmware'|'cad'|'bug'|'fix'|'release'), title, date ('YYYY-MM-DD'), description, milestone (bool) }"}
                </span>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-sky-950/60">
                <button 
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 border border-sky-950 text-slate-400 rounded hover:bg-slate-800 transition-colors uppercase text-[10px] font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-sky-500 text-slate-950 rounded hover:bg-sky-400 transition-all uppercase text-[10px] font-bold"
                >
                  Save Log File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
};

export default Projects;