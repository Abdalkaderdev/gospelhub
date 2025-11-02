import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BibleVerse } from "../types";
import { SearchService } from "../search";
import { themeManager } from "../themes";
import { analyticsManager } from "../analytics";
import { performanceManager } from "../performance";

interface VerseOfTheDayProps {
  verse: BibleVerse;
  onNavigate: (direction: "prev" | "next") => void;
  isLoading: boolean;
  translationId?: string;
}

export const VerseOfTheDay = ({ verse, onNavigate, isLoading, translationId = "kjv" }: VerseOfTheDayProps) => {
  const [fontSize, setFontSize] = useState(18);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highlightedWord, setHighlightedWord] = useState<number | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [currentTheme, setCurrentTheme] = useState(themeManager.getCurrentTheme());
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const searchService = new SearchService(translationId);

  useEffect(() => {
    const unsubscribe = themeManager.subscribe(setCurrentTheme);
    analyticsManager.recordVerseRead(verse.verse);
    return unsubscribe;
  }, [verse.verse]);

  // Debounced search function
  const handleSearchInput = useCallback(
    async (query: string) => {
      setSearchQuery(query);
      
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      if (!query.trim()) {
        setSuggestions([]);
        setSelectedSuggestionIndex(-1);
        return;
      }

      debounceTimer.current = setTimeout(async () => {
        setIsSearching(true);
        try {
          const result = await searchService.searchBible(query);
          setSuggestions(result.results.slice(0, 8));
          setSelectedSuggestionIndex(-1);
        } catch (error) {
          console.error("Search error:", error);
          setSuggestions([]);
        } finally {
          setIsSearching(false);
        }
      }, 300);
    },
    [searchService]
  );

  // Keyboard navigation for suggestions
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!searchOpen || searchSuggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          prev < searchSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          const suggestion = searchSuggestions[selectedSuggestionIndex];
          setSearchQuery(`${suggestion.verse.book} ${suggestion.verse.chapter}:${suggestion.verse.verse}`);
          setSuggestions([]);
          setSearchOpen(false);
        }
        break;
      case "Escape":
        setSearchOpen(false);
        setSuggestions([]);
        break;
      default:
        break;
    }
  };

  // Handle swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        onNavigate("next");
      } else {
        onNavigate("prev");
      }
    }
  };

  // Handle pinch-to-zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -1 : 1;
      setFontSize((prev) => Math.max(14, Math.min(28, prev + delta)));
    }
  };

  // Simulate audio playback with word-by-word highlighting
  useEffect(() => {
    if (!isPlaying) return;

    const words = verse.text.split(" ");
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < words.length) {
        setHighlightedWord(currentIndex);
        currentIndex++;
      } else {
        setIsPlaying(false);
        setHighlightedWord(null);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [isPlaying, verse.text]);

  const words = verse.text.split(" ");

  return (
    <motion.div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
      className="relative flex flex-col h-screen w-full overflow-hidden theme-transition"
      style={{
        background: `linear-gradient(135deg, ${currentTheme.colors.background} 0%, ${currentTheme.colors.surface} 100%)`
      }}
    >
      {/* Header with Search */}
      <motion.header
        className="pt-6 px-6 pb-4 relative z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-light text-stone-900">Verse of the Day</h1>
            <p className="text-sm text-stone-500">
              {verse.book} {verse.chapter}:{verse.verse}
            </p>
          </div>
          <motion.button
            onClick={() => setSearchOpen(!searchOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 transition-colors"
            title="Premium Search"
          >
            <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </motion.button>
        </div>

        {/* Premium Search Dropdown */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <input
                type="text"
                placeholder="Search verses, books, keywords..."
                value={searchQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setSearchOpen(true)}
                autoFocus
                className="w-full px-4 py-3 rounded-xl border border-amber-200 bg-white/90 backdrop-blur text-stone-900 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
              />

              {/* Suggestions Dropdown */}
              <AnimatePresence>
                {searchSuggestions.length > 0 && (
                  <motion.div
                    className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur rounded-xl border border-stone-200 shadow-lg z-50 max-h-64 overflow-y-auto"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                  >
                    {searchSuggestions.map((result, index) => (
                      <motion.div
                        key={`${result.verse.book}-${result.verse.chapter}-${result.verse.verse}`}
                        className={`px-4 py-3 cursor-pointer transition-colors border-b border-stone-100 last:border-b-0 ${
                          selectedSuggestionIndex === index
                            ? "bg-amber-50"
                            : "hover:bg-stone-50"
                        }`}
                        onClick={() => {
                          setSearchQuery(`${result.verse.book} ${result.verse.chapter}:${result.verse.verse}`);
                          setSuggestions([]);
                          setSearchOpen(false);
                        }}
                      >
                        <p className="font-medium text-amber-700 text-sm">
                          {result.verse.book} {result.verse.chapter}:{result.verse.verse}
                        </p>
                        <p className="text-stone-700 text-xs line-clamp-2 mt-1">
                          {result.verse.text}
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Loading State */}
              {isSearching && (
                <motion.div
                  className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur rounded-xl border border-stone-200 shadow-lg p-4 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    className="w-4 h-4 rounded-full bg-amber-500"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                  />
                  <span className="ml-2 text-sm text-stone-600">Searching...</span>
                </motion.div>
              )}

              {/* No Results */}
              {!isSearching && searchQuery.trim() && searchSuggestions.length === 0 && (
                <motion.div
                  className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur rounded-xl border border-stone-200 shadow-lg p-4 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="text-sm text-stone-500">No verses found</p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${verse.book}-${verse.chapter}-${verse.verse}`}
          className="flex-1 flex flex-col justify-center items-center px-6 py-8 overflow-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-full max-w-md bg-white/60 backdrop-blur rounded-3xl p-8 shadow-lg border border-stone-200/60">
            <p
              className="text-center leading-relaxed text-stone-800 transition-all duration-200"
              style={{ fontSize: `${fontSize}px` }}
            >
              {words.map((word, index) => (
                <span
                  key={index}
                  className={`transition-colors duration-150 ${
                    highlightedWord === index
                      ? "bg-amber-200/60 px-1 rounded"
                      : ""
                  }`}
                >
                  {word}{" "}
                </span>
              ))}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <motion.div
        className="px-6 pb-8 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Audio Player */}
        <div className="flex items-center justify-center gap-4 bg-white/80 backdrop-blur rounded-2xl p-4 shadow-lg border border-stone-200/60">
          <motion.button
            onClick={() => setIsPlaying(!isPlaying)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-full bg-amber-500 text-white shadow-lg hover:bg-amber-600 transition-colors"
          >
            {isPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            )}
          </motion.button>

          <div className="flex-1 h-1 bg-stone-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-amber-500"
              initial={{ width: "0%" }}
              animate={{ width: `${(highlightedWord ?? 0) / words.length * 100}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>

          <span className="text-sm text-stone-500 font-medium">
            {fontSize}px
          </span>
        </div>

        {/* Font Size Controls */}
        <div className="flex items-center justify-center gap-3 bg-white/80 backdrop-blur rounded-2xl p-4 shadow-lg border border-stone-200/60">
          <motion.button
            onClick={() => setFontSize((prev) => Math.max(14, prev - 1))}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-2 rounded-lg bg-stone-100 text-stone-900 hover:bg-stone-200 transition-colors"
          >
            A−
          </motion.button>
          <span className="text-xs text-stone-500">Font Size</span>
          <motion.button
            onClick={() => setFontSize((prev) => Math.min(28, prev + 1))}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-2 rounded-lg bg-stone-100 text-stone-900 hover:bg-stone-200 transition-colors"
          >
            A+
          </motion.button>
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <motion.button
            onClick={() => onNavigate("prev")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-3 rounded-xl border border-stone-200 bg-white/80 text-stone-900 hover:bg-stone-50 transition-colors"
          >
            ← Previous
          </motion.button>
          <motion.button
            onClick={() => onNavigate("next")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-3 rounded-xl border border-stone-200 bg-white/80 text-stone-900 hover:bg-stone-50 transition-colors"
          >
            Next →
          </motion.button>
        </div>
      </motion.div>

      {/* Swipe Hint */}
      <motion.div
        className="absolute bottom-4 left-0 right-0 flex justify-center"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <p className="text-xs text-stone-400">Swipe to navigate</p>
      </motion.div>
    </motion.div>
  );
};
