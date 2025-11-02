import { Fragment, useEffect, useMemo, useState, useRef, useCallback, Suspense } from "react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import { bibleTranslations, getTranslationById, defaultTranslationId } from "./data";
import { BibleReference, AppState, NavigationDirection, BibleVerse } from "./types";
import { isSingleVerse } from "./utils/guards";
import { navigateChapter } from "./utils/navigation";
import { SearchService } from "./search";

import { 
  LazyAnalyticsDashboard,
  LazyParallelView,
  LazyWordStudy,
  LazyCommentary,
  LazyCrossReferences,
  LazyBookIntroduction
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
import { usePWA } from "./hooks/usePWA";
import { offlineSyncManager } from "./utils/offlineSync";
import { triggerHaptic, isMobileDevice } from "./utils/haptics";
import { analyticsManager } from "./analytics";
import { performanceManager } from "./performance";
import { updateMetaTags, generateVerseShareData, generateStructuredData } from "./utils/seo";
import { announceToScreenReader, KEYBOARD_KEYS } from "./utils/accessibility";

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
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [parallelConfig, setParallelConfig] = useState({ translations: [selectedTranslationId], syncScroll: true, highlightDifferences: false });
  const [keyboardNavigation, setKeyboardNavigation] = useState(false);
  const [showThemeSwitcher, setShowThemeSwitcher] = useState(false);
  const { currentTheme } = useTheme();
  const { isOnline } = usePWA();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const selectedTranslation = useMemo(
    () => getTranslationById(selectedTranslationId) || bibleTranslations[0],
    [selectedTranslationId]
  );

  const searchService = useMemo(() => new SearchService(selectedTranslationId), [selectedTranslationId]);

  const bookKeys = useMemo(() => Object.keys(selectedTranslation.data), [selectedTranslation]);
  const firstBook = bookKeys[0] ?? "";

  useEffect(() => {
    if (!appState.currentBook) {
      setAppState(prev => ({ ...prev, currentBook: firstBook }));
    }
  }, [selectedTranslation, firstBook, appState.currentBook]);



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
      const title = `${appState.currentBook} ${appState.currentChapter} - GospelHub`;
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
    if (!appState.currentBook) {
      return [] as number[];
    }
    return selectedTranslation.data[appState.currentBook]?.chapters ?? [];
  }, [appState.currentBook, selectedTranslation]);

  const currentVerses = useMemo(() => {
    if (!appState.currentBook) {
      return [];
    }
    return selectedTranslation.data[appState.currentBook]?.verses[appState.currentChapter] ?? [];
  }, [appState, selectedTranslation]);

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setIsLoading(true);
    try {
      const result = await searchService.searchBible(query);
      setSearchResults(result.results);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchService]);

  const handleNavigate = useCallback((direction: "prev" | "next") => {
    const availableBooks = Object.keys(selectedTranslation.data);
    const navDirection = direction === "next" ? NavigationDirection.Next : NavigationDirection.Previous;
    const newState = navigateChapter(appState, navDirection, availableBooks);
    
    // Trigger haptic feedback on mobile
    if (isMobileDevice()) {
      triggerHaptic('light');
    }
    
    setAppState(newState);
    announceToScreenReader(`Navigated to ${newState.currentBook} chapter ${newState.currentChapter}`);
  }, [selectedTranslation.data, appState]);

  const handleRefresh = useCallback(async () => {
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
    <>
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
        aria-label="Bible reader application"
      >
        {displayVerses.length > 0 && !searchTerm.trim() && (
          <ReadingProgressBar 
            progress={progressData.progress}
            estimatedTime={progressData.estimatedReadingTime}
            wordsRead={progressData.wordsRead}
            totalWords={progressData.totalWords}
            currentTheme={currentTheme}
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
            Daily <span className="font-semibold" style={{ color: currentTheme.colors.primary }}>Bible</span> Reader
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
              📚 Study Tools
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
              onClick={() => setShowReadingPlan(true)}
              className="px-4 py-2 rounded-lg border hover:opacity-90 transition-opacity text-sm"
              style={{ 
                borderColor: currentTheme.colors.border,
                backgroundColor: currentTheme.colors.surface,
                color: currentTheme.colors.text
              }}
            >
              📅 Reading Plan
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
                        const newId = event.target.value;
                        setSelectedTranslationId(newId);
                        searchService.setTranslation(newId);
                      }}
                      className="w-full rounded-xl border border-stone-200 bg-white px-4 sm:px-5 py-2 sm:py-3 text-sm sm:text-base text-stone-900 shadow-sm transition-all hover:border-stone-300 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
                    >
                      {bibleTranslations.map((translation) => (
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
                      onChange={(event) => setAppState(prev => ({ ...prev, currentBook: event.target.value, currentVerse: "all" }))}
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
                      onChange={(event) => setAppState(prev => ({ ...prev, currentChapter: Number(event.target.value), currentVerse: "all" }))}
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
                    <span className="mb-2 block text-xs sm:text-sm font-medium" style={{ color: currentTheme.colors.textSecondary }}>Advanced Search</span>
                    <AdvancedSearch 
                      searchService={searchService}
                      currentTheme={currentTheme}
                      onResultClick={(book, chapter, verse) => {
                        setAppState({ currentBook: book, currentChapter: chapter, currentVerse: verse });
                        setSearchTerm('');
                        setSearchResults([]);
                      }}
                    />
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
                    
                    {appState.currentVerse !== "all" && typeof appState.currentVerse === "number" && (
                      <>
                        <LazyWrapper>
                          <LazyCommentary
                            book={appState.currentBook}
                            chapter={appState.currentChapter}
                            verse={appState.currentVerse}
                          />
                        </LazyWrapper>
                        
                        <LazyWrapper>
                          <LazyCrossReferences
                            book={appState.currentBook}
                            chapter={appState.currentChapter}
                            verse={appState.currentVerse}
                            onReferenceClick={(book, chapter, verse) => {
                              setAppState({ currentBook: book, currentChapter: chapter, currentVerse: verse });
                            }}
                          />
                        </LazyWrapper>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            </section>
          )}

          <section className={showStudyTools ? "lg:col-span-4" : "lg:col-span-7"}>
            <PullToRefresh onRefresh={handleRefresh}>
              <SwipeNavigation 
                onSwipeLeft={() => handleNavigate('next')}
                onSwipeRight={() => handleNavigate('prev')}
                disabled={isLoading}
              >
                <PageTransition pageKey={`${appState.currentBook}-${appState.currentChapter}`}>
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
                      <CrossAssembly 
                        size={48}
                        color={currentTheme.colors.primary}
                        thickness={6}
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
                        size={32}
                        color={currentTheme.colors.textSecondary}
                        duration={2}
                      />
                      <p style={{ color: currentTheme.colors.textSecondary }}>No verses found</p>
                    </motion.div>
                  ) : (
                    <VirtualizedVerseList
                      verses={displayVerses.map(item => {
                        if ("verse" in item) {
                          return {
                            book: item.book || '',
                            chapter: item.chapter || 0,
                            verse: item.verse,
                            text: item.text
                          };
                        } else {
                          return item.verse;
                        }
                      })}
                      onVerseClick={(verse) => {
                        setSelectedWord(verse.text.split(' ')[0]);
                        announceToScreenReader(`Selected verse ${verse.verse}`);
                      }}
                      height={400}
                    />
                  )}
                  </div>
                  </motion.div>
                </PageTransition>
              </SwipeNavigation>
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
      
      <AnimatePresence>
        {showReadingPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowReadingPlan(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <button
                  onClick={() => setShowReadingPlan(false)}
                  className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-colors"
                >
                  ✕
                </button>
                <LazyWrapper>
                  <LazyReadingPlanView />
                </LazyWrapper>
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
      
      <InstallPrompt />
      
      <FloatingActionButton 
        onNavigateNext={() => handleNavigate('next')}
        onNavigatePrev={() => handleNavigate('prev')}
        onToggleStudyTools={() => setShowStudyTools(!showStudyTools)}
        onShowAnalytics={() => setShowAnalytics(true)}
      />
        </div>
      </main>
    </>
  );
};

export default App;
