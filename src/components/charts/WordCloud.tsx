import { motion } from 'framer-motion';
import { WordFrequency } from '../../types';

interface WordCloudProps {
  words: WordFrequency[];
  maxWords?: number;
}

export const WordCloud = ({ words, maxWords = 20 }: WordCloudProps) => {
  const displayWords = words.slice(0, maxWords);
  const maxCount = Math.max(...displayWords.map(w => w.count));

  const getFontSize = (count: number) => {
    const minSize = 12;
    const maxSize = 32;
    return minSize + ((count / maxCount) * (maxSize - minSize));
  };

  const getOpacity = (count: number) => {
    return 0.6 + ((count / maxCount) * 0.4);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-[var(--color-text)]">Word Frequency</h3>
      
      <div className="flex flex-wrap gap-2 p-4 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)]">
        {displayWords.map((word, index) => (
          <motion.span
            key={word.word}
            className="inline-block px-2 py-1 rounded-lg bg-[var(--color-primary)] text-white cursor-pointer hover:scale-105 transition-transform"
            style={{
              fontSize: `${getFontSize(word.count)}px`,
              opacity: getOpacity(word.count)
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: getOpacity(word.count), scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            title={`${word.word}: ${word.count} occurrences`}
          >
            {word.word}
          </motion.span>
        ))}
      </div>
    </div>
  );
};