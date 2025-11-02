import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  translationName?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  subtitle, 
  translationName,
  actions 
}) => {
  const { currentTheme } = useTheme();

  return (
    <motion.header
      className="mb-8 sm:mb-16 text-left"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {translationName && (
        <p className="mb-2 text-xs sm:text-sm font-medium tracking-[0.3em] uppercase text-stone-500">
          {translationName}
        </p>
      )}
      <h1 className="mb-4 sm:mb-6 text-4xl sm:text-6xl lg:text-7xl font-light leading-tight tracking-tight" 
          style={{ color: currentTheme.colors.text }}>
        {title}
      </h1>
      {subtitle && (
        <p className="mb-6 text-lg text-gray-600 dark:text-gray-400">
          {subtitle}
        </p>
      )}
      {actions && (
        <div className="flex flex-wrap gap-3">
          {actions}
        </div>
      )}
    </motion.header>
  );
};