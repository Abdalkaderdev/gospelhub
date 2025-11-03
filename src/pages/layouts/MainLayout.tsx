import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { ErrorBoundary } from '../../components/ErrorBoundary';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, title = "Gospel Hub" }) => {
  const { currentTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/bible', label: 'Bible', icon: '📖' },
    { path: '/search', label: 'Search', icon: '🔍' },
    { path: '/study', label: 'Study', icon: '📚' },
    { path: '/bookmarks', label: 'Bookmarks', icon: '🔖' },
    { path: '/notes', label: 'Notes', icon: '📝' },
    { path: '/analytics', label: 'Analytics', icon: '📊' },
    { path: '/settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <ErrorBoundary>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-xl font-bold text-amber-600">
              Gospel Hub
            </Link>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-4">
              {menuItems.slice(0, 6).map(item => (
                <Link 
                  key={item.path}
                  to={item.path}
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-amber-600 hover:bg-gray-50 rounded-md"
                >
                  {item.icon} {item.label}
                </Link>
              ))}
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              ☰
            </button>
          </div>
          
          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-2 border-t">
              {menuItems.map(item => (
                <Link 
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  {item.icon} {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>
      
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