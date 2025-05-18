import React from 'react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  categoryColor: string;
}

const Blog: React.FC = () => {
  const blogPosts: BlogPost[] = [
    {
      title: "My Journey Learning Hardware Basics",
      excerpt: "Exploring the fascinating world of electronics and hardware during my internship and the valuable lessons I've learned along the way.",
      date: "May 15, 2025",
      readTime: "5 min read",
      category: "Hardware",
      categoryColor: "bg-emerald-100 text-emerald-800"
    },
    {
      title: "Building The Mood Match: Challenges and Solutions",
      excerpt: "An inside look at the development process of my mood-matching platform and how I'm overcoming technical challenges.",
      date: "April 28, 2025",
      readTime: "4 min read",
      category: "Development",
      categoryColor: "bg-indigo-100 text-indigo-800"
    },
    {
      title: "The Intersection of Technology and Spirituality",
      excerpt: "Reflecting on how technology can enhance spiritual experiences and foster meaningful connections in our digital age.",
      date: "April 10, 2025",
      readTime: "6 min read",
      category: "Reflection",
      categoryColor: "bg-amber-100 text-amber-800"
    }
  ];

  return (
    <section id="blog" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Blog & Journal</h2>
          <div className="w-20 h-1 bg-indigo-700 mx-auto mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Thoughts, insights, and reflections on my journey through technology and beyond.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <div 
              key={index} 
              className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1"
            >
              <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-lg">Featured Image</span>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${post.categoryColor}`}>
                    {post.category}
                  </span>
                  <div className="text-gray-500 text-xs">
                    <span className="flex items-center">
                      <Clock size={12} className="mr-1" />
                      {post.readTime}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
                <p className="text-gray-700 mb-4">{post.excerpt}</p>
                
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar size={14} className="mr-1" />
                    {post.date}
                  </div>
                  <a 
                    href="#" 
                    className="text-indigo-700 hover:text-indigo-800 font-medium flex items-center transition-colors"
                  >
                    Read More <ArrowRight size={16} className="ml-1" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <a 
            href="#" 
            className="inline-block bg-white border border-indigo-700 text-indigo-700 hover:bg-indigo-50 px-6 py-3 rounded-md font-medium transition-colors"
          >
            View All Posts
          </a>
        </div>
        
        <div className="mt-16 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-8">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Subscribe to My Newsletter</h3>
            <p className="text-gray-700 mb-6">
              Get the latest updates on my projects, tech insights, and learning journey delivered straight to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
              <button 
                type="submit" 
                className="bg-indigo-700 hover:bg-indigo-800 text-white px-6 py-2 rounded-md font-medium transition-colors"
              >
                Subscribe
              </button>
            </form>
            <p className="text-gray-500 text-xs mt-2">
              I respect your privacy and will never share your information.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blog;