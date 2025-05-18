import React from 'react';

interface Skill {
  name: string;
  level: number;
  color: string;
}

const Skills: React.FC = () => {
  const technicalSkills: Skill[] = [
    { name: 'Python', level: 85, color: 'bg-blue-600' },
    { name: 'HTML & CSS', level: 80, color: 'bg-orange-500' },
    { name: 'JavaScript', level: 75, color: 'bg-yellow-500' },
    { name: 'PHP & MySQL', level: 70, color: 'bg-purple-600' },
    { name: 'Robotics', level: 60, color: 'bg-red-500' },
    { name: 'Hardware Basics', level: 65, color: 'bg-green-500' }
  ];

  const softSkills: Skill[] = [
    { name: 'Project Management', level: 80, color: 'bg-indigo-600' },
    { name: 'Problem Solving', level: 90, color: 'bg-emerald-600' },
    { name: 'IT Support', level: 85, color: 'bg-cyan-600' },
    { name: 'Communication', level: 80, color: 'bg-amber-500' }
  ];

  return (
    <section id="skills" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">My Skills</h2>
          <div className="w-20 h-1 bg-indigo-700 mx-auto mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            A showcase of my technical abilities and soft skills that I've developed over the years.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="w-8 h-8 bg-indigo-700 rounded-full mr-3"></span>
              Technical Skills
            </h3>
            <div className="space-y-6">
              {technicalSkills.map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-gray-800">{skill.name}</span>
                    <span className="text-gray-600">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${skill.color} transition-all duration-1000`} 
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="w-8 h-8 bg-emerald-600 rounded-full mr-3"></span>
              Soft Skills
            </h3>
            <div className="space-y-6">
              {softSkills.map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-gray-800">{skill.name}</span>
                    <span className="text-gray-600">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${skill.color} transition-all duration-1000`} 
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Current Focus Areas</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-indigo-50 p-4 rounded-lg text-center transition-transform hover:scale-105">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-indigo-700 text-xl font-bold">P</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Python Development</h4>
                <p className="text-gray-700 text-sm">Advanced automation & OOP</p>
              </div>
              
              <div className="bg-emerald-50 p-4 rounded-lg text-center transition-transform hover:scale-105">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-emerald-700 text-xl font-bold">W</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Web Development</h4>
                <p className="text-gray-700 text-sm">Building modern web applications</p>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-lg text-center transition-transform hover:scale-105">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-amber-700 text-xl font-bold">H</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Hardware</h4>
                <p className="text-gray-700 text-sm">Electronics & physical computing</p>
              </div>
              
              <div className="bg-rose-50 p-4 rounded-lg text-center transition-transform hover:scale-105">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-rose-700 text-xl font-bold">C</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Cybersecurity</h4>
                <p className="text-gray-700 text-sm">Expanding knowledge & skills</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;