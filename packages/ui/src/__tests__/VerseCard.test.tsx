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
const mockIsBookmarked = jest.fn();

describe('VerseCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsBookmarked.mockReturnValue(false);
  });

  it('renders verse text and reference', () => {
    render(
      <VerseCard
        verse={mockVerse}
        onBookmark={mockOnBookmark}
        isBookmarked={mockIsBookmarked}
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
        isBookmarked={mockIsBookmarked}
      />
    );

    expect(screen.getByRole('button', { name: /bookmark/i })).toBeInTheDocument();
  });

  it('calls onBookmark when bookmark button is clicked', async () => {
    render(
      <VerseCard
        verse={mockVerse}
        onBookmark={mockOnBookmark}
        isBookmarked={mockIsBookmarked}
      />
    );

    const bookmarkButton = screen.getByRole('button', { name: /bookmark/i });
    fireEvent.click(bookmarkButton);

    await waitFor(() => {
      expect(mockOnBookmark).toHaveBeenCalledWith(mockVerse);
    });
  });

  it('shows bookmarked state when verse is bookmarked', () => {
    mockIsBookmarked.mockReturnValue(true);

    render(
      <VerseCard
        verse={mockVerse}
        onBookmark={mockOnBookmark}
        isBookmarked={mockIsBookmarked}
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
        isBookmarked={mockIsBookmarked}
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
        isBookmarked={mockIsBookmarked}
      />
    );

    expect(screen.getByText(longVerse.text)).toBeInTheDocument();
  });

  it('displays verse number correctly', () => {
    render(
      <VerseCard
        verse={mockVerse}
        onBookmark={mockOnBookmark}
        isBookmarked={mockIsBookmarked}
      />
    );

    expect(screen.getByText('16')).toBeInTheDocument();
  });
});