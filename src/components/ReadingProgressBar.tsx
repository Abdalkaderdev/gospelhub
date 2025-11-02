import { motion } from 'framer-motion';

interface ReadingProgressBarProps {
  progress: number;
  estimatedTime: number;
  wordsRead: number;
  totalWords: number;
  currentTheme: any;
}

export const ReadingProgressBar = ({ 
  progress, 
  estimatedTime, 
  wordsRead, 
  totalWords, 
  currentTheme 
}: ReadingProgressBarProps) => {
  return (
    <motion.div
      className="sticky top-0 z-40 backdrop-blur-sm border-b"
      style={{
        backgroundColor: currentTheme.colors.surface + 'E6',
        borderColor: currentTheme.colors.border
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative h-1">
        <motion.div
          className="absolute top-0 left-0 h-full"
          style={{ backgroundColor: currentTheme.colors.primary }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>
      
      <div className="px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <span style={{ color: currentTheme.colors.textSecondary }}>
            {Math.round(progress)}% complete
          </span>
          <span style={{ color: currentTheme.colors.textSecondary }}>
            {wordsRead.toLocaleString()} / {totalWords.toLocaleString()} words
          </span>
        </div>
        
        {estimatedTime > 0 && (
          <span style={{ color: currentTheme.colors.textSecondary }}>
            {estimatedTime} min remaining
          </span>
        )}
      </div>
    </motion.div>
  );
};