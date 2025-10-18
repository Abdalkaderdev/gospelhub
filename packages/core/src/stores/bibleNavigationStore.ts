import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BibleNavigationState {
  currentBook: string;
  currentChapter: number;
  isLoading: boolean;
  error: string | null;
}

interface BibleNavigationActions {
  setCurrentBook: (book: string) => void;
  setCurrentChapter: (chapter: number) => void;
  setCurrentLocation: (book: string, chapter: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  navigateToNext: () => Promise<void>;
  navigateToPrevious: () => Promise<void>;
  reset: () => void;
}

type BibleNavigationStore = BibleNavigationState & BibleNavigationActions;

const initialState: BibleNavigationState = {
  currentBook: 'Genesis',
  currentChapter: 1,
  isLoading: false,
  error: null,
};

export const useBibleNavigationStore = create<BibleNavigationStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setCurrentBook: (book: string) => {
        set({ currentBook: book, currentChapter: 1, error: null });
      },

      setCurrentChapter: (chapter: number) => {
        set({ currentChapter: chapter, error: null });
      },

      setCurrentLocation: (book: string, chapter: number) => {
        set({ currentBook: book, currentChapter: chapter, error: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      navigateToNext: async () => {
        const { currentBook, currentChapter } = get();
        set({ isLoading: true, error: null });

        try {
          const { BibleDataService } = await import('../bible-data-enhanced');
          const service = BibleDataService.getInstance();
          const nextLocation = service.getNextChapter(currentBook, currentChapter);
          
          if (nextLocation) {
            set({ 
              currentBook: nextLocation.book, 
              currentChapter: nextLocation.chapter,
              isLoading: false 
            });
          } else {
            set({ error: 'No next chapter available', isLoading: false });
          }
        } catch (error) {
          set({ error: 'Failed to navigate to next chapter', isLoading: false });
        }
      },

      navigateToPrevious: async () => {
        const { currentBook, currentChapter } = get();
        set({ isLoading: true, error: null });

        try {
          const { BibleDataService } = await import('../bible-data-enhanced');
          const service = BibleDataService.getInstance();
          const prevLocation = service.getPreviousChapter(currentBook, currentChapter);
          
          if (prevLocation) {
            set({ 
              currentBook: prevLocation.book, 
              currentChapter: prevLocation.chapter,
              isLoading: false 
            });
          } else {
            set({ error: 'No previous chapter available', isLoading: false });
          }
        } catch (error) {
          set({ error: 'Failed to navigate to previous chapter', isLoading: false });
        }
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'bible-navigation-storage',
      partialize: (state) => ({
        currentBook: state.currentBook,
        currentChapter: state.currentChapter,
      }),
    }
  )
);