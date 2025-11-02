import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { ReactNode, useRef, useState } from 'react';
import { triggerHaptic } from '../utils/haptics';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  disabled?: boolean;
}

export const PullToRefresh = ({ children, onRefresh, disabled = false }: PullToRefreshProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const hasTriggeredHaptic = useRef(false);

  const [{ y, rotate }, api] = useSpring(() => ({
    y: 0,
    rotate: 0,
    config: { tension: 300, friction: 30 }
  }));

  const bind = useDrag(
    ({ active, movement: [, my], velocity: [, vy], direction: [, yDir] }) => {
      if (disabled || isRefreshing) return;

      const threshold = 80;
      const velocityThreshold = 0.5;

      // Only allow pull down at top of page
      const isAtTop = window.scrollY === 0;
      if (!isAtTop && my < 0) return;

      // Trigger haptic when threshold reached
      if (my > threshold && !hasTriggeredHaptic.current) {
        triggerHaptic('light');
        hasTriggeredHaptic.current = true;
      }

      if (active && my > 0) {
        // Dampen the pull effect
        const dampedY = Math.min(my * 0.5, 100);
        api.start({ 
          y: dampedY, 
          rotate: dampedY * 2,
          immediate: true 
        });
      } else {
        hasTriggeredHaptic.current = false;
        
        // Check if should trigger refresh
        const shouldRefresh = my > threshold || vy > velocityThreshold;
        
        if (shouldRefresh && yDir > 0) {
          triggerHaptic('medium');
          setIsRefreshing(true);
          
          onRefresh().finally(() => {
            setIsRefreshing(false);
            api.start({ y: 0, rotate: 0 });
          });
        } else {
          api.start({ y: 0, rotate: 0 });
        }
      }
    },
    {
      axis: 'y',
      filterTaps: true,
      rubberband: true
    }
  );

  return (
    <div className="relative">
      {/* Pull indicator */}
      <animated.div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full flex items-center justify-center w-12 h-12 z-10"
        style={{
          y: y.to(y => y - 48),
          opacity: y.to(y => Math.min(y / 80, 1))
        }}
      >
        <animated.div
          className="w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full"
          style={{
            rotate: isRefreshing 
              ? rotate.to(() => '360deg')
              : rotate.to(r => `${r}deg`)
          }}
        />
      </animated.div>

      <animated.div
        {...bind()}
        style={{
          y,
          touchAction: 'pan-x pinch-zoom'
        }}
        className="select-none"
      >
        {children}
      </animated.div>
    </div>
  );
};