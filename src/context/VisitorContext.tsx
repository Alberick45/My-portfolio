import React, { createContext, useContext, useState, useEffect } from 'react';

// 30 minutes in milliseconds
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;

interface VisitorContextType {
  visitorName: string;
  visitorEmail: string;
  hasVisited: boolean;
  setVisitor: (name: string, email?: string) => void;
  clearVisitorSession: () => void;
}

const VisitorContext = createContext<VisitorContextType>({
  visitorName: '',
  visitorEmail: '',
  hasVisited: false,
  setVisitor: () => {},
  clearVisitorSession: () => {},
});

export const VisitorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Helper to check if stored session is still valid (less than 30 mins inactive)
  const isSessionValid = (): boolean => {
    const lastActiveStr = localStorage.getItem('visitor_last_active');
    const storedName = localStorage.getItem('visitor_name');
    if (!storedName) return false;

    if (!lastActiveStr) return true; // Legacy entry fallback

    const lastActive = parseInt(lastActiveStr, 10);
    const now = Date.now();
    
    // Expired if inactive for more than 30 minutes
    if (now - lastActive > INACTIVITY_TIMEOUT_MS) {
      return false;
    }
    return true;
  };

  const [visitorName, setVisitorName] = useState<string>(() => {
    if (isSessionValid()) {
      return localStorage.getItem('visitor_name') || '';
    } else {
      // Clear expired session on boot
      localStorage.removeItem('visitor_name');
      localStorage.removeItem('visitor_email');
      localStorage.removeItem('visitor_last_active');
      return '';
    }
  });

  const [visitorEmail, setVisitorEmail] = useState<string>(() => {
    if (isSessionValid()) {
      return localStorage.getItem('visitor_email') || '';
    }
    return '';
  });

  const [hasVisited, setHasVisited] = useState<boolean>(() => {
    return isSessionValid();
  });

  const setVisitor = (name: string, email: string = '') => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const nowStr = Date.now().toString();

    setVisitorName(trimmedName);
    setVisitorEmail(trimmedEmail);
    setHasVisited(true);

    if (trimmedName) {
      localStorage.setItem('visitor_name', trimmedName);
      localStorage.setItem('visitor_last_active', nowStr);
    }
    if (trimmedEmail) {
      localStorage.setItem('visitor_email', trimmedEmail);
    }
  };

  const clearVisitorSession = () => {
    setVisitorName('');
    setVisitorEmail('');
    setHasVisited(false);
    localStorage.removeItem('visitor_name');
    localStorage.removeItem('visitor_email');
    localStorage.removeItem('visitor_last_active');
  };

  // Activity tracker & periodic inactivity checker
  useEffect(() => {
    if (!visitorName) return;

    let lastUpdate = Date.now();
    localStorage.setItem('visitor_last_active', lastUpdate.toString());

    // Throttle timestamp updates to once every 10 seconds on user interaction
    const updateActivity = () => {
      const now = Date.now();
      if (now - lastUpdate > 10000) {
        lastUpdate = now;
        localStorage.setItem('visitor_last_active', now.toString());
      }
    };

    const activityEvents = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];
    activityEvents.forEach((event) => {
      window.addEventListener(event, updateActivity, { passive: true });
    });

    // Check inactivity status every 30 seconds
    const interval = setInterval(() => {
      const lastActiveStr = localStorage.getItem('visitor_last_active');
      if (lastActiveStr) {
        const lastActive = parseInt(lastActiveStr, 10);
        if (Date.now() - lastActive > INACTIVITY_TIMEOUT_MS) {
          console.log("[SESSION] Visitor session expired due to 30 minutes of inactivity.");
          clearVisitorSession();
        }
      }
    }, 30000);

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, updateActivity);
      });
      clearInterval(interval);
    };
  }, [visitorName]);

  return (
    <VisitorContext.Provider value={{ visitorName, visitorEmail, hasVisited, setVisitor, clearVisitorSession }}>
      {children}
    </VisitorContext.Provider>
  );
};

export const useVisitor = () => useContext(VisitorContext);
