import { useCallback, useRef } from 'react';
import { useAnimationControls, Variants } from 'framer-motion';

interface UseAnimationsReturn {
  fadeIn: Variants;
  slideUp: Variants;
  slideDown: Variants;
  slideLeft: Variants;
  slideRight: Variants;
  scale: Variants;
  stagger: Variants;
  controls: ReturnType<typeof useAnimationControls>;
  triggerAnimation: (animation: string) => Promise<void>;
}

export const useAnimations = (duration: number = 0.3): UseAnimationsReturn => {
  const controls = useAnimationControls();
  const timeoutRef = useRef<NodeJS.Timeout>();

  const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration }
    }
  };

  const slideUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration, ease: 'easeOut' }
    }
  };

  const slideDown: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration, ease: 'easeOut' }
    }
  };

  const slideLeft: Variants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration, ease: 'easeOut' }
    }
  };

  const slideRight: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration, ease: 'easeOut' }
    }
  };

  const scale: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration, ease: 'easeOut' }
    }
  };

  const stagger: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const triggerAnimation = useCallback(async (animation: string): Promise<void> => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    await controls.start(animation);
  }, [controls]);

  return {
    fadeIn,
    slideUp,
    slideDown,
    slideLeft,
    slideRight,
    scale,
    stagger,
    controls,
    triggerAnimation
  };
};