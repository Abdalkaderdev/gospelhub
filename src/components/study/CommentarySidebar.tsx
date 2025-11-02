import React, { memo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, BookOpen, User, Calendar } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface Commentary {
  id: string;
  author: string;
  title: string;
  date: string;
  text: string;
  verse: string;
}

interface CommentarySidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  commentaries: Commentary[];
  currentVerse: string;
  position?: 'left' | 'right';
}

const CommentaryCard = memo<{ commentary: Commentary; isExpanded: boolean; onToggle: () => void }>(
  ({ commentary, isExpanded, onToggle }) => {
    const { currentTheme } = useTheme();

    return (
      <motion.div
        className="border rounded-lg overflow-hidden"
        style={{
          borderColor: currentTheme.colors.border,
          backgroundColor: currentTheme.colors.surface
        }}
        layout
      >
        <div
          className="p-4 cursor-pointer hover:opacity-90 transition-opacity"
          onClick={onToggle}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" style={{ color: currentTheme.colors.primary }} />
              <h4 className="font-semibold text-sm" style={{ color: currentTheme.colors.text }}>
                {commentary.author}
              </h4>
            </div>
            <span className="text-xs" style={{ color: currentTheme.colors.textSecondary }}>
              {commentary.verse}
            </span>
          </div>
          
          <p className="text-xs mb-2" style={{ color: currentTheme.colors.textSecondary }}>
            {commentary.title}
          </p>
          
          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3" style={{ color: currentTheme.colors.textSecondary }} />
            <span className="text-xs" style={{ color: currentTheme.colors.textSecondary }}>
              {commentary.date}
            </span>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="border-t"
              style={{ borderColor: currentTheme.colors.border }}
            >
              <div className="p-4">
                <p 
                  className="text-sm leading-relaxed"
                  style={{ color: currentTheme.colors.text }}
                >
                  {commentary.text}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }
);

CommentaryCard.displayName = 'CommentaryCard';

export const CommentarySidebar = memo<CommentarySidebarProps>(({
  isOpen,
  onToggle,
  commentaries,
  currentVerse,
  position = 'right'
}) => {
  const { currentTheme } = useTheme();
  const [expandedCommentary, setExpandedCommentary] = useState<string | null>(null);

  const handleCommentaryToggle = useCallback((id: string) => {
    setExpandedCommentary(prev => prev === id ? null : id);
  }, []);

  const sidebarVariants = {
    closed: {
      x: position === 'right' ? '100%' : '-100%',
      opacity: 0
    },
    open: {
      x: 0,
      opacity: 1
    }
  };

  const toggleButtonVariants = {
    closed: {
      x: position === 'right' ? -40 : 40,
      rotate: position === 'right' ? 0 : 180
    },
    open: {
      x: position === 'right' ? -320 : 320,
      rotate: position === 'right' ? 180 : 0
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        className="fixed top-1/2 z-40 p-3 rounded-l-lg shadow-lg"
        style={{
          backgroundColor: currentTheme.colors.primary,
          [position]: 0,
          transform: 'translateY(-50%)'
        }}
        variants={toggleButtonVariants}
        animate={isOpen ? 'open' : 'closed'}
        onClick={onToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {position === 'right' ? (
          <ChevronLeft className="w-5 h-5 text-white" />
        ) : (
          <ChevronRight className="w-5 h-5 text-white" />
        )}
      </motion.button>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-30"
              onClick={onToggle}
            />

            {/* Sidebar Content */}
            <motion.div
              className="fixed top-0 bottom-0 w-80 z-40 shadow-2xl overflow-hidden"
              style={{
                backgroundColor: currentTheme.colors.background,
                [position]: 0
              }}
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              {/* Header */}
              <div 
                className="p-4 border-b"
                style={{ borderColor: currentTheme.colors.border }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="w-5 h-5" style={{ color: currentTheme.colors.primary }} />
                  <h3 className="font-semibold" style={{ color: currentTheme.colors.text }}>
                    Commentary
                  </h3>
                </div>
                <p className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                  {currentVerse}
                </p>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {commentaries.length > 0 ? (
                    commentaries.map((commentary) => (
                      <CommentaryCard
                        key={commentary.id}
                        commentary={commentary}
                        isExpanded={expandedCommentary === commentary.id}
                        onToggle={() => handleCommentaryToggle(commentary.id)}
                      />
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-8"
                    >
                      <BookOpen 
                        className="w-12 h-12 mx-auto mb-3 opacity-50" 
                        style={{ color: currentTheme.colors.textSecondary }} 
                      />
                      <p style={{ color: currentTheme.colors.textSecondary }}>
                        No commentaries available for this verse
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div 
                className="p-4 border-t"
                style={{ borderColor: currentTheme.colors.border }}
              >
                <button
                  className="w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: currentTheme.colors.primary + '20',
                    color: currentTheme.colors.primary
                  }}
                >
                  Load More Commentaries
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
});

CommentarySidebar.displayName = 'CommentarySidebar';