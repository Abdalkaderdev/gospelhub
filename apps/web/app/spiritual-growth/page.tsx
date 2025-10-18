'use client';

import { useState, useEffect } from 'react';
import { PWALayout, ReadingPlanCard, PromiseCard, BagItemCard, DictionaryEntryCard, MobileNavigation } from '@gospelhub/ui';
import { 
  ReadingPlanService, 
  PromiseService, 
  BagService, 
  DictionaryService,
  WebStorageAdapter,
  StorageManager,
  ReadingPlan,
  GodsPromise,
  BagItem,
  DictionaryEntry
} from '@gospelhub/core';

export default function SpiritualGrowthPage() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [activeTab, setActiveTab] = useState<'plans' | 'promises' | 'bag' | 'dictionary'>('plans');
  const [isMobile, setIsMobile] = useState(false);
  // const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Services
  const [readingPlanService, setReadingPlanService] = useState<ReadingPlanService | null>(null);
  const [promiseService, setPromiseService] = useState<PromiseService | null>(null);
  const [bagService, setBagService] = useState<BagService | null>(null);
  const [dictionaryService, setDictionaryService] = useState<DictionaryService | null>(null);

  // Data
  const [readingPlans, setReadingPlans] = useState<ReadingPlan[]>([]);
  const [promises, setPromises] = useState<GodsPromise[]>([]);
  const [bagItems, setBagItems] = useState<BagItem[]>([]);
  const [dictionaryEntries, setDictionaryEntries] = useState<DictionaryEntry[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Initialize services
  useEffect(() => {
    const initializeServices = async () => {
      const storage = new StorageManager(new WebStorageAdapter());
      
      setReadingPlanService(new ReadingPlanService(storage));
      setPromiseService(new PromiseService(storage));
      setBagService(new BagService(storage));
      setDictionaryService(new DictionaryService(storage));
      
      setIsLoading(false);
    };

    initializeServices();
  }, []);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      if (!readingPlanService || !promiseService || !bagService || !dictionaryService) return;

      try {
        const [plans, allPromises, items, entries] = await Promise.all([
          readingPlanService.getAvailablePlans(),
          promiseService.getAllPromises(),
          bagService.getAllItems(),
          dictionaryService.getAllEntries()
        ]);

        setReadingPlans(plans);
        setPromises(allPromises);
        setBagItems(items);
        setDictionaryEntries(entries);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, [readingPlanService, promiseService, bagService, dictionaryService]);

  // Filter promises by category
  const filteredPromises = selectedCategory === 'all' 
    ? promises 
    : promises.filter(promise => promise.category === selectedCategory);

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(promises.map(p => p.category)))];

  // Handle promise claim
  const handlePromiseClaim = async (promise: GodsPromise) => {
    if (!promiseService) return;
    
    try {
      if (promise.isClaimed) {
        await promiseService.unclaimPromise(promise.id);
      } else {
        await promiseService.claimPromise(promise.id);
      }
      
      // Reload promises
      const updatedPromises = await promiseService.getAllPromises();
      setPromises(updatedPromises);
    } catch (error) {
      console.error('Error claiming promise:', error);
    }
  };

  // Handle promise favorite toggle
  const handlePromiseFavoriteToggle = async (promise: GodsPromise) => {
    if (!promiseService) return;
    
    try {
      await promiseService.toggleFavorite(promise.id);
      
      // Reload promises
      const updatedPromises = await promiseService.getAllPromises();
      setPromises(updatedPromises);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  // Handle bag item actions
  const handleBagItemEdit = (item: BagItem) => {
    console.log('Edit item:', item);
    // TODO: Implement edit functionality
  };

  const handleBagItemDelete = async (item: BagItem) => {
    if (!bagService) return;
    
    try {
      await bagService.deleteItem(item.id);
      
      // Reload bag items
      const updatedItems = await bagService.getAllItems();
      setBagItems(updatedItems);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleBagItemFavoriteToggle = async (item: BagItem) => {
    if (!bagService) return;
    
    try {
      await bagService.toggleFavorite(item.id);
      
      // Reload bag items
      const updatedItems = await bagService.getAllItems();
      setBagItems(updatedItems);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  // Handle dictionary entry favorite toggle
  const handleDictionaryFavoriteToggle = async (entry: DictionaryEntry) => {
    if (!dictionaryService) return;
    
    try {
      await dictionaryService.toggleFavorite(entry.id);
      
      // Reload dictionary entries
      const updatedEntries = await dictionaryService.getAllEntries();
      setDictionaryEntries(updatedEntries);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  // Handle navigation to verse
  const handleNavigateToVerse = (book: string, chapter: number, verse: number) => {
    console.log('Navigate to verse:', book, chapter, verse);
    // TODO: Implement navigation to Bible reader
  };

  if (isLoading) {
    return (
      <PWALayout theme={theme} onThemeChange={setTheme}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading Spiritual Growth Tools...</p>
          </div>
        </div>
      </PWALayout>
    );
  }

  return (
    <PWALayout theme={theme} onThemeChange={setTheme}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Spiritual Growth Tools
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Deepen your faith with reading plans, God&apos;s promises, prayer journal, and Bible dictionary
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8">
              {[
                { id: 'plans', label: 'Reading Plans', icon: '📖' },
                { id: 'promises', label: "God&apos;s Promises", icon: '✨' },
                { id: 'bag', label: 'Bag of Life', icon: '🎒' },
                { id: 'dictionary', label: 'Bible Dictionary', icon: '📚' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'plans' | 'promises' | 'bag' | 'dictionary')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${isMobile ? 'pb-20' : ''}`}>
          {/* Reading Plans Tab */}
          {activeTab === 'plans' && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Choose Your Reading Plan
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Start a structured Bible reading journey with our curated plans
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {readingPlans.map((plan) => (
                  <ReadingPlanCard
                    key={plan.id}
                    plan={plan}
                    onSelect={(plan: ReadingPlan) => console.log('Selected plan:', plan)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* God's Promises Tab */}
          {activeTab === 'promises' && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  God&apos;s Promises
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Claim God&apos;s promises for your life and find hope in His Word
                </p>
                
                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === category
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredPromises.map((promise) => (
                  <PromiseCard
                    key={promise.id}
                    promise={promise}
                    onClaim={handlePromiseClaim}
                    onToggleFavorite={handlePromiseFavoriteToggle}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Bag of Life Tab */}
          {activeTab === 'bag' && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Bag of Life
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Your personal space for prayers, reflections, and spiritual notes
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {bagItems.map((item) => (
                  <BagItemCard
                    key={item.id}
                    item={item}
                    onEdit={handleBagItemEdit}
                    onDelete={handleBagItemDelete}
                    onToggleFavorite={handleBagItemFavoriteToggle}
                  />
                ))}
              </div>
              
              {bagItems.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎒</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Your Bag is Empty
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Start adding prayers, reflections, and notes to your spiritual journey
                  </p>
                  <button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                    Add Your First Item
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Bible Dictionary Tab */}
          {activeTab === 'dictionary' && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Bible Dictionary
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Explore biblical terms, people, and places with detailed definitions and practical applications
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {dictionaryEntries.map((entry) => (
                  <DictionaryEntryCard
                    key={entry.id}
                    entry={entry}
                    onToggleFavorite={handleDictionaryFavoriteToggle}
                    onNavigateToVerse={handleNavigateToVerse}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        {isMobile && (
          <MobileNavigation
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab as 'plans' | 'promises' | 'bag' | 'dictionary')}
            tabs={[
              { id: 'plans', label: 'Plans', icon: '📖' },
              { id: 'promises', label: 'Promises', icon: '✨' },
              { id: 'bag', label: 'Bag', icon: '🎒' },
              { id: 'dictionary', label: 'Dictionary', icon: '📚' }
            ]}
          />
        )}
      </div>
    </PWALayout>
  );
}