import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import { Enhanced } from './pages/Enhanced';
import { Home, BibleReader, Search, StudyTools, ReadingPlans, Bookmarks, Notes, Highlights, History, Settings, Analytics, Themes, Audio, Offline, Share, ParallelView, OriginalLanguages, Maps, Timeline, Characters } from './pages';
import { ThemeProvider } from './contexts/ThemeContext';
import { ErrorFallback } from './components/ErrorFallback';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <ErrorFallback />
  },
  {
    path: '/app',
    element: <App />,
    errorElement: <ErrorFallback />
  },
  {
    path: '/bible',
    element: <BibleReader />,
    errorElement: <ErrorFallback />
  },
  {
    path: '/search',
    element: <Search />,
    errorElement: <ErrorFallback />
  },
  {
    path: '/study',
    element: <StudyTools />,
    errorElement: <ErrorFallback />
  },
  {
    path: '/plans',
    element: <ReadingPlans />,
    errorElement: <ErrorFallback />
  },
  {
    path: '/bookmarks',
    element: <Bookmarks />,
    errorElement: <ErrorFallback />
  },
  {
    path: '/notes',
    element: <Notes />,
    errorElement: <ErrorFallback />
  },
  {
    path: '/highlights',
    element: <Highlights />,
    errorElement: <ErrorFallback />
  },
  {
    path: '/history',
    element: <History />,
    errorElement: <ErrorFallback />
  },
  {
    path: '/settings',
    element: <Settings />,
    errorElement: <ErrorFallback />
  },
  {
    path: '/analytics',
    element: <Analytics />,
    errorElement: <ErrorFallback />
  },
  {
    path: '/themes',
    element: <Themes />,
    errorElement: <ErrorFallback />
  },
  {
    path: '/audio',
    element: <Audio />,
    errorElement: <ErrorFallback />
  },
  {
    path: '/offline',
    element: <Offline />,
    errorElement: <ErrorFallback />
  },
  {
    path: '/share',
    element: <Share />,
    errorElement: <ErrorFallback />
  },
  {
    path: '/parallel',
    element: <ParallelView />,
    errorElement: <ErrorFallback />
  },
  {
    path: '/languages',
    element: <OriginalLanguages />,
    errorElement: <ErrorFallback />
  },
  {
    path: '/maps',
    element: <Maps />,
    errorElement: <ErrorFallback />
  },
  {
    path: '/timeline',
    element: <Timeline />,
    errorElement: <ErrorFallback />
  },
  {
    path: '/characters',
    element: <Characters />,
    errorElement: <ErrorFallback />
  },
  {
    path: '/enhanced',
    element: <Enhanced />,
    errorElement: <ErrorFallback />
  }
]);

export const AppRouter: React.FC = () => {
  return (
    <ThemeProvider>
      <RouterProvider router={router} fallbackElement={<ErrorFallback />} />
    </ThemeProvider>
  );
};