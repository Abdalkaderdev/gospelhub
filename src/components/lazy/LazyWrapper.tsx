import React, { Suspense, memo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { CrossAssembly } from '../CrossAssembly';

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const DefaultFallback = memo(() => {
  const { currentTheme } = useTheme();
  
  return (
    <motion.div
      className="flex items-center justify-center py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <CrossAssembly
        size={48}
        color={currentTheme.colors.primary}
        thickness={6}
      />
    </motion.div>
  );
});

DefaultFallback.displayName = 'DefaultFallback';

export const LazyWrapper = memo<LazyWrapperProps>(({ children, fallback }) => {
  return (
    <Suspense fallback={fallback || <DefaultFallback />}>
      {children}
    </Suspense>
  );
});

LazyWrapper.displayName = 'LazyWrapper';