import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { VerseCard } from '../components/VerseCard';

const mockVerse = {
  book: 'John',
  chapter: 3,
  verse: 16,
  text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
  reference: 'John 3:16'
};

const mockOnBookmark = jest.fn();

describe('VerseCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders verse text and reference', () => {
    render(
      <VerseCard
        verse={mockVerse}
        onBookmark={mockOnBookmark}
        isBookmarked={false}
      />
    );

    expect(screen.getByText(mockVerse.text)).toBeInTheDocument();
    expect(screen.getByText(mockVerse.reference)).toBeInTheDocument();
  });

  it('shows bookmark button', () => {
    render(
      <VerseCard
        verse={mockVerse}
        onBookmark={mockOnBookmark}
        isBookmarked={false}
      />
    );

    expect(screen.getByRole('button', { name: /bookmark/i })).toBeInTheDocument();
  });

  it('calls onBookmark when bookmark button is clicked', async () => {
    render(
      <VerseCard
        verse={mockVerse}
        onBookmark={mockOnBookmark}
        isBookmarked={false}
      />
    );

    const bookmarkButton = screen.getByRole('button', { name: /bookmark/i });
    fireEvent.click(bookmarkButton);

    await waitFor(() => {
      expect(mockOnBookmark).toHaveBeenCalledWith(mockVerse);
    });
  });

  it('shows bookmarked state when verse is bookmarked', () => {
    render(
      <VerseCard
        verse={mockVerse}
        onBookmark={mockOnBookmark}
        isBookmarked={true}
      />
    );

    const bookmarkButton = screen.getByRole('button', { name: /bookmark/i });
    expect(bookmarkButton).toHaveClass('text-primary-600');
  });

  it('applies custom className', () => {
    const customClass = 'custom-verse-card';
    render(
      <VerseCard
        verse={mockVerse}
        onBookmark={mockOnBookmark}
        isBookmarked={false}
        className={customClass}
      />
    );

    const card = screen.getByText(mockVerse.text).closest('div');
    expect(card).toHaveClass(customClass);
  });

  it('handles long verse text', () => {
    const longVerse = {
      ...mockVerse,
      text: 'This is a very long verse that should be displayed properly without breaking the layout or causing any issues with the component rendering. It should wrap nicely and maintain readability.'
    };

    render(
      <VerseCard
        verse={longVerse}
        onBookmark={mockOnBookmark}
        isBookmarked={false}
      />
    );

    expect(screen.getByText(longVerse.text)).toBeInTheDocument();
  });

  it('displays verse number correctly', () => {
    render(
      <VerseCard
        verse={mockVerse}
        onBookmark={mockOnBookmark}
        isBookmarked={false}
      />
    );

    expect(screen.getByText('16')).toBeInTheDocument();
  });
});