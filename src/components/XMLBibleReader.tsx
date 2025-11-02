import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BibleWord } from '../types';
import { getXMLChapter } from '../data/xml';
import { XMLWordStudy } from './study/XMLWordStudy';

interface XMLBibleReaderProps {
  translationId: string;
  bookName: string;
  chapter: number;
}

export const XMLBibleReader: React.FC<XMLBibleReaderProps> = ({
  translationId,
  bookName,
  chapter
}) => {
  const [selectedWord, setSelectedWord] = useState<BibleWord | null>(null);
  
  const currentChapter = useMemo(() => 
    getXMLChapter(translationId, bookName, chapter), 
    [translationId, bookName, chapter]
  );

  const handleWordClick = (word: BibleWord) => {
    if (word.strongsNumber) {
      setSelectedWord(word);
    }
  };

  if (!currentChapter) {
    return (
      <div className="text-gray-600 p-4 text-center">
        Chapter not found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        {bookName} {chapter}
      </h2>
      
      <div className="space-y-3">
        {currentChapter.verses.map(verse => (
          <motion.div
            key={verse.number}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <span className="text-sm text-gray-500 font-medium min-w-[2rem]">
              {verse.number}
            </span>
            <div className="flex-1">
              {verse.words && verse.words.length > 0 ? (
                <span>
                  {verse.words.map((word, index) => (
                    <span
                      key={index}
                      onClick={() => handleWordClick(word)}
                      className={`${
                        word.strongsNumber 
                          ? 'cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded px-1 border-b border-dotted border-blue-400' 
                          : ''
                      }`}
                      title={word.strongsNumber ? `Strong's: ${word.strongsNumber}` : undefined}
                    >
                      {word.text}
                    </span>
                  ))}
                </span>
              ) : (
                <span>{verse.text}</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedWord && (
          <XMLWordStudy
            word={selectedWord}
            onClose={() => setSelectedWord(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};