import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ArrowRight, Plus, X, Trash2, Edit2, Lock, Key } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
  categoryColor: string;
  gradient: string;
}

const DEFAULT_POSTS: BlogPost[] = [
  {
    id: 'default-1',
    title: "My Journey Learning Hardware Basics",
    excerpt: "Exploring the fascinating world of electronics and hardware during my internship and the valuable lessons I've learned along the way.",
    content: "During my internship, I had the incredible opportunity to dive into the fundamentals of electronics and microcontrollers. Working with hands-on hardware circuits helped demystify how software interacts with physical logic gates, microcontrollers, and real-world inputs.",
    date: "May 15, 2025",
    readTime: "5 min read",
    category: "Hardware",
    categoryColor: "bg-emerald-50 text-emerald-700 border-emerald-100",
    gradient: "from-emerald-400 to-teal-500"
  },
  {
    id: 'default-2',
    title: "Building The Mood Match: Challenges and Solutions",
    excerpt: "An inside look at the development process of my mood-matching platform and how I'm overcoming technical challenges.",
    content: "The Mood Match concept relies on sentiment analysis and user preferences. Bridging the API integrations, ensuring sub-second response times, and selecting accurate recommendation paths was both challenging and rewarding. I designed a customized matching algorithm to make music suggestions feel highly responsive and natural.",
    date: "April 28, 2025",
    readTime: "4 min read",
    category: "Development",
    categoryColor: "bg-indigo-50 text-indigo-700 border-indigo-100",
    gradient: "from-indigo-400 to-blue-500"
  },
  {
    id: 'default-3',
    title: "The Intersection of Technology and Spirituality",
    excerpt: "Reflecting on how technology can enhance spiritual experiences and foster meaningful connections in our digital age.",
    content: "In a world dominated by rapid notifications and short attention spans, designing spaces for quiet reflection and spiritual community becomes vital. By leveraging clean, simple interface design, we can build online spaces that encourage meditation, prayer, and deep connection.",
    date: "April 10, 2025",
    readTime: "6 min read",
    category: "Reflection",
    categoryColor: "bg-amber-50 text-amber-700 border-amber-100",
    gradient: "from-amber-400 to-orange-500"
  }
];

const DEFAULT_CATEGORIES = ['Development', 'Hardware', 'Reflection', 'Life & Tech'];

const CATEGORY_THEMES: { [key: string]: { categoryColor: string; gradient: string } } = {
  'Development': { categoryColor: 'bg-indigo-50 text-indigo-700 border-indigo-100', gradient: 'from-indigo-400 to-blue-500' },
  'Hardware': { categoryColor: 'bg-emerald-50 text-emerald-700 border-emerald-100', gradient: 'from-emerald-400 to-teal-500' },
  'Reflection': { categoryColor: 'bg-amber-50 text-amber-700 border-amber-100', gradient: 'from-amber-400 to-orange-500' },
  'Life & Tech': { categoryColor: 'bg-rose-50 text-rose-700 border-rose-100', gradient: 'from-pink-400 to-rose-500' },
};

const BACKUP_THEMES = [
  { categoryColor: 'bg-cyan-50 text-cyan-700 border-cyan-100', gradient: 'from-cyan-400 to-sky-500' },
  { categoryColor: 'bg-purple-50 text-purple-700 border-purple-100', gradient: 'from-purple-400 to-fuchsia-500' },
  { categoryColor: 'bg-violet-50 text-violet-700 border-violet-100', gradient: 'from-violet-400 to-indigo-500' },
  { categoryColor: 'bg-lime-50 text-lime-700 border-lime-100', gradient: 'from-lime-400 to-green-500' },
  { categoryColor: 'bg-teal-50 text-teal-700 border-teal-100', gradient: 'from-teal-400 to-emerald-500' }
];

const getCategoryTheme = (cat: string) => {
  if (CATEGORY_THEMES[cat]) return CATEGORY_THEMES[cat];
  let hash = 0;
  for (let i = 0; i < cat.length; i++) {
    hash = cat.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % BACKUP_THEMES.length;
  return BACKUP_THEMES[idx];
};

const Blog: React.FC<{ teaser?: boolean }> = ({ teaser = false }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  
  // Auth state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('isAdminLoggedIn') === 'true';
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [hasCredentials, setHasCredentials] = useState(false);
  
  // Login / Registration Form State
  const [authUsername, setAuthUsername] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authConfirmPassword, setAuthConfirmPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Categories state
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [showAddCategoryInput, setShowAddCategoryInput] = useState(false);

  // Editing state
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  // Form State for Post Creation/Edition
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Development');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [readTime, setReadTime] = useState('5 min read');

  // SHA-256 hashing helper
  const hashPassword = async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('albert-portfolio-posts');
    if (saved) {
      try {
        setPosts(JSON.parse(saved));
      } catch (e) {
        setPosts(DEFAULT_POSTS);
      }
    } else {
      setPosts(DEFAULT_POSTS);
      localStorage.setItem('albert-portfolio-posts', JSON.stringify(DEFAULT_POSTS));
    }

    const savedCats = localStorage.getItem('albert-portfolio-categories');
    if (savedCats) {
      try {
        setCategories(JSON.parse(savedCats));
      } catch (e) {
        setCategories(DEFAULT_CATEGORIES);
      }
    }

    const adminUser = localStorage.getItem('admin_user');
    const adminPassHash = localStorage.getItem('admin_pass_hash');
    if (adminUser && adminPassHash) {
      setHasCredentials(true);
    }

    const handleStorageChange = () => {
      setIsAdminLoggedIn(localStorage.getItem('isAdminLoggedIn') === 'true');
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const savePostsToStorage = (updatedPosts: BlogPost[]) => {
    setPosts(updatedPosts);
    localStorage.setItem('albert-portfolio-posts', JSON.stringify(updatedPosts));
  };

  const saveCategoriesToStorage = (updatedCats: string[]) => {
    setCategories(updatedCats);
    localStorage.setItem('albert-portfolio-categories', JSON.stringify(updatedCats));
  };

  const handleOpenCreateModal = () => {
    setEditingPostId(null);
    setTitle('');
    if (categories.length > 0) {
      setCategory(categories[0]);
    }
    setExcerpt('');
    setContent('');
    setReadTime('5 min read');
    setIsModalOpen(true);
    setShowAddCategoryInput(false);
    setNewCategoryInput('');
  };

  const handleOpenEditModal = (post: BlogPost, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPostId(post.id);
    setTitle(post.title);
    setCategory(post.category);
    setExcerpt(post.excerpt);
    setContent(post.content);
    setReadTime(post.readTime);
    setIsModalOpen(true);
    setShowAddCategoryInput(false);
    setNewCategoryInput('');
  };

  const handleAddCategory = () => {
    const trimmed = newCategoryInput.trim();
    if (!trimmed) return;
    if (categories.includes(trimmed)) {
      setCategory(trimmed);
      setNewCategoryInput('');
      setShowAddCategoryInput(false);
      return;
    }
    const updated = [...categories, trimmed];
    saveCategoriesToStorage(updated);
    setCategory(trimmed);
    setNewCategoryInput('');
    setShowAddCategoryInput(false);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!authUsername || !authPassword) {
      setAuthError('Please fill in all fields.');
      return;
    }

    if (!hasCredentials) {
      // Registration flow
      if (authPassword !== authConfirmPassword) {
        setAuthError('Passwords do not match.');
        return;
      }

      const passHash = await hashPassword(authPassword);
      localStorage.setItem('admin_user', authUsername);
      localStorage.setItem('admin_pass_hash', passHash);
      setHasCredentials(true);
      setIsAdminLoggedIn(true);
      setIsAuthModalOpen(false);
      setAuthUsername('');
      setAuthPassword('');
      setAuthConfirmPassword('');
    } else {
      // Login flow
      const storedUser = localStorage.getItem('admin_user');
      const storedHash = localStorage.getItem('admin_pass_hash');
      const enteredHash = await hashPassword(authPassword);

      if (authUsername === storedUser && enteredHash === storedHash) {
        setIsAdminLoggedIn(true);
        localStorage.setItem('isAdminLoggedIn', 'true');
        window.dispatchEvent(new Event('storage'));
        setIsAuthModalOpen(false);
        setAuthUsername('');
        setAuthPassword('');
      } else {
        setAuthError('Invalid username or password.');
      }
    }
  };

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !excerpt || !content) return;

    // Pick visual themes dynamically
    const theme = getCategoryTheme(category);

    if (editingPostId) {
      // EDIT MODE
      const updated = posts.map(p => {
        if (p.id === editingPostId) {
          return {
            ...p,
            title,
            excerpt,
            content,
            category,
            categoryColor: theme.categoryColor,
            gradient: theme.gradient,
            readTime
          };
        }
        return p;
      });
      savePostsToStorage(updated);
    } else {
      // CREATE MODE
      const newPost: BlogPost = {
        id: Date.now().toString(),
        title,
        excerpt,
        content,
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        readTime,
        category,
        categoryColor: theme.categoryColor,
        gradient: theme.gradient
      };
      const updated = [newPost, ...posts];
      savePostsToStorage(updated);
    }

    // Reset fields & close modal
    setTitle('');
    setExcerpt('');
    setContent('');
    setReadTime('5 min read');
    setIsModalOpen(false);
    setEditingPostId(null);
  };

  const handleDeletePost = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this post?')) {
      const updated = posts.filter(post => post.id !== id);
      savePostsToStorage(updated);
      if (selectedPost?.id === id) {
        setSelectedPost(null);
      }
    }
  };

  return (
    <section id="journal" className={`py-20 bg-blueprint-grid bg-[#090d16] border-t border-sky-950/40 relative ${!teaser ? 'pt-28' : ''}`}>
      <div className="absolute inset-0 bg-dot-grid opacity-30 pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-6 z-10 relative">
        {/* Full Journal Back Button / Header Breadcrumb */}
        {!teaser && (
          <div className="max-w-6xl mx-auto mb-8 flex justify-between items-center font-mono-tech">
            <a 
              href="/#" 
              className="inline-flex items-center text-xs uppercase tracking-wide text-sky-400 hover:text-white transition-colors"
            >
              <ArrowRight size={14} className="mr-2 rotate-180" />
              Back to Workshop
            </a>
            {hasCredentials && (
              <button 
                onClick={() => {
                  const nextState = !isAdminLoggedIn;
                  setIsAdminLoggedIn(nextState);
                  if (nextState) {
                    localStorage.setItem('isAdminLoggedIn', 'true');
                  } else {
                    localStorage.removeItem('isAdminLoggedIn');
                  }
                  window.dispatchEvent(new Event('storage'));
                }}
                className="text-[10px] uppercase font-bold border border-sky-500/20 bg-slate-900 text-sky-400 px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-all"
              >
                {isAdminLoggedIn ? "Exit Console" : "Terminal Auth"}
              </button>
            )}
          </div>
        )}

        <div className="mb-12 border-b border-sky-950/80 pb-6 flex flex-col md:flex-row md:items-end justify-between relative">
          <div>
            <span className="font-mono-tech text-xs text-sky-500 uppercase tracking-widest cursor-pointer" onDoubleClick={() => setIsAuthModalOpen(true)}>
              // LOG_DEVICES_ENTRY
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mt-1">
              Engineering <span className="text-sky-400">Journal</span>
            </h2>
          </div>
          <p className="text-slate-400 text-sm max-w-md mt-2 md:mt-0 font-sans">
            {teaser 
              ? "Chronological snippets documenting hardware iterations, testing failures, and active technical logs." 
              : "A running technical diary. Focuses on quick, natural entries about systems failures, research parameters, and micro-prototypes."}
          </p>
          
          {/* Admin Bar */}
          {isAdminLoggedIn && (
            <div className="absolute top-full left-0 right-0 mt-4 z-20 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 border border-sky-500/20 rounded-xl p-4 shadow-2xl font-mono-tech">
              <span className="text-xs text-sky-400 flex items-center">
                <Lock size={14} className="mr-1.5 text-sky-400 animate-pulse" />
                CONSOLE_MODE: ADMINISTRATOR
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleOpenCreateModal}
                  className="bg-sky-500 hover:bg-sky-400 text-slate-950 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all"
                >
                  <Plus size={12} className="inline mr-1" />
                  New Log Entry
                </button>
                <button
                  onClick={() => {
                    setIsAdminLoggedIn(false);
                    localStorage.removeItem('isAdminLoggedIn');
                    window.dispatchEvent(new Event('storage'));
                  }}
                  className="bg-slate-950 border border-red-500/20 hover:border-red-500/55 text-red-400 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all"
                >
                  Close Console
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Posts Grid */}
        <div className={`grid grid-cols-1 ${teaser ? 'md:grid-cols-2 max-w-4xl mx-auto' : 'md:grid-cols-3'} gap-8 ${isAdminLoggedIn ? 'pt-20' : ''}`}>
          {(teaser ? posts.slice(0, 2) : posts).map((post) => (
            <div 
              key={post.id} 
              onClick={() => setSelectedPost(post)}
              className="group panel-workshop p-6 rounded-xl border-sky-500/10 hover:border-sky-400/40 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="font-mono-tech text-[10px] text-sky-400 bg-sky-950/40 border border-sky-900/50 px-2 py-0.5 rounded uppercase">
                    {post.category}
                  </span>
                  {isAdminLoggedIn && (
                    <div className="flex gap-1 text-slate-800" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => handleOpenEditModal(post, e)}
                        className="bg-slate-900 border border-sky-950 text-sky-400 hover:text-white p-1.5 rounded transition-colors"
                        title="Edit Log"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={(e) => handleDeletePost(post.id, e)}
                        className="bg-slate-900 border border-red-950 text-red-400 hover:text-white p-1.5 rounded transition-colors"
                        title="Delete Log"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-white group-hover:text-sky-400 transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-slate-400 text-xs font-sans leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-sky-950/60 flex justify-between items-center text-[10px] font-mono-tech text-slate-500">
                <div className="flex items-center">
                  <Calendar size={12} className="mr-1 text-sky-500/50" />
                  {post.date}
                </div>
                <span className="text-sky-400 group-hover:underline flex items-center">
                  Read Log <ArrowRight size={10} className="ml-1" />
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {posts.length === 0 && (
          <div className="text-center py-12 bg-slate-950/50 rounded-xl border border-dashed border-sky-950/30 font-mono-tech text-xs text-slate-500">
            <p className="mb-2">No journal logs available.{!teaser && " Double-click header to enter admin mode and write one!"}</p>
          </div>
        )}

        {/* View All / Teaser Navigation Button */}
        {teaser && posts.length > 0 && (
          <div className="text-center mt-12 font-mono-tech">
            <a 
              href="/journal" 
              className="border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 px-5 py-3 rounded-lg text-xs uppercase tracking-wide flex items-center justify-center transition-all w-fit mx-auto"
            >
              Explore Full Journal Log
              <ArrowRight size={14} className="ml-2" />
            </a>
          </div>
        )}
        {/* Subscribe Section */}
        {!teaser && (
          <div className="mt-16 bg-slate-900/40 border border-sky-950/60 rounded-xl p-8">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">// SUBSCRIBE_TELEMETRY.sys</h3>
              <p className="text-slate-400 mb-6">
                Receive detailed logs of new firmware releases, prototype failures, and diagnostic logs directly in your mailbox.
              </p>
              <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto font-mono-tech text-xs">
                <input 
                  type="email" 
                  placeholder="COMMS_ADDRESS@DOMAIN.COM" 
                  className="flex-1 px-4 py-3 rounded-lg border border-sky-950 bg-slate-950 text-white focus:outline-none focus:border-sky-400 font-sans"
                  required
                />
                <button 
                  type="submit" 
                  className="bg-sky-500 hover:bg-sky-400 text-slate-950 px-6 py-3 rounded-lg font-bold uppercase transition-colors"
                >
                  Establish Link
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Secret Auth Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="panel-workshop max-w-md w-full rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-sky-950/60 flex justify-between items-center bg-slate-900 rounded-t-2xl">
              <h3 className="text-sm font-bold text-white flex items-center font-mono-tech uppercase">
                <Key size={16} className="text-sky-400 mr-2" />
                {hasCredentials ? 'Console Auth' : 'Initialize Key'}
              </h3>
              <button 
                onClick={() => {
                  setIsAuthModalOpen(false);
                  setAuthError('');
                }}
                className="text-slate-400 hover:text-white p-1 bg-slate-950 border border-sky-950 rounded-lg transition-colors"
              >
                <X size={14} />
              </button>
            </div>
            
            <form onSubmit={handleAuthSubmit} className="p-6 space-y-4 text-slate-300 font-mono-tech text-xs">
              {authError && (
                <div className="bg-rose-500/10 text-rose-400 text-xs px-3 py-2 rounded-lg border border-rose-500/20">
                  {authError}
                </div>
              )}

              <div>
                <label className="block text-slate-400 mb-1.5 uppercase">// Username</label>
                <input 
                  type="text" 
                  value={authUsername}
                  onChange={(e) => setAuthUsername(e.target.value)}
                  placeholder="Enter administrator username"
                  className="w-full px-4 py-2.5 rounded-lg border border-sky-950 bg-slate-950 text-white focus:outline-none focus:border-sky-400"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5 uppercase">// Password</label>
                <input 
                  type="password" 
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full px-4 py-2.5 rounded-lg border border-sky-950 bg-slate-950 text-white focus:outline-none focus:border-sky-400"
                  required
                />
              </div>

              {!hasCredentials && (
                <div>
                  <label className="block text-slate-400 mb-1.5 uppercase">// Confirm Password</label>
                  <input 
                    type="password" 
                    value={authConfirmPassword}
                    onChange={(e) => setAuthConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full px-4 py-2.5 rounded-lg border border-sky-950 bg-slate-950 text-white focus:outline-none focus:border-sky-400"
                    required
                  />
                  <p className="text-[10px] text-slate-500 mt-2">
                    Creating developer console credentials. The passphrase is encrypted and salted locally.
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t border-sky-950/60">
                <button 
                  type="button"
                  onClick={() => {
                    setIsAuthModalOpen(false);
                    setAuthError('');
                  }}
                  className="px-4 py-2 border border-sky-950 text-slate-400 rounded-lg hover:bg-slate-800 transition-colors uppercase text-[10px] font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-lg transition-all uppercase text-[10px] font-bold"
                >
                  {hasCredentials ? 'Authenticate' : 'Save Credentials'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* modal - Create / Edit Post */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="panel-workshop rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-sky-500/20 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-sky-950/60 flex justify-between items-center bg-slate-900 rounded-t-2xl">
              <h3 className="text-sm font-bold text-white flex items-center font-mono-tech uppercase">
                <Plus size={16} className="text-sky-400 mr-2" />
                {editingPostId ? 'Edit Log Entry' : 'Append Workshop Log'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 bg-slate-950 border border-sky-950 rounded-lg transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            
            <form onSubmit={handleSavePost} className="p-6 space-y-4 text-slate-300 font-mono-tech text-xs">
              <div>
                <label className="block text-slate-400 mb-1.5 uppercase">// Log Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. ESP32 LoRa Packet Tests in Rain"
                  className="w-full px-4 py-2.5 rounded-lg border border-sky-950 bg-slate-950 text-white focus:outline-none focus:border-sky-400 font-sans"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-slate-400 uppercase">// Category</label>
                    <button
                      type="button"
                      onClick={() => setShowAddCategoryInput(!showAddCategoryInput)}
                      className="text-[10px] text-sky-400 hover:text-sky-300 font-bold"
                    >
                      {showAddCategoryInput ? 'Cancel' : '+ Add Custom'}
                    </button>
                  </div>

                  {showAddCategoryInput ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newCategoryInput}
                        onChange={(e) => setNewCategoryInput(e.target.value)}
                        placeholder="New category name"
                        className="flex-1 px-3 py-1.5 rounded-lg border border-sky-950 bg-slate-950 text-white focus:outline-none focus:border-sky-400 font-sans"
                      />
                      <button
                        type="button"
                        onClick={handleAddCategory}
                        className="px-3 py-1.5 bg-sky-500 text-slate-950 rounded-lg text-[10px] font-bold uppercase"
                      >
                        Add
                      </button>
                    </div>
                  ) : (
                    <select 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-sky-950 bg-slate-950 text-white focus:outline-none focus:border-sky-400"
                    >
                      {categories.map((cat, idx) => (
                        <option key={idx} value={cat}>{cat}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-slate-400 mb-1.5 uppercase">// Read Estimation</label>
                  <input 
                    type="text" 
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    placeholder="e.g. 5 min read"
                    className="w-full px-4 py-2.5 rounded-lg border border-sky-950 bg-slate-950 text-white focus:outline-none focus:border-sky-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5 uppercase">// Short Abstract</label>
                <input 
                  type="text" 
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief summary of the log..."
                  className="w-full px-4 py-2.5 rounded-lg border border-sky-950 bg-slate-950 text-white focus:outline-none focus:border-sky-400 font-sans"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5 uppercase">// Log Content (Markdown support)</label>
                <textarea 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Input detailed log entries..."
                  rows={6}
                  className="w-full px-4 py-2.5 rounded-lg border border-sky-950 bg-slate-950 text-white focus:outline-none focus:border-sky-400 font-sans"
                  required
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-sky-950/60">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 border border-sky-950 text-slate-400 rounded-lg hover:bg-slate-805 transition-colors uppercase text-[10px] font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2.5 bg-sky-500 text-slate-950 rounded-lg hover:bg-sky-400 transition-all uppercase text-[10px] font-bold"
                >
                  {editingPostId ? 'Apply Changes' : 'Append Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* modal - Read Full Post */}
      {selectedPost && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="panel-workshop rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-sky-500/20 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-sky-950/60 flex justify-between items-center bg-slate-900 rounded-t-2xl">
              <span className="font-mono-tech text-[10px] text-sky-400 bg-sky-950/40 border border-sky-900/50 px-2.5 py-1 rounded uppercase">
                {selectedPost.category}
              </span>
              <button 
                onClick={() => setSelectedPost(null)}
                className="text-slate-400 hover:text-white p-1 bg-slate-950 border border-sky-950 rounded-lg transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            <div className="p-6 md:p-8 space-y-4">
              <div className="flex items-center text-slate-500 font-mono-tech text-[10px]">
                <Calendar size={12} className="mr-1.5" />
                LOGGED_ON: {selectedPost.date} | ESTIMATED_DECRYPT: {selectedPost.readTime}
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white leading-tight font-sans">
                {selectedPost.title}
              </h3>
              <p className="text-slate-400 font-medium italic text-xs leading-relaxed border-l-2 border-sky-500/40 pl-4 py-1 font-sans">
                {selectedPost.excerpt}
              </p>
              <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap pt-4 font-sans border-t border-sky-950/40">
                {selectedPost.content}
              </div>
            </div>

            <div className="p-6 border-t border-sky-950/60 flex justify-end">
              <button 
                onClick={() => setSelectedPost(null)}
                className="px-4 py-2 bg-slate-950 border border-sky-950 text-slate-300 hover:text-white rounded-lg font-mono-tech text-xs uppercase tracking-wide transition-colors"
              >
                Close Log File
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Blog;