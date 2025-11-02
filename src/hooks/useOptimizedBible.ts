import { useState, useEffect, useCallback } from 'react';
import { optimizedBibleService } from '../services/OptimizedBibleService';
import { ProcessedTranslation, TranslationMetadata, BibleVerse } from '../types/bible';

export const useOptimizedBible = () => {
  const [availableTranslations, setAvailableTranslations] = useState<TranslationMetadata[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeService = async () => {
      try {
        await optimizedBibleService.initialize();
        setAvailableTranslations(optimizedBibleService.getAvailableTranslations());
      } catch (err) {
        setError('Failed to initialize Bible service');
      }
    };

    initializeService();
  }, []);

  const loadTranslation = useCallback(async (translationId: string): Promise<ProcessedTranslation | null> => {
    setLoading(true);
    setError(null);

    try {
      const translation = await optimizedBibleService.loadTranslation(translationId);
      return translation;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load translation');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadChapter = useCallback(async (
    translationId: string, 
    bookName: string, 
    chapterNumber: number
  ): Promise<BibleVerse[] | null> => {
    setLoading(true);
    setError(null);

    try {
      const verses = await optimizedBibleService.loadChapter(translationId, bookName, chapterNumber);
      return verses;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load chapter');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearCache = useCallback(() => {
    optimizedBibleService.clearCache();
  }, []);

  const pruneCache = useCallback((maxSize?: number) => {
    optimizedBibleService.pruneCache(maxSize);
  }, []);

  return {
    availableTranslations,
    loading,
    error,
    loadTranslation,
    loadChapter,
    clearCache,
    pruneCache
  };
};