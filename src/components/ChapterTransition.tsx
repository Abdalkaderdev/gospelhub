import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChapterTransitionProps {
  children: React.ReactNode;
  chapterKey: string;
  direction?: 'left' | 'right' | 'none';
}

export const ChapterTransition: React.FC<ChapterTransitionProps> = ({
  children,
  chapterKey,
  direction = 'none'
}) => {
  const variants = {
    enter: (direction: string) => ({
      x: direction === 'left' ? -300 : direction === 'right' ? 300 : 0,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: string) => ({
      x: direction === 'left' ? 300 : direction === 'right' ? -300 : 0,
      opacity: 0,
      scale: 0.95
    })
  };

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={chapterKey}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          duration: 0.4
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};