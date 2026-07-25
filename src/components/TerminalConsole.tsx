import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, X } from 'lucide-react';

interface TerminalConsoleProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LogLine {
  text: string;
  type: 'input' | 'output' | 'error' | 'success';
}

const TerminalConsole: React.FC<TerminalConsoleProps> = ({ isOpen, onClose }) => {
  const [history, setHistory] = useState<LogLine[]>([
    { text: 'ALBERT.DEV [Version 2.0.0]', type: 'output' },
    { text: 'Establishing secure link to Tema, Ghana...', type: 'output' },
    { text: 'Session active. Type "help" to view command registry.', type: 'success' },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStep, setAuthStep] = useState<'username' | 'password' | null>(null);
  const [authUsername, setAuthUsername] = useState('');
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  if (!isOpen) return null;

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    // Save history line
    const newHistory = [...history, { text: `albert.dev@workshop:~$ ${trimmed}`, type: 'input' as const }];
    
    // Auth process routing
    if (isAuthenticating) {
      handleAuthInput(trimmed, newHistory);
      return;
    }

    const args = trimmed.split(' ');
    const primary = args[0].toLowerCase();

    switch (primary) {
      case 'help':
        newHistory.push(
          { text: '---- REGISTRY COMMANDS ----', type: 'output' },
          { text: '  about        : Query Albert\'s mission statement', type: 'output' },
          { text: '  skills       : Display capability matrices', type: 'output' },
          { text: '  projects     : List active build logs', type: 'output' },
          { text: '  journal      : Read recent lab entries', type: 'output' },
          { text: '  resume       : Download developer resume (CV)', type: 'output' },
          { text: '  login / sudo : Access developer administration tools', type: 'output' },
          { text: '  logout       : Terminate current administrator session', type: 'output' },
          { text: '  clear        : Purge screen memory buffer', type: 'output' },
          { text: '  exit / close : Terminate terminal console interface', type: 'output' },
          { text: '---------------------------', type: 'output' }
        );
        break;

      case 'about':
        newHistory.push(
          { text: '// MISSION STATEMENT //', type: 'output' },
          { text: 'Albert is a systems builder from Ghana focused on exploring unfamiliar engineering domains, rapidly prototyping firmware/hardware modules, and documenting iterative failures.', type: 'output' },
          { text: 'Focus: ESP32 microcontrollers, Real-time kernels, custom LoRa communication layouts, and solid CAD components.', type: 'output' }
        );
        break;

      case 'skills':
        newHistory.push(
          { text: '// CAPABILITIES DOSSIER //', type: 'output' },
          { text: '  - Software  : TypeScript, React, Python, C/C++ (FreeRTOS)', type: 'output' },
          { text: '  - Hardware  : ESP32 boards, I2C/SPI interfaces, sensor arrays', type: 'output' },
          { text: '  - CAD & Fab : Fusion 360 solid modeling, FDM 3D printing', type: 'output' },
          { text: '  - Systems   : Docker, Git, Linux shells, build systems', type: 'output' }
        );
        break;

      case 'projects':
        const storedProjs = localStorage.getItem('workshop_projects');
        let projsList = [];
        if (storedProjs) {
          try { projsList = JSON.parse(storedProjs); } catch(e){}
        }
        if (projsList.length === 0) {
          projsList = [
            { title: 'Wireless Morse Code Messenger', version: 'v1.4' },
            { title: 'Autonomous Soil Probe', version: 'v2.1' },
            { title: '3D Printed Mechanical Arm', version: 'v0.8-alpha' }
          ];
        }
        newHistory.push({ text: '// ACTIVE BUILD LOGS //', type: 'output' });
        projsList.forEach((p: any, idx: number) => {
          newHistory.push({ text: `  [${idx + 1}] ${p.title} (${p.version || 'v1.0'})`, type: 'output' });
        });
        break;

      case 'journal':
        const storedPosts = localStorage.getItem('blog_posts');
        let postsList = [];
        if (storedPosts) {
          try { postsList = JSON.parse(storedPosts); } catch(e){}
        }
        newHistory.push({ text: '// RECENT LAB ENTRIES //', type: 'output' });
        if (postsList.length === 0) {
          newHistory.push({ text: '  - No log entries found. Sudo login to write first post.', type: 'output' });
        } else {
          postsList.slice(0, 3).forEach((p: any) => {
            newHistory.push({ text: `  - [${p.date}] ${p.title} (${p.category})`, type: 'output' });
          });
        }
        break;

      case 'resume':
        newHistory.push({ text: 'Triggering resume.pdf stream download...', type: 'success' });
        const link = document.createElement('a');
        link.href = '/resume.pdf';
        link.download = 'Albert_Baiden_Amissah_Resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        break;

      case 'login':
      case 'sudo':
        const alreadyIn = localStorage.getItem('isAdminLoggedIn') === 'true';
        if (alreadyIn) {
          newHistory.push({ text: 'Access status: Already authenticated as ADMINISTRATOR.', type: 'success' });
        } else {
          setIsAuthenticating(true);
          setAuthStep('username');
          newHistory.push({ text: 'Entering Console security protocol.', type: 'output' });
          newHistory.push({ text: 'Enter Administrator Username: ', type: 'output' });
        }
        break;

      case 'logout':
        localStorage.removeItem('isAdminLoggedIn');
        window.dispatchEvent(new Event('storage'));
        newHistory.push({ text: 'Console session terminated. Logged out.', type: 'error' });
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      case 'exit':
      case 'close':
        onClose();
        setInputVal('');
        return;

      default:
        newHistory.push({ text: `Command not found: "${primary}". Type "help" for registry list.`, type: 'error' });
    }

    setHistory(newHistory);
    setInputVal('');
  };

  const handleAuthInput = (val: string, newHistory: LogLine[]) => {
    if (authStep === 'username') {
      setAuthUsername(val);
      setAuthStep('password');
      newHistory.push({ text: 'Enter Security Password: ', type: 'output' });
      setHistory(newHistory);
      setInputVal('');
    } else if (authStep === 'password') {
      // Fetch credential check
      const savedCreds = localStorage.getItem('admin_credentials');
      let authSuccess = false;
      
      if (savedCreds) {
        try {
          const creds = JSON.parse(savedCreds);
          authSuccess = (authUsername === creds.username && val === creds.password);
        } catch(e) {}
      } else {
        // Fallback default password is admin
        authSuccess = (authUsername === 'admin' && val === 'admin');
      }

      if (authSuccess) {
        localStorage.setItem('isAdminLoggedIn', 'true');
        window.dispatchEvent(new Event('storage')); // Notify other components
        newHistory.push({ text: 'CONSOLE_AUTH: SUCCESS. Administrator credentials validated.', type: 'success' });
        newHistory.push({ text: 'Admin permissions unlocked across all modules.', type: 'success' });
      } else {
        newHistory.push({ text: 'CONSOLE_AUTH: FAIL. Invalid credentials sequence.', type: 'error' });
      }

      setIsAuthenticating(false);
      setAuthStep(null);
      setAuthUsername('');
      setHistory(newHistory);
      setInputVal('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-black border border-sky-500/20 rounded-lg shadow-2xl flex flex-col overflow-hidden h-[450px]">
        {/* Terminal Header */}
        <div className="bg-slate-900 border-b border-sky-950/60 px-4 py-3 flex justify-between items-center font-mono-tech text-xs">
          <div className="flex items-center space-x-2 text-sky-400">
            <TerminalIcon size={14} className="animate-pulse" />
            <span>DEV_CONSOLE.bin // ALBERT.DEV</span>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors p-0.5 rounded hover:bg-slate-800"
          >
            <X size={14} />
          </button>
        </div>

        {/* Output Screen */}
        <div 
          onClick={() => inputRef.current?.focus()}
          className="flex-1 p-4 overflow-y-auto font-mono-tech text-xs space-y-2.5 selection:bg-sky-500/20 text-emerald-400 cursor-text"
        >
          {history.map((line, idx) => (
            <div key={idx} className="whitespace-pre-wrap leading-relaxed">
              {line.type === 'input' && (
                <span className="text-sky-400 font-semibold">{line.text}</span>
              )}
              {line.type === 'output' && (
                <span className="text-slate-300">{line.text}</span>
              )}
              {line.type === 'success' && (
                <span className="text-emerald-400">{line.text}</span>
              )}
              {line.type === 'error' && (
                <span className="text-rose-400">{line.text}</span>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input Bar */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleCommand(inputVal);
          }}
          className="bg-slate-950 border-t border-sky-950/40 p-3 flex items-center"
        >
          <span className="font-mono-tech text-xs text-sky-400 mr-2 select-none">
            {isAuthenticating ? 'passcode:' : 'albert.dev@workshop:~$'}
          </span>
          <input 
            ref={inputRef}
            type={authStep === 'password' ? 'password' : 'text'}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="flex-1 bg-transparent focus:outline-none font-mono-tech text-xs text-white"
            autoFocus
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
        </form>
      </div>
    </div>
  );
};

export default TerminalConsole;
