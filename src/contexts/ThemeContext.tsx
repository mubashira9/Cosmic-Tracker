import React, { createContext, useContext, useEffect, useState } from 'react';

export interface Theme {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  gradients: {
    main: string;
    button: string;
    card: string;
  };
}

export const themes: Theme[] = [
  {
    id: 'cosmic',
    name: '🌌 Cosmic (Default)',
    description: 'Deep space vibes with purple and cyan',
    colors: {
      primary: 'cyan-400',
      secondary: 'purple-400',
      accent: 'pink-400',
      background: 'from-purple-900 via-blue-900 to-indigo-900',
      surface: 'black bg-opacity-40',
      text: 'white',
      textSecondary: 'gray-300',
      border: 'purple-500/30',
      success: 'green-400',
      warning: 'orange-400',
      error: 'red-400',
    },
    gradients: {
      main: 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900',
      button: 'bg-gradient-to-r from-cyan-500 to-purple-600',
      card: 'bg-black bg-opacity-40 backdrop-blur-sm',
    },
  },
  {
    id: 'sunset',
    name: '🌅 Sunset Horizon',
    description: 'Warm oranges and pinks like a sunset',
    colors: {
      primary: 'orange-400',
      secondary: 'pink-400',
      accent: 'yellow-400',
      background: 'from-orange-900 via-red-900 to-pink-900',
      surface: 'black bg-opacity-40',
      text: 'white',
      textSecondary: 'orange-100',
      border: 'orange-500/30',
      success: 'green-400',
      warning: 'yellow-400',
      error: 'red-400',
    },
    gradients: {
      main: 'bg-gradient-to-br from-orange-900 via-red-900 to-pink-900',
      button: 'bg-gradient-to-r from-orange-500 to-pink-600',
      card: 'bg-black bg-opacity-40 backdrop-blur-sm',
    },
  },
  {
    id: 'forest',
    name: '🌲 Forest Night',
    description: 'Deep greens and earth tones',
    colors: {
      primary: 'emerald-400',
      secondary: 'green-400',
      accent: 'lime-400',
      background: 'from-green-900 via-emerald-900 to-teal-900',
      surface: 'black bg-opacity-40',
      text: 'white',
      textSecondary: 'green-100',
      border: 'green-500/30',
      success: 'emerald-400',
      warning: 'yellow-400',
      error: 'red-400',
    },
    gradients: {
      main: 'bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900',
      button: 'bg-gradient-to-r from-emerald-500 to-teal-600',
      card: 'bg-black bg-opacity-40 backdrop-blur-sm',
    },
  },
  {
    id: 'ocean',
    name: '🌊 Ocean Depths',
    description: 'Deep blues and teals like the ocean',
    colors: {
      primary: 'blue-400',
      secondary: 'teal-400',
      accent: 'cyan-400',
      background: 'from-blue-900 via-teal-900 to-cyan-900',
      surface: 'black bg-opacity-40',
      text: 'white',
      textSecondary: 'blue-100',
      border: 'blue-500/30',
      success: 'green-400',
      warning: 'yellow-400',
      error: 'red-400',
    },
    gradients: {
      main: 'bg-gradient-to-br from-blue-900 via-teal-900 to-cyan-900',
      button: 'bg-gradient-to-r from-blue-500 to-teal-600',
      card: 'bg-black bg-opacity-40 backdrop-blur-sm',
    },
  },
  {
    id: 'midnight',
    name: '🌙 Midnight',
    description: 'Dark grays and blues for night owls',
    colors: {
      primary: 'slate-400',
      secondary: 'gray-400',
      accent: 'blue-400',
      background: 'from-gray-900 via-slate-900 to-zinc-900',
      surface: 'black bg-opacity-50',
      text: 'white',
      textSecondary: 'gray-300',
      border: 'gray-500/30',
      success: 'green-400',
      warning: 'yellow-400',
      error: 'red-400',
    },
    gradients: {
      main: 'bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900',
      button: 'bg-gradient-to-r from-slate-500 to-gray-600',
      card: 'bg-black bg-opacity-50 backdrop-blur-sm',
    },
  },
  {
    id: 'aurora',
    name: '🌈 Aurora Borealis',
    description: 'Vibrant greens and purples like northern lights',
    colors: {
      primary: 'violet-400',
      secondary: 'emerald-400',
      accent: 'fuchsia-400',
      background: 'from-violet-900 via-purple-900 to-emerald-900',
      surface: 'black bg-opacity-40',
      text: 'white',
      textSecondary: 'violet-100',
      border: 'violet-500/30',
      success: 'emerald-400',
      warning: 'yellow-400',
      error: 'red-400',
    },
    gradients: {
      main: 'bg-gradient-to-br from-violet-900 via-purple-900 to-emerald-900',
      button: 'bg-gradient-to-r from-violet-500 to-emerald-600',
      card: 'bg-black bg-opacity-40 backdrop-blur-sm',
    },
  },
];

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeId: string) => void;
  themes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]); // Default to cosmic theme

  useEffect(() => {
    // Load saved theme from localStorage
    const savedThemeId = localStorage.getItem('cosmic-tracker-theme');
    if (savedThemeId) {
      const savedTheme = themes.find(theme => theme.id === savedThemeId);
      if (savedTheme) {
        setCurrentTheme(savedTheme);
      }
    }
  }, []);

  const setTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
      localStorage.setItem('cosmic-tracker-theme', themeId);
    }
  };

  const value = {
    currentTheme,
    setTheme,
    themes,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};