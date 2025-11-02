import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { Palette, Sun, Moon, Contrast, Calendar, Check } from 'lucide-react';

interface ThemeSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ isOpen, onClose }) => {
  const { 
    currentTheme, 
    setTheme, 
    availableThemes, 
    isSeasonalEnabled, 
    setSeasonalEnabled,
    isHighContrast,
    setHighContrast
  } = useTheme();
  
  const [activeTab, setActiveTab] = useState<'themes' | 'settings'>('themes');

  const regularThemes = availableThemes.filter(t => !t.seasonal && !t.accessibility);
  const seasonalThemes = availableThemes.filter(t => t.seasonal);

  const getThemeIcon = (themeId: string) => {
    switch (themeId) {
      case 'dark': return <Moon className="w-4 h-4" />;
      case 'sepia': return <Sun className="w-4 h-4" />;
      case 'high-contrast': return <Contrast className="w-4 h-4" />;
      default: return <Palette className="w-4 h-4" />;
    }
  };

  const getSeasonIcon = (themeId: string) => {
    const icons = {
      spring: '🌸',
      summer: '☀️',
      autumn: '🍂',
      winter: '❄️'
    };
    return icons[themeId as keyof typeof icons] || '🌟';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
            style={{
              backgroundColor: currentTheme.colors.surface,
              border: `1px solid ${currentTheme.colors.border}`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b" style={{ borderColor: currentTheme.colors.border }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold" style={{ color: currentTheme.colors.text }}>
                  Theme Settings
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:opacity-70 transition-opacity"
                  style={{ color: currentTheme.colors.textSecondary }}
                >
                  ✕
                </button>
              </div>
              
              {/* Tabs */}
              <div className="flex rounded-lg p-1" style={{ backgroundColor: currentTheme.colors.background }}>
                <button
                  onClick={() => setActiveTab('themes')}
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === 'themes' ? 'shadow-sm' : ''
                  }`}
                  style={{
                    backgroundColor: activeTab === 'themes' ? currentTheme.colors.primary : 'transparent',
                    color: activeTab === 'themes' ? '#ffffff' : currentTheme.colors.textSecondary
                  }}
                >
                  Themes
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === 'settings' ? 'shadow-sm' : ''
                  }`}
                  style={{
                    backgroundColor: activeTab === 'settings' ? currentTheme.colors.primary : 'transparent',
                    color: activeTab === 'settings' ? '#ffffff' : currentTheme.colors.textSecondary
                  }}
                >
                  Settings
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-96 overflow-y-auto">
              <AnimatePresence mode="wait">
                {activeTab === 'themes' ? (
                  <motion.div
                    key="themes"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    {/* Regular Themes */}
                    <div>
                      <h3 className="text-sm font-medium mb-3" style={{ color: currentTheme.colors.textSecondary }}>
                        Standard Themes
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {regularThemes.map((theme) => (
                          <motion.button
                            key={theme.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setTheme(theme.id)}
                            className={`p-3 rounded-xl border-2 transition-all ${
                              currentTheme.id === theme.id ? 'ring-2' : ''
                            }`}
                            style={{
                              backgroundColor: theme.colors.surface,
                              borderColor: currentTheme.id === theme.id ? currentTheme.colors.primary : theme.colors.border,
                              ringColor: currentTheme.colors.primary
                            }}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              {getThemeIcon(theme.id)}
                              <span className="text-sm font-medium" style={{ color: theme.colors.text }}>
                                {theme.name}
                              </span>
                              {currentTheme.id === theme.id && (
                                <Check className="w-4 h-4 ml-auto" style={{ color: currentTheme.colors.primary }} />
                              )}
                            </div>
                            <div className="flex gap-1">
                              {Object.entries(theme.colors).slice(0, 4).map(([key, color]) => (
                                <div
                                  key={key}
                                  className="w-4 h-4 rounded-full border"
                                  style={{ backgroundColor: color, borderColor: theme.colors.border }}
                                />
                              ))}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Seasonal Themes */}
                    <div>
                      <h3 className="text-sm font-medium mb-3" style={{ color: currentTheme.colors.textSecondary }}>
                        Seasonal Themes
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {seasonalThemes.map((theme) => (
                          <motion.button
                            key={theme.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setTheme(theme.id)}
                            className={`p-3 rounded-xl border-2 transition-all ${
                              currentTheme.id === theme.id ? 'ring-2' : ''
                            }`}
                            style={{
                              backgroundColor: theme.colors.surface,
                              borderColor: currentTheme.id === theme.id ? currentTheme.colors.primary : theme.colors.border,
                              ringColor: currentTheme.colors.primary
                            }}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-lg">{getSeasonIcon(theme.id)}</span>
                              <span className="text-sm font-medium" style={{ color: theme.colors.text }}>
                                {theme.name}
                              </span>
                              {currentTheme.id === theme.id && (
                                <Check className="w-4 h-4 ml-auto" style={{ color: currentTheme.colors.primary }} />
                              )}
                            </div>
                            <div className="flex gap-1">
                              {Object.entries(theme.colors).slice(0, 4).map(([key, color]) => (
                                <div
                                  key={key}
                                  className="w-4 h-4 rounded-full border"
                                  style={{ backgroundColor: color, borderColor: theme.colors.border }}
                                />
                              ))}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Seasonal Themes Toggle */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5" style={{ color: currentTheme.colors.primary }} />
                        <div>
                          <p className="font-medium" style={{ color: currentTheme.colors.text }}>
                            Seasonal Themes
                          </p>
                          <p className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                            Auto-rotate themes by season
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSeasonalEnabled(!isSeasonalEnabled)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          isSeasonalEnabled ? 'shadow-sm' : ''
                        }`}
                        style={{
                          backgroundColor: isSeasonalEnabled ? currentTheme.colors.primary : currentTheme.colors.border
                        }}
                      >
                        <motion.div
                          animate={{ x: isSeasonalEnabled ? 24 : 2 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                        />
                      </button>
                    </div>

                    {/* High Contrast Toggle */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Contrast className="w-5 h-5" style={{ color: currentTheme.colors.primary }} />
                        <div>
                          <p className="font-medium" style={{ color: currentTheme.colors.text }}>
                            High Contrast
                          </p>
                          <p className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                            Enhanced accessibility mode
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setHighContrast(!isHighContrast)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          isHighContrast ? 'shadow-sm' : ''
                        }`}
                        style={{
                          backgroundColor: isHighContrast ? currentTheme.colors.primary : currentTheme.colors.border
                        }}
                      >
                        <motion.div
                          animate={{ x: isHighContrast ? 24 : 2 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                        />
                      </button>
                    </div>

                    {/* Current Theme Info */}
                    <div className="p-4 rounded-lg" style={{ backgroundColor: currentTheme.colors.background }}>
                      <p className="text-sm font-medium mb-2" style={{ color: currentTheme.colors.text }}>
                        Current Theme: {currentTheme.name}
                      </p>
                      <div className="flex gap-2">
                        {Object.entries(currentTheme.colors).slice(0, 6).map(([key, color]) => (
                          <div
                            key={key}
                            className="w-6 h-6 rounded-full border shadow-sm"
                            style={{ backgroundColor: color, borderColor: currentTheme.colors.border }}
                            title={key}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};