import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

interface Bookmark {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  note?: string;
  collection: string;
  timestamp: number;
}

interface Collection {
  id: string;
  name: string;
  color: string;
  timestamp: number;
}

interface BookmarkButtonProps {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  book, chapter, verse, text
}) => {
  const { currentTheme } = useTheme();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [note, setNote] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('default');

  useEffect(() => {
    const saved = localStorage.getItem('bible-bookmarks');
    if (saved) {
      setBookmarks(JSON.parse(saved));
    }
  }, []);

  const bookmarkId = `${book}-${chapter}-${verse}`;
  const isBookmarked = bookmarks.some(b => b.id === bookmarkId);

  const handleBookmark = () => {
    if (isBookmarked) {
      const updated = bookmarks.filter(b => b.id !== bookmarkId);
      setBookmarks(updated);
      localStorage.setItem('bible-bookmarks', JSON.stringify(updated));
    } else {
      setShowNoteModal(true);
    }
  };

  const saveBookmark = () => {
    const newBookmark: Bookmark = {
      id: bookmarkId,
      book, chapter, verse, text,
      note: note.trim() || undefined,
      collection: selectedCollection,
      timestamp: Date.now()
    };

    const updated = [...bookmarks, newBookmark];
    setBookmarks(updated);
    localStorage.setItem('bible-bookmarks', JSON.stringify(updated));
    setShowNoteModal(false);
    setNote('');
  };

  return (
    <>
      <motion.button
        onClick={handleBookmark}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="p-2 rounded-full transition-colors"
        style={{
          color: isBookmarked ? currentTheme.colors.primary : currentTheme.colors.textSecondary
        }}
      >
        {isBookmarked ? '🔖' : '📑'}
      </motion.button>

      <AnimatePresence>
        {showNoteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowNoteModal(false)}
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
              <div className="p-6 border-b" style={{ borderColor: currentTheme.colors.border }}>
                <h3 className="text-lg font-semibold" style={{ color: currentTheme.colors.text }}>
                  Bookmark Verse
                </h3>
                <div className="text-sm mt-1" style={{ color: currentTheme.colors.textSecondary }}>
                  {book} {chapter}:{verse}
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: currentTheme.colors.text }}>
                    Personal Note (Optional)
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add your thoughts, insights, or reflections..."
                    className="w-full px-3 py-2 rounded-lg border resize-none"
                    rows={3}
                    style={{
                      backgroundColor: currentTheme.colors.background,
                      borderColor: currentTheme.colors.border,
                      color: currentTheme.colors.text
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: currentTheme.colors.text }}>
                    Collection
                  </label>
                  <select
                    value={selectedCollection}
                    onChange={(e) => setSelectedCollection(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border"
                    style={{
                      backgroundColor: currentTheme.colors.background,
                      borderColor: currentTheme.colors.border,
                      color: currentTheme.colors.text
                    }}
                  >
                    <option value="default">📚 General</option>
                    <option value="favorites">⭐ Favorites</option>
                    <option value="study">📖 Study Notes</option>
                    <option value="prayer">🙏 Prayer</option>
                    <option value="comfort">💙 Comfort</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowNoteModal(false)}
                    className="flex-1 px-4 py-2 rounded-lg border transition-opacity hover:opacity-70"
                    style={{
                      borderColor: currentTheme.colors.border,
                      color: currentTheme.colors.textSecondary
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveBookmark}
                    className="flex-1 px-4 py-2 rounded-lg transition-opacity hover:opacity-90"
                    style={{
                      backgroundColor: currentTheme.colors.primary,
                      color: 'white'
                    }}
                  >
                    Save Bookmark
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

interface BookmarksPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (book: string, chapter: number, verse: number) => void;
}

export const BookmarksPanel: React.FC<BookmarksPanelProps> = ({
  isOpen, onClose, onNavigate
}) => {
  const { currentTheme } = useTheme();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [selectedCollection, setSelectedCollection] = useState('all');
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('bible-bookmarks');
      if (saved) {
        setBookmarks(JSON.parse(saved).sort((a: Bookmark, b: Bookmark) => b.timestamp - a.timestamp));
      }
    }
  }, [isOpen]);

  const collections = [
    { id: 'all', name: '📋 All Bookmarks', color: currentTheme.colors.text },
    { id: 'default', name: '📚 General', color: '#6b7280' },
    { id: 'favorites', name: '⭐ Favorites', color: '#f59e0b' },
    { id: 'study', name: '📖 Study Notes', color: '#3b82f6' },
    { id: 'prayer', name: '🙏 Prayer', color: '#8b5cf6' },
    { id: 'comfort', name: '💙 Comfort', color: '#06b6d4' }
  ];

  const filteredBookmarks = selectedCollection === 'all' 
    ? bookmarks 
    : bookmarks.filter(b => b.collection === selectedCollection);

  const removeBookmark = (id: string) => {
    const updated = bookmarks.filter(b => b.id !== id);
    setBookmarks(updated);
    localStorage.setItem('bible-bookmarks', JSON.stringify(updated));
  };

  const updateNote = (id: string, newNote: string) => {
    const updated = bookmarks.map(b => 
      b.id === id ? { ...b, note: newNote.trim() || undefined } : b
    );
    setBookmarks(updated);
    localStorage.setItem('bible-bookmarks', JSON.stringify(updated));
    setEditingNote(null);
    setNoteText('');
  };

  if (!isOpen) return null;

  return (
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
        className="w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden"
        style={{
          backgroundColor: currentTheme.colors.surface,
          border: `1px solid ${currentTheme.colors.border}`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b" style={{ borderColor: currentTheme.colors.border }}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold" style={{ color: currentTheme.colors.text }}>
              My Bookmarks ({filteredBookmarks.length})
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:opacity-70 transition-opacity"
              style={{ color: currentTheme.colors.textSecondary }}
            >
              ✕
            </button>
          </div>
          
          <div className="flex gap-2 mt-4 overflow-x-auto">
            {collections.map(collection => (
              <button
                key={collection.id}
                onClick={() => setSelectedCollection(collection.id)}
                className="px-3 py-1 text-sm rounded-full border whitespace-nowrap transition-all"
                style={{
                  backgroundColor: selectedCollection === collection.id ? currentTheme.colors.primary : 'transparent',
                  borderColor: currentTheme.colors.border,
                  color: selectedCollection === collection.id ? 'white' : collection.color
                }}
              >
                {collection.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-6 max-h-96 overflow-y-auto">
          {filteredBookmarks.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📑</div>
              <p style={{ color: currentTheme.colors.textSecondary }}>
                No bookmarks yet. Start bookmarking verses to build your collection.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookmarks.map(bookmark => (
                <motion.div
                  key={bookmark.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg border"
                  style={{
                    backgroundColor: currentTheme.colors.background,
                    borderColor: currentTheme.colors.border
                  }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <button
                      onClick={() => onNavigate(bookmark.book, bookmark.chapter, bookmark.verse)}
                      className="font-medium hover:underline"
                      style={{ color: currentTheme.colors.primary }}
                    >
                      {bookmark.book} {bookmark.chapter}:{bookmark.verse}
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-1 rounded" 
                        style={{ 
                          backgroundColor: currentTheme.colors.surface,
                          color: currentTheme.colors.textSecondary
                        }}
                      >
                        {collections.find(c => c.id === bookmark.collection)?.name.split(' ')[0]}
                      </span>
                      <button
                        onClick={() => removeBookmark(bookmark.id)}
                        className="text-xs hover:opacity-70 transition-opacity"
                        style={{ color: currentTheme.colors.textSecondary }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-sm leading-relaxed mb-3" style={{ color: currentTheme.colors.text }}>
                    {bookmark.text}
                  </p>
                  
                  {editingNote === bookmark.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded border resize-none"
                        rows={2}
                        style={{
                          backgroundColor: currentTheme.colors.surface,
                          borderColor: currentTheme.colors.border,
                          color: currentTheme.colors.text
                        }}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateNote(bookmark.id, noteText)}
                          className="px-3 py-1 text-xs rounded"
                          style={{
                            backgroundColor: currentTheme.colors.primary,
                            color: 'white'
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingNote(null);
                            setNoteText('');
                          }}
                          className="px-3 py-1 text-xs rounded border"
                          style={{
                            borderColor: currentTheme.colors.border,
                            color: currentTheme.colors.textSecondary
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {bookmark.note ? (
                        <div 
                          className="text-sm italic p-3 rounded border-l-4 cursor-pointer hover:bg-opacity-50"
                          style={{
                            backgroundColor: currentTheme.colors.surface,
                            borderLeftColor: currentTheme.colors.primary,
                            color: currentTheme.colors.textSecondary
                          }}
                          onClick={() => {
                            setEditingNote(bookmark.id);
                            setNoteText(bookmark.note || '');
                          }}
                        >
                          "{bookmark.note}"
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingNote(bookmark.id);
                            setNoteText('');
                          }}
                          className="text-xs hover:underline"
                          style={{ color: currentTheme.colors.textSecondary }}
                        >
                          + Add note
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};