import { Theme, ThemePreset, SeasonalTheme, ThemeColors } from '../types';

const presetThemes: Record<ThemePreset, Theme> = {
  classic: {
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
      border: '#e7e5e4'
    }
  },
  dark: {
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
      border: '#292524'
    }
  },
  sepia: {
    id: 'sepia',
    name: 'Sepia',
    colors: {
      primary: '#92400e',
      secondary: '#451a03',
      accent: '#a16207',
      background: '#fef3c7',
      surface: '#fef7ed',
      text: '#451a03',
      textSecondary: '#78716c',
      border: '#fed7aa'
    }
  },
  modern: {
    id: 'modern',
    name: 'Modern',
    colors: {
      primary: '#3b82f6',
      secondary: '#1d4ed8',
      accent: '#60a5fa',
      background: '#f8fafc',
      surface: '#ffffff',
      text: '#0f172a',
      textSecondary: '#64748b',
      border: '#e2e8f0'
    }
  }
};

const seasonalThemes: Record<SeasonalTheme, Theme> = {
  spring: {
    id: 'spring',
    name: 'Spring',
    colors: {
      primary: '#10b981',
      secondary: '#059669',
      accent: '#34d399',
      background: '#f0fdf4',
      surface: '#ffffff',
      text: '#064e3b',
      textSecondary: '#6b7280',
      border: '#bbf7d0'
    }
  },
  summer: {
    id: 'summer',
    name: 'Summer',
    colors: {
      primary: '#f59e0b',
      secondary: '#d97706',
      accent: '#fbbf24',
      background: '#fffbeb',
      surface: '#ffffff',
      text: '#92400e',
      textSecondary: '#78716c',
      border: '#fed7aa'
    }
  },
  autumn: {
    id: 'autumn',
    name: 'Autumn',
    colors: {
      primary: '#dc2626',
      secondary: '#b91c1c',
      accent: '#ef4444',
      background: '#fef2f2',
      surface: '#ffffff',
      text: '#7f1d1d',
      textSecondary: '#78716c',
      border: '#fecaca'
    }
  },
  winter: {
    id: 'winter',
    name: 'Winter',
    colors: {
      primary: '#1e40af',
      secondary: '#1e3a8a',
      accent: '#3b82f6',
      background: '#f1f5f9',
      surface: '#ffffff',
      text: '#1e293b',
      textSecondary: '#64748b',
      border: '#cbd5e1'
    }
  }
};

export class ThemeManager {
  private currentTheme: Theme = presetThemes.classic;
  private listeners: ((theme: Theme) => void)[] = [];

  constructor() {
    this.loadSavedTheme();
  }

  getCurrentTheme(): Theme {
    return this.currentTheme;
  }

  setTheme(theme: Theme): void {
    this.currentTheme = theme;
    this.applyTheme(theme);
    this.saveTheme(theme);
    this.notifyListeners();
  }

  setPresetTheme(preset: ThemePreset): void {
    this.setTheme(presetThemes[preset]);
  }

  createCustomTheme(name: string, colors: ThemeColors): Theme {
    return {
      id: `custom-${Date.now()}`,
      name,
      colors
    };
  }

  getSeasonalTheme(): Theme {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return seasonalThemes.spring;
    if (month >= 5 && month <= 7) return seasonalThemes.summer;
    if (month >= 8 && month <= 10) return seasonalThemes.autumn;
    return seasonalThemes.winter;
  }

  getPresetThemes(): Theme[] {
    return Object.values(presetThemes);
  }

  subscribe(listener: (theme: Theme) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private applyTheme(theme: Theme): void {
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
  }

  private saveTheme(theme: Theme): void {
    localStorage.setItem('bible-reader-theme', JSON.stringify(theme));
  }

  private loadSavedTheme(): void {
    try {
      const saved = localStorage.getItem('bible-reader-theme');
      if (saved) {
        const theme = JSON.parse(saved);
        this.currentTheme = theme;
        this.applyTheme(theme);
      }
    } catch (error) {
      console.warn('Failed to load saved theme:', error);
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentTheme));
  }
}

export const themeManager = new ThemeManager();
export { presetThemes, seasonalThemes };