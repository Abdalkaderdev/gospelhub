import { useBibleNavigationStore } from '../stores/bibleNavigationStore';
import { useBible } from './useBible';

export const useBibleNavigation = () => {
  const navigationStore = useBibleNavigationStore();
  const { bookMetadata } = useBible();

  const canGoNext = () => {
    if (!bookMetadata) return false;
    const { currentBook, currentChapter } = navigationStore;
    return currentChapter < bookMetadata.totalChapters;
  };

  const canGoPrevious = () => {
    const { currentChapter } = navigationStore;
    return currentChapter > 1;
  };

  const goToNextChapter = async () => {
    if (canGoNext()) {
      await navigationStore.navigateToNext();
    }
  };

  const goToPreviousChapter = async () => {
    if (canGoPrevious()) {
      await navigationStore.navigateToPrevious();
    }
  };

  const goToChapter = (book: string, chapter: number) => {
    navigationStore.setCurrentLocation(book, chapter);
  };

  const goToBook = (book: string) => {
    navigationStore.setCurrentBook(book);
  };

  const getCurrentLocation = () => {
    const { currentBook, currentChapter } = navigationStore;
    return { book: currentBook, chapter: currentChapter };
  };

  const getLocationDisplay = () => {
    const { currentBook, currentChapter } = navigationStore;
    return `${currentBook} ${currentChapter}`;
  };

  const getProgress = () => {
    if (!bookMetadata) return 0;
    const { currentChapter } = navigationStore;
    return (currentChapter / bookMetadata.totalChapters) * 100;
  };

  return {
    // State
    ...navigationStore,
    
    // Computed values
    canGoNext: canGoNext(),
    canGoPrevious: canGoPrevious(),
    progress: getProgress(),
    locationDisplay: getLocationDisplay(),
    
    // Actions
    goToNextChapter,
    goToPreviousChapter,
    goToChapter,
    goToBook,
    getCurrentLocation,
  };
};