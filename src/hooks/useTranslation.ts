import { useState, useEffect } from 'react';

interface TranslationData {
  id: string;
  name: string;
  direction: 'ltr' | 'rtl';
  data: any;
}

export const useTranslation = (initialTranslationId: string = 'eng-kjv') => {
  const [currentTranslation, setCurrentTranslation] = useState<TranslationData>({
    id: initialTranslationId,
    name: 'King James Version',
    direction: 'ltr',
    data: null
  });
  const [loading, setLoading] = useState(false);

  const loadTranslation = async (translationId: string, translationData?: any) => {
    if (translationData) {
      const translationInfo = getTranslationInfo(translationId);
      setCurrentTranslation({
        id: translationId,
        name: translationInfo.name,
        direction: translationInfo.direction,
        data: translationData
      });
      
      // Apply RTL styling to document
      document.documentElement.dir = translationInfo.direction;
      document.documentElement.lang = translationInfo.direction === 'rtl' ? 'ar' : 'en';
      
      return;
    }

    setLoading(true);
    try {
      const translationInfo = getTranslationInfo(translationId);
      const response = await fetch(`/src/data/processed/${translationInfo.file}`);
      const data = await response.json();
      
      setCurrentTranslation({
        id: translationId,
        name: translationInfo.name,
        direction: translationInfo.direction,
        data
      });
      
      // Apply RTL styling to document
      document.documentElement.dir = translationInfo.direction;
      document.documentElement.lang = translationInfo.direction === 'rtl' ? 'ar' : 'en';
      
    } catch (error) {
      console.error('Failed to load translation:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTranslationInfo = (translationId: string) => {
    const translations = {
      'eng-kjv': { name: 'King James Version', direction: 'ltr' as const, file: 'eng-kjv.json' },
      'eng-esv': { name: 'English Standard Version', direction: 'ltr' as const, file: 'eng-esv.json' },
      'eng-niv': { name: 'New International Version', direction: 'ltr' as const, file: 'eng-niv.json' },
      'spa-rv60': { name: 'Reina-Valera 1960', direction: 'ltr' as const, file: 'spa-rv60.json' },
      'spa-nvi': { name: 'Nueva Versión Internacional', direction: 'ltr' as const, file: 'spa-nvi.json' },
      'ara-svd': { name: 'Smith & Van Dyke', direction: 'rtl' as const, file: 'ara-svd.json' },
      'ara-vd': { name: 'Van Dyke', direction: 'rtl' as const, file: 'ara-vd.json' }
    };
    
    return translations[translationId as keyof typeof translations] || translations['eng-kjv'];
  };

  useEffect(() => {
    const savedTranslation = localStorage.getItem('selectedTranslation');
    if (savedTranslation && savedTranslation !== initialTranslationId) {
      loadTranslation(savedTranslation);
    }
  }, []);

  return {
    currentTranslation,
    loading,
    loadTranslation
  };
};