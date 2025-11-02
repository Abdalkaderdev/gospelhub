import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CrossReference } from '../../types';
import { studyService } from '../../study';

interface CrossReferencesProps {
  book: string;
  chapter: number;
  verse: number;
  onReferenceClick: (book: string, chapter: number, verse: number) => void;
}

export const CrossReferences = ({ book, chapter, verse, onReferenceClick }: CrossReferencesProps) => {
  const [references, setReferences] = useState<CrossReference[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadReferences = async () => {
      setLoading(true);
      try {
        const result = await studyService.getCrossReferences(book, chapter, verse);
        setReferences(result);
      } catch (error) {
        console.error('Failed to load cross-references:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadReferences();
  }, [book, chapter, verse]);

  const getRelationshipColor = (relationship: string) => {
    switch (relationship) {
      case 'parallel': return 'bg-blue-100 text-blue-800';
      case 'prophecy': return 'bg-purple-100 text-purple-800';
      case 'fulfillment': return 'bg-green-100 text-green-800';
      case 'theme': return 'bg-amber-100 text-amber-800';
      case 'quote': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRelationshipIcon = (relationship: string) => {
    switch (relationship) {
      case 'parallel': return '⚖️';
      case 'prophecy': return '🔮';
      case 'fulfillment': return '✅';
      case 'theme': return '🎯';
      case 'quote': return '💬';
      default: return '🔗';
    }
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
      <h3 className="text-lg font-medium text-[var(--color-text)]">Cross References</h3>
      
      {references.length === 0 ? (
        <p className="text-[var(--color-text-secondary)] text-sm">No cross-references found</p>
      ) : (
        <div className="space-y-3">
          {references.map((ref, index) => (
            <motion.div
              key={`${ref.to.book}-${ref.to.chapter}-${ref.to.verse}`}
              className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl hover:shadow-md transition-shadow cursor-pointer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onReferenceClick(ref.to.book, ref.to.chapter, ref.to.verse!)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-[var(--color-primary)]">
                      {ref.to.book} {ref.to.chapter}:{ref.to.verse}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRelationshipColor(ref.relationship)}`}>
                      {getRelationshipIcon(ref.relationship)} {ref.relationship}
                    </span>
                  </div>
                  
                  {/* Strength indicator */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--color-text-secondary)]">Relevance:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(level => (
                        <div
                          key={level}
                          className={`w-2 h-2 rounded-full ${
                            level <= ref.strength * 5
                              ? 'bg-[var(--color-primary)]'
                              : 'bg-[var(--color-border)]'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-[var(--color-text-secondary)]">
                      {Math.round(ref.strength * 100)}%
                    </span>
                  </div>
                </div>
                
                <svg className="w-5 h-5 text-[var(--color-text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};