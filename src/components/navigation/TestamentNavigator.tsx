import React from 'react';
import { Testament, BookCategory, BOOK_CATEGORIES } from '../../types/bible-enhanced';
import { BibleMetadataService } from '../../services/BibleMetadataService';

interface TestamentNavigatorProps {
  currentBook?: string;
  onBookSelect: (book: string) => void;
  onCategorySelect?: (category: BookCategory) => void;
}

export const TestamentNavigator: React.FC<TestamentNavigatorProps> = ({
  currentBook,
  onBookSelect,
  onCategorySelect
}) => {
  const [selectedTestament, setSelectedTestament] = React.useState<'Old' | 'New'>('Old');
  const [selectedCategory, setSelectedCategory] = React.useState<BookCategory | null>(null);

  const testamentBooks = BibleMetadataService.getTestamentBooks(selectedTestament);
  const categoryBooks = selectedCategory ? BibleMetadataService.getBooksByCategory(selectedCategory) : [];

  const handleCategoryClick = (category: BookCategory) => {
    setSelectedCategory(selectedCategory === category ? null : category);
    onCategorySelect?.(category);
  };

  const booksToShow = selectedCategory ? categoryBooks : testamentBooks;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      {/* Testament Tabs */}
      <div className="flex mb-4 border-b border-gray-200 dark:border-gray-700">
        {(['Old', 'New'] as const).map((testament) => (
          <button
            key={testament}
            onClick={() => {
              setSelectedTestament(testament);
              setSelectedCategory(null);
            }}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              selectedTestament === testament
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            {testament} Testament ({BibleMetadataService.getTestamentBooks(testament).length} books)
          </button>
        ))}
      </div>

      {/* Category Filter */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {Object.keys(BOOK_CATEGORIES).map((category) => {
            const categoryKey = category as BookCategory;
            const categoryBooks = BOOK_CATEGORIES[categoryKey];
            const hasBooks = categoryBooks.some(book => testamentBooks.includes(book));
            
            if (!hasBooks) return null;

            return (
              <button
                key={category}
                onClick={() => handleCategoryClick(categoryKey)}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  selectedCategory === categoryKey
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {booksToShow.map((book) => (
          <button
            key={book}
            onClick={() => onBookSelect(book)}
            className={`p-2 text-sm rounded-lg text-left transition-colors ${
              currentBook === book
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {book}
          </button>
        ))}
      </div>

      {/* Category Info */}
      {selectedCategory && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">
            {selectedCategory} Books
          </h4>
          <p className="text-sm text-blue-600 dark:text-blue-300">
            {categoryBooks.length} books in this category
          </p>
        </div>
      )}
    </div>
  );
};