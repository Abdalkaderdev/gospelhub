import { useState, useEffect, useCallback } from 'react';

interface UserPreferences {
  fontSize: number;
  theme: string;
  translation: string;
  readingPlan: string | null;
  notifications: boolean;
  autoScroll: boolean;
  highlightColor: string;
}

const defaultPreferences: UserPreferences = {
  fontSize: 16,
  theme: 'classic',
  translation: 'kjv',
  readingPlan: null,
  notifications: true,
  autoScroll: false,
  highlightColor: '#fbbf24'
};

interface UseUserPreferencesReturn {
  preferences: UserPreferences;
  updatePreference: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void;
  resetPreferences: () => void;
  exportPreferences: () => string;
  importPreferences: (data: string) => boolean;
}

export const useUserPreferences = (): UseUserPreferencesReturn => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);

  useEffect(() => {
    const stored = localStorage.getItem('userPreferences');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setPreferences({ ...defaultPreferences, ...parsed });
      } catch (error) {
        console.error('Failed to parse user preferences:', error);
      }
    }
  }, []);

  const savePreferences = useCallback((newPreferences: UserPreferences) => {
    localStorage.setItem('userPreferences', JSON.stringify(newPreferences));
  }, []);

  const updatePreference = useCallback(<K extends keyof UserPreferences>(
    key: K, 
    value: UserPreferences[K]
  ) => {
    setPreferences(prev => {
      const updated = { ...prev, [key]: value };
      savePreferences(updated);
      return updated;
    });
  }, [savePreferences]);

  const resetPreferences = useCallback(() => {
    setPreferences(defaultPreferences);
    savePreferences(defaultPreferences);
  }, [savePreferences]);

  const exportPreferences = useCallback(() => {
    return JSON.stringify(preferences, null, 2);
  }, [preferences]);

  const importPreferences = useCallback((data: string): boolean => {
    try {
      const parsed = JSON.parse(data);
      const merged = { ...defaultPreferences, ...parsed };
      setPreferences(merged);
      savePreferences(merged);
      return true;
    } catch (error) {
      console.error('Failed to import preferences:', error);
      return false;
    }
  }, [savePreferences]);

  return {
    preferences,
    updatePreference,
    resetPreferences,
    exportPreferences,
    importPreferences
  };
};