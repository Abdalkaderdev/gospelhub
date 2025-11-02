import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { bookIntroductions, BookIntroduction as BookIntroType } from '../../data/bookIntroductions';
import { characters } from '../../data/crossReferences';

interface BookIntroductionProps {
  book: string;
  isOpen: boolean;
  onClose: () => void;
}

export const BookIntroduction = ({ book, isOpen, onClose }: BookIntroductionProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'outline' | 'timeline' | 'characters'>('overview');
  const introduction = bookIntroductions[book] || {
    author: 'Unknown',
    dateWritten: 'Unknown',
    audience: 'Unknown',
    purpose: 'No introduction available for this book.',
    keyThemes: [],
    outline: [],
    timeline: []
  };

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
            className="w-full max-w-4xl max-h-[90vh] bg-[var(--color-surface)] rounded-2xl shadow-2xl border border-[var(--color-border)] overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[var(--color-border)]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-light text-[var(--color-text)]">📖 Book of {book}</h2>
                  <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                    {introduction.author} • {introduction.dateWritten}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-[var(--color-border)] transition-colors text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                >
                  ✕
                </button>
              </div>
              
              <div className="flex space-x-1 mt-4">
                {([
                  { id: 'overview', label: 'Overview', icon: '📜' },
                  { id: 'outline', label: 'Outline', icon: '🗺️' },
                  { id: 'timeline', label: 'Timeline', icon: '📅' },
                  { id: 'characters', label: 'Characters', icon: '👥' }
                ] as const).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {activeTab === 'overview' && (
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-[var(--color-text)] mb-2">Author</h3>
                        <p className="text-[var(--color-text-secondary)]">{introduction.author}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-[var(--color-text)] mb-2">Date Written</h3>
                        <p className="text-[var(--color-text-secondary)]">{introduction.dateWritten}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-[var(--color-text)] mb-2">Audience</h3>
                        <p className="text-[var(--color-text-secondary)]">{introduction.audience}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-[var(--color-text)] mb-2">Purpose</h3>
                        <p className="text-[var(--color-text-secondary)]">{introduction.purpose}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-[var(--color-text)] mb-2">Key Themes</h3>
                        <div className="flex flex-wrap gap-2">
                          {introduction.keyThemes.map((theme, index) => (
                            <motion.span
                              key={theme}
                              className="px-3 py-1 bg-[var(--color-primary)] text-white rounded-full text-sm"
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              {theme}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'outline' && (
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-lg font-semibold text-[var(--color-text)]">Book Outline</h3>
                  {introduction.outline.map((section, index) => (
                    <motion.div
                      key={index}
                      className="p-4 bg-[var(--color-background)] rounded-xl border-l-4 border-[var(--color-primary)]"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <h4 className="font-medium text-[var(--color-text)]">{section.title}</h4>
                      <p className="text-sm text-[var(--color-text-secondary)] mt-1">{section.chapters}</p>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'timeline' && (
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-lg font-semibold text-[var(--color-text)]">Historical Timeline</h3>
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[var(--color-border)]"></div>
                    {introduction.timeline.map((event, index) => (
                      <motion.div
                        key={index}
                        className="relative flex items-start gap-4 pb-6"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 }}
                      >
                        <div className="w-8 h-8 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-white text-sm font-bold z-10">
                          {index + 1}
                        </div>
                        <div className="flex-1 pt-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-[var(--color-text)]">{event.event}</h4>
                            <span className="text-xs bg-[var(--color-background)] px-2 py-1 rounded text-[var(--color-text-secondary)]">
                              {event.date}
                            </span>
                          </div>
                          {event.reference && (
                            <p className="text-sm text-[var(--color-primary)]">{event.reference}</p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'characters' && (
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-lg font-semibold text-[var(--color-text)]">Key Characters</h3>
                  {characters[book] && characters[book].length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {characters[book].map((character, index) => (
                        <motion.div
                          key={character.name}
                          className="p-4 bg-[var(--color-background)] rounded-xl border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-[var(--color-text)]">👤 {character.name}</h4>
                            <span className="text-xs px-2 py-1 rounded-full bg-[var(--color-primary)] text-white">
                              {character.role}
                            </span>
                          </div>
                          {character.description && (
                            <p className="text-sm text-[var(--color-text-secondary)]">{character.description}</p>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">👥</div>
                      <p className="text-[var(--color-text-secondary)]">No character information available for {book}</p>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};