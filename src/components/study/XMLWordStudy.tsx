import React from 'react';
import { motion } from 'framer-motion';
import { BibleWord } from '../../types';
import { strongsHebrew } from '../../data/strongsHebrew.json';
import { strongsGreek } from '../../data/strongsGreek.json';

interface XMLWordStudyProps {
  word: BibleWord;
  onClose: () => void;
}

export const XMLWordStudy: React.FC<XMLWordStudyProps> = ({ word, onClose }) => {
  const getStrongsData = () => {
    if (!word.strongsNumber) return null;
    
    const number = word.strongsNumber.replace(/[HG]/, '');
    const isHebrew = word.strongsNumber.startsWith('H');
    
    return isHebrew 
      ? strongsHebrew[number as keyof typeof strongsHebrew]
      : strongsGreek[number as keyof typeof strongsGreek];
  };

  const strongsData = getStrongsData();
  const isHebrew = word.strongsNumber?.startsWith('H');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{word.text}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {strongsData && (
          <div className="space-y-3">
            <div className={`inline-block px-2 py-1 rounded text-sm ${
              isHebrew ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
            }`}>
              {word.strongsNumber} • {isHebrew ? 'Hebrew' : 'Greek'}
            </div>
            
            <div>
              <p className="font-medium">{strongsData.transliteration}</p>
              <p className="text-sm text-gray-600">{strongsData.pronunciation}</p>
            </div>
            
            <div>
              <h4 className="font-medium mb-1">Definition</h4>
              <p className="text-sm">{strongsData.definition}</p>
            </div>

            {word.morphology && (
              <div>
                <h4 className="font-medium mb-1">Morphology</h4>
                <p className="text-sm font-mono">{word.morphology}</p>
              </div>
            )}

            {word.lemma && (
              <div>
                <h4 className="font-medium mb-1">Lemma</h4>
                <p className="text-sm">{word.lemma}</p>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};