import React from 'react';
import { BibleEnhanced } from '../components/BibleEnhanced';
import { ThemeProvider } from '../contexts/ThemeContext';

export const Enhanced: React.FC = () => {
  return (
    <ThemeProvider>
      <BibleEnhanced />
    </ThemeProvider>
  );
};