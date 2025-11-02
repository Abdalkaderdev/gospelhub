import React, { memo, useMemo, useCallback } from 'react';
import { ProgressRing } from '../ProgressRing';

interface MemoizedProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  label?: string;
  showPercentage?: boolean;
  animated?: boolean;
}

export const MemoizedProgressRing = memo<MemoizedProgressRingProps>(({
  progress,
  size = 120,
  strokeWidth = 8,
  color = '#d97706',
  backgroundColor = '#e7e5e4',
  label,
  showPercentage = true,
  animated = true
}) => {
  const roundedProgress = useMemo(() => Math.round(progress), [progress]);
  
  const memoizedProps = useMemo(() => ({
    progress: roundedProgress,
    size,
    strokeWidth,
    color,
    backgroundColor,
    label,
    showPercentage,
    animated
  }), [roundedProgress, size, strokeWidth, color, backgroundColor, label, showPercentage, animated]);

  return <ProgressRing {...memoizedProps} />;
});

MemoizedProgressRing.displayName = 'MemoizedProgressRing';