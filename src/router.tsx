import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import { Enhanced } from './pages/Enhanced';
import { ThemeProvider } from './contexts/ThemeContext';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/enhanced',
    element: <Enhanced />
  }
]);

export const AppRouter: React.FC = () => {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};