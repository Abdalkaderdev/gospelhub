import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import { Enhanced } from './pages/Enhanced';

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
  return <RouterProvider router={router} />;
};