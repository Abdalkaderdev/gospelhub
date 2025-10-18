import { useEffect } from 'react';
import { Verse } from '../types';
import { useBookmarkStore } from '../stores/bookmarkStore';

export const useBookmarks = () => {
  const bookmarkStore = useBookmarkStore();

  // Load bookmark verses on mount
  useEffect(() => {
    bookmarkStore.loadBookmarkVerses();
  }, [bookmarkStore]);

  // Toggle bookmark for a verse
  const toggleBookmark = async (verse: Verse) => {
    await bookmarkStore.toggleBookmark(verse);
  };

  // Add bookmark for a verse
  const addBookmark = async (verse: Verse) => {
    await bookmarkStore.addBookmark(verse);
  };

  // Remove bookmark for a verse
  const removeBookmark = async (verseReference: string) => {
    await bookmarkStore.removeBookmark(verseReference);
  };

  // Check if a verse is bookmarked
  const isBookmarked = (verseReference: string) => {
    return bookmarkStore.isBookmarked(verseReference);
  };

  // Get bookmark count
  const getBookmarkCount = () => {
    return bookmarkStore.bookmarks.length;
  };

  // Get bookmarks by book
  const getBookmarksByBook = (book: string) => {
    return bookmarkStore.bookmarkVerses.filter(verse => verse.book === book);
  };

  // Get bookmarks by chapter
  const getBookmarksByChapter = (book: string, chapter: number) => {
    return bookmarkStore.bookmarkVerses.filter(
      verse => verse.book === book && verse.chapter === chapter
    );
  };

  // Export bookmarks
  const exportBookmarks = () => {
    return bookmarkStore.exportBookmarks();
  };

  // Import bookmarks
  const importBookmarks = async (bookmarksJson: string) => {
    await bookmarkStore.importBookmarks(bookmarksJson);
  };

  // Clear all bookmarks
  const clearAllBookmarks = () => {
    bookmarkStore.clearBookmarks();
  };

  // Get bookmark statistics
  const getBookmarkStats = () => {
    const { bookmarkVerses } = bookmarkStore;
    const books = new Set(bookmarkVerses.map(v => v.book));
    const chapters = new Set(bookmarkVerses.map(v => `${v.book} ${v.chapter}`));
    
    return {
      totalBookmarks: bookmarkVerses.length,
      totalBooks: books.size,
      totalChapters: chapters.size,
      books: Array.from(books).sort(),
    };
  };

  return {
    // State
    bookmarks: bookmarkStore.bookmarks,
    bookmarkVerses: bookmarkStore.bookmarkVerses,
    isLoading: bookmarkStore.isLoading,
    error: bookmarkStore.error,
    
    // Computed values
    bookmarkCount: getBookmarkCount(),
    stats: getBookmarkStats(),
    
    // Actions
    toggleBookmark,
    addBookmark,
    removeBookmark,
    isBookmarked,
    getBookmarksByBook,
    getBookmarksByChapter,
    exportBookmarks,
    importBookmarks,
    clearAllBookmarks,
    refreshBookmarks: bookmarkStore.loadBookmarkVerses,
  };
};