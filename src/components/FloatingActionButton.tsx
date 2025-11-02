import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface FloatingActionButtonProps {
  onNavigateNext: () => void;
  onNavigatePrev: () => void;
  onToggleStudyTools: () => void;
  onShowAnalytics: () => void;
}

export const FloatingActionButton = ({ 
  onNavigateNext, 
  onNavigatePrev, 
  onToggleStudyTools, 
  onShowAnalytics 
}: FloatingActionButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const fabVariants = {
    closed: { rotate: 0 },
    open: { rotate: 45 }
  };

  const menuVariants = {
    closed: { opacity: 0, scale: 0 },
    open: { opacity: 1, scale: 1 }
  };

  const actions = [
    { icon: '←', label: 'Previous Chapter', action: onNavigatePrev },
    { icon: '→', label: 'Next Chapter', action: onNavigateNext },
    { icon: '📚', label: 'Study Tools', action: onToggleStudyTools },
    { icon: '📊', label: 'Analytics', action: onShowAnalytics }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-16 right-0 space-y-3"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            transition={{ duration: 0.2 }}
          >
            {actions.map((action, index) => (
              <motion.button
                key={action.label}
                className="flex items-center justify-center w-12 h-12 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full shadow-lg hover:shadow-xl transition-shadow"
                style={{ color: 'var(--color-text)' }}
                onClick={() => {
                  action.action();
                  setIsOpen(false);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: index * 0.05 }}
                title={action.label}
              >
                {action.icon}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className="flex items-center justify-center w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
        onClick={() => setIsOpen(!isOpen)}
        variants={fabVariants}
        animate={isOpen ? 'open' : 'closed'}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.2 }}
      >
        +
      </motion.button>
    </div>
  );
};