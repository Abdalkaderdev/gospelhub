import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Theme, ThemeColors, ThemePreset } from '../types';
import { themeManager, presetThemes, seasonalThemes } from '../themes';

interface ThemeBuilderProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeBuilder = ({ isOpen, onClose }: ThemeBuilderProps) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'custom' | 'seasonal'>('presets');
  const [customColors, setCustomColors] = useState<ThemeColors>({
    primary: '#d97706',
    secondary: '#92400e',
    accent: '#f59e0b',
    background: '#fafaf9',
    surface: '#ffffff',
    text: '#1c1917',
    textSecondary: '#78716c',
    border: '#e7e5e4'
  });
  const [customName, setCustomName] = useState('My Custom Theme');

  const handlePresetSelect = useCallback((preset: ThemePreset) => {
    themeManager.setPresetTheme(preset);
  }, []);

  const handleSeasonalSelect = useCallback((season: keyof typeof seasonalThemes) => {
    themeManager.setTheme(seasonalThemes[season]);
  }, []);

  const handleCustomColorChange = useCallback((key: keyof ThemeColors, value: string) => {
    setCustomColors(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleCustomThemeApply = useCallback(() => {
    const customTheme = themeManager.createCustomTheme(customName, customColors);
    themeManager.setTheme(customTheme);
  }, [customName, customColors]);

  const enableSeasonalAuto = useCallback(() => {
    localStorage.setItem('bible-reader-auto-seasonal', 'true');
    themeManager.setTheme(themeManager.getSeasonalTheme());
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-2xl bg-[var(--color-surface)] rounded-2xl shadow-2xl border border-[var(--color-border)] overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[var(--color-border)]">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-light text-[var(--color-text)]">Theme Builder</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-[var(--color-border)] transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="flex space-x-1 mt-4">
                {(['presets', 'custom', 'seasonal'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 max-h-96 overflow-y-auto">
              {activeTab === 'presets' && (
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(presetThemes).map(([key, theme]) => (
                    <motion.button
                      key={key}
                      onClick={() => handlePresetSelect(key as ThemePreset)}
                      className="p-4 rounded-xl border-2 border-transparent hover:border-[var(--color-primary)] transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex space-x-1">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: theme.colors.primary }}
                          />
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: theme.colors.secondary }}
                          />
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: theme.colors.accent }}
                          />
                        </div>
                        <span className="font-medium text-[var(--color-text)]">{theme.name}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}

              {activeTab === 'seasonal' && (
                <div className="space-y-4">
                  <button
                    onClick={enableSeasonalAuto}
                    className="w-full p-4 rounded-xl bg-[var(--color-primary)] text-white font-medium hover:opacity-90 transition-opacity"
                  >
                    Enable Automatic Seasonal Themes
                  </button>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(seasonalThemes).map(([key, theme]) => (
                      <motion.button
                        key={key}
                        onClick={() => handleSeasonalSelect(key as keyof typeof seasonalThemes)}
                        className="p-4 rounded-xl border-2 border-transparent hover:border-[var(--color-primary)] transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex space-x-1">
                            <div 
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: theme.colors.primary }}
                            />
                            <div 
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: theme.colors.secondary }}
                            />
                            <div 
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: theme.colors.accent }}
                            />
                          </div>
                          <span className="font-medium text-[var(--color-text)]">{theme.name}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'custom' && (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Theme Name"
                    className="w-full p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)]"
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(customColors).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <label className="block text-sm font-medium text-[var(--color-text)] capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={value}
                            onChange={(e) => handleCustomColorChange(key as keyof ThemeColors, e.target.value)}
                            className="w-12 h-10 rounded border border-[var(--color-border)]"
                          />
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => handleCustomColorChange(key as keyof ThemeColors, e.target.value)}
                            className="flex-1 p-2 rounded border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] text-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={handleCustomThemeApply}
                    className="w-full p-3 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:opacity-90 transition-opacity"
                  >
                    Apply Custom Theme
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};