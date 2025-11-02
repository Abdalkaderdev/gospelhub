import React, { useRef, useState } from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

interface SwipeGestureHandlerProps {
  children: React.ReactNode;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  disabled?: boolean;
}

export const SwipeGestureHandler: React.FC<SwipeGestureHandlerProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  disabled = false
}) => {
  const { currentTheme } = useTheme();
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5]);
  const scale = useTransform(x, [-200, 0, 200], [0.95, 1, 0.95]);

  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = { light: 10, medium: 50, heavy: 100 };
      navigator.vibrate(patterns[type]);
    }
  };

  const handleDragStart = () => {
    if (disabled) return;
    setIsDragging(true);
    triggerHaptic('light');
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (disabled) return;
    
    setIsDragging(false);
    const threshold = 100;
    const velocity = Math.abs(info.velocity.x);

    if (info.offset.x > threshold || velocity > 500) {
      triggerHaptic('medium');
      onSwipeRight();
    } else if (info.offset.x < -threshold || velocity > 500) {
      triggerHaptic('medium');
      onSwipeLeft();
    }

    x.set(0);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Swipe indicators */}
      {isDragging && (
        <>
          <motion.div
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 flex items-center gap-2 px-3 py-2 rounded-full"
            style={{
              backgroundColor: currentTheme.colors.primary + '20',
              color: currentTheme.colors.primary
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <span>←</span>
            <span className="text-sm font-medium">Previous</span>
          </motion.div>
          
          <motion.div
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 flex items-center gap-2 px-3 py-2 rounded-full"
            style={{
              backgroundColor: currentTheme.colors.primary + '20',
              color: currentTheme.colors.primary
            }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <span className="text-sm font-medium">Next</span>
            <span>→</span>
          </motion.div>
        </>
      )}

      <motion.div
        drag={disabled ? false : "x"}
        dragConstraints={{ left: -300, right: 300 }}
        dragElastic={0.2}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        style={{ x, opacity, scale }}
        className="cursor-grab active:cursor-grabbing"
        whileTap={{ cursor: "grabbing" }}
      >
        {children}
      </motion.div>
    </div>
  );
};