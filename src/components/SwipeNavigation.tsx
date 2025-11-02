import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { ReactNode, useRef } from 'react';
import { triggerHaptic } from '../utils/haptics';

interface SwipeNavigationProps {
  children: ReactNode;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  disabled?: boolean;
}

export const SwipeNavigation = ({ 
  children, 
  onSwipeLeft, 
  onSwipeRight, 
  disabled = false 
}: SwipeNavigationProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasTriggeredHaptic = useRef(false);

  const [{ x, opacity }, api] = useSpring(() => ({
    x: 0,
    opacity: 1,
    config: { tension: 300, friction: 30 }
  }));

  const bind = useDrag(
    ({ active, movement: [mx], direction: [xDir], velocity: [vx], cancel }) => {
      if (disabled) return;

      const threshold = 100;
      const velocityThreshold = 0.5;
      
      // Trigger haptic feedback when threshold is reached
      if (Math.abs(mx) > threshold && !hasTriggeredHaptic.current) {
        triggerHaptic('light');
        hasTriggeredHaptic.current = true;
      }

      // Determine if swipe should trigger navigation
      const shouldNavigate = Math.abs(mx) > threshold || Math.abs(vx) > velocityThreshold;

      if (active) {
        // Limit drag distance
        const clampedX = Math.max(-200, Math.min(200, mx));
        api.start({ 
          x: clampedX, 
          opacity: 1 - Math.abs(clampedX) / 400,
          immediate: true 
        });
      } else {
        hasTriggeredHaptic.current = false;
        
        if (shouldNavigate) {
          // Trigger navigation with haptic feedback
          triggerHaptic('medium');
          
          if (xDir > 0) {
            onSwipeRight();
          } else {
            onSwipeLeft();
          }
        }
        
        // Reset position
        api.start({ x: 0, opacity: 1 });
      }

      // Cancel drag if threshold exceeded to prevent browser navigation
      if (Math.abs(mx) > 150) {
        cancel();
      }
    },
    {
      axis: 'x',
      filterTaps: true,
      rubberband: true
    }
  );

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      <animated.div
        {...bind()}
        style={{
          x,
          opacity,
          touchAction: 'pan-y pinch-zoom'
        }}
        className="select-none"
      >
        {children}
      </animated.div>
      
      {/* Visual feedback indicators */}
      <animated.div
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl opacity-0 pointer-events-none"
        style={{
          opacity: x.to(x => x > 50 ? (x - 50) / 50 : 0)
        }}
      >
        ←
      </animated.div>
      
      <animated.div
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-2xl opacity-0 pointer-events-none"
        style={{
          opacity: x.to(x => x < -50 ? (-x - 50) / 50 : 0)
        }}
      >
        →
      </animated.div>
    </div>
  );
};