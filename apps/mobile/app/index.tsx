import React, { useState, useEffect } from 'react';
import { MobileBibleReader } from '@gospelhub/ui';
import { MobileStorageAdapter, StorageManager, BookmarkManager } from '@gospelhub/core';
import { Verse } from '@gospelhub/types';

export default function HomeScreen() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [bookmarkManager, setBookmarkManager] = useState<BookmarkManager | null>(null);

  // Initialize storage and bookmark manager
  useEffect(() => {
    const storage = new StorageManager(new MobileStorageAdapter());
    const bookmarkMgr = new BookmarkManager(storage);
    setBookmarkManager(bookmarkMgr);
    
    // Initialize mobile storage
    storage.adapter.init?.();
    
    // Load existing bookmarks
    bookmarkMgr.getBookmarkReferences().then(setBookmarks);
  }, []);

  const handleBookmark = async (verse: Verse) => {
    if (!bookmarkManager) return;
    
    try {
      const isBookmarked = await bookmarkManager.isBookmarked(verse.reference);
      
      if (isBookmarked) {
        await bookmarkManager.removeBookmark(verse.reference);
        setBookmarks(prev => prev.filter(ref => ref !== verse.reference));
      } else {
        await bookmarkManager.addBookmark(verse);
        setBookmarks(prev => [...prev, verse.reference]);
      }
    } catch (error) {
      console.error('Error managing bookmark:', error);
    }
  };

  const handleReadingProgress = (book: string, chapter: number) => {
    // In a real app, you'd save reading progress
    console.log(`Reading progress: ${book} ${chapter}`);
  };

  return (
    <MobileBibleReader
      onBookmark={handleBookmark}
      bookmarks={bookmarks}
      onReadingProgress={handleReadingProgress}
    />
  );
}