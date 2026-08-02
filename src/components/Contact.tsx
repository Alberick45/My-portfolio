import React, { useState } from 'react';
import { Mail, Phone, MapPin, Linkedin, Github, MessageSquare, Terminal, Send, Loader2 } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const triggerMailtoFallback = () => {
    const mailtoUrl = `mailto:albertbaidenamissah@proton.me?subject=${encodeURIComponent(
      formData.subject || 'Portfolio Inquiry'
    )}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )}`;
    window.location.href = mailtoUrl;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    setStatusMessage('');

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

    if (!accessKey || accessKey.includes('your_web3forms')) {
      console.warn('Web3Forms Access Key is not configured in .env. Falling back to mailto.');
      setStatus('error');
      setStatusMessage('NO ACCESS KEY DETECTED. INITIALIZING DIRECT COMMS FALLBACK...');
      setTimeout(() => {
        triggerMailtoFallback();
        setStatus('idle');
      }, 1500);
      return;
    }

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          from_name: `${formData.name} via Portfolio`,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
        // Reset status to idle after a few seconds
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (err: any) {
      console.error('Submission error:', err);
      setStatus('error');
      setStatusMessage('TRANSMISSION TIMEOUT. LAUNCHING DIRECT COMMS FALLBACK...');
      setTimeout(() => {
        triggerMailtoFallback();
        setStatus('idle');
      }, 1500);
    }
  };

  return (
    <section id="contact" className="py-20 bg-blueprint-grid bg-[#090d16] border-t border-sky-950/40 relative">
      <div className="absolute inset-0 bg-dot-grid opacity-30 pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-6 z-10 relative">

        {/* Section Header */}
        <div className="mb-12 border-b border-sky-950/80 pb-6 flex flex-col md:flex-row md:items-end justify-between">
          <div>
            <span className="font-mono-tech text-xs text-sky-500 uppercase tracking-widest">// COMMS_ANTENNA_TX</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mt-1">
              Establish <span className="text-sky-400">Connection</span>
            </h2>
          </div>
          <p className="text-slate-400 text-sm max-w-md mt-2 md:mt-0 font-sans">
            Transmit telemetry or project queries directly to Albert's local console. Responses are usually parsed within 12 cycles.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* Console Form */}
          <div className="lg:col-span-7 flex">
            <div className="panel-workshop p-6 md:p-8 rounded-xl border-sky-500/10 w-full flex flex-col justify-between">
              <div>
                <h3 className="font-mono-tech text-sky-400 text-sm mb-6 flex items-center">
                  <Terminal size={16} className="mr-2 text-sky-400" />
                  CONNECTION_CONSOLE.exe
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4 font-mono-tech text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-slate-400 mb-1.5 uppercase">// CALL_SIGN (NAME)</label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Captain Nemo"
                        className="w-full px-4 py-2.5 rounded-lg border border-sky-950 bg-slate-950 text-white focus:outline-none focus:border-sky-400 font-sans"
                        required
                        disabled={status === 'sending'}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-slate-400 mb-1.5 uppercase">// COMMS_ADDRESS (EMAIL)</label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. nemo@nautilus.org"
                        className="w-full px-4 py-2.5 rounded-lg border border-sky-950 bg-slate-950 text-white focus:outline-none focus:border-sky-400 font-sans"
                        required
                        disabled={status === 'sending'}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-slate-400 mb-1.5 uppercase">// LOG_HEADER (SUBJECT)</label>
                    <input
                      type="text"
                      id="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="e.g. LoRa Project Collaboration query"
                      className="w-full px-4 py-2.5 rounded-lg border border-sky-950 bg-slate-950 text-white focus:outline-none focus:border-sky-400 font-sans"
                      required
                      disabled={status === 'sending'}
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-slate-400 mb-1.5 uppercase">// LOG_PAYLOAD (MESSAGE)</label>
                    <textarea
                      id="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Input detailed packet contents..."
                      className="w-full px-4 py-2.5 rounded-lg border border-sky-950 bg-slate-950 text-white focus:outline-none focus:border-sky-400 font-sans text-sm"
                      required
                      disabled={status === 'sending'}
                    ></textarea>
                  </div>

                  {status !== 'idle' && (
                    <div className={`p-4 rounded-lg border font-mono-tech text-xs transition-all ${
                      status === 'sending' 
                        ? 'bg-sky-950/20 border-sky-500/30 text-sky-400 animate-pulse'
                        : status === 'success'
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400'
                        : 'bg-amber-950/20 border-amber-500/30 text-amber-400'
                    }`}>
                      <p className="flex items-center gap-2">
                        <span className={`h-1.5 w-1.5 rounded-full bg-current ${status === 'sending' ? 'animate-ping' : ''}`} />
                        <span>
                          {status === 'sending' && `// TRANSMITTING TELEMETRY PACKET...`}
                          {status === 'success' && `// SYSTEM: SIGNAL TRANSMITTED SUCCESSFULLY. [OK]`}
                          {status === 'error' && `// SYSTEM: ${statusMessage}`}
                        </span>
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className={`bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold uppercase tracking-wider text-xs px-6 py-3.5 rounded-lg transition-all flex items-center ${
                      status === 'sending' ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {status === 'sending' ? (
                      <>
                        <Loader2 size={14} className="mr-2 animate-spin" />
                        Transmitting...
                      </>
                    ) : (
                      <>
                        <Send size={14} className="mr-2" />
                        Transmit Signal
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Info Side Grid */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">

            {/* Connection Cards */}
            <div className="space-y-4">

              {/* Email */}
              <div className="panel-workshop p-4.5 rounded-xl border-sky-500/10 flex items-start">
                <div className="p-2.5 bg-sky-950/50 rounded-lg border border-sky-500/20 mr-4">
                  <Mail size={16} className="text-sky-400" />
                </div>
                <div>
                  <h4 className="font-mono-tech font-bold text-xs text-white uppercase">01. Comms Address</h4>
                  <p className="text-slate-300 text-sm mt-1">albertbaidenamissah@proton.me</p>
                  <a href="mailto:albertbaidenamissah@proton.me" className="text-sky-400 hover:underline text-xs mt-1.5 inline-block font-mono-tech">
                    [MAIL_CLIENT.exe]
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="panel-workshop p-4.5 rounded-xl border-sky-500/10 flex items-start">
                <div className="p-2.5 bg-sky-950/50 rounded-lg border border-sky-500/20 mr-4">
                  <Phone size={16} className="text-sky-400" />
                </div>
                <div>
                  <h4 className="font-mono-tech font-bold text-xs text-white uppercase">02. Direct Line</h4>
                  <p className="text-slate-300 text-sm mt-1">+233 20 850 6317</p>
                  <a href="tel:+233208506317" className="text-sky-400 hover:underline text-xs mt-1.5 inline-block font-mono-tech">
                    [VOIP_RING.exe]
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="panel-workshop p-4.5 rounded-xl border-sky-500/10 flex items-start">
                <div className="p-2.5 bg-sky-950/50 rounded-lg border border-sky-500/20 mr-4">
                  <MapPin size={16} className="text-sky-400" />
                </div>
                <div>
                  <h4 className="font-mono-tech font-bold text-xs text-white uppercase">03. Grid Coordinates</h4>
                  <p className="text-slate-300 text-sm mt-1">Tema, Ghana (5.6698° N, 0.0167° W)</p>
                </div>
              </div>

            </div>

            {/* Socials / Connections */}
            <div className="panel-workshop p-5 rounded-xl border-sky-500/10">
              <h4 className="font-mono-tech font-bold text-xs text-white uppercase mb-4">// REMOTE_LINKS</h4>
              <div className="flex gap-3">
                <a
                  href="https://linkedin.com/in/albert-baiden-amissah"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-slate-900 hover:bg-slate-800 border border-sky-950 hover:border-sky-400/30 rounded-lg text-sky-400 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={18} />
                </a>
                <a
                  href="https://github.com/albertbaiden"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-slate-900 hover:bg-slate-800 border border-sky-950 hover:border-sky-400/30 rounded-lg text-sky-400 transition-colors"
                  aria-label="GitHub"
                >
                  <Github size={18} />
                </a>
                <a
                  href="https://wa.me/233208506317"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-slate-900 hover:bg-slate-800 border border-sky-950 hover:border-sky-400/30 rounded-lg text-sky-400 transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageSquare size={18} />
                </a>
              </div>
            </div>

            {/* Availability */}
            <div className="panel-workshop p-5 rounded-xl border-amber-500/20 bg-slate-900/40 text-xs">
              <h4 className="font-mono-tech font-bold text-amber-500 uppercase mb-2">// COLLAB_STATUS</h4>
              <p className="text-slate-400 leading-relaxed font-sans">
                I am currently open to internships, active hardware/software project collaborations, and exploratory systems testing. Let's build.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;