import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Monitor, Wifi, WifiOff } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';
import { useTheme } from '../contexts/ThemeContext';

export const InstallPrompt: React.FC = () => {
  const { isInstallable, isOnline, showInstallPrompt, dismissInstallPrompt } = usePWA();
  const { currentTheme } = useTheme();

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      {/* Install Prompt */}
      <AnimatePresence>
        {isInstallable && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto"
          >
            <div
              className="rounded-2xl p-4 shadow-2xl border backdrop-blur-sm"
              style={{
                backgroundColor: currentTheme.colors.surface + 'F0',
                borderColor: currentTheme.colors.border
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: currentTheme.colors.primary + '20' }}
                >
                  <Download 
                    className="w-5 h-5" 
                    style={{ color: currentTheme.colors.primary }} 
                  />
                </div>
                
                <div className="flex-1">
                  <h3 
                    className="font-semibold text-sm mb-1"
                    style={{ color: currentTheme.colors.text }}
                  >
                    Install GospelHub
                  </h3>
                  <p 
                    className="text-xs mb-3"
                    style={{ color: currentTheme.colors.textSecondary }}
                  >
                    Get the full experience with offline reading and faster access
                  </p>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1 text-xs">
                      <Smartphone className="w-3 h-3" />
                      <span style={{ color: currentTheme.colors.textSecondary }}>
                        Works offline
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <Monitor className="w-3 h-3" />
                      <span style={{ color: currentTheme.colors.textSecondary }}>
                        Desktop & mobile
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={showInstallPrompt}
                      className="flex-1 px-3 py-2 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90"
                      style={{ backgroundColor: currentTheme.colors.primary }}
                    >
                      Install App
                    </button>
                    <button
                      onClick={dismissInstallPrompt}
                      className="p-2 rounded-lg transition-all hover:opacity-70"
                      style={{ color: currentTheme.colors.textSecondary }}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offline Indicator */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-4 right-4 z-50 max-w-sm mx-auto"
          >
            <div
              className="rounded-xl p-3 shadow-lg border backdrop-blur-sm"
              style={{
                backgroundColor: currentTheme.colors.warning + '20',
                borderColor: currentTheme.colors.warning + '40'
              }}
            >
              <div className="flex items-center gap-2">
                <WifiOff 
                  className="w-4 h-4" 
                  style={{ color: currentTheme.colors.warning }} 
                />
                <span 
                  className="text-sm font-medium"
                  style={{ color: currentTheme.colors.text }}
                >
                  You're offline
                </span>
                <span 
                  className="text-xs ml-auto"
                  style={{ color: currentTheme.colors.textSecondary }}
                >
                  Cached content available
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};