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

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  
  // Auth state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
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
    <section id="blog" className="py-16 md:py-24 bg-white relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16 relative select-none">
          <h2 
            onDoubleClick={() => setIsAuthModalOpen(true)}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 cursor-pointer hover:text-indigo-800 transition-colors"
            title="Double-click to access admin console"
          >
            Blog & Journal
          </h2>
          <div className="w-20 h-1 bg-indigo-700 mx-auto mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Thoughts, insights, and reflections on my journey through technology and beyond.
          </p>
          
          {/* Admin Bar */}
          {isAdminLoggedIn && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 bg-indigo-50 border border-indigo-100 rounded-xl p-4 max-w-xl mx-auto shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
              <span className="text-sm font-semibold text-indigo-900 flex items-center">
                <Lock size={16} className="mr-1.5 text-indigo-600 animate-pulse" />
                Administrator Mode Active
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleOpenCreateModal}
                  className="inline-flex items-center bg-indigo-700 hover:bg-indigo-800 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all shadow-md"
                >
                  <Plus size={14} className="mr-1" />
                  Write New Post
                </button>
                <button
                  onClick={() => setIsAdminLoggedIn(false)}
                  className="inline-flex items-center bg-white hover:bg-red-50 text-red-700 border border-red-200 px-4 py-2 rounded-lg text-xs font-semibold transition-all"
                >
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div 
              key={post.id} 
              onClick={() => setSelectedPost(post)}
              className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Visual Header */}
                <div className={`h-40 bg-gradient-to-br ${post.gradient} p-6 flex flex-col justify-between text-white relative`}>
                  <div className="flex justify-between items-start">
                    <span className="backdrop-blur-md bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/10">
                      {post.category}
                    </span>
                    {isAdminLoggedIn && (
                      <div className="flex gap-1.5 text-slate-800">
                        <button
                          onClick={(e) => handleOpenEditModal(post, e)}
                          className="bg-white/95 hover:bg-white p-2 rounded-lg transition-colors shadow-sm"
                          title="Edit Post"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={(e) => handleDeletePost(post.id, e)}
                          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors shadow-sm"
                          title="Delete Post"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="text-white/80 text-xs flex items-center mb-1">
                      <Clock size={12} className="mr-1" />
                      {post.readTime}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-700 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 border-t border-gray-50 flex justify-between items-center text-gray-500 text-xs">
                <div className="flex items-center">
                  <Calendar size={14} className="mr-1" />
                  {post.date}
                </div>
                <span className="text-indigo-700 group-hover:translate-x-1 transition-transform font-semibold flex items-center">
                  Read Article <ArrowRight size={14} className="ml-1" />
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {posts.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-slate-500 mb-2">No posts available. Double-click header to enter admin mode and write one!</p>
          </div>
        )}

        {/* Subscribe Section */}
        <div className="mt-16 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-8">
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
          </div>
        </div>
      </div>

      {/* Secret Auth Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
              <h3 className="text-lg font-bold text-slate-800 flex items-center">
                <Key size={18} className="text-indigo-600 mr-2" />
                {hasCredentials ? 'Administrator Sign In' : 'Setup Administrator Credentials'}
              </h3>
              <button 
                onClick={() => {
                  setIsAuthModalOpen(false);
                  setAuthError('');
                }}
                className="text-slate-400 hover:text-slate-600 p-1 bg-white border border-slate-200 rounded-lg transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            
            <form onSubmit={handleAuthSubmit} className="p-6 space-y-4 text-slate-800">
              {authError && (
                <div className="bg-red-50 text-red-700 text-xs font-semibold px-3 py-2 rounded-lg border border-red-100">
                  {authError}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Username</label>
                <input 
                  type="text" 
                  value={authUsername}
                  onChange={(e) => setAuthUsername(e.target.value)}
                  placeholder="Enter administrator username"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                <input 
                  type="password" 
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
                  required
                />
              </div>

              {!hasCredentials && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm Password</label>
                  <input 
                    type="password" 
                    value={authConfirmPassword}
                    onChange={(e) => setAuthConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
                    required
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Setting up credentials for the first time. The password will be encrypted & hashed using SHA-256.
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => {
                    setIsAuthModalOpen(false);
                    setAuthError('');
                  }}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg text-sm font-semibold shadow-md transition-all"
                >
                  {hasCredentials ? 'Log In' : 'Register Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* modal - Create / Edit Post */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
              <h3 className="text-xl font-bold text-slate-800 flex items-center">
                <Plus size={20} className="text-indigo-600 mr-2" />
                {editingPostId ? 'Edit Article' : 'Write a New Article'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 bg-white border border-slate-200 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSavePost} className="p-6 space-y-4 text-slate-800">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. My Experience Building Rokai Assistant"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-sm font-semibold text-slate-700">Category</label>
                    <button
                      type="button"
                      onClick={() => setShowAddCategoryInput(!showAddCategoryInput)}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
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
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
                      />
                      <button
                        type="button"
                        onClick={handleAddCategory}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold"
                      >
                        Add
                      </button>
                    </div>
                  ) : (
                    <select 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                    >
                      {categories.map((cat, idx) => (
                        <option key={idx} value={cat}>{cat}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Read Time</label>
                  <input 
                    type="text" 
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    placeholder="e.g. 5 min read"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Short Excerpt</label>
                <input 
                  type="text" 
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief summary of the article..."
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Post Content</label>
                <textarea 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write the body of your article here..."
                  rows={6}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-sans bg-white"
                  required
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  {editingPostId ? 'Save Changes' : 'Publish Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* modal - Read Full Post */}
      {selectedPost && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className={`h-48 bg-gradient-to-br ${selectedPost.gradient} p-6 flex flex-col justify-between text-white relative`}>
              <div className="flex justify-between items-start">
                <span className="backdrop-blur-md bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/10">
                  {selectedPost.category}
                </span>
                <button 
                  onClick={() => setSelectedPost(null)}
                  className="text-white hover:bg-white/20 p-1.5 rounded-lg transition-colors border border-white/10 backdrop-blur-sm"
                >
                  <X size={18} />
                </button>
              </div>
              <div>
                <div className="text-white/80 text-xs flex items-center mb-1">
                  <Clock size={12} className="mr-1" />
                  {selectedPost.readTime}
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-4">
              <div className="flex items-center text-slate-400 text-xs">
                <Calendar size={14} className="mr-1.5" />
                {selectedPost.date}
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
                {selectedPost.title}
              </h3>
              <p className="text-slate-500 font-medium italic text-sm leading-relaxed border-l-2 border-indigo-600 pl-4 py-1">
                {selectedPost.excerpt}
              </p>
              <div className="text-slate-700 text-base leading-relaxed whitespace-pre-wrap pt-4">
                {selectedPost.content}
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setSelectedPost(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition-colors"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Blog;