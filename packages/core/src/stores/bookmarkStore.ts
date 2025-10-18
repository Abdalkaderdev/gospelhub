import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Verse } from '../types';

interface BookmarkState {
  bookmarks: string[];
  bookmarkVerses: Verse[];
  isLoading: boolean;
  error: string | null;
}

interface BookmarkActions {
  addBookmark: (verse: Verse) => Promise<void>;
  removeBookmark: (verseReference: string) => Promise<void>;
  toggleBookmark: (verse: Verse) => Promise<void>;
  isBookmarked: (verseReference: string) => boolean;
  loadBookmarkVerses: () => Promise<void>;
  clearBookmarks: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  exportBookmarks: () => string;
  importBookmarks: (bookmarksJson: string) => Promise<void>;
}

type BookmarkStore = BookmarkState & BookmarkActions;

const initialState: BookmarkState = {
  bookmarks: [],
  bookmarkVerses: [],
  isLoading: false,
  error: null,
};

export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      addBookmark: async (verse: Verse) => {
        const { bookmarks } = get();
        if (!bookmarks.includes(verse.reference)) {
          const newBookmarks = [...bookmarks, verse.reference];
          set({ bookmarks: newBookmarks });
          
          // Load the actual verse data
          await get().loadBookmarkVerses();
        }
      },

      removeBookmark: async (verseReference: string) => {
        const { bookmarks } = get();
        const newBookmarks = bookmarks.filter(ref => ref !== verseReference);
        set({ bookmarks: newBookmarks });
        
        // Reload bookmark verses
        await get().loadBookmarkVerses();
      },

      toggleBookmark: async (verse: Verse) => {
        const { isBookmarked, addBookmark, removeBookmark } = get();
        
        if (isBookmarked(verse.reference)) {
          await removeBookmark(verse.reference);
        } else {
          await addBookmark(verse);
        }
      },

      isBookmarked: (verseReference: string) => {
        const { bookmarks } = get();
        return bookmarks.includes(verseReference);
      },

      loadBookmarkVerses: async () => {
        const { bookmarks } = get();
        set({ isLoading: true, error: null });

        try {
          const { BibleDataService } = await import('../bible-data-enhanced');
          const service = BibleDataService.getInstance();
          const allVerses = service.getAllVerses();
          
          const bookmarkVerses = bookmarks
            .map(ref => allVerses.find(verse => verse.reference === ref))
            .filter((verse): verse is Verse => verse !== undefined);
          
          set({ bookmarkVerses, isLoading: false });
        } catch (error) {
          set({ error: 'Failed to load bookmark verses', isLoading: false });
        }
      },

      clearBookmarks: () => {
        set({ bookmarks: [], bookmarkVerses: [] });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      exportBookmarks: () => {
        const { bookmarks, bookmarkVerses } = get();
        return JSON.stringify({
          bookmarks,
          bookmarkVerses,
          exportedAt: new Date().toISOString(),
        }, null, 2);
      },

      importBookmarks: async (bookmarksJson: string) => {
        try {
          const data = JSON.parse(bookmarksJson);
          if (data.bookmarks && Array.isArray(data.bookmarks)) {
            set({ bookmarks: data.bookmarks });
            await get().loadBookmarkVerses();
          } else {
            throw new Error('Invalid bookmarks format');
          }
        } catch (error) {
          set({ error: 'Failed to import bookmarks' });
        }
      },
    }),
    {
      name: 'bible-bookmarks-storage',
      partialize: (state) => ({
        bookmarks: state.bookmarks,
      }),
    }
  )
);