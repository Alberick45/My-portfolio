import React from 'react';
import { Target, Users, Zap, Heart } from 'lucide-react';

interface Goal {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const Goals: React.FC = () => {
  const goals: Goal[] = [
    {
      icon: <Users size={24} />,
      title: "Work with Impactful Teams",
      description: "Collaborate with innovative teams to create user-friendly digital tools that solve real-world problems and make a positive difference.",
      color: "from-indigo-500 to-blue-500"
    },
    {
      icon: <Heart size={24} />,
      title: "Help Others Through Technology",
      description: "Develop technologies that help people find peace, happiness, and fulfillment in their lives while making complex processes simpler.",
      color: "from-emerald-500 to-green-500"
    },
    {
      icon: <Zap size={24} />,
      title: "Blend Hardware and Software",
      description: "Combine my growing knowledge of hardware and software to create intuitive, integrated systems that provide seamless user experiences.",
      color: "from-amber-500 to-yellow-500"
    },
    {
      icon: <Target size={24} />,
      title: "Continuous Growth",
      description: "Continue growing spiritually, intellectually, and socially while building meaningful connections and expanding my knowledge in tech.",
      color: "from-rose-500 to-pink-500"
    }
  ];

  return (
    <section id="goals" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">My Goals</h2>
          <div className="w-20 h-1 bg-indigo-700 mx-auto mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Aspirations that drive my personal and professional journey in technology and beyond.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {goals.map((goal, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1"
            >
              <div className={`h-2 bg-gradient-to-r ${goal.color}`}></div>
              <div className="p-8">
                <div className="mb-6 flex items-center">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${goal.color} flex items-center justify-center text-white`}>
                    {goal.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 ml-4">{goal.title}</h3>
                </div>
                <p className="text-gray-700">{goal.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-indigo-50 rounded-lg p-8 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">My Personal Mission</h3>
            <p className="text-gray-700 text-lg italic mb-6">
              "I'm dreaming of a world happy with gadgets and nature living in harmony. I believe technology should enhance our connection to each other and to the natural world, not replace it."
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white px-4 py-2 rounded-full text-sm font-medium text-indigo-700 shadow-sm">
                Innovation with Purpose
              </div>
              <div className="bg-white px-4 py-2 rounded-full text-sm font-medium text-emerald-700 shadow-sm">
                Technology for Good
              </div>
              <div className="bg-white px-4 py-2 rounded-full text-sm font-medium text-amber-700 shadow-sm">
                Balance & Harmony
              </div>
            </div>
          </div>
          
          <div className="absolute right-0 bottom-0 w-32 h-32 bg-indigo-100 rounded-full -mr-16 -mb-16 opacity-50"></div>
          <div className="absolute left-10 top-10 w-16 h-16 bg-emerald-100 rounded-full opacity-30"></div>
        </div>
      </div>
    </section>
  );
};

export default Goals;