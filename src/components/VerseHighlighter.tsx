import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

interface Highlight {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  color: string;
  timestamp: number;
}

interface ContextMenuProps {
  x: number;
  y: number;
  onHighlight: (color: string) => void;
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onHighlight, onClose }) => {
  const { currentTheme } = useTheme();
  const colors = [
    { name: 'Yellow', value: '#fef3c7', border: '#f59e0b' },
    { name: 'Green', value: '#d1fae5', border: '#10b981' },
    { name: 'Blue', value: '#dbeafe', border: '#3b82f6' },
    { name: 'Pink', value: '#fce7f3', border: '#ec4899' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed z-50 rounded-lg shadow-lg border p-2"
      style={{
        left: x,
        top: y,
        backgroundColor: currentTheme.colors.surface,
        borderColor: currentTheme.colors.border
      }}
    >
      <div className="space-y-1">
        {colors.map(color => (
          <button
            key={color.name}
            onClick={() => onHighlight(color.value)}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded hover:opacity-80 transition-opacity"
            style={{ backgroundColor: color.value, border: `1px solid ${color.border}` }}
          >
            <div className="w-3 h-3 rounded" style={{ backgroundColor: color.border }} />
            {color.name}
          </button>
        ))}
        <button
          onClick={onClose}
          className="w-full px-3 py-2 text-sm rounded hover:opacity-80 transition-opacity"
          style={{ color: currentTheme.colors.textSecondary }}
        >
          Cancel
        </button>
      </div>
    </motion.div>
  );
};

interface VerseHighlighterProps {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  children: React.ReactNode;
}

export const VerseHighlighter: React.FC<VerseHighlighterProps> = ({
  book, chapter, verse, text, children
}) => {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const verseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('verse-highlights');
    if (stored) {
      setHighlights(JSON.parse(stored));
    }
  }, []);

  const currentHighlight = highlights.find(h => 
    h.book === book && h.chapter === chapter && h.verse === verse
  );

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleHighlight = (color: string) => {
    const newHighlight: Highlight = {
      id: `${book}-${chapter}-${verse}`,
      book, chapter, verse, text, color,
      timestamp: Date.now()
    };

    const updated = highlights.filter(h => h.id !== newHighlight.id);
    updated.push(newHighlight);
    
    setHighlights(updated);
    localStorage.setItem('verse-highlights', JSON.stringify(updated));
    setContextMenu(null);
  };

  const handleRemoveHighlight = () => {
    const updated = highlights.filter(h => h.id !== `${book}-${chapter}-${verse}`);
    setHighlights(updated);
    localStorage.setItem('verse-highlights', JSON.stringify(updated));
  };

  return (
    <>
      <motion.div
        ref={verseRef}
        onContextMenu={handleContextMenu}
        className="cursor-pointer transition-all duration-300"
        style={{
          backgroundColor: currentHighlight?.color,
          borderRadius: currentHighlight ? '4px' : '0px',
          padding: currentHighlight ? '2px 4px' : '0px'
        }}
        whileHover={currentHighlight ? { scale: 1.02 } : {}}
        onDoubleClick={currentHighlight ? handleRemoveHighlight : undefined}
      >
        {children}
      </motion.div>

      <AnimatePresence>
        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onHighlight={handleHighlight}
            onClose={() => setContextMenu(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

interface HighlightsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HighlightsPanel: React.FC<HighlightsPanelProps> = ({ isOpen, onClose }) => {
  const { currentTheme } = useTheme();
  const [highlights, setHighlights] = useState<Highlight[]>([]);

  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem('verse-highlights');
      if (stored) {
        setHighlights(JSON.parse(stored).sort((a: Highlight, b: Highlight) => b.timestamp - a.timestamp));
      }
    }
  }, [isOpen]);

  const removeHighlight = (id: string) => {
    const updated = highlights.filter(h => h.id !== id);
    setHighlights(updated);
    localStorage.setItem('verse-highlights', JSON.stringify(updated));
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
        className="w-full max-w-2xl max-h-[80vh] rounded-2xl shadow-2xl overflow-hidden"
        style={{
          backgroundColor: currentTheme.colors.surface,
          border: `1px solid ${currentTheme.colors.border}`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b" style={{ borderColor: currentTheme.colors.border }}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold" style={{ color: currentTheme.colors.text }}>
              Highlighted Verses ({highlights.length})
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:opacity-70 transition-opacity"
              style={{ color: currentTheme.colors.textSecondary }}
            >
              ✕
            </button>
          </div>
        </div>
        
        <div className="p-6 max-h-96 overflow-y-auto">
          {highlights.length === 0 ? (
            <p style={{ color: currentTheme.colors.textSecondary }}>
              No highlighted verses yet. Right-click on any verse to highlight it.
            </p>
          ) : (
            <div className="space-y-4">
              {highlights.map(highlight => (
                <motion.div
                  key={highlight.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg border"
                  style={{
                    backgroundColor: highlight.color,
                    borderColor: currentTheme.colors.border
                  }}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="font-medium mb-2" style={{ color: currentTheme.colors.text }}>
                        {highlight.book} {highlight.chapter}:{highlight.verse}
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: currentTheme.colors.text }}>
                        {highlight.text}
                      </p>
                    </div>
                    <button
                      onClick={() => removeHighlight(highlight.id)}
                      className="p-1 rounded hover:opacity-70 transition-opacity"
                      style={{ color: currentTheme.colors.textSecondary }}
                    >
                      ✕
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};