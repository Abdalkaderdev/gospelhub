import React from 'react';
import { WordStudyTooltip } from './WordStudyTooltip';

interface EnhancedVerseTextProps {
  text: string;
  testament?: 'old' | 'new';
}

export const EnhancedVerseText: React.FC<EnhancedVerseTextProps> = ({
  text,
  testament = 'new'
}) => {
  const words = text.split(/(\s+|[.,;:!?])/);
  
  const keyWords = [
    'God', 'Lord', 'Jesus', 'Christ', 'love', 'world', 'life', 'eternal', 
    'believe', 'faith', 'Son', 'Word', 'light', 'beginning', 'created', 
    'heaven', 'earth', 'king', 'only', 'begotten'
  ];

  return (
    <span>
      {words.map((word, index) => {
        const cleanWord = word.replace(/[.,;:!?]/g, '');
        const isKeyWord = keyWords.some(kw => 
          cleanWord.toLowerCase() === kw.toLowerCase()
        );

        if (isKeyWord && cleanWord.length > 2) {
          return (
            <WordStudyTooltip 
              key={index} 
              word={cleanWord} 
              testament={testament}
            >
              {word}
            </WordStudyTooltip>
          );
        }

        return <span key={index}>{word}</span>;
      })}
    </span>
  );
};