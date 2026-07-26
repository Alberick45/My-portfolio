import React, { useState, useEffect } from 'react';
import { Target, ArrowRight, Activity, Calendar, Compass, Plus, Edit2, Trash2, X } from 'lucide-react';

interface RoadmapItem {
  title: string;
  description: string;
  status: 'active' | 'pending' | 'dream';
  timeframe: string;
}

interface RoadmapLane {
  id: string;
  title: string;
  subtitle: string;
  items: RoadmapItem[];
}

const DEFAULT_ROADMAP_LANES: RoadmapLane[] = [
  {
    id: 'current',
    title: '01. Current',
    subtitle: 'Actively designing & building',
    items: [
      { title: 'Launch BuilderOS v1', description: 'Development of an ESP32-based RTOS shell for multi-device serial mesh networks.', status: 'active', timeframe: 'Q3 2026' },
      { title: 'Local LLM API Node', description: 'Integrating light sentiment NLP models directly on local Raspberry Pi cluster endpoints.', status: 'active', timeframe: 'Q3 2026' }
    ]
  },
  {
    id: 'next',
    title: '02. Next',
    subtitle: 'Scheduled engineering queue',
    items: [
      { title: 'Develop Robotics Platform', description: 'Modular motorized chassis drafting with real-time feedback loops via WebSockets.', status: 'pending', timeframe: 'Q4 2026' },
      { title: 'LoRa Mesh Network Nodes', description: 'Field testing solar-powered node housings in regional Ghana areas.', status: 'pending', timeframe: 'Q1 2027' }
    ]
  },
  {
    id: 'future',
    title: '03. Future',
    subtitle: 'Long-term research & design',
    items: [
      { title: 'Create A³PK Labs', description: 'Public open-source repository index for educational DIY hardware modules.', status: 'pending', timeframe: '2027' },
      { title: 'Research Autonomous Drone AI', description: 'Exploring computer vision pathfinding on budget-friendly embedded chips.', status: 'pending', timeframe: '2027' }
    ]
  },
  {
    id: 'dream',
    title: '04. Dream',
    subtitle: 'Blue-sky vision statements',
    items: [
      { title: 'Community Open-Lab', description: 'Establishing a physical hardware fabrication space in Tema for young makers.', status: 'dream', timeframe: 'Future' },
      { title: 'Solar Powered Server Grid', description: 'Hosting micro-services completely powered by custom solar battery arrays.', status: 'dream', timeframe: 'Future' }
    ]
  }
];

const Goals: React.FC = () => {
  const [lanes, setLanes] = useState<RoadmapLane[]>(DEFAULT_ROADMAP_LANES);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('isAdminLoggedIn') === 'true';
  });

  // Modal form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLaneId, setEditingLaneId] = useState<string | null>(null);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetLaneId, setTargetLaneId] = useState('current');
  const [status, setStatus] = useState<'active' | 'pending' | 'dream'>('pending');
  const [timeframe, setTimeframe] = useState('');

  // Load from local storage and fallback/FastAPI backend
  useEffect(() => {
    const loadRoadmap = async () => {
      // 1. Try static file from public
      try {
        const res = await fetch("/roadmap.json");
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setLanes(data);
            localStorage.setItem('albert-portfolio-roadmap', JSON.stringify(data));
            return;
          }
        }
      } catch (err) {
        console.warn("Could not fetch roadmap statically. Trying localStorage...", err);
      }

      // 2. Try localStorage
      const saved = localStorage.getItem('albert-portfolio-roadmap');
      if (saved) {
        try {
          setLanes(JSON.parse(saved));
          return;
        } catch (e) {
          console.error(e);
        }
      }

      // 3. Fallback to default
      setLanes(DEFAULT_ROADMAP_LANES);
    };

    loadRoadmap();
  }, []);

  // Watch admin login status
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAdminLoggedIn(localStorage.getItem('isAdminLoggedIn') === 'true');
    };
    window.addEventListener('storage', handleStorageChange);

    const interval = setInterval(() => {
      const loggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
      if (loggedIn !== isAdminLoggedIn) {
        setIsAdminLoggedIn(loggedIn);
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [isAdminLoggedIn]);

  const saveRoadmapToStorage = async (updatedLanes: RoadmapLane[]) => {
    setLanes(updatedLanes);
    localStorage.setItem('albert-portfolio-roadmap', JSON.stringify(updatedLanes));

    // Persist to serverless endpoint / local backend
    try {
      await fetch("/api/roadmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roadmap: updatedLanes }),
      });
    } catch (err) {
      console.error("Failed to persist roadmap updates:", err);
    }
  };

  const handleAddItem = (laneId: string) => {
    setEditingLaneId(laneId);
    setTargetLaneId(laneId);
    setEditingItemIndex(null);
    setTitle('');
    setDescription('');
    setStatus(laneId === 'current' ? 'active' : laneId === 'dream' ? 'dream' : 'pending');
    setTimeframe('');
    setIsModalOpen(true);
  };

  const handleEditItem = (laneId: string, index: number, item: RoadmapItem) => {
    setEditingLaneId(laneId);
    setTargetLaneId(laneId);
    setEditingItemIndex(index);
    setTitle(item.title);
    setDescription(item.description);
    setStatus(item.status);
    setTimeframe(item.timeframe);
    setIsModalOpen(true);
  };

  const handleDeleteItem = (laneId: string, index: number) => {
    if (!window.confirm("Are you sure you want to delete this roadmap item?")) return;
    const updated = lanes.map(lane => {
      if (lane.id === laneId) {
        const newItems = [...lane.items];
        newItems.splice(index, 1);
        return { ...lane, items: newItems };
      }
      return lane;
    });
    saveRoadmapToStorage(updated);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert("Title and description are required.");
      return;
    }

    const assignedStatus = targetLaneId === 'current' 
      ? 'active' 
      : targetLaneId === 'dream' 
        ? 'dream' 
        : 'pending';

    const newItem: RoadmapItem = {
      title: title.trim(),
      description: description.trim(),
      status: assignedStatus,
      timeframe: timeframe.trim() || 'TBD'
    };

    let updated: RoadmapLane[] = [];

    if (editingLaneId === targetLaneId) {
      // Same lane, modify list
      updated = lanes.map(lane => {
        if (lane.id === editingLaneId) {
          const newItems = [...lane.items];
          if (editingItemIndex !== null) {
            newItems[editingItemIndex] = newItem;
          } else {
            newItems.push(newItem);
          }
          return { ...lane, items: newItems };
        }
        return lane;
      });
    } else {
      // Moved to a different lane
      updated = lanes.map(lane => {
        // Remove from source lane if we are editing an existing item
        if (lane.id === editingLaneId && editingItemIndex !== null) {
          const newItems = [...lane.items];
          newItems.splice(editingItemIndex, 1);
          return { ...lane, items: newItems };
        }
        // Add to target lane
        if (lane.id === targetLaneId) {
          return { ...lane, items: [...lane.items, newItem] };
        }
        return lane;
      });
    }

    saveRoadmapToStorage(updated);
    setIsModalOpen(false);
  };
  return (
    <section id="roadmap" className="py-20 bg-blueprint-grid bg-[#090d16] border-t border-sky-950/40 relative">
      <div className="absolute inset-0 bg-dot-grid opacity-30 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 md:px-6 z-10 relative">
        
        {/* Section Header */}
        <div className="mb-12 border-b border-sky-950/80 pb-6 flex flex-col md:flex-row md:items-end justify-between">
          <div>
            <span className="font-mono-tech text-xs text-sky-500 uppercase tracking-widest">// FLIGHT_PLAN.cfg</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mt-1">
              Project <span className="text-sky-400">Roadmap</span>
            </h2>
          </div>
          <p className="text-slate-400 text-sm max-w-md mt-2 md:mt-0 font-sans">
            A visual overview of upcoming builds, engineering milestones, and blue-sky research projects scheduled in the workshop.
          </p>
        </div>

        {/* Roadmap lanes grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {lanes.map((lane) => (
            <div key={lane.id} className="space-y-4">
              {/* Lane Header */}
              <div className="bg-slate-900/60 border border-sky-950/50 p-4 rounded-xl font-mono-tech">
                <span className="text-white font-bold text-sm block">{lane.title}</span>
                <span className="text-slate-500 text-[10px] uppercase block mt-1">{lane.subtitle}</span>
              </div>

              {/* Lane Items */}
              <div className="space-y-3">
                {lane.items.map((item, idx) => (
                  <div 
                    key={idx} 
                    className={`panel-workshop p-4.5 rounded-xl border-sky-500/10 flex flex-col justify-between space-y-3 hover:border-sky-500/30 transition-all ${
                      item.status === 'active' ? 'border-sky-500/30 bg-sky-500/5' : ''
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-start">
                        <span className="text-white text-sm font-bold font-sans group-hover:text-sky-400 pr-2">
                          {item.title}
                        </span>
                        
                        <div className="flex items-center gap-2">
                          {isAdminLoggedIn && (
                            <div className="flex items-center gap-1.5 mr-1">
                              <button
                                onClick={() => handleEditItem(lane.id, idx, item)}
                                className="text-slate-500 hover:text-sky-400 p-0.5 rounded transition-colors"
                                title="Edit Goal"
                              >
                                <Edit2 size={12} />
                              </button>
                              <button
                                onClick={() => handleDeleteItem(lane.id, idx)}
                                className="text-slate-500 hover:text-rose-400 p-0.5 rounded transition-colors"
                                title="Delete Goal"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          )}
                          {item.status === 'active' && (
                            <span className="flex h-2 w-2 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-400"></span>
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-slate-400 text-xs leading-relaxed font-sans">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-sky-950/40 text-[10px] font-mono-tech">
                      <span className="text-slate-500 flex items-center">
                        <Calendar size={10} className="mr-1" />
                        {item.timeframe}
                      </span>
                      
                      <span className={`uppercase font-bold ${
                        item.status === 'active' 
                          ? 'text-sky-400' 
                          : item.status === 'dream' 
                            ? 'text-amber-500' 
                            : 'text-slate-500'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Add Goal Button for Admin */}
                {isAdminLoggedIn && (
                  <button
                    onClick={() => handleAddItem(lane.id)}
                    className="w-full py-2.5 px-4 border border-dashed border-sky-500/20 hover:border-sky-500/40 rounded-xl flex items-center justify-center gap-2 text-sky-400/80 hover:text-sky-400 font-mono-tech text-[10px] tracking-wider transition-all bg-sky-500/0 hover:bg-sky-500/5 mt-2"
                  >
                    <Plus size={12} />
                    ADD_GOAL.cfg
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom philosophy card */}
        <div className="mt-16 bg-slate-900/40 border border-sky-950/60 rounded-xl p-6 relative overflow-hidden font-sans">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="font-mono-tech text-[10px] text-amber-500 flex items-center">
                <Compass size={12} className="mr-1.5 animate-spin" /> HARMONY_PRINCIPLE.txt
              </span>
              <p className="text-slate-300 italic text-base">
                "I envision a future where gadgets and nature exist in synergy. Technology should serve to deepen our connection to our environments and each other, rather than isolate us from the real world."
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 text-xs font-mono-tech">
              <span className="bg-sky-500/10 border border-sky-500/20 text-sky-300 px-3 py-1.5 rounded-lg">Purposeful Systems</span>
              <span className="bg-sky-500/10 border border-sky-500/20 text-sky-300 px-3 py-1.5 rounded-lg">Green Engineering</span>
            </div>
          </div>
        </div>

      </div>

      {/* Edit/Create Goal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
          <div className="w-full max-w-md panel-workshop p-6 rounded-xl border border-sky-500/20 bg-slate-900/95 shadow-2xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>

            <h3 className="font-mono-tech text-sky-400 text-sm mb-5 flex items-center">
              <Target size={14} className="mr-2 text-sky-400 animate-pulse" />
              {editingItemIndex !== null ? 'EDIT_GOAL.cfg' : 'ADD_GOAL.cfg'}
            </h3>

            <form onSubmit={handleSaveModal} className="space-y-4 font-sans text-xs">
              <div>
                <label className="block text-slate-400 font-mono-tech text-[9px] uppercase tracking-wider mb-1.5">// Goal Title</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Launch BuilderOS v1"
                  className="w-full bg-slate-950/80 border border-sky-950/80 rounded-lg p-2.5 text-slate-200 font-sans focus:border-sky-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono-tech text-[9px] uppercase tracking-wider mb-1.5">// Description</label>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., Development of an ESP32-based RTOS shell for multi-device serial mesh networks."
                  className="w-full bg-slate-950/80 border border-sky-950/80 rounded-lg p-2.5 text-slate-200 font-sans focus:border-sky-500 focus:outline-none h-24 resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-mono-tech text-[9px] uppercase tracking-wider mb-1.5">// Roadmap Lane</label>
                  <select 
                    value={targetLaneId} 
                    onChange={(e) => setTargetLaneId(e.target.value)}
                    className="w-full bg-slate-950/80 border border-sky-950/80 rounded-lg p-2.5 text-slate-200 font-sans focus:border-sky-500 focus:outline-none"
                  >
                    <option value="current">01. Current</option>
                    <option value="next">02. Next</option>
                    <option value="future">03. Future</option>
                    <option value="dream">04. Dream</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-mono-tech text-[9px] uppercase tracking-wider mb-1.5">// Timeframe</label>
                  <input 
                    type="text" 
                    value={timeframe} 
                    onChange={(e) => setTimeframe(e.target.value)}
                    placeholder="e.g., Q3 2026, 2027"
                    className="w-full bg-slate-950/80 border border-sky-950/80 rounded-lg p-2.5 text-slate-200 font-sans focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-sky-950/40">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-950/60 hover:bg-slate-950 text-slate-400 border border-sky-950/50 font-mono-tech font-bold uppercase tracking-wider text-[9px] px-4 py-2 rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-mono-tech font-bold uppercase tracking-wider text-[9px] px-4 py-2 rounded-lg transition-all"
                >
                  Save Config
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Goals;