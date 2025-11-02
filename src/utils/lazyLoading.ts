import { lazy } from 'react';

// Code splitting for major components
export const LazyReadingPlans = lazy(() => 
  import('../components/ReadingPlans').then(module => ({ default: module.ReadingPlans }))
);

export const LazyStudyTools = lazy(() => 
  import('../components/StudyTools').then(module => ({ default: module.StudyTools }))
);

export const LazyParallelBibleView = lazy(() => 
  import('../components/ParallelBibleView').then(module => ({ default: module.ParallelBibleView }))
);

export const LazyAdvancedStudyPanel = lazy(() => 
  import('../components/AdvancedStudyPanel').then(module => ({ default: module.AdvancedStudyPanel }))
);

export const LazyBookmarksPanel = lazy(() => 
  import('../components/BookmarkSystem').then(module => ({ default: module.BookmarksPanel }))
);

export const LazyHighlightsPanel = lazy(() => 
  import('../components/VerseHighlighter').then(module => ({ default: module.HighlightsPanel }))
);

export const LazyBibleSearch = lazy(() => 
  import('../components/BibleSearch').then(module => ({ default: module.BibleSearch }))
);

export const LazyTranslationSwitcher = lazy(() => 
  import('../components/TranslationSwitcher').then(module => ({ default: module.TranslationSwitcher }))
);

// Preload critical components
export const preloadCriticalComponents = () => {
  // Preload components likely to be used soon
  import('../components/BookmarkSystem');
  import('../components/VerseHighlighter');
  import('../components/BibleSearch');
};