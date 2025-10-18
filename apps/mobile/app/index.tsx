import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { VerseCard, BibleNavigator, SearchBar } from '@gospelhub/ui';
import { BibleSearch, getAllVerses, getChapter } from '@gospelhub/core';
import { Verse, SearchResult } from '@gospelhub/types';

export default function HomeScreen() {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState('Genesis');
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [bibleSearch] = useState(() => new BibleSearch(getAllVerses()));

  // Load initial chapter
  useEffect(() => {
    const chapter = getChapter(selectedBook, selectedChapter);
    if (chapter) {
      setVerses(chapter.verses);
    }
  }, [selectedBook, selectedChapter]);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = bibleSearch.search(searchQuery, { limit: 20 });
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, bibleSearch]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleBookSelect = (book: string) => {
    setSelectedBook(book);
    setSelectedChapter(1);
  };

  const handleChapterSelect = (book: string, chapter: number) => {
    setSelectedBook(book);
    setSelectedChapter(chapter);
  };

  const handleBookmark = (verse: Verse) => {
    // TODO: Implement bookmark functionality
    console.log('Bookmark verse:', verse.reference);
  };

  const displayVerses = searchQuery.trim() ? searchResults.map(r => r.verse) : verses;

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700">
        <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Gospel Hub
        </Text>
        <SearchBar onSearch={handleSearch} />
      </View>

      <ScrollView className="flex-1 p-4">
        <View className="mb-6">
          <Text className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {searchQuery.trim() ? `Search Results` : `${selectedBook} ${selectedChapter}`}
          </Text>
          {searchQuery.trim() && (
            <Text className="text-gray-600 dark:text-gray-400">
              {searchResults.length} results found
            </Text>
          )}
        </View>

        <View className="space-y-4">
          {displayVerses.map((verse) => (
            <VerseCard
              key={verse.reference}
              verse={verse}
              onBookmark={handleBookmark}
              isBookmarked={false} // TODO: Implement bookmark state
            />
          ))}
        </View>

        {displayVerses.length === 0 && (
          <View className="py-12 items-center">
            <Text className="text-gray-500 dark:text-gray-400 text-center">
              {searchQuery.trim() ? 'No verses found matching your search.' : 'No verses available for this chapter.'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <BibleNavigator
          onBookSelect={handleBookSelect}
          onChapterSelect={handleChapterSelect}
          selectedBook={selectedBook}
          selectedChapter={selectedChapter}
        />
      </View>
    </View>
  );
}