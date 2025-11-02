import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { ErrorBoundary } from '../../components/ErrorBoundary';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, title = "Gospel Hub" }) => {
  const { currentTheme } = useTheme();

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
        aria-label={title}
      >
        {children}
      </main>
    </ErrorBoundary>
  );
};