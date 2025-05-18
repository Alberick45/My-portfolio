import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Github, MessageSquare } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
          <div className="w-20 h-1 bg-indigo-700 mx-auto mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have a question or want to work together? Feel free to reach out to me through any of the channels below.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send Me a Message</h3>
              <form>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name
                    </label>
                    <input 
                      type="text" 
                      id="name" 
                      className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Email
                    </label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input 
                    type="text" 
                    id="subject" 
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea 
                    id="message" 
                    rows={5} 
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="bg-indigo-700 hover:bg-indigo-800 text-white px-6 py-3 rounded-md font-medium transition-colors flex items-center"
                >
                  <MessageSquare size={20} className="mr-2" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
          
          <div>
            <div className="grid grid-cols-1 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6 flex items-start">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 mr-4">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">Email</h4>
                  <p className="text-gray-700">ce-abaiden-amissah8423@st.umat.edu.gh</p>
                  <a href="mailto:ce-abaiden-amissah8423@st.umat.edu.gh" className="text-indigo-700 hover:text-indigo-800 text-sm font-medium mt-1 inline-block">
                    Send an email
                  </a>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 flex items-start">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 mr-4">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">Phone</h4>
                  <p className="text-gray-700">+233 20 850 6317</p>
                  <a href="tel:+233208506317" className="text-indigo-700 hover:text-indigo-800 text-sm font-medium mt-1 inline-block">
                    Give me a call
                  </a>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 flex items-start">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 mr-4">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">Location</h4>
                  <p className="text-gray-700">Tema, Ghana</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Connect With Me</h3>
              <div className="flex space-x-4">
                <a 
                  href="https://linkedin.com/in/albert-baiden-amissah" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 hover:bg-blue-200 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={20} />
                </a>
                <a 
                  href="https://github.com/albertbaiden" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors"
                  aria-label="GitHub"
                >
                  <Github size={20} />
                </a>
                <a 
                  href="https://wa.me/233208506317" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-700 hover:bg-green-200 transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageSquare size={20} />
                </a>
              </div>
            </div>
            
            <div className="mt-6 bg-indigo-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Availability</h3>
              <p className="text-gray-700">
                I'm currently open to internships, project collaborations, and learning opportunities. Feel free to reach out at any time!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;