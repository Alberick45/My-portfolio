import React, { createContext, useContext, useState, useEffect } from 'react';

// 30 minutes in milliseconds
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;

// Helper function to sanitize user input against XSS
const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .trim()
    .slice(0, 30);
};

interface VisitorContextType {
  visitorName: string;
  visitorEmail: string;
  hasVisited: boolean;
  setVisitor: (name: string) => void;
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
  // Purge any legacy email stored in local storage for privacy & security
  useEffect(() => {
    localStorage.removeItem('visitor_email');
  }, []);

  const isSessionValid = (): boolean => {
    const lastActiveStr = localStorage.getItem('visitor_last_active');
    const storedName = localStorage.getItem('visitor_name');
    if (!storedName) return false;
    if (!lastActiveStr) return true;

    const lastActive = parseInt(lastActiveStr, 10);
    const now = Date.now();
    return now - lastActive <= INACTIVITY_TIMEOUT_MS;
  };

  const [visitorName, setVisitorName] = useState<string>(() => {
    if (isSessionValid()) {
      return sanitizeInput(localStorage.getItem('visitor_name') || '');
    } else {
      localStorage.removeItem('visitor_name');
      localStorage.removeItem('visitor_email');
      localStorage.removeItem('visitor_last_active');
      return '';
    }
  });

  const [hasVisited, setHasVisited] = useState<boolean>(() => {
    return isSessionValid();
  });

  const setVisitor = (name: string) => {
    const sanitized = sanitizeInput(name);
    const nowStr = Date.now().toString();

    setVisitorName(sanitized);
    setHasVisited(true);

    if (sanitized) {
      localStorage.setItem('visitor_name', sanitized);
      localStorage.setItem('visitor_last_active', nowStr);
    }
  };

  const clearVisitorSession = () => {
    setVisitorName('');
    setHasVisited(false);
    localStorage.removeItem('visitor_name');
    localStorage.removeItem('visitor_email');
    localStorage.removeItem('visitor_last_active');
  };

  useEffect(() => {
    if (!visitorName) return;

    let lastUpdate = Date.now();
    localStorage.setItem('visitor_last_active', lastUpdate.toString());

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

    const interval = setInterval(() => {
      const lastActiveStr = localStorage.getItem('visitor_last_active');
      if (lastActiveStr) {
        const lastActive = parseInt(lastActiveStr, 10);
        if (Date.now() - lastActive > INACTIVITY_TIMEOUT_MS) {
          console.log("[SESSION] Visitor session expired due to inactivity.");
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
    <VisitorContext.Provider value={{ visitorName, visitorEmail: '', hasVisited, setVisitor, clearVisitorSession }}>
      {children}
    </VisitorContext.Provider>
  );
};

export const useVisitor = () => useContext(VisitorContext);
