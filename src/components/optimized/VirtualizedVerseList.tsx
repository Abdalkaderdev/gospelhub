import React, { memo, useMemo, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import { motion } from 'framer-motion';
import { BibleVerse } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';

interface VirtualizedVerseListProps {
  verses: BibleVerse[];
  onVerseClick?: (verse: BibleVerse) => void;
  height: number;
  itemHeight?: number;
}

interface VerseItemProps {
  index: number;
  style: React.CSSProperties;
  data: {
    verses: BibleVerse[];
    onVerseClick?: (verse: BibleVerse) => void;
    theme: any;
  };
}

const VerseItem = memo<VerseItemProps>(({ index, style, data }) => {
  const { verses, onVerseClick, theme } = data;
  const verse = verses[index];

  const handleClick = useCallback(() => {
    onVerseClick?.(verse);
  }, [onVerseClick, verse]);

  return (
    <div style={style}>
      <motion.div
        className="p-3 border-l-3 border-transparent hover:border-l-amber-500 hover:bg-stone-50 cursor-pointer transition-all"
        onClick={handleClick}
        whileHover={{ x: 4 }}
        style={{
          borderLeftColor: 'transparent',
          transition: 'all 0.2s ease'
        }}
      >
        <div className="flex gap-3">
          <span 
            className="text-sm font-semibold min-w-8 inline-block"
            style={{ color: theme.colors.primary }}
          >
            {verse.verse}
          </span>
          <p 
            className="text-base leading-relaxed"
            style={{ color: theme.colors.text }}
          >
            {verse.text}
          </p>
        </div>
      </motion.div>
    </div>
  );
});

VerseItem.displayName = 'VerseItem';

export const VirtualizedVerseList = memo<VirtualizedVerseListProps>(({ 
  verses, 
  onVerseClick, 
  height, 
  itemHeight = 80 
}) => {
  const { currentTheme } = useTheme();

  const itemData = useMemo(() => ({
    verses,
    onVerseClick,
    theme: currentTheme
  }), [verses, onVerseClick, currentTheme]);

  const itemCount = useMemo(() => verses.length, [verses.length]);

  return (
    <List
      height={height}
      itemCount={itemCount}
      itemSize={itemHeight}
      itemData={itemData}
      overscanCount={5}
    >
      {VerseItem}
    </List>
  );
});

VirtualizedVerseList.displayName = 'VirtualizedVerseList';