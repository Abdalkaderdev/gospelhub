import type { Meta, StoryObj } from '@storybook/react';
import { SearchBox } from '../components/compound/SearchBox';
import { useState } from 'react';

const sampleResults = [
  { book: 'John', chapter: 3, verse: 16, text: 'For God so loved the world, that he gave his only begotten Son...' },
  { book: 'Romans', chapter: 8, verse: 28, text: 'And we know that all things work together for good...' },
  { book: 'Philippians', chapter: 4, verse: 13, text: 'I can do all things through Christ which strengtheneth me.' },
];

const meta: Meta<typeof SearchBox> = {
  title: 'Components/SearchBox',
  component: SearchBox,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A compound search component with flexible composition for Bible search functionality.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onSearch: {
      action: 'search-triggered',
      description: 'Callback when search is performed',
    },
    onResultClick: {
      action: 'result-clicked',
      description: 'Callback when a result is clicked',
    },
    results: {
      description: 'Array of search results',
    },
    isLoading: {
      control: 'boolean',
      description: 'Loading state',
    },
    placeholder: {
      control: 'text',
      description: 'Input placeholder text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Search Bible verses...',
    results: [],
    isLoading: false,
  },
  render: (args) => (
    <SearchBox {...args}>
      <SearchBox.Input placeholder={args.placeholder} />
      <SearchBox.Results>
        <SearchBox.Loading />
        <SearchBox.Empty />
      </SearchBox.Results>
    </SearchBox>
  ),
};

export const WithResults: Story = {
  args: {
    placeholder: 'Search Bible verses...',
    results: sampleResults,
    isLoading: false,
  },
  render: (args) => (
    <SearchBox {...args}>
      <SearchBox.Input placeholder={args.placeholder} />
      <SearchBox.Results>
        <SearchBox.Loading />
        <SearchBox.Empty />
      </SearchBox.Results>
    </SearchBox>
  ),
};

export const Loading: Story = {
  args: {
    placeholder: 'Search Bible verses...',
    results: [],
    isLoading: true,
  },
  render: (args) => (
    <SearchBox {...args}>
      <SearchBox.Input placeholder={args.placeholder} />
      <SearchBox.Results>
        <SearchBox.Loading />
        <SearchBox.Empty />
      </SearchBox.Results>
    </SearchBox>
  ),
};

export const CustomResults: Story = {
  args: {
    placeholder: 'Search Bible verses...',
    results: sampleResults,
    isLoading: false,
  },
  render: (args) => (
    <SearchBox {...args}>
      <SearchBox.Input placeholder={args.placeholder} />
      <SearchBox.Results>
        <SearchBox.Loading />
        {args.results.map((result, index) => (
          <SearchBox.Result key={index} result={result} index={index}>
            <div style={{ padding: '0.5rem 0' }}>
              <div style={{ fontWeight: 600, color: '#d97706' }}>
                {result.book} {result.chapter}:{result.verse}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#78716c', marginTop: '0.25rem' }}>
                {result.text}
              </div>
            </div>
          </SearchBox.Result>
        ))}
        <SearchBox.Empty message="No verses found matching your search" />
      </SearchBox.Results>
    </SearchBox>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = (query: string) => {
      setIsLoading(true);
      setTimeout(() => {
        const filtered = sampleResults.filter(result => 
          result.text.toLowerCase().includes(query.toLowerCase()) ||
          result.book.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
        setIsLoading(false);
      }, 1000);
    };

    return (
      <SearchBox 
        onSearch={handleSearch}
        results={results}
        isLoading={isLoading}
        onResultClick={(result) => alert(`Selected: ${result.book} ${result.chapter}:${result.verse}`)}
      >
        <SearchBox.Input placeholder="Try searching for 'God' or 'love'..." />
        <SearchBox.Results>
          <SearchBox.Loading />
          <SearchBox.Empty message="No verses found. Try a different search term." />
        </SearchBox.Results>
      </SearchBox>
    );
  },
};