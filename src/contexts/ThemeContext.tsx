import React, { createContext, useContext, useState, useEffect } from 'react';

interface Theme {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    textSecondary: string;
    border: string;
  };
  gradients: {
    background: string;
    card: string;
    button: string;
  };
}

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeId: string) => void;
  themes: Theme[];
}

const themes: Theme[] = [
  {
    id: 'cosmic',
    name: 'Cosmic Explorer',
    description: 'Deep space blues and cosmic grays',
    colors: {
      primary: 'slate-400',
      secondary: 'gray-400',
      accent: 'cyan-400',
      text: 'white',
      textSecondary: 'gray-300',
      border: 'gray-500/30',
    },
    gradients: {
      background: 'bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900',
      card: 'bg-black bg-opacity-50 backdrop-blur-sm',
      button: 'bg-gradient-to-r from-slate-500 to-gray-600',
    },
  },
  {
    id: 'nebula',
    name: 'Nebula Dreams',
    description: 'Purple and pink cosmic clouds',
    colors: {
      primary: 'purple-400',
      secondary: 'pink-400',
      accent: 'violet-400',
      text: 'white',
      textSecondary: 'purple-200',
      border: 'purple-500/30',
    },
    gradients: {
      background: 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900',
      card: 'bg-black bg-opacity-40 backdrop-blur-sm',
      button: 'bg-gradient-to-r from-purple-500 to-pink-600',
    },
  },
  {
    id: 'solar',
    name: 'Solar Flare',
    description: 'Warm oranges and golden yellows',
    colors: {
      primary: 'orange-400',
      secondary: 'yellow-400',
      accent: 'amber-400',
      text: 'white',
      textSecondary: 'orange-200',
      border: 'orange-500/30',
    },
    gradients: {
      background: 'bg-gradient-to-br from-orange-900 via-red-900 to-yellow-900',
      card: 'bg-black bg-opacity-40 backdrop-blur-sm',
      button: 'bg-gradient-to-r from-orange-500 to-yellow-600',
    },
  },
  {
    id: 'aurora',
    name: 'Aurora Borealis',
    description: 'Cool greens and electric blues',
    colors: {
      primary: 'emerald-400',
      secondary: 'teal-400',
      accent: 'green-400',
      text: 'white',
      textSecondary: 'emerald-200',
      border: 'emerald-500/30',
    },
    gradients: {
      background: 'bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900',
      card: 'bg-black bg-opacity-40 backdrop-blur-sm',
      button: 'bg-gradient-to-r from-emerald-500 to-teal-600',
    },
  },
];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);

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