import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Trash2, Wifi, Database, BookOpen, Highlight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { usePWA } from '../hooks/usePWA';
import { offlineSyncManager } from '../utils/offlineSync';

interface OfflineManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OfflineManager: React.FC<OfflineManagerProps> = ({ isOpen, onClose }) => {
  const { currentTheme } = useTheme();
  const { cacheSize, updateCacheSize, isOnline } = usePWA();
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [highlights, setHighlights] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'cache' | 'bookmarks' | 'highlights'>('cache');

  useEffect(() => {
    if (isOpen) {
      loadOfflineData();
      updateCacheSize();
    }
  }, [isOpen, updateCacheSize]);

  const loadOfflineData = async () => {
    try {
      const [bookmarkData, highlightData] = await Promise.all([
        offlineSyncManager.getBookmarks(),
        offlineSyncManager.getHighlights()
      ]);
      setBookmarks(bookmarkData);
      setHighlights(highlightData);
    } catch (error) {
      console.error('Failed to load offline data:', error);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const clearCache = async () => {
    try {
      await offlineSyncManager.clearCache();
      updateCacheSize();
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  };

  const removeBookmark = async (id: string) => {
    try {
      await offlineSyncManager.removeBookmark(id);
      setBookmarks(prev => prev.filter(b => b.id !== id));
    } catch (error) {
      console.error('Failed to remove bookmark:', error);
    }
  };

  const removeHighlight = async (id: string) => {
    try {
      await offlineSyncManager.removeHighlight(id);
      setHighlights(prev => prev.filter(h => h.id !== id));
    } catch (error) {
      console.error('Failed to remove highlight:', error);
    }
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
            className="w-full max-w-2xl max-h-[80vh] rounded-2xl shadow-2xl overflow-hidden"
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
                  Offline Manager
                </h2>
                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                    isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    <Wifi className="w-3 h-3" />
                    {isOnline ? 'Online' : 'Offline'}
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:opacity-70 transition-opacity"
                    style={{ color: currentTheme.colors.textSecondary }}
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              {/* Tabs */}
              <div className="flex rounded-lg p-1" style={{ backgroundColor: currentTheme.colors.background }}>
                {[
                  { key: 'cache' as const, label: 'Cache', icon: Database },
                  { key: 'bookmarks' as const, label: 'Bookmarks', icon: BookOpen },
                  { key: 'highlights' as const, label: 'Highlights', icon: Highlight }
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                      activeTab === key ? 'shadow-sm' : ''
                    }`}
                    style={{
                      backgroundColor: activeTab === key ? currentTheme.colors.primary : 'transparent',
                      color: activeTab === key ? '#ffffff' : currentTheme.colors.textSecondary
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-96 overflow-y-auto">
              <AnimatePresence mode="wait">
                {activeTab === 'cache' && (
                  <motion.div
                    key="cache"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    <div className="text-center p-6 rounded-xl" style={{ backgroundColor: currentTheme.colors.background }}>
                      <Database className="w-12 h-12 mx-auto mb-3" style={{ color: currentTheme.colors.primary }} />
                      <h3 className="text-lg font-semibold mb-2" style={{ color: currentTheme.colors.text }}>
                        Cache Storage
                      </h3>
                      <p className="text-2xl font-bold mb-1" style={{ color: currentTheme.colors.primary }}>
                        {formatBytes(cacheSize)}
                      </p>
                      <p className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                        Cached for offline reading
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={updateCacheSize}
                        className="flex items-center justify-center gap-2 p-3 rounded-lg border transition-all hover:opacity-80"
                        style={{
                          borderColor: currentTheme.colors.border,
                          backgroundColor: currentTheme.colors.surface,
                          color: currentTheme.colors.text
                        }}
                      >
                        <Download className="w-4 h-4" />
                        Refresh
                      </button>
                      <button
                        onClick={clearCache}
                        className="flex items-center justify-center gap-2 p-3 rounded-lg border transition-all hover:opacity-80"
                        style={{
                          borderColor: currentTheme.colors.error,
                          backgroundColor: currentTheme.colors.error + '10',
                          color: currentTheme.colors.error
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                        Clear Cache
                      </button>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'bookmarks' && (
                  <motion.div
                    key="bookmarks"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    {bookmarks.length === 0 ? (
                      <div className="text-center py-8">
                        <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" style={{ color: currentTheme.colors.textSecondary }} />
                        <p style={{ color: currentTheme.colors.textSecondary }}>No bookmarks saved</p>
                      </div>
                    ) : (
                      bookmarks.map((bookmark) => (
                        <div
                          key={bookmark.id}
                          className="flex items-center justify-between p-3 rounded-lg border"
                          style={{
                            borderColor: currentTheme.colors.border,
                            backgroundColor: currentTheme.colors.background
                          }}
                        >
                          <div>
                            <p className="font-medium" style={{ color: currentTheme.colors.text }}>
                              {bookmark.book} {bookmark.chapter}
                              {bookmark.verse && `:${bookmark.verse}`}
                            </p>
                            {bookmark.note && (
                              <p className="text-sm mt-1" style={{ color: currentTheme.colors.textSecondary }}>
                                {bookmark.note}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => removeBookmark(bookmark.id)}
                            className="p-2 rounded-lg hover:opacity-70 transition-opacity"
                            style={{ color: currentTheme.colors.error }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </motion.div>
                )}

                {activeTab === 'highlights' && (
                  <motion.div
                    key="highlights"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    {highlights.length === 0 ? (
                      <div className="text-center py-8">
                        <Highlight className="w-12 h-12 mx-auto mb-3 opacity-50" style={{ color: currentTheme.colors.textSecondary }} />
                        <p style={{ color: currentTheme.colors.textSecondary }}>No highlights saved</p>
                      </div>
                    ) : (
                      highlights.map((highlight) => (
                        <div
                          key={highlight.id}
                          className="flex items-start justify-between p-3 rounded-lg border"
                          style={{
                            borderColor: currentTheme.colors.border,
                            backgroundColor: currentTheme.colors.background
                          }}
                        >
                          <div className="flex-1">
                            <p className="font-medium mb-1" style={{ color: currentTheme.colors.text }}>
                              {highlight.book} {highlight.chapter}:{highlight.verse}
                            </p>
                            <p 
                              className="text-sm p-2 rounded border-l-4"
                              style={{ 
                                backgroundColor: highlight.color + '20',
                                borderLeftColor: highlight.color,
                                color: currentTheme.colors.text
                              }}
                            >
                              {highlight.text}
                            </p>
                          </div>
                          <button
                            onClick={() => removeHighlight(highlight.id)}
                            className="p-2 rounded-lg hover:opacity-70 transition-opacity ml-2"
                            style={{ color: currentTheme.colors.error }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
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