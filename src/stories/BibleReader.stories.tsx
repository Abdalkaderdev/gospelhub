import type { Meta, StoryObj } from '@storybook/react';
import { BibleReader } from '../components/compound/BibleReader';
import { BibleVerse } from '../types';

const sampleVerses: BibleVerse[] = [
  { verse: 1, text: "In the beginning God created the heaven and the earth." },
  { verse: 2, text: "And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters." },
  { verse: 3, text: "And God said, Let there be light: and there was light." },
  { verse: 4, text: "And God saw the light, that it was good: and God divided the light from the darkness." },
  { verse: 5, text: "And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day." }
];

const meta: Meta<typeof BibleReader> = {
  title: 'Components/BibleReader',
  component: BibleReader,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A compound component for displaying Bible chapters with flexible composition.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    verses: {
      description: 'Array of Bible verses to display',
    },
    currentBook: {
      control: 'text',
      description: 'Current book name',
    },
    currentChapter: {
      control: 'number',
      description: 'Current chapter number',
    },
    onVerseClick: {
      action: 'verse-clicked',
      description: 'Callback when a verse is clicked',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    verses: sampleVerses,
    currentBook: 'Genesis',
    currentChapter: 1,
  },
  render: (args) => (
    <BibleReader {...args}>
      <BibleReader.Header />
      <BibleReader.Content />
    </BibleReader>
  ),
};

export const WithCustomHeader: Story = {
  args: {
    verses: sampleVerses,
    currentBook: 'Genesis',
    currentChapter: 1,
  },
  render: (args) => (
    <BibleReader {...args}>
      <BibleReader.Header>
        <p style={{ color: '#78716c', fontSize: '0.875rem' }}>
          King James Version
        </p>
      </BibleReader.Header>
      <BibleReader.Content />
    </BibleReader>
  ),
};

export const CustomVerses: Story = {
  args: {
    verses: sampleVerses,
    currentBook: 'Genesis',
    currentChapter: 1,
  },
  render: (args) => (
    <BibleReader {...args}>
      <BibleReader.Header />
      <BibleReader.Content>
        {args.verses.map((verse, index) => (
          <BibleReader.Verse key={verse.verse} verse={verse} index={index}>
            <strong>{verse.text}</strong>
          </BibleReader.Verse>
        ))}
      </BibleReader.Content>
    </BibleReader>
  ),
};

export const Interactive: Story = {
  args: {
    verses: sampleVerses,
    currentBook: 'Genesis',
    currentChapter: 1,
    onVerseClick: (verse) => alert(`Clicked verse ${verse.verse}: ${verse.text.substring(0, 50)}...`),
  },
  render: (args) => (
    <BibleReader {...args}>
      <BibleReader.Header>
        <p style={{ color: '#78716c', fontSize: '0.875rem' }}>
          Click any verse to see details
        </p>
      </BibleReader.Header>
      <BibleReader.Content />
    </BibleReader>
  ),
};