import React from 'react';
import { TranslationComparison, TextDifference, BibleReference } from '../../types/bible-enhanced';
import { BibleTranslation } from '../../types';

interface TranslationComparisonProps {
  comparison: TranslationComparison;
  highlightDifferences?: boolean;
}

export const TranslationComparisonView: React.FC<TranslationComparisonProps> = ({
  comparison,
  highlightDifferences = true
}) => {
  const renderTextWithHighlights = (text: string, differences: TextDifference[] = []) => {
    if (!highlightDifferences || differences.length === 0) {
      return <span>{text}</span>;
    }

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    // Sort differences by position
    const sortedDifferences = [...differences].sort((a, b) => a.position - b.position);

    for (const diff of sortedDifferences) {
      // Add text before the difference
      if (diff.position > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`}>
            {text.slice(lastIndex, diff.position)}
          </span>
        );
      }

      // Add the highlighted difference
      const diffText = text.slice(diff.position, diff.position + diff.length);
      parts.push(
        <span
          key={`diff-${diff.position}`}
          className={`px-1 rounded ${getDifferenceStyle(diff.type)}`}
          title={diff.alternativeText ? `Alternative: ${diff.alternativeText}` : undefined}
        >
          {diffText}
        </span>
      );

      lastIndex = diff.position + diff.length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(
        <span key={`text-${lastIndex}`}>
          {text.slice(lastIndex)}
        </span>
      );
    }

    return <>{parts}</>;
  };

  const getDifferenceStyle = (type: TextDifference['type']): string => {
    switch (type) {
      case 'addition':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'deletion':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'substitution':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      {/* Reference Header */}
      <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {comparison.reference.book} {comparison.reference.chapter}:{comparison.reference.verse}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Comparing {comparison.translations.length} translations
        </p>
      </div>

      {/* Translation Comparison */}
      <div className="space-y-6">
        {comparison.translations.map((translation, index) => (
          <div
            key={translation.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
          >
            {/* Translation Header */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {translation.name}
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                {translation.id}
              </span>
            </div>

            {/* Translation Text */}
            <div className="text-gray-800 dark:text-gray-200 leading-relaxed">
              {renderTextWithHighlights(translation.text, translation.differences)}
            </div>

            {/* Differences Summary */}
            {translation.differences && translation.differences.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-600">
                <div className="flex flex-wrap gap-2">
                  {translation.differences.map((diff, diffIndex) => (
                    <span
                      key={diffIndex}
                      className={`px-2 py-1 text-xs rounded-full ${getDifferenceStyle(diff.type)}`}
                    >
                      {diff.type}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      {highlightDifferences && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Difference Types:
          </h4>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-green-100 dark:bg-green-900 rounded"></span>
              <span className="text-gray-600 dark:text-gray-400">Addition</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-red-100 dark:bg-red-900 rounded"></span>
              <span className="text-gray-600 dark:text-gray-400">Deletion</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-yellow-100 dark:bg-yellow-900 rounded"></span>
              <span className="text-gray-600 dark:text-gray-400">Substitution</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const generateTranslationComparison = (
  reference: BibleReference,
  translations: BibleTranslation[]
): TranslationComparison => {
  // This is a simplified implementation
  // In a real app, you'd implement proper text comparison algorithms
  const translationData = translations.map(translation => ({
    id: translation.id,
    name: translation.name,
    text: `Sample text for ${translation.name}`, // Replace with actual verse lookup
    differences: [] as TextDifference[]
  }));

  return {
    reference,
    translations: translationData
  };
};