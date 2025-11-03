import { lazy } from 'react';

// Lazy load heavy components
export const LazyThemeSwitcher = lazy(() => 
  import('../ThemeSwitcher').then(module => ({ default: module.ThemeSwitcher }))
);

export const LazyAnalyticsDashboard = lazy(() => 
  import('../AnalyticsDashboard').then(module => ({ default: module.AnalyticsDashboard }))
);

export const LazyReadingPlanView = lazy(() => 
  import('../ReadingPlanView').then(module => ({ default: module.ReadingPlanView }))
);

export const LazyOfflineManager = lazy(() => 
  import('../OfflineManager').then(module => ({ default: module.OfflineManager }))
);

export const LazyWordStudy = lazy(() => 
  import('../study/WordStudy').then(module => ({ default: module.WordStudy }))
);

export const LazyBookIntroduction = lazy(() => 
  import('../study/BookIntroduction').then(module => ({ default: module.BookIntroduction }))
);

export const LazyParallelView = lazy(() => 
  import('../study/ParallelViewEnhanced').then(module => ({ default: module.ParallelViewEnhanced }))
);

export const LazyCommentary = lazy(() => 
  import('../study/Commentary').then(module => ({ default: module.Commentary }))
);

export const LazyCrossReferences = lazy(() => 
  import('../study/CrossReferences').then(module => ({ default: module.CrossReferences }))
);

export const LazyVerseHighlighter = lazy(() =>
  import('../VerseHighlighter').then(module => ({ default: module.VerseHighlighter }))
);

export const LazyTranslationSwitcher = lazy(() =>
  import('../TranslationSwitcher').then(module => ({ default: module.TranslationSwitcher }))
);

export const LazyBibleSearch = lazy(() =>
  import('../BibleSearch').then(module => ({ default: module.BibleSearch }))
);

export const LazyBookmarkSystem = lazy(() =>
  import('../BookmarkSystem').then(module => ({ default: module.BookmarkButton }))
);

export const LazyReadingPlans = lazy(() =>
  import('../ReadingPlans').then(module => ({ default: module.ReadingPlans }))
);

export const LazyStudyTools = lazy(() =>
  import('../StudyTools').then(module => ({ default: module.StudyTools }))
);

export const LazyParallelBibleView = lazy(() =>
  import('../ParallelBibleView').then(module => ({ default: module.ParallelBibleView }))
);