import { Fragment, useEffect, useMemo, useState, useRef } from "react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import { bibleTranslations, getTranslationById, defaultTranslationId } from "./data";
import { BibleReference, AppState, NavigationDirection, BibleVerse } from "./types";
import { isSingleVerse } from "./utils/guards";
import { navigateChapter } from "./utils/navigation";
import { SearchService } from "./search";
import { VerseOfTheDay } from "./components/VerseOfTheDay";
import { ThemeBuilder } from "./components/ThemeBuilder";
import { AnalyticsDashboard } from "./components/AnalyticsDashboard";
import { themeManager } from "./themes";
import { analyticsManager } from "./analytics";
import { performanceManager } from "./performance";

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
  const [showVerseOfDay, setShowVerseOfDay] = useState(true);
  const [showThemeBuilder, setShowThemeBuilder] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(themeManager.getCurrentTheme());

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
    const unsubscribe = themeManager.subscribe(setCurrentTheme);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (appState.currentBook && appState.currentChapter) {
      analyticsManager.startSession(appState.currentBook, appState.currentChapter, selectedTranslationId);
      performanceManager.preloadNextChapters(appState.currentBook, appState.currentChapter, selectedTranslationId);
    }
    return () => analyticsManager.endSession();
  }, [appState.currentBook, appState.currentChapter, selectedTranslationId]);

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

  const handleSearch = async (query: string) => {
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
  };

  const handleNavigate = (direction: "prev" | "next") => {
    const availableBooks = Object.keys(selectedTranslation.data);
    const navDirection = direction === "next" ? NavigationDirection.Next : NavigationDirection.Previous;
    const newState = navigateChapter(appState, navDirection, availableBooks);
    setAppState(newState);
  };

  const dailyVerse = currentVerses.length > 0 ? currentVerses[0] : null;
  const displayVerses = searchTerm.trim() ? searchResults : currentVerses;

  if (showVerseOfDay && dailyVerse) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowVerseOfDay(false)}
          className="fixed top-4 right-4 z-50 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg"
        >
          ✕
        </button>
        <VerseOfTheDay
          verse={dailyVerse}
          onNavigate={handleNavigate}
          isLoading={isLoading}
          translationId={selectedTranslationId}
        />
      </div>
    );
  }

  return (
    <main className="min-h-screen theme-transition px-4 sm:px-6 py-8 sm:py-16" style={{
      background: `linear-gradient(135deg, ${currentTheme.colors.background} 0%, ${currentTheme.colors.surface} 100%)`,
      color: currentTheme.colors.text
    }}>
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
              onClick={() => setShowVerseOfDay(true)}
              className="px-4 py-2 rounded-lg text-white hover:opacity-90 transition-opacity text-sm"
              style={{ backgroundColor: currentTheme.colors.primary }}
            >
              View Verse of the Day
            </button>
            <button
              onClick={() => setShowThemeBuilder(true)}
              className="px-4 py-2 rounded-lg border hover:opacity-90 transition-opacity text-sm"
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
          </div>
        </motion.header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <section className="lg:col-span-5">
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

                  <label className="block">
                    <span className="mb-2 block text-xs sm:text-sm font-medium text-stone-600">Search</span>
                    <input
                      type="search"
                      placeholder='Try "light"'
                      value={searchTerm}
                      onChange={(event) => {
                        const query = event.target.value;
                        setSearchTerm(query);
                        if (query.trim()) {
                          handleSearch(query);
                        }
                      }}
                      className="w-full rounded-xl border border-stone-200 bg-white px-4 sm:px-5 py-2 sm:py-3 text-sm sm:text-base text-stone-900 shadow-sm transition-all hover:border-stone-300 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
                    />
                  </label>
                </div>
              </div>
            </motion.div>
          </section>

          <section className="lg:col-span-7">
            <motion.div
              className="rounded-2xl sm:rounded-3xl border border-stone-200/60 bg-white/80 p-6 sm:p-8 shadow-lg backdrop-blur-sm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="mb-4 sm:mb-6 flex items-start justify-between gap-4">
                <h2 className="text-2xl sm:text-3xl font-light text-stone-900">
                  {searchTerm.trim() ? `Results for "${searchTerm.trim()}"` : `${appState.currentBook} ${appState.currentChapter}`}
                </h2>
              </div>

              <div className="max-h-[60vh] overflow-y-auto space-y-3 sm:space-y-4">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-stone-500">Loading...</p>
                  </div>
                ) : displayVerses.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-stone-500">No verses found</p>
                  </div>
                ) : (
                  <AnimatePresence mode="wait">
                    {displayVerses.map((item, index) => {
                      const verse = "verse" in item ? item.verse : item.verse;
                      const text = "verse" in item ? item.text : item.verse.text;

                      return (
                        <motion.div
                          key={`${item.book || verse.book}-${item.chapter || verse.chapter}-${verse}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="rounded-xl border border-stone-100 bg-gradient-to-r from-stone-50/50 to-white p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <span className="text-xs sm:text-sm font-medium text-amber-700 block mb-2">
                            {item.book || verse.book} {item.chapter || verse.chapter}:{verse}
                          </span>
                          <p className="text-sm sm:text-base leading-relaxed text-stone-800">
                            {text}
                          </p>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
              </div>
            </motion.div>
          </section>
        </div>
      </div>
      
      <ThemeBuilder 
        isOpen={showThemeBuilder} 
        onClose={() => setShowThemeBuilder(false)} 
      />
      
      <AnalyticsDashboard 
        isOpen={showAnalytics} 
        onClose={() => setShowAnalytics(false)} 
      />
    </main>
  );
};

export default App;
