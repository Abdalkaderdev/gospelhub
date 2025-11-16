import { Fragment, useEffect, useMemo, useState, useRef, useCallback, Suspense } from "react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import { bibleTranslations, getTranslationById, defaultTranslationId, getAllTranslations } from "./data";
import { BibleReference, AppState, NavigationDirection } from "./types";
import { isSingleVerse } from "./utils/guards";
import { navigateChapter } from "./utils/navigation";
import { SearchService } from "./search";
import { security, csrfToken } from "./utils/security";
import { TranslationSelector } from "./components/TranslationSelector";

import { 
  LazyAnalyticsDashboard,
  LazyParallelView,
  LazyWordStudy,
  LazyCommentary,
  LazyCrossReferences,
  LazyBookIntroduction,
  LazyVerseHighlighter,
  LazyTranslationSwitcher,
  LazyBibleSearch,
  LazyBookmarkSystem,
  LazyReadingPlans,
  LazyStudyTools,
  LazyParallelBibleView
} from "./components/lazy/LazyComponents";
import { LazyWrapper } from "./components/lazy/LazyWrapper";
import { PageTransition } from "./components/PageTransition";
import { FloatingActionButton } from "./components/FloatingActionButton";
import { VerseList } from "./components/VerseList";
import { SwipeNavigation } from "./components/SwipeNavigation";
import { PullToRefresh } from "./components/PullToRefresh";
import { CrossLoader } from "./components/CrossLoader";
import { CrossAssembly } from "./components/CrossAssembly";
import { ReadingProgressBar } from "./components/ReadingProgressBar";
import { useReadingProgress } from "./hooks/useReadingProgress";
import { AdvancedSearch } from "./components/AdvancedSearch";
import { LazyReadingPlanView, LazyThemeSwitcher, LazyOfflineManager } from "./components/lazy/LazyComponents";
import { useTheme } from "./contexts/ThemeContext";
import { InstallPrompt } from "./components/InstallPrompt";
import { VirtualizedVerseList } from "./components/optimized/VirtualizedVerseList";
import { HighlightsPanel } from "./components/VerseHighlighter";
import { useTranslation } from "./hooks/useTranslation";
import { EnhancedVerseText } from "./components/EnhancedVerseText";
import { isOldTestament } from "./utils/bibleBooks";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { performanceMonitor, registerServiceWorker } from "./utils/performance";
import { errorReporter, setupGlobalErrorHandling } from "./utils/errorReporting";
import { preloadCriticalComponents } from "./utils/lazyLoading";
import { BookmarkButton, BookmarksPanel } from "./components/BookmarkSystem";
import { SwipeGestureHandler } from "./components/SwipeGestureHandler";
import { ChapterTransition } from "./components/ChapterTransition";
import { AdvancedStudyPanel } from "./components/AdvancedStudyPanel";
import { usePWA } from "./hooks/usePWA";
import { offlineSyncManager } from "./utils/offlineSync";
import { triggerHaptic, isMobileDevice } from "./utils/haptics";
import { analyticsManager } from "./analytics";
import { performanceManager } from "./performance";
import { updateMetaTags, generateVerseShareData, generateStructuredData } from "./utils/seo";
import { announceToScreenReader, KEYBOARD_KEYS } from "./utils/accessibility";
import { crossReferences, characters, themes } from "./data/crossReferences";
import { BibleTranslation } from "./types";

const loadTranslationFromJSON = async (translationId: string): Promise<BibleTranslation | null> => {
  try {
    const translationModule = await import(`./data/${translationId}.ts`);
    return translationModule.default;
  } catch (error) {
    console.error(`Error loading translation ${translationId}:`, error);
    return null;
  }
};

const App = () => {
  const [selectedTranslationId, setSelectedTranslationId] = useState(defaultTranslationId);
  const [appState, setAppState] = useState<AppState>({
    currentBook: "",
    currentChapter: 1,
    currentVerse: "all",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [showThemeBuilder, setShowThemeBuilder] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showStudyTools, setShowStudyTools] = useState(false);
  const [showBookIntro, setShowBookIntro] = useState(false);
  const [showReadingPlan, setShowReadingPlan] = useState(false);
  const [showOfflineManager, setShowOfflineManager] = useState(false);
  const [showTranslationSelector, setShowTranslationSelector] = useState(false);
  const [showHighlights, setShowHighlights] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | 'none'>('none');
  const [showReadingPlans, setShowReadingPlans] = useState(false);
  const [showStudyToolsModal, setShowStudyToolsModal] = useState(false);
  const [showParallelView, setShowParallelView] = useState(false);
  const [parallelTranslations, setParallelTranslations] = useState<any[]>([]);
  const [loadedTranslations, setLoadedTranslations] = useState<Record<string, any>>({});
  const { currentTranslation, loading: translationLoading, loadTranslation } = useTranslation(selectedTranslationId);

  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [parallelConfig, setParallelConfig] = useState({ translations: [selectedTranslationId], syncScroll: true, highlightDifferences: false });
  const [keyboardNavigation, setKeyboardNavigation] = useState(false);
  const [showThemeSwitcher, setShowThemeSwitcher] = useState(false);
  const { currentTheme } = useTheme();
  const { isOnline } = usePWA();

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [loadedTranslation, setLoadedTranslation] = useState<BibleTranslation | null>(null);
  
  const selectedTranslation = useMemo(
    () => loadedTranslation || getTranslationById(selectedTranslationId) || bibleTranslations[0],
    [selectedTranslationId, loadedTranslation]
  );
  
  // Load JSON translation when ID changes
  useEffect(() => {
    const loadSelectedTranslation = async () => {
      const tsTranslation = getTranslationById(selectedTranslationId);
      if (tsTranslation) {
        setLoadedTranslation(tsTranslation);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      const jsonTranslation = await loadTranslationFromJSON(selectedTranslationId);
      if (jsonTranslation) {
        setLoadedTranslation(jsonTranslation);
      }
      setIsLoading(false);
    };
    
    loadSelectedTranslation();
  }, [selectedTranslationId]);

  const searchService = useMemo(() => new SearchService(selectedTranslationId), [selectedTranslationId]);

  const bookKeys = useMemo(() => Object.keys(selectedTranslation.data), [selectedTranslation]);
  const firstBook = bookKeys[0] ?? "";

  useEffect(() => {
    if (!appState.currentBook && firstBook) {
      console.log('Setting initial book:', firstBook);
      setAppState(prev => ({ ...prev, currentBook: firstBook }));
    }
  }, [selectedTranslation, firstBook, appState.currentBook]);

  useEffect(() => {
    registerServiceWorker();
    setupGlobalErrorHandling();
    preloadCriticalComponents();
    
    // Initialize CSRF token
    if (!csrfToken.get()) {
      const token = csrfToken.generate();
      csrfToken.store(token);
    }
  }, []);
  
  useEffect(() => {
    if (appState.currentBook && appState.currentChapter) {
      analyticsManager.startSession(appState.currentBook, appState.currentChapter, selectedTranslationId);
      performanceManager.preloadNextChapters(appState.currentBook, appState.currentChapter, selectedTranslationId);
      
      // Cache chapter for offline reading
      const chapterData = selectedTranslation.data[appState.currentBook]?.verses[appState.currentChapter];
      if (chapterData) {
        offlineSyncManager.cacheChapter(appState.currentBook, appState.currentChapter, chapterData);
      }
      
      // Update SEO meta tags
      const title = `${appState.currentBook} ${appState.currentChapter} - Gospel Hub`;
      const description = `Read ${appState.currentBook} chapter ${appState.currentChapter} in the ${selectedTranslation.name} translation`;
      const url = `https://gospelhub.space/${encodeURIComponent(appState.currentBook)}/${appState.currentChapter}`;
      updateMetaTags(title, description, url);
    }
    return () => analyticsManager.endSession();
  }, [appState.currentBook, appState.currentChapter, selectedTranslationId, selectedTranslation.name]);

  // Keyboard navigation detection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === KEYBOARD_KEYS.TAB) {
        setKeyboardNavigation(true);
        document.body.classList.add('keyboard-nav');
      }
    };

    const handleMouseDown = () => {
      setKeyboardNavigation(false);
      document.body.classList.remove('keyboard-nav');
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  const chapterOptions = useMemo(() => {
    if (!appState.currentBook || !selectedTranslation.data[appState.currentBook]) {
      return [] as number[];
    }
    return selectedTranslation.data[appState.currentBook].chapters ?? [];
  }, [appState.currentBook, selectedTranslation]);

  const currentVerses = useMemo(() => {
    if (!appState.currentBook || !selectedTranslation.data[appState.currentBook]) {
      return [];
    }
    const bookData = selectedTranslation.data[appState.currentBook];
    return bookData.verses[appState.currentChapter] ?? [];
  }, [appState, selectedTranslation]);

  const handleSearch = useCallback(async (query: string) => {
    // Sanitize search query to prevent XSS
    const sanitizedQuery = security.sanitizeSearchQuery(query);
    errorReporter.trackInteraction('search', { query: sanitizedQuery.substring(0, 50) });
    
    if (!sanitizedQuery.trim()) {
      setSearchResults([]);
      return;
    }
    setIsLoading(true);
    try {
      const result = await searchService.searchBible(sanitizedQuery);
      setSearchResults(result.results);
    } catch (error) {
      errorReporter.logError(error as Error, 'Search operation failed');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchService]);

  const handleNavigate = useCallback((direction: "prev" | "next", fromSwipe = false) => {
    errorReporter.trackInteraction('navigate', { direction, fromSwipe });
    const availableBooks = Object.keys(selectedTranslation.data);
    const navDirection = direction === "next" ? NavigationDirection.Next : NavigationDirection.Previous;
    const newState = navigateChapter(appState, navDirection, availableBooks);
    
    // Set swipe direction for animation
    if (fromSwipe) {
      setSwipeDirection(direction === 'next' ? 'left' : 'right');
    } else {
      setSwipeDirection('none');
    }
    
    // Trigger haptic feedback on mobile
    if (isMobileDevice()) {
      triggerHaptic('light');
    }
    
    setAppState(newState);
    announceToScreenReader(`Navigated to ${newState.currentBook} chapter ${newState.currentChapter}`);
    
    // Reset swipe direction after animation
    setTimeout(() => setSwipeDirection('none'), 500);
  }, [selectedTranslation.data, appState]);

  const handleRefresh = useCallback(async () => {
    errorReporter.trackInteraction('refresh');
    setIsLoading(true);
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Refresh current chapter data
    if (appState.currentBook && appState.currentChapter) {
      performanceManager.preloadNextChapters(appState.currentBook, appState.currentChapter, selectedTranslationId);
    }
    
    setIsLoading(false);
    announceToScreenReader('Content refreshed');
  }, [appState.currentBook, appState.currentChapter, selectedTranslationId]);

  const displayVerses = searchTerm.trim() ? searchResults : currentVerses;
  
  // Get combined text for progress tracking
  const combinedText = useMemo(() => {
    return displayVerses.map(item => {
      if ("verse" in item) {
        return item.text;
      } else {
        return item.verse?.text || '';
      }
    }).join(' ');
  }, [displayVerses]);
  
  const progressData = useReadingProgress(scrollContainerRef, combinedText);

  return (
    <ErrorBoundary>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <main 
        id="main-content"
        className="min-h-screen theme-transition theme-background" 
        style={{
          background: `linear-gradient(135deg, ${currentTheme.colors.background} 0%, ${currentTheme.colors.surface} 100%)`
        }}
        role="main"
        aria-label="Gospel Hub application"
      >
        {displayVerses.length > 0 && !searchTerm.trim() && (
          <ReadingProgressBar 
            totalVerses={currentVerses.length}
            currentChapter={`${appState.currentBook} ${appState.currentChapter}`}
          />
        )}
        
        <div className="px-4 sm:px-6 py-8 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <motion.header
          className="mb-8 sm:mb-16 text-left"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-2 text-xs sm:text-sm font-medium tracking-[0.3em] uppercase text-stone-500">
            {selectedTranslation.name}
          </p>
          <h1 className="mb-4 sm:mb-6 text-4xl sm:text-6xl lg:text-7xl font-light leading-tight tracking-tight" style={{ color: currentTheme.colors.text }}>
            <span className="font-semibold" style={{ color: currentTheme.colors.primary }}>Gospel</span> Hub
          </h1>
          <div className="flex flex-wrap gap-3">

            <button
              onClick={() => setShowThemeSwitcher(true)}
              className="px-4 py-2 rounded-lg border hover:opacity-90 transition-opacity text-sm theme-transition"
              style={{ 
                borderColor: currentTheme.colors.border,
                backgroundColor: currentTheme.colors.surface,
                color: currentTheme.colors.text
              }}
            >
              🎨 Themes
            </button>
            <button
              onClick={() => setShowAnalytics(true)}
              className="px-4 py-2 rounded-lg border hover:opacity-90 transition-opacity text-sm"
              style={{ 
                borderColor: currentTheme.colors.border,
                backgroundColor: currentTheme.colors.surface,
                color: currentTheme.colors.text
              }}
            >
              📊 Analytics
            </button>
            <button
              onClick={() => setShowStudyTools(!showStudyTools)}
              className="px-4 py-2 rounded-lg border hover:opacity-90 transition-opacity text-sm"
              style={{ 
                borderColor: currentTheme.colors.border,
                backgroundColor: showStudyTools ? currentTheme.colors.primary : currentTheme.colors.surface,
                color: showStudyTools ? 'white' : currentTheme.colors.text
              }}
            >
              📚 Study Panel
            </button>
            <button
              onClick={() => setShowStudyToolsModal(true)}
              className="px-4 py-2 rounded-lg border hover:opacity-90 transition-opacity text-sm"
              style={{ 
                borderColor: currentTheme.colors.border,
                backgroundColor: currentTheme.colors.surface,
                color: currentTheme.colors.text
              }}
            >
              🔍 Study Tools
            </button>
            <button
              onClick={() => setShowParallelView(true)}
              className="px-4 py-2 rounded-lg border hover:opacity-90 transition-opacity text-sm"
              style={{ 
                borderColor: currentTheme.colors.border,
                backgroundColor: currentTheme.colors.surface,
                color: currentTheme.colors.text
              }}
            >
              🔄 Parallel View
            </button>
            <button
              onClick={() => setShowBookIntro(true)}
              className="px-4 py-2 rounded-lg border hover:opacity-90 transition-opacity text-sm"
              style={{ 
                borderColor: currentTheme.colors.border,
                backgroundColor: currentTheme.colors.surface,
                color: currentTheme.colors.text
              }}
            >
              📖 Book Intro
            </button>
            <button
              onClick={() => setShowReadingPlans(true)}
              className="px-4 py-2 rounded-lg border hover:opacity-90 transition-opacity text-sm"
              style={{ 
                borderColor: currentTheme.colors.border,
                backgroundColor: currentTheme.colors.surface,
                color: currentTheme.colors.text
              }}
            >
              📅 Reading Plans
            </button>
            <button
              onClick={() => setShowTranslationSelector(true)}
              className="px-4 py-2 rounded-lg border hover:opacity-90 transition-opacity text-sm"
              style={{ 
                borderColor: currentTheme.colors.border,
                backgroundColor: currentTheme.colors.surface,
                color: currentTheme.colors.text
              }}
            >
              🌍 Translations
            </button>
            <button
              onClick={() => setShowOfflineManager(true)}
              className="px-4 py-2 rounded-lg border hover:opacity-90 transition-opacity text-sm"
              style={{ 
                borderColor: currentTheme.colors.border,
                backgroundColor: currentTheme.colors.surface,
                color: currentTheme.colors.text
              }}
            >
              {isOnline ? '💾' : '📱'} Offline
            </button>
            <button
              onClick={() => {
                try {
                  window.location.href = '/enhanced';
                } catch (error) {
                  console.error('Navigation error:', error);
                  // Fallback navigation
                  window.open('/enhanced', '_self');
                }
              }}
              className="px-4 py-2 rounded-lg border hover:opacity-90 transition-opacity text-sm"
              style={{ 
                borderColor: currentTheme.colors.border,
                backgroundColor: currentTheme.colors.primary,
                color: 'white'
              }}
            >
              ✨ Enhanced Features
            </button>
            <button
              onClick={() => setShowHighlights(true)}
              className="px-4 py-2 rounded-lg border hover:opacity-90 transition-opacity text-sm"
              style={{ 
                borderColor: currentTheme.colors.border,
                backgroundColor: currentTheme.colors.surface,
                color: currentTheme.colors.text
              }}
            >
              🖍️ Highlights
            </button>
            <button
              onClick={() => setShowSearch(true)}
              className="px-4 py-2 rounded-lg border hover:opacity-90 transition-opacity text-sm"
              style={{ 
                borderColor: currentTheme.colors.border,
                backgroundColor: currentTheme.colors.surface,
                color: currentTheme.colors.text
              }}
            >
              🔍 Search All
            </button>
            <button
              onClick={() => setShowBookmarks(true)}
              className="px-4 py-2 rounded-lg border hover:opacity-90 transition-opacity text-sm"
              style={{ 
                borderColor: currentTheme.colors.border,
                backgroundColor: currentTheme.colors.surface,
                color: currentTheme.colors.text
              }}
            >
              📑 Bookmarks
            </button>
            <Suspense fallback={<div>Loading...</div>}>
              <LazyTranslationSwitcher
                currentTranslation={currentTranslation.id}
                onTranslationChange={(id, data) => {
                  loadTranslation(id, data);
                setSelectedTranslationId(id);
                setLoadedTranslations(prev => ({ ...prev, [id]: { data } }));
              }}
            />
          </div>
        </motion.header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <section className={showStudyTools ? "lg:col-span-4" : "lg:col-span-5"}>
            <motion.div
              className="sticky top-8 space-y-4 sm:space-y-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="rounded-2xl sm:rounded-3xl border p-6 sm:p-8 shadow-lg backdrop-blur-sm theme-transition" style={{
                borderColor: currentTheme.colors.border,
                backgroundColor: currentTheme.colors.surface + 'CC'
              }}>
                <h3 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-light text-stone-900">Navigate Scripture</h3>

                <div className="space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-xs sm:text-sm font-medium text-stone-600">Translation</span>
                    <select
                      value={selectedTranslationId}
                      onChange={(event) => {
                        const newId = security.sanitizeId(event.target.value);
                        if (security.validateTranslationId(newId)) {
                          setSelectedTranslationId(newId);
                          setIsLoading(true);
                          searchService.setTranslation(newId);
                        }
                      }}
                      className="w-full rounded-xl border border-stone-200 bg-white px-4 sm:px-5 py-2 sm:py-3 text-sm sm:text-base text-stone-900 shadow-sm transition-all hover:border-stone-300 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
                    >
                      {getAllTranslations().map((translation) => (
                        <option key={translation.id} value={translation.id}>
                          {translation.name} ({translation.abbreviation})
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs sm:text-sm font-medium text-stone-600">Book</span>
                    <select
                      value={appState.currentBook}
                      onChange={(event) => {
                        const bookName = event.target.value;
                        if (security.validateBookName(bookName)) {
                          setAppState(prev => ({ ...prev, currentBook: bookName, currentVerse: "all" }));
                        }
                      }}
                      className="w-full rounded-xl border border-stone-200 bg-white px-4 sm:px-5 py-2 sm:py-3 text-sm sm:text-base text-stone-900 shadow-sm transition-all hover:border-stone-300 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
                    >
                      {bookKeys.map((book) => (
                        <option key={book} value={book}>
                          {book}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs sm:text-sm font-medium text-stone-600">Chapter</span>
                    <select
                      value={appState.currentChapter}
                      onChange={(event) => {
                        const chapter = Number(event.target.value);
                        if (security.validateChapter(chapter)) {
                          setAppState(prev => ({ ...prev, currentChapter: chapter, currentVerse: "all" }));
                        }
                      }}
                      className="w-full rounded-xl border border-stone-200 bg-white px-4 sm:px-5 py-2 sm:py-3 text-sm sm:text-base text-stone-900 shadow-sm transition-all hover:border-stone-300 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
                    >
                      {chapterOptions.map((chapter) => (
                        <option key={chapter} value={chapter}>
                          {chapter}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div>
                    <span className="mb-2 block text-xs sm:text-sm font-medium" style={{ color: currentTheme.colors.textSecondary }}>Quick Search</span>
                    <button
                      onClick={() => setShowSearch(true)}
                      className="w-full px-4 py-3 text-left rounded-xl border transition-all hover:border-opacity-70"
                      style={{
                        borderColor: currentTheme.colors.border,
                        backgroundColor: currentTheme.colors.surface,
                        color: currentTheme.colors.textSecondary
                      }}
                    >
                      🔍 Search across all translations...
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>

          {showStudyTools && (
            <section className="lg:col-span-4">
              <motion.div
                className="sticky top-8 space-y-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="rounded-2xl sm:rounded-3xl border p-6 shadow-lg backdrop-blur-sm theme-transition" style={{
                  borderColor: currentTheme.colors.border,
                  backgroundColor: currentTheme.colors.surface + 'CC'
                }}>
                  <h3 className="text-xl font-light mb-4" style={{ color: currentTheme.colors.text }}>Study Tools</h3>
                  
                  <div className="space-y-6">
                    <LazyWrapper>
                      <LazyParallelView
                        book={appState.currentBook}
                        chapter={appState.currentChapter}
                        config={parallelConfig}
                        onConfigChange={setParallelConfig}
                      />
                    </LazyWrapper>
                    
                    <div className="space-y-4">
                      {(() => {
                        const refKey = `${appState.currentBook}:${appState.currentChapter}:1`;
                        const refs = crossReferences[refKey] || [];
                        return (
                          <div className="p-4 rounded-lg border" style={{
                            borderColor: currentTheme.colors.border,
                            backgroundColor: currentTheme.colors.background + '40'
                          }}>
                            <h4 className="font-medium mb-3" style={{ color: currentTheme.colors.text }}>🔗 Cross References ({refs.length})</h4>
                            <div className="space-y-2 text-sm">
                              {refs.map(ref => {
                                const [book, chapter, verse] = ref.split(':');
                                return (
                                  <div key={ref} className="cursor-pointer hover:opacity-70" style={{ color: currentTheme.colors.primary }}
                                    onClick={() => setAppState({ currentBook: book, currentChapter: parseInt(chapter), currentVerse: parseInt(verse) })}>
                                    {ref.replace(':', ' ')} 
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })()}
                      
                      {(() => {
                        const bookChars = characters[appState.currentBook] || [];
                        return (
                          <div className="p-4 rounded-lg border" style={{
                            borderColor: currentTheme.colors.border,
                            backgroundColor: currentTheme.colors.background + '40'
                          }}>
                            <h4 className="font-medium mb-3" style={{ color: currentTheme.colors.text }}>👤 Characters ({bookChars.length})</h4>
                            <div className="space-y-2 text-sm">
                              {bookChars.map(char => (
                                <div key={char.name} className="flex justify-between items-center">
                                  <span style={{ color: currentTheme.colors.text }}>{char.name}</span>
                                  <span className="text-xs px-2 py-1 rounded" style={{ 
                                    backgroundColor: currentTheme.colors.primary + '20',
                                    color: currentTheme.colors.primary 
                                  }}>{char.role}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                      
                      {(() => {
                        const bookThemes = themes[appState.currentBook] || [];
                        return (
                          <div className="p-4 rounded-lg border" style={{
                            borderColor: currentTheme.colors.border,
                            backgroundColor: currentTheme.colors.background + '40'
                          }}>
                            <h4 className="font-medium mb-3" style={{ color: currentTheme.colors.text }}>📚 Themes ({bookThemes.length})</h4>
                            <div className="space-y-2 text-sm">
                              {bookThemes.map(theme => (
                                <div key={theme.theme} className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.color }}></div>
                                  <span style={{ color: currentTheme.colors.text }}>{theme.theme}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </motion.div>
            </section>
          )}

          <section className={showStudyTools ? "lg:col-span-4" : "lg:col-span-7"}>
            <PullToRefresh onRefresh={handleRefresh}>
              <SwipeGestureHandler
                onSwipeLeft={() => handleNavigate('next', true)}
                onSwipeRight={() => handleNavigate('prev', true)}
                disabled={isLoading}
              >
                <ChapterTransition 
                  chapterKey={`${appState.currentBook}-${appState.currentChapter}`}
                  direction={swipeDirection}
                >
                  <motion.div
                    className="rounded-2xl sm:rounded-3xl border p-6 sm:p-8 shadow-lg backdrop-blur-sm theme-transition"
                    style={{
                      borderColor: currentTheme.colors.border,
                      backgroundColor: currentTheme.colors.surface + 'CC'
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                <div className="mb-4 sm:mb-6 flex items-start justify-between gap-4">
                  <h2 className="text-2xl sm:text-3xl font-light" style={{ color: currentTheme.colors.text }}>
                    {searchTerm.trim() ? `Results for "${searchTerm.trim()}"` : `${appState.currentBook} ${appState.currentChapter}`}
                  </h2>
                </div>

                <div 
                  ref={scrollContainerRef}
                  className="max-h-[60vh] overflow-y-auto scroll-container"
                >
                  {isLoading ? (
                    <motion.div 
                      className="flex items-center justify-center py-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CrossLoader 
                        variant="morphing"
                        size={48}
                        color={currentTheme.colors.primary}
                        duration={2}
                      />
                    </motion.div>
                  ) : displayVerses.length === 0 ? (
                    <motion.div 
                      className="flex flex-col items-center justify-center py-8 space-y-4"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <CrossLoader 
                        variant="particle"
                        size={32}
                        color={currentTheme.colors.textSecondary}
                        duration={2}
                      />
                      <p style={{ color: currentTheme.colors.textSecondary }}>No verses found</p>
                    </motion.div>
                  ) : (
                    <div className="space-y-2">
                      {displayVerses.map((item, index) => {
                        // Handle direct verse objects from KJV data
                        const verseData = item.book ? item : {
                          book: appState.currentBook,
                          chapter: appState.currentChapter,
                          verse: item.verse || index + 1,
                          text: item.text || item
                        };
                        
                        return (
                          <Suspense fallback={<div>Loading...</div>}>
                            <LazyVerseHighlighter
                              key={`${verseData.book}-${verseData.chapter}-${verseData.verse}`}
                              book={verseData.book}
                              chapter={verseData.chapter}
                            verse={verseData.verse}
                            text={verseData.text}
                          >
                            <div 
                              className="p-3 rounded-lg hover:bg-opacity-50 transition-all cursor-pointer"
                              style={{ 
                                backgroundColor: currentTheme.colors.background + '40'
                              }}
                              onClick={() => {
                                setSelectedWord(verseData.text.split(' ')[0]);
                                announceToScreenReader(`Selected verse ${verseData.verse}`);
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <span 
                                  className="font-medium mr-2"
                                  style={{ color: currentTheme.colors.primary }}
                                >
                                  {verseData.verse}
                                </span>
                                <BookmarkButton
                                  book={verseData.book}
                                  chapter={verseData.chapter}
                                  verse={verseData.verse}
                                  text={verseData.text}
                                />
                              </div>
                              <span style={{ color: currentTheme.colors.text }}>
                                <EnhancedVerseText 
                                  text={verseData.text}
                                  testament={isOldTestament(verseData.book) ? 'old' : 'new'}
                                />
                              </span>
                            </div>
                          </VerseHighlighter>
                        );
                      })}
                    </div>
                  )}
                  </div>
                  </motion.div>
                </ChapterTransition>
              </SwipeGestureHandler>
            </PullToRefresh>
          </section>
        </div>
      </div>
      
      <LazyWrapper>
        <LazyThemeSwitcher 
          isOpen={showThemeSwitcher} 
          onClose={() => setShowThemeSwitcher(false)} 
        />
      </LazyWrapper>
      
      <LazyWrapper>
        <LazyAnalyticsDashboard 
          isOpen={showAnalytics} 
          onClose={() => setShowAnalytics(false)} 
        />
      </LazyWrapper>
      
      <LazyWrapper>
        <LazyWordStudy 
          word={selectedWord} 
          onClose={() => setSelectedWord(null)} 
        />
      </LazyWrapper>
      
      <LazyWrapper>
        <LazyBookIntroduction 
          book={appState.currentBook} 
          isOpen={showBookIntro} 
          onClose={() => setShowBookIntro(false)} 
        />
      </LazyWrapper>
      
      <Suspense fallback={<div>Loading...</div>}>
        <LazyReadingPlans
          isOpen={showReadingPlans}
          onClose={() => setShowReadingPlans(false)}
          onNavigate={(book, chapter) => {
          setAppState({ currentBook: book, currentChapter: chapter, currentVerse: 'all' });
          setShowReadingPlans(false);
        }}
      />
      
      <Suspense fallback={<div>Loading...</div>}>
        <LazyStudyTools
          isOpen={showStudyToolsModal}
          onClose={() => setShowStudyToolsModal(false)}
          currentVerse={typeof appState.currentVerse === 'number' ? {
          book: appState.currentBook,
          chapter: appState.currentChapter,
          verse: appState.currentVerse
        } : undefined}
        onNavigate={(book, chapter, verse) => {
          setAppState({ currentBook: book, currentChapter: chapter, currentVerse: verse || 'all' });
          setShowStudyToolsModal(false);
        }}
      />
      
      <AnimatePresence>
        {showParallelView && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowParallelView(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-6xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden"
              style={{
                backgroundColor: currentTheme.colors.surface,
                border: `1px solid ${currentTheme.colors.border}`
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b" style={{ borderColor: currentTheme.colors.border }}>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold" style={{ color: currentTheme.colors.text }}>
                    Parallel Bible View
                  </h2>
                  <button
                    onClick={() => setShowParallelView(false)}
                    className="p-2 rounded-lg hover:opacity-70 transition-opacity"
                    style={{ color: currentTheme.colors.textSecondary }}
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="p-6 max-h-96 overflow-y-auto">
                <Suspense fallback={<div>Loading...</div>}>
                  <LazyParallelBibleView
                    book={appState.currentBook}
                    chapter={appState.currentChapter}
                    translations={parallelTranslations.length > 0 ? parallelTranslations : [
                    { id: currentTranslation.id, name: currentTranslation.name, data: currentTranslation }
                  ]}
                  onAddTranslation={() => {
                    const newTranslation = {
                      id: 'eng-esv',
                      name: 'English Standard Version',
                      data: currentTranslation
                    };
                    setParallelTranslations(prev => [...prev, newTranslation]);
                  }}
                  onRemoveTranslation={(id) => {
                    setParallelTranslations(prev => prev.filter(t => t.id !== id));
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <LazyWrapper>
        <LazyOfflineManager 
          isOpen={showOfflineManager} 
          onClose={() => setShowOfflineManager(false)} 
        />
      </LazyWrapper>
      
      <HighlightsPanel 
        isOpen={showHighlights}
        onClose={() => setShowHighlights(false)}
      />
      
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSearch(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden"
              style={{
                backgroundColor: currentTheme.colors.surface,
                border: `1px solid ${currentTheme.colors.border}`
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b" style={{ borderColor: currentTheme.colors.border }}>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold" style={{ color: currentTheme.colors.text }}>
                    Search Bible
                  </h2>
                  <button
                    onClick={() => setShowSearch(false)}
                    className="p-2 rounded-lg hover:opacity-70 transition-opacity"
                    style={{ color: currentTheme.colors.textSecondary }}
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="p-6 max-h-96 overflow-y-auto">
                <Suspense fallback={<div>Loading...</div>}>
                  <LazyBibleSearch
                    translations={{
                      [currentTranslation.id]: currentTranslation,
                      ...loadedTranslations
                  }}
                  onResultClick={(book, chapter, verse) => {
                    setAppState({ currentBook: book, currentChapter: chapter, currentVerse: verse });
                    setShowSearch(false);
                  }}
                  currentBook={appState.currentBook}
                  currentChapter={appState.currentChapter}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <BookmarksPanel
        isOpen={showBookmarks}
        onClose={() => setShowBookmarks(false)}
        onNavigate={(book, chapter, verse) => {
          setAppState({ currentBook: book, currentChapter: chapter, currentVerse: verse });
          setShowBookmarks(false);
        }}
      />
      
      <AnimatePresence>
        {showTranslationSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowTranslationSelector(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden"
              style={{
                backgroundColor: currentTheme.colors.surface,
                border: `1px solid ${currentTheme.colors.border}`
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b" style={{ borderColor: currentTheme.colors.border }}>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold" style={{ color: currentTheme.colors.text }}>
                    Choose Translation
                  </h2>
                  <button
                    onClick={() => setShowTranslationSelector(false)}
                    className="p-2 rounded-lg hover:opacity-70 transition-opacity"
                    style={{ color: currentTheme.colors.textSecondary }}
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="p-6 max-h-96 overflow-y-auto">
                <TranslationSelector
                  selectedTranslation={currentTranslation.id}
                  onTranslationChange={(id) => {
                    loadTranslation(id);
                    setShowTranslationSelector(false);
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <InstallPrompt />
      
      <FloatingActionButton 
        onNavigateNext={() => handleNavigate('next')}
        onNavigatePrev={() => handleNavigate('prev')}
        onToggleStudyTools={() => setShowStudyTools(!showStudyTools)}
        onShowAnalytics={() => setShowAnalytics(true)}
      />
        </div>
      </main>
    </ErrorBoundary>
  );
};

export default App;