import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Settings ka structure define karein
interface AppSettings {
  aiSuggestionsEnabled: boolean;
  toggleAISuggestions: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const SettingsContext = createContext<AppSettings | undefined>(undefined);

// Provider component jo state ko manage karega
export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  // --- YEH HAI FIX 1: State ko seedha localStorage se initialize kiya taaki flicker na ho ---
  const [aiSuggestionsEnabled, setAiSuggestionsEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('aiSuggestionsEnabled') !== 'false'; // Default 'true'
    }
    return true;
  });

  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false; // Server-side ke liye default
  });
  // --------------------------------------------------------------------------

  // Yeh effect state change hone par class aur localStorage ko update karta hai
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement;
      root.classList.remove('dark', 'light');
      root.classList.add(darkMode ? 'dark' : 'light');
      localStorage.setItem('darkMode', String(darkMode));
    }
  }, [darkMode]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('aiSuggestionsEnabled', String(aiSuggestionsEnabled));
    }
  }, [aiSuggestionsEnabled]);

  const toggleAISuggestions = () => {
    setAiSuggestionsEnabled(prev => !prev);
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const value = { aiSuggestionsEnabled, toggleAISuggestions, darkMode, toggleDarkMode };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

// Custom hook taaki settings aasaani se use ho sakein
export const useAppSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useAppSettings must be used within a SettingsProvider');
  }
  return context;
};

