import { motion } from 'framer-motion';

interface BookProgressProps {
  data: { book: string; chaptersRead: number; totalChapters: number; progress: number }[];
}

export const BookProgress = ({ data }: BookProgressProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-[var(--color-text)]">Book Progress</h3>
      
      <div className="space-y-3" role="list" aria-label="Bible book reading progress">
        {data.slice(0, 8).map((book, index) => (
          <motion.div
            key={book.book}
            className="p-4 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)]"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            role="listitem"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-[var(--color-text)]">{book.book}</h4>
              <span className="text-sm text-[var(--color-text-secondary)]">
                {book.chaptersRead}/{book.totalChapters}
              </span>
            </div>
            
            <div className="relative h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
              <motion.div
                className="absolute left-0 top-0 h-full rounded-full"
                style={{ backgroundColor: 'var(--color-primary)' }}
                initial={{ width: 0 }}
                animate={{ width: `${book.progress}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
                aria-label={`${Math.round(book.progress)}% complete`}
              />
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-[var(--color-text-secondary)]">
                {Math.round(book.progress)}% complete
              </span>
              {book.progress === 100 && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full" aria-label="Completed">
                  ✓ Complete
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};