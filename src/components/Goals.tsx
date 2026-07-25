import React from 'react';
import { Target, ArrowRight, Activity, Calendar, Compass } from 'lucide-react';

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

const ROADMAP_LANES: RoadmapLane[] = [
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
          {ROADMAP_LANES.map((lane) => (
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
                        <span className="text-white text-sm font-bold font-sans group-hover:text-sky-400">
                          {item.title}
                        </span>
                        {item.status === 'active' && (
                          <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-400"></span>
                          </span>
                        )}
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
    </section>
  );
};

export default Goals;