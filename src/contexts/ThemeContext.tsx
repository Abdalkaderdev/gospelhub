import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface Theme {
  id: string;
  name: string;
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
  seasonal?: boolean;
  accessibility?: boolean;
}

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeId: string) => void;
  availableThemes: Theme[];
  isSeasonalEnabled: boolean;
  setSeasonalEnabled: (enabled: boolean) => void;
  isHighContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themes: Theme[] = [
  {
    id: 'classic',
    name: 'Classic',
    colors: {
      primary: '#d97706',
      secondary: '#92400e',
      accent: '#f59e0b',
      background: '#fafaf9',
      surface: '#ffffff',
      text: '#1c1917',
      textSecondary: '#78716c',
      border: '#e7e5e4',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444'
    }
  },
  {
    id: 'dark',
    name: 'Dark',
    colors: {
      primary: '#f59e0b',
      secondary: '#d97706',
      accent: '#fbbf24',
      background: '#0c0a09',
      surface: '#1c1917',
      text: '#fafaf9',
      textSecondary: '#a8a29e',
      border: '#44403c',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444'
    }
  },
  {
    id: 'sepia',
    name: 'Sepia',
    colors: {
      primary: '#92400e',
      secondary: '#78350f',
      accent: '#a16207',
      background: '#fef7ed',
      surface: '#fefcf9',
      text: '#451a03',
      textSecondary: '#78350f',
      border: '#fed7aa',
      success: '#166534',
      warning: '#a16207',
      error: '#dc2626'
    }
  },
  {
    id: 'spring',
    name: 'Spring',
    seasonal: true,
    colors: {
      primary: '#10b981',
      secondary: '#059669',
      accent: '#34d399',
      background: '#f0fdf4',
      surface: '#ffffff',
      text: '#064e3b',
      textSecondary: '#047857',
      border: '#bbf7d0',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444'
    }
  },
  {
    id: 'summer',
    name: 'Summer',
    seasonal: true,
    colors: {
      primary: '#0ea5e9',
      secondary: '#0284c7',
      accent: '#38bdf8',
      background: '#f0f9ff',
      surface: '#ffffff',
      text: '#0c4a6e',
      textSecondary: '#0369a1',
      border: '#bae6fd',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444'
    }
  },
  {
    id: 'autumn',
    name: 'Autumn',
    seasonal: true,
    colors: {
      primary: '#ea580c',
      secondary: '#c2410c',
      accent: '#fb923c',
      background: '#fff7ed',
      surface: '#ffffff',
      text: '#7c2d12',
      textSecondary: '#9a3412',
      border: '#fed7aa',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444'
    }
  },
  {
    id: 'winter',
    name: 'Winter',
    seasonal: true,
    colors: {
      primary: '#6366f1',
      secondary: '#4f46e5',
      accent: '#818cf8',
      background: '#f8fafc',
      surface: '#ffffff',
      text: '#1e1b4b',
      textSecondary: '#3730a3',
      border: '#c7d2fe',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444'
    }
  },
  {
    id: 'high-contrast',
    name: 'High Contrast',
    accessibility: true,
    colors: {
      primary: '#000000',
      secondary: '#333333',
      accent: '#0066cc',
      background: '#ffffff',
      surface: '#ffffff',
      text: '#000000',
      textSecondary: '#333333',
      border: '#000000',
      success: '#006600',
      warning: '#cc6600',
      error: '#cc0000'
    }
  }
];

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);
  const [isSeasonalEnabled, setSeasonalEnabled] = useState(false);
  const [isHighContrast, setHighContrast] = useState(false);

  useEffect(() => {
    const savedThemeId = localStorage.getItem('selectedTheme');
    const savedSeasonal = localStorage.getItem('seasonalThemes') === 'true';
    const savedHighContrast = localStorage.getItem('highContrast') === 'true';

    setSeasonalEnabled(savedSeasonal);
    setHighContrast(savedHighContrast);

    if (savedHighContrast) {
      const highContrastTheme = themes.find(t => t.accessibility);
      if (highContrastTheme) {
        setCurrentTheme(highContrastTheme);
        applyTheme(highContrastTheme);
        return;
      }
    }

    if (savedSeasonal) {
      const seasonalTheme = getSeasonalTheme();
      if (seasonalTheme) {
        setCurrentTheme(seasonalTheme);
        applyTheme(seasonalTheme);
        return;
      }
    }

    if (savedThemeId) {
      const theme = themes.find(t => t.id === savedThemeId);
      if (theme) {
        setCurrentTheme(theme);
        applyTheme(theme);
      }
    }
  }, []);

  useEffect(() => {
    if (isSeasonalEnabled && !isHighContrast) {
      const seasonalTheme = getSeasonalTheme();
      if (seasonalTheme && seasonalTheme.id !== currentTheme.id) {
        setCurrentTheme(seasonalTheme);
        applyTheme(seasonalTheme);
      }
    }
  }, [isSeasonalEnabled, isHighContrast, currentTheme.id]);

  const getSeasonalTheme = (): Theme | null => {
    const month = new Date().getMonth();
    let seasonId = '';

    if (month >= 2 && month <= 4) seasonId = 'spring';
    else if (month >= 5 && month <= 7) seasonId = 'summer';
    else if (month >= 8 && month <= 10) seasonId = 'autumn';
    else seasonId = 'winter';

    return themes.find(t => t.id === seasonId) || null;
  };

  const applyTheme = (theme: Theme) => {
    const root = document.documentElement;
    
    Object.entries(theme.colors).forEach(([key, value]) => {
      // Sanitize CSS values to prevent XSS
      const sanitizedValue = value.replace(/[^#a-fA-F0-9\s]/g, '');
      if (sanitizedValue && /^#[0-9a-fA-F]{6}$/.test(sanitizedValue)) {
        root.style.setProperty(`--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, sanitizedValue);
      }
    });

    // Sanitize theme ID
    const sanitizedThemeId = theme.id.replace(/[^a-zA-Z0-9_-]/g, '');
    root.setAttribute('data-theme', sanitizedThemeId);
  };

  const setTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (!theme) return;

    setCurrentTheme(theme);
    applyTheme(theme);
    localStorage.setItem('selectedTheme', themeId);

    if (theme.accessibility) {
      setHighContrast(true);
      localStorage.setItem('highContrast', 'true');
    }
  };

  const handleSeasonalEnabled = (enabled: boolean) => {
    setSeasonalEnabled(enabled);
    localStorage.setItem('seasonalThemes', enabled.toString());

    if (enabled && !isHighContrast) {
      const seasonalTheme = getSeasonalTheme();
      if (seasonalTheme) {
        setCurrentTheme(seasonalTheme);
        applyTheme(seasonalTheme);
      }
    }
  };

  const handleHighContrast = (enabled: boolean) => {
    setHighContrast(enabled);
    localStorage.setItem('highContrast', enabled.toString());

    if (enabled) {
      const highContrastTheme = themes.find(t => t.accessibility);
      if (highContrastTheme) {
        setCurrentTheme(highContrastTheme);
        applyTheme(highContrastTheme);
      }
    } else if (isSeasonalEnabled) {
      const seasonalTheme = getSeasonalTheme();
      if (seasonalTheme) {
        setCurrentTheme(seasonalTheme);
        applyTheme(seasonalTheme);
      }
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setTheme,
        availableThemes: themes,
        isSeasonalEnabled,
        setSeasonalEnabled: handleSeasonalEnabled,
        isHighContrast,
        setHighContrast: handleHighContrast
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};