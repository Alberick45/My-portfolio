import React, { createContext, useContext, useState, useEffect } from 'react';

interface VisitorContextType {
  visitorName: string;
  visitorEmail: string;
  hasVisited: boolean;
  setVisitor: (name: string, email?: string) => void;
}

const VisitorContext = createContext<VisitorContextType>({
  visitorName: '',
  visitorEmail: '',
  hasVisited: false,
  setVisitor: () => {},
});

export const VisitorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visitorName, setVisitorName] = useState<string>(() => {
    return localStorage.getItem('visitor_name') || '';
  });

  const [visitorEmail, setVisitorEmail] = useState<string>(() => {
    return localStorage.getItem('visitor_email') || '';
  });

  const [hasVisited, setHasVisited] = useState<boolean>(() => {
    return !!localStorage.getItem('visitor_name');
  });

  const setVisitor = (name: string, email: string = '') => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    
    setVisitorName(trimmedName);
    setVisitorEmail(trimmedEmail);
    setHasVisited(true);

    if (trimmedName) {
      localStorage.setItem('visitor_name', trimmedName);
    }
    if (trimmedEmail) {
      localStorage.setItem('visitor_email', trimmedEmail);
    }
  };

  return (
    <VisitorContext.Provider value={{ visitorName, visitorEmail, hasVisited, setVisitor }}>
      {children}
    </VisitorContext.Provider>
  );
};

export const useVisitor = () => useContext(VisitorContext);
