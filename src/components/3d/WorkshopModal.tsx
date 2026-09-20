import React, { useState, useEffect, useRef } from 'react';
import { X, ExternalLink, Cpu, Terminal, Layers, Wrench, ShieldCheck, ChevronDown, ChevronUp, BookOpen, Calendar, Share2, Twitter, Linkedin, MessageSquare, Copy, Check } from 'lucide-react';
import { LogArticle } from '../../config/workshopData';

// Markdown inline style parser (bold **text**, italics *text*)
export const parseInlineStyles = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/);
  return parts.flatMap((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return [<strong key={`b-${i}`} className="text-white font-bold">{part.slice(2, -2)}</strong>];
    }
    const subParts = part.split(/(\*.*?\*)/);
    return subParts.map((subPart, j) => {
      if (subPart.startsWith('*') && subPart.endsWith('*')) {
        return <em key={`i-${i}-${j}`} className="text-sky-300 italic">{subPart.slice(1, -1)}</em>;
      }
      return subPart;
    });
  });
};

// Full Markdown Content Renderer (Headings, Images, Videos, Bullet Lists, Blockquotes, HRs)
export const renderFormattedContent = (content: string) => {
  if (!content) return null;
  const lines = content.split('\n');
  return lines.map((line, idx) => {
    const trimmed = line.trim();

    if (trimmed === '') {
      return <div key={`empty-${idx}`} className="h-3" />;
    }

    if (trimmed === '---' || trimmed === '***') {
      return <hr key={`hr-${idx}`} className="my-4 border-sky-950/80" />;
    }

    const videoRegex = /!\[video\]\((.*?)\)/i;
    const videoMatch = trimmed.match(videoRegex);
    if (videoMatch) {
      const videoUrl = videoMatch[1];
      return (
        <div key={`vid-${idx}`} className="my-4 rounded-xl overflow-hidden border border-sky-500/30 bg-slate-950 p-2 shadow-2xl">
          <video src={videoUrl} controls className="w-full rounded-lg max-h-[400px] object-contain bg-black" />
        </div>
      );
    }

    const imageRegex = /!\[(.*?)\]\((.*?)\)/;
    const imageMatch = trimmed.match(imageRegex);
    if (imageMatch) {
      const altText = imageMatch[1];
      const imageUrl = imageMatch[2];
      
      const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(imageUrl) || altText.toLowerCase() === 'video';
      if (isVideo) {
        return (
          <div key={`vid-img-${idx}`} className="my-4 rounded-xl overflow-hidden border border-sky-500/30 bg-slate-950 p-2 shadow-2xl">
            <video src={imageUrl} controls className="w-full rounded-lg max-h-[400px] object-contain bg-black" />
          </div>
        );
      }

      return (
        <div key={`img-${idx}`} className="my-4 rounded-xl overflow-hidden border border-sky-500/30 bg-slate-950 p-2 shadow-2xl">
          <img src={imageUrl} alt={altText} className="w-full rounded-lg max-h-[450px] object-cover bg-slate-900 mx-auto" />
          {altText && <p className="text-[10px] text-slate-400 font-mono-tech mt-2 text-center">// {altText}</p>}
        </div>
      );
    }

    if (trimmed.startsWith('### ')) {
      return <h4 key={`h3-${idx}`} className="text-xs font-bold text-sky-400 mt-5 mb-2 font-mono-tech uppercase tracking-wider">{parseInlineStyles(trimmed.slice(4))}</h4>;
    }
    if (trimmed.startsWith('## ')) {
      return <h3 key={`h2-${idx}`} className="text-sm sm:text-base font-bold text-white mt-6 mb-2 font-sans border-b border-sky-950/60 pb-1.5">{parseInlineStyles(trimmed.slice(3))}</h3>;
    }
    if (trimmed.startsWith('# ')) {
      return <h2 key={`h1-${idx}`} className="text-base sm:text-lg font-bold text-white mt-7 mb-3 font-sans border-b border-sky-950/80 pb-2">{parseInlineStyles(trimmed.slice(2))}</h2>;
    }

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      return (
        <ul key={`ul-${idx}`} className="list-disc pl-5 my-1.5 text-slate-200">
          <li className="font-sans text-xs sm:text-sm leading-relaxed">{parseInlineStyles(trimmed.slice(2))}</li>
        </ul>
      );
    }

    const numListMatch = trimmed.match(/^(\d+)\.\s(.*)/);
    if (numListMatch) {
      const num = numListMatch[1];
      const rest = numListMatch[2];
      return (
        <ol key={`ol-${idx}`} className="list-decimal pl-5 my-1.5 text-slate-200">
          <li value={num} className="font-sans text-xs sm:text-sm leading-relaxed">{parseInlineStyles(rest)}</li>
        </ol>
      );
    }

    if (trimmed.startsWith('> ')) {
      return (
        <blockquote key={`quote-${idx}`} className="border-l-2 border-amber-400/80 bg-slate-900/60 p-3 rounded-r-lg italic my-3 text-slate-200 font-sans text-xs sm:text-sm">
          {parseInlineStyles(trimmed.slice(2))}
        </blockquote>
      );
    }

    return (
      <p key={`p-${idx}`} className="text-slate-200 text-xs sm:text-sm leading-relaxed mb-3 font-sans">
        {parseInlineStyles(line)}
      </p>
    );
  });
};
export const SocialShareBar: React.FC<{ title: string; text?: string; url?: string }> = ({ title, text, url }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareText = text || title;

  const handleNativeShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title: title,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled share
      }
    }
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`${title} — ${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(`${title} — Albert Baiden-Amissah (A3PK Labs)`);

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 pt-3 mt-3 border-t border-slate-800/80 font-mono-tech text-[10px]">
      <span className="flex items-center gap-1 font-bold text-sky-400">
        <Share2 size={12} /> SHARE LOG:
      </span>
      <div className="flex items-center gap-1.5 flex-wrap">
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button
            type="button"
            onClick={handleNativeShare}
            className="px-2 py-1 bg-sky-950/90 border border-sky-700/80 text-sky-300 hover:text-white hover:bg-sky-900 rounded transition-all flex items-center gap-1 font-bold"
          >
            <Share2 size={10} /> Share
          </button>
        )}
        <a
          href={`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="px-2 py-1 bg-slate-900 border border-slate-700 text-sky-300 hover:text-white hover:border-sky-400 rounded transition-all flex items-center gap-1"
        >
          <Twitter size={10} /> X/Twitter
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="px-2 py-1 bg-slate-900 border border-slate-700 text-blue-300 hover:text-white hover:border-blue-400 rounded transition-all flex items-center gap-1"
        >
          <Linkedin size={10} /> LinkedIn
        </a>
        <a
          href={`https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="px-2 py-1 bg-slate-900 border border-slate-700 text-emerald-300 hover:text-white hover:border-emerald-400 rounded transition-all flex items-center gap-1"
        >
          <MessageSquare size={10} /> WhatsApp
        </a>
        <button
          type="button"
          onClick={handleCopy}
          className="px-2 py-1 bg-slate-900 border border-slate-700 text-amber-300 hover:text-white hover:border-amber-400 rounded transition-all flex items-center gap-1 font-mono-tech"
        >
          {copied ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
          <span>{copied ? 'COPIED!' : 'COPY LINK'}</span>
        </button>
      </div>
    </div>
  );
};

export interface ModalData {
  isOpen: boolean;
  title: string;
  placard?: string;
  summary: string;
  bullets?: string[];
  tags?: string[];
  externalUrl?: string;
  customContent?: React.ReactNode;
  onFullDetails?: () => void;
  onOpenTerminal?: () => void;
  fullDetails?: {
    overview: string;
    componentsList?: string[];
    schematicNotes?: string[];
    firmwareHighlights?: string[];
    challengesSolved?: string;
  };
  logEntries?: LogArticle[];
}

interface WorkshopModalProps {
  data: ModalData;
  onClose: () => void;
}

// Visual SVG Thumbnail component for log entries
const LogThumbnail: React.FC<{ type?: LogArticle['thumbnailType'] }> = ({ type }) => {
  switch (type) {
    case 'oscilloscope':
      return (
        <svg viewBox="0 0 60 40" className="w-14 h-10 bg-slate-950 border border-sky-500/40 rounded p-1">
          <path d="M5,20 Q15,5 25,20 T45,20 T55,20" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
          <line x1="0" y1="20" x2="60" y2="20" stroke="#1e293b" strokeWidth="1" strokeDasharray="2 2" />
        </svg>
      );
    case 'circuit':
      return (
        <svg viewBox="0 0 60 40" className="w-14 h-10 bg-slate-950 border border-emerald-500/40 rounded p-1">
          <rect x="20" y="12" width="20" height="16" rx="2" fill="#064e3b" stroke="#34d399" strokeWidth="1" />
          <path d="M5,20 L20,20 M40,20 L55,20" stroke="#34d399" strokeWidth="1.5" />
          <circle cx="5" cy="20" r="2" fill="#34d399" />
          <circle cx="55" cy="20" r="2" fill="#34d399" />
        </svg>
      );
    case 'code':
      return (
        <svg viewBox="0 0 60 40" className="w-14 h-10 bg-slate-950 border border-amber-500/40 rounded p-1 font-mono">
          <text x="8" y="18" fill="#fb923c" fontSize="8">&lt;code&gt;</text>
          <text x="12" y="30" fill="#38bdf8" fontSize="8">ISR()</text>
        </svg>
      );
    case 'cad':
      return (
        <svg viewBox="0 0 60 40" className="w-14 h-10 bg-slate-950 border border-indigo-500/40 rounded p-1">
          <polygon points="30,8 50,18 30,28 10,18" fill="none" stroke="#818cf8" strokeWidth="1.5" />
          <line x1="10" y1="18" x2="10" y2="30" stroke="#818cf8" strokeWidth="1.5" />
          <line x1="30" y1="28" x2="30" y2="38" stroke="#818cf8" strokeWidth="1.5" />
          <line x1="50" y1="18" x2="50" y2="30" stroke="#818cf8" strokeWidth="1.5" />
        </svg>
      );
    case 'vision':
      return (
        <svg viewBox="0 0 60 40" className="w-14 h-10 bg-slate-950 border border-rose-500/40 rounded p-1">
          <circle cx="30" cy="20" r="12" fill="none" stroke="#fb7185" strokeWidth="1.5" />
          <circle cx="30" cy="20" r="4" fill="#fb7185" />
          <line x1="10" y1="20" x2="50" y2="20" stroke="#fb7185" strokeWidth="1" strokeDasharray="2 2" />
        </svg>
      );
    case 'battery':
      return (
        <svg viewBox="0 0 60 40" className="w-14 h-10 bg-slate-950 border border-emerald-500/40 rounded p-1">
          <rect x="12" y="10" width="32" height="20" rx="3" fill="none" stroke="#34d399" strokeWidth="1.5" />
          <rect x="44" y="15" width="4" height="10" rx="1" fill="#34d399" />
          <rect x="15" y="13" width="20" height="14" rx="1" fill="#34d399" />
        </svg>
      );
    case 'failed':
    default:
      return (
        <svg viewBox="0 0 60 40" className="w-14 h-10 bg-slate-950 border border-amber-600/40 rounded p-1">
          <path d="M15,30 L30,10 L45,30 Z" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
          <circle cx="30" cy="25" r="1.5" fill="#f59e0b" />
          <line x1="30" y1="17" x2="30" y2="21" stroke="#f59e0b" strokeWidth="1.5" />
        </svg>
      );
  }
};

export const WorkshopModal: React.FC<WorkshopModalProps> = ({ data, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const [showFullView, setShowFullView] = useState(false);
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const prevIsOpenRef = useRef(false);

  useEffect(() => {
    // Only reset state when modal transitions from closed (false) to open (true)
    if (data.isOpen && !prevIsOpenRef.current) {
      setShowFullView(false);
      setSelectedLogId(null);
      previousActiveElement.current = document.activeElement as HTMLElement;

      // Safe JS focus trap filtering without querySelectorAll attribute syntax errors
      try {
        const elements = modalRef.current?.querySelectorAll<HTMLElement>(
          'button, a[href], input, select, textarea, [tabindex]'
        );
        if (elements) {
          const focusable = Array.from(elements).filter(
            (el) => el.getAttribute('tabindex') !== '-1' && !el.hasAttribute('disabled')
          );
          if (focusable.length > 0) {
            focusable[0].focus();
          }
        }
      } catch (err) {
        // Safe fallback
      }

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        if (previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
      };
    }

    prevIsOpenRef.current = data.isOpen;
  }, [data.isOpen, onClose]);

  if (!data.isOpen) return null;

  // Strict target check for backdrop click: only close if user clicked directly on backdrop container
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl panel-workshop rounded-2xl p-5 sm:p-7 border border-sky-500/40 shadow-[0_0_60px_rgba(0,0,0,0.9)] text-slate-100 font-sans my-auto max-h-[90vh] flex flex-col"
      >
        {/* Header bar */}
        <div className="flex justify-between items-start border-b border-sky-950 pb-3 mb-4 shrink-0">
          <div>
            {data.placard && (
              <span className="font-mono-tech text-[10px] text-sky-400 uppercase tracking-widest block mb-1">
                // {data.placard}
              </span>
            )}
            <h2 id="modal-title" className="text-lg sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              {data.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close dialog"
            className="text-slate-400 hover:text-sky-400 p-2 rounded-lg bg-slate-900 border border-sky-950/60 transition-colors shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto pr-1 space-y-4 flex-1 font-sans">
          
          {/* Tags */}
          {data.tags && data.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {data.tags.map((tag, idx) => (
                <span key={idx} className="font-mono-tech text-[10px] bg-sky-500/10 border border-sky-500/20 text-sky-300 px-2 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* High-level Summary */}
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            {data.summary}
          </p>

          {/* At most 4 Short Bullets */}
          {data.bullets && data.bullets.length > 0 && (
            <ul className="space-y-2 font-mono-tech text-xs text-slate-300 border-l-2 border-sky-500/40 pl-4 py-1">
              {data.bullets.slice(0, 4).map((bullet, idx) => (
                <li key={idx} className="leading-normal">
                  • {bullet}
                </li>
              ))}
            </ul>
          )}

          {/* Interactive Logbook Entries Section with Visual Thumbnails & Abstracts */}
          {data.logEntries && data.logEntries.length > 0 && (
            <div className="mt-4 pt-3 border-t border-sky-950/80">
              <div className="flex items-center justify-between text-xs font-mono-tech text-sky-400 font-bold mb-3">
                <span className="flex items-center">
                  <BookOpen size={14} className="mr-1.5 text-amber-400" /> RECENT BUILD LOGS & ABSTRACTS
                </span>
                <span className="text-[10px] text-slate-400 font-normal">Select log to view</span>
              </div>

              {/* Log Abstracts List */}
              <div className="space-y-2">
                {data.logEntries.map((log) => {
                  const isSelected = selectedLogId === log.id;
                  return (
                    <div
                      key={log.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLogId(isSelected ? null : log.id);
                      }}
                      className={`p-3 rounded-lg border transition-all cursor-pointer flex items-start space-x-3 ${
                        isSelected
                          ? 'bg-slate-900 border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                          : 'bg-slate-950/80 border-slate-800 hover:border-sky-500/50 hover:bg-slate-900/60'
                      }`}
                    >
                      {/* SVG Thumbnail */}
                      <div className="shrink-0 mt-0.5">
                        <LogThumbnail type={log.thumbnailType} />
                      </div>

                      {/* Log Abstract Info */}
                      <div className="flex-1 font-mono-tech text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-xs">{log.title}</span>
                          <span className="text-[10px] text-slate-400 flex items-center">
                            <Calendar size={10} className="mr-1" /> {log.date}
                          </span>
                        </div>
                        
                        <p className="font-sans text-xs text-slate-300 mt-1 line-clamp-2">
                          {log.abstract}
                        </p>

                        {/* Expanded Log Full Article View */}
                        {isSelected && (
                          <div className="mt-3 pt-3 border-t border-sky-950 font-sans text-xs text-slate-100 animate-fade-in bg-slate-950/95 p-4 rounded-xl border border-sky-500/40 shadow-[0_0_25px_rgba(56,189,248,0.15)]">
                            <div className="font-mono-tech text-[10px] text-sky-400 font-bold mb-2 flex justify-between items-center border-b border-sky-950 pb-1.5">
                              <span className="flex items-center gap-1.5">
                                <BookOpen size={12} className="text-amber-400" /> FULL LOG RECORD
                              </span>
                              <span>{log.date}</span>
                            </div>
                            <div className="leading-relaxed text-slate-100 font-sans text-xs sm:text-sm my-2">
                              {renderFormattedContent(log.content)}
                            </div>
                            {log.tags && log.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-slate-800/80">
                                {log.tags.map((t, idx) => (
                                  <span key={idx} className="font-mono-tech text-[10px] bg-sky-950 border border-sky-800 text-sky-300 px-2 py-0.5 rounded">
                                    #{t}
                                  </span>
                                ))}
                              </div>
                            )}
                            <SocialShareBar title={log.title} text={log.abstract} />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Custom Content node */}
          {data.customContent && (
            <div className="my-3">{data.customContent}</div>
          )}

          {/* Full Details In-Modal Technical View */}
          {showFullView && (data.fullDetails || data.bullets) && (
            <div className="mt-4 pt-4 border-t border-sky-950 space-y-4 animate-fade-in font-mono-tech text-xs">
              
              {data.fullDetails?.overview && (
                <div className="bg-slate-900/80 p-3 rounded-lg border border-sky-500/20">
                  <div className="text-sky-400 font-bold mb-1 text-[11px] uppercase tracking-wider flex items-center">
                    <Cpu size={14} className="mr-1.5" /> Technical Specification Overview
                  </div>
                  <div className="font-sans text-xs text-slate-300 leading-relaxed">
                    {renderFormattedContent(data.fullDetails.overview)}
                  </div>
                </div>
              )}

              {data.fullDetails?.componentsList && data.fullDetails.componentsList.length > 0 && (
                <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                  <div className="text-amber-400 font-bold mb-2 text-[10px] uppercase tracking-wider flex items-center">
                    <Wrench size={13} className="mr-1.5" /> Hardware Component Breakdown
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-slate-300 font-sans text-xs">
                    {data.fullDetails.componentsList.map((comp, idx) => (
                      <li key={idx} className="flex items-center bg-slate-950 px-2 py-1 rounded border border-slate-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-2" />
                        <span>{comp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {data.fullDetails?.schematicNotes && data.fullDetails.schematicNotes.length > 0 && (
                <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                  <div className="text-cyan-400 font-bold mb-2 text-[10px] uppercase tracking-wider flex items-center">
                    <Layers size={13} className="mr-1.5" /> Pinout & Circuit Schematic Notes
                  </div>
                  <ul className="space-y-1 text-slate-300 font-mono-tech text-[11px]">
                    {data.fullDetails.schematicNotes.map((note, idx) => (
                      <li key={idx} className="bg-slate-950 p-2 rounded border border-cyan-950/60 text-cyan-200">
                        &gt; {note}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {data.fullDetails?.firmwareHighlights && data.fullDetails.firmwareHighlights.length > 0 && (
                <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                  <div className="text-sky-400 font-bold mb-2 text-[10px] uppercase tracking-wider flex items-center">
                    <Cpu size={13} className="mr-1.5" /> Firmware & CAD Specifications
                  </div>
                  <ul className="space-y-1 text-slate-300 font-mono-tech text-[11px]">
                    {data.fullDetails.firmwareHighlights.map((fw, idx) => (
                      <li key={idx} className="bg-slate-950 p-2 rounded border border-sky-950/60 text-sky-200">
                        &gt; {fw}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {data.fullDetails?.challengesSolved && (
                <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                  <div className="text-emerald-400 font-bold mb-1 text-[10px] uppercase tracking-wider flex items-center">
                    <ShieldCheck size={13} className="mr-1.5" /> Engineering Challenge & Resolution
                  </div>
                  <p className="font-sans text-xs text-slate-300 leading-relaxed">
                    {data.fullDetails.challengesSolved}
                  </p>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Footer Action Bar */}
        <div className="pt-4 mt-3 border-t border-sky-950 flex flex-wrap gap-2 justify-between items-center shrink-0 font-mono-tech text-xs">
          
          {/* CRT Terminal Trigger Button inside Modal */}
          {data.onOpenTerminal && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
                data.onOpenTerminal?.();
              }}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3.5 py-2 rounded-lg inline-flex items-center shadow-lg transition-all"
            >
              <Terminal size={14} className="mr-1.5 animate-pulse" />
              <span>Launch Terminal (/help)</span>
            </button>
          )}

          <div className="flex gap-2 ml-auto">
            {/* Toggle Full In-Modal Technical View */}
            {(data.fullDetails || data.bullets) && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFullView((prev) => !prev);
                  if (data.onFullDetails) data.onFullDetails();
                }}
                className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-4 py-2 rounded-lg inline-flex items-center shadow-lg transition-all"
              >
                <span>{showFullView ? 'Hide Full Details' : 'See Full Details'}</span>
                {showFullView ? (
                  <ChevronUp size={14} className="ml-1" />
                ) : (
                  <ChevronDown size={14} className="ml-1" />
                )}
              </button>
            )}

            {/* Optional GitHub Source Link if provided */}
            {data.externalUrl && (
              <a
                href={data.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/30 font-bold px-3 py-2 rounded-lg inline-flex items-center transition-all text-[11px]"
              >
                <span>Source Repo</span>
                <ExternalLink size={13} className="ml-1.5" />
              </a>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
