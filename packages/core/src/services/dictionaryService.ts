import { DictionaryEntry } from '../types/spiritual-growth';
import { StorageManager } from '../storage';

export class DictionaryService {
  private storage: StorageManager;

  constructor(storage: StorageManager) {
    this.storage = storage;
  }

  // Get all dictionary entries
  async getAllEntries(): Promise<DictionaryEntry[]> {
    const { getAllDictionaryEntries } = await import('../data/bible-dictionary');
    const entries = getAllDictionaryEntries();
    
    // Load user's favorite status and search count
    const userData = await this.getUserDictionaryData();
    
    return entries.map(entry => ({
      ...entry,
      isFavorite: userData.favoriteTerms.includes(entry.id),
      searchCount: userData.searchCount[entry.id] || 0
    }));
  }

  // Get entry by ID
  async getEntry(entryId: string): Promise<DictionaryEntry | null> {
    const allEntries = await this.getAllEntries();
    return allEntries.find(entry => entry.id === entryId) || null;
  }

  // Search entries
  async searchEntries(query: string): Promise<DictionaryEntry[]> {
    const { searchDictionary } = await import('../data/bible-dictionary');
    const entries = searchDictionary(query);
    
    // Load user's favorite status and search count
    const userData = await this.getUserDictionaryData();
    
    return entries.map(entry => ({
      ...entry,
      isFavorite: userData.favoriteTerms.includes(entry.id),
      searchCount: userData.searchCount[entry.id] || 0
    }));
  }

  // Get entries by category
  async getEntriesByCategory(category: string): Promise<DictionaryEntry[]> {
    const { getEntriesByCategory } = await import('../data/bible-dictionary');
    const entries = getEntriesByCategory(category);
    
    // Load user's favorite status and search count
    const userData = await this.getUserDictionaryData();
    
    return entries.map(entry => ({
      ...entry,
      isFavorite: userData.favoriteTerms.includes(entry.id),
      searchCount: userData.searchCount[entry.id] || 0
    }));
  }

  // Get alphabetical entries
  async getAlphabeticalEntries(): Promise<DictionaryEntry[]> {
    const { getAlphabeticalEntries } = await import('../data/bible-dictionary');
    const entries = getAlphabeticalEntries();
    
    // Load user's favorite status and search count
    const userData = await this.getUserDictionaryData();
    
    return entries.map(entry => ({
      ...entry,
      isFavorite: userData.favoriteTerms.includes(entry.id),
      searchCount: userData.searchCount[entry.id] || 0
    }));
  }

  // Get random entry
  async getRandomEntry(): Promise<DictionaryEntry> {
    const { getRandomEntry } = await import('../data/bible-dictionary');
    const entry = getRandomEntry();
    
    // Load user's favorite status and search count
    const userData = await this.getUserDictionaryData();
    
    return {
      ...entry,
      isFavorite: userData.favoriteTerms.includes(entry.id),
      searchCount: userData.searchCount[entry.id] || 0
    };
  }

  // Toggle favorite status
  async toggleFavorite(entryId: string): Promise<void> {
    const userData = await this.getUserDictionaryData();
    
    if (userData.favoriteTerms.includes(entryId)) {
      userData.favoriteTerms = userData.favoriteTerms.filter(id => id !== entryId);
    } else {
      userData.favoriteTerms.push(entryId);
    }
    
    await this.storage.saveDictionaryData(userData);
  }

  // Get favorite entries
  async getFavoriteEntries(): Promise<DictionaryEntry[]> {
    const allEntries = await this.getAllEntries();
    return allEntries.filter(entry => entry.isFavorite);
  }

  // Get search history
  async getSearchHistory(): Promise<string[]> {
    const userData = await this.getUserDictionaryData();
    return userData.searchHistory || [];
  }

  // Add to search history
  async addToSearchHistory(query: string): Promise<void> {
    const userData = await this.getUserDictionaryData();
    
    if (!userData.searchHistory) {
      userData.searchHistory = [];
    }
    
    // Remove if already exists and add to beginning
    userData.searchHistory = userData.searchHistory.filter(q => q !== query);
    userData.searchHistory.unshift(query);
    
    // Keep only last 20 searches
    userData.searchHistory = userData.searchHistory.slice(0, 20);
    
    await this.storage.saveDictionaryData(userData);
  }

  // Clear search history
  async clearSearchHistory(): Promise<void> {
    const userData = await this.getUserDictionaryData();
    userData.searchHistory = [];
    await this.storage.saveDictionaryData(userData);
  }

  // Increment search count
  async incrementSearchCount(entryId: string): Promise<void> {
    const userData = await this.getUserDictionaryData();
    userData.searchCount[entryId] = (userData.searchCount[entryId] || 0) + 1;
    await this.storage.saveDictionaryData(userData);
  }

  // Get most searched terms
  async getMostSearchedTerms(limit: number = 10): Promise<DictionaryEntry[]> {
    const allEntries = await this.getAllEntries();
    return allEntries
      .filter(entry => entry.searchCount > 0)
      .sort((a, b) => b.searchCount - a.searchCount)
      .slice(0, limit);
  }

  // Get word of the day
  async getWordOfTheDay(): Promise<DictionaryEntry> {
    const userData = await this.getUserDictionaryData();
    const today = new Date().toISOString().split('T')[0];
    
    // Check if we already have a word for today
    if (userData.wordOfTheDay && userData.wordOfTheDayDate === today) {
      const entry = await this.getEntry(userData.wordOfTheDay);
      if (entry) return entry;
    }
    
    // Get a new random word
    const randomEntry = await this.getRandomEntry();
    
    // Save as today's word
    userData.wordOfTheDay = randomEntry.id;
    userData.wordOfTheDayDate = today;
    await this.storage.saveDictionaryData(userData);
    
    return randomEntry;
  }

  // Get statistics
  async getStatistics(): Promise<{
    totalTerms: number;
    favoriteTerms: number;
    totalSearches: number;
    mostSearchedTerm: string;
    searchHistoryLength: number;
  }> {
    const allEntries = await this.getAllEntries();
    const userData = await this.getUserDictionaryData();
    
    const totalSearches = Object.values(userData.searchCount).reduce((sum, count) => sum + count, 0);
    const mostSearched = allEntries
      .filter(entry => entry.searchCount > 0)
      .sort((a, b) => b.searchCount - a.searchCount)[0];

    return {
      totalTerms: allEntries.length,
      favoriteTerms: userData.favoriteTerms.length,
      totalSearches,
      mostSearchedTerm: mostSearched?.term || 'None',
      searchHistoryLength: userData.searchHistory?.length || 0
    };
  }

  // Get user's dictionary data
  private async getUserDictionaryData(): Promise<{
    favoriteTerms: string[];
    searchHistory: string[];
    searchCount: Record<string, number>;
    wordOfTheDay?: string;
    wordOfTheDayDate?: string;
  }> {
    try {
      const data = await this.storage.getDictionaryData();
      return {
        favoriteTerms: data.favoriteTerms || [],
        searchHistory: data.searchHistory || [],
        searchCount: data.searchCount || {},
        wordOfTheDay: data.wordOfTheDay,
        wordOfTheDayDate: data.wordOfTheDayDate
      };
    } catch {
      return {
        favoriteTerms: [],
        searchHistory: [],
        searchCount: {}
      };
    }
  }
}