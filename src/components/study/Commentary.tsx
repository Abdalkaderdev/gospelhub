import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Commentary as CommentaryType } from '../../types';
import { studyService } from '../../study';

interface CommentaryProps {
  book: string;
  chapter: number;
  verse?: number;
}

export const Commentary = ({ book, chapter, verse }: CommentaryProps) => {
  const [commentaries, setCommentaries] = useState<CommentaryType[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCommentary = async () => {
      setLoading(true);
      try {
        const result = await studyService.getCommentary(book, chapter, verse);
        setCommentaries(result);
      } catch (error) {
        console.error('Failed to load commentary:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadCommentary();
  }, [book, chapter, verse]);

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <motion.div
          className="w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-[var(--color-text)]">Commentary</h3>
      
      {commentaries.length === 0 ? (
        <p className="text-[var(--color-text-secondary)] text-sm">No commentary available</p>
      ) : (
        <div className="space-y-3">
          {commentaries.map((commentary, index) => {
            const isExpanded = expandedIds.has(commentary.id);
            
            return (
              <motion.div
                key={commentary.id}
                className="border border-[var(--color-border)] rounded-xl overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  onClick={() => toggleExpanded(commentary.id)}
                  className="w-full p-4 text-left hover:bg-[var(--color-background)] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-[var(--color-text)]">{commentary.author}</h4>
                      <p className="text-sm text-[var(--color-text-secondary)]">{commentary.title}</p>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <svg className="w-5 h-5 text-[var(--color-text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </motion.div>
                  </div>
                </button>
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 pt-0 border-t border-[var(--color-border)]">
                        <p className="text-[var(--color-text)] leading-relaxed">
                          {commentary.content}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};