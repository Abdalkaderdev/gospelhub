import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import { vi } from 'vitest';
import { ThemeProvider } from './contexts/ThemeContext';

vi.mock('./data', () => ({
  bibleTranslations: [
    {
      id: 'kjv',
      name: 'King James Version',
      abbreviation: 'KJV',
      data: {
        Genesis: {
          chapters: [1],
          verses: {
            1: [{ verse: 1, text: 'In the beginning God created the heaven and the earth.' }],
          },
        },
      },
    },
    {
      id: 'niv',
      name: 'New International Version',
      abbreviation: 'NIV',
      data: {
        Genesis: {
          chapters: [1],
          verses: {
            1: [{ verse: 1, text: 'In the beginning God created the heavens and the earth.' }],
          },
        },
      },
    }
  ],
  getTranslationById: (id: string) => {
    if (id === 'esv') {
      return null;
    }
    if (id === 'niv') {
        return {
            id: 'niv',
            name: 'New International Version',
            abbreviation: 'NIV',
            data: {
              Genesis: {
                chapters: [1],
                verses: {
                  1: [{ verse: 1, text: 'In the beginning God created the heavens and the earth.' }],
                },
              },
            },
          };
    }
    return {
      id: 'kjv',
      name: 'King James Version',
      abbreviation: 'KJV',
      data: {
        Genesis: {
          chapters: [1],
          verses: {
            1: [{ verse: 1, text: 'In the beginning God created the heaven and the earth.' }],
          },
        },
      },
    };
  },
  defaultTranslationId: 'kjv',
  getAllTranslations: () => [
    {
      id: 'kjv',
      name: 'King James Version',
      abbreviation: 'KJV',
      data: {
        Genesis: {
          chapters: [1],
          verses: {
            1: [{ verse: 1, text: 'In the beginning God created the heaven and the earth.' }],
          },
        },
      },
    },
    {
      id: 'esv',
      name: 'English Standard Version',
      abbreviation: 'ESV',
      data: {
        Genesis: {
          chapters: [1],
          verses: {
            1: [{ verse: 1, text: 'In the beginning, God created the heavens and the earth.' }],
          },
        },
      },
    },
    {
        id: 'niv',
        name: 'New International Version',
        abbreviation: 'NIV',
        data: {
          Genesis: {
            chapters: [1],
            verses: {
              1: [{ verse: 1, text: 'In the beginning God created the heavens and the earth.' }],
            },
          },
        },
      }
  ],
}));

vi.mock('./hooks/usePWA', () => ({
  usePWA: () => ({ isOnline: true }),
}));

describe('App', () => {
  it('should load a translation from JSON when a new translation is selected', async () => {
    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>
    );

    // Select a translation that needs to be loaded from JSON
    fireEvent.change(screen.getByLabelText('Translation'), { target: { value: 'esv' } });

    // Wait for the translation to be loaded
    await waitFor(() => {
        expect(screen.getByText('In the beginning, God created the heavens and the earth.')).toBeInTheDocument();
    });
  });

  it('should load a translation from memory when a new translation is selected', async () => {
    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>
    );

    // Select a translation that is already loaded in memory
    fireEvent.change(screen.getByLabelText('Translation'), { target: { value: 'niv' } });

    // Wait for the translation to be loaded
    await waitFor(() => {
        expect(screen.getByText('In the beginning God created the heavens and the earth.')).toBeInTheDocument();
    });
  });
});
