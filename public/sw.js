const CACHE_NAME = 'gospelhub-v1';
const STATIC_CACHE = 'gospelhub-static-v1';
const DYNAMIC_CACHE = 'gospelhub-dynamic-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  '/icon-192.png',
  '/icon-512.png'
];

const BIBLE_DATA_CACHE = 'bible-data-v1';

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => cache.addAll(STATIC_ASSETS)),
      caches.open(BIBLE_DATA_CACHE).then(cache => {
        // Pre-cache popular Bible books
        const popularBooks = [
          '/api/bible/Genesis/1',
          '/api/bible/Matthew/1',
          '/api/bible/John/1',
          '/api/bible/Psalms/23',
          '/api/bible/Romans/8'
        ];
        return cache.addAll(popularBooks.map(url => new Request(url)));
      })
    ])
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE && 
              cacheName !== BIBLE_DATA_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event with caching strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle Bible data requests
  if (url.pathname.startsWith('/api/bible/')) {
    event.respondWith(cacheFirstStrategy(request, BIBLE_DATA_CACHE));
    return;
  }

  // Handle static assets
  if (STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
    return;
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then(cache => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => caches.match('/offline.html'))
    );
    return;
  }

  // Default: network first, fallback to cache
  event.respondWith(networkFirstStrategy(request));
});

// Background sync for bookmarks and highlights
self.addEventListener('sync', event => {
  if (event.tag === 'sync-bookmarks') {
    event.waitUntil(syncBookmarks());
  }
  if (event.tag === 'sync-highlights') {
    event.waitUntil(syncHighlights());
  }
});

// Message handling for cache management
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CACHE_BIBLE_CHAPTER') {
    const { book, chapter, data } = event.data;
    caches.open(BIBLE_DATA_CACHE).then(cache => {
      cache.put(`/api/bible/${book}/${chapter}`, new Response(JSON.stringify(data)));
    });
  }
  
  if (event.data && event.data.type === 'GET_CACHE_SIZE') {
    getCacheSize().then(size => {
      event.ports[0].postMessage({ type: 'CACHE_SIZE', size });
    });
  }
});

// Caching strategies
async function cacheFirstStrategy(request, cacheName) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(cacheName);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    return new Response('Offline content not available', { status: 503 });
  }
}

async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Content not available offline', { status: 503 });
  }
}

// Background sync functions
async function syncBookmarks() {
  try {
    const bookmarks = await getStoredData('pendingBookmarks');
    if (bookmarks && bookmarks.length > 0) {
      await fetch('/api/sync/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookmarks)
      });
      await clearStoredData('pendingBookmarks');
    }
  } catch (error) {
    console.error('Bookmark sync failed:', error);
  }
}

async function syncHighlights() {
  try {
    const highlights = await getStoredData('pendingHighlights');
    if (highlights && highlights.length > 0) {
      await fetch('/api/sync/highlights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(highlights)
      });
      await clearStoredData('pendingHighlights');
    }
  } catch (error) {
    console.error('Highlights sync failed:', error);
  }
}

// Helper functions
async function getStoredData(key) {
  return new Promise((resolve) => {
    const request = indexedDB.open('GospelHubDB', 1);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['syncData'], 'readonly');
      const store = transaction.objectStore('syncData');
      const getRequest = store.get(key);
      getRequest.onsuccess = () => resolve(getRequest.result?.data);
    };
  });
}

async function clearStoredData(key) {
  return new Promise((resolve) => {
    const request = indexedDB.open('GospelHubDB', 1);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['syncData'], 'readwrite');
      const store = transaction.objectStore('syncData');
      store.delete(key);
      transaction.oncomplete = () => resolve();
    };
  });
}

async function getCacheSize() {
  const cacheNames = await caches.keys();
  let totalSize = 0;
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    
    for (const request of requests) {
      const response = await cache.match(request);
      if (response) {
        const blob = await response.blob();
        totalSize += blob.size;
      }
    }
  }
  
  return totalSize;
}