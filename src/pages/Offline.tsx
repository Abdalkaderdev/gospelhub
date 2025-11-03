import { useState, useEffect } from 'react';
import { MainLayout } from './layouts';

export const Offline = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cacheSize, setCacheSize] = useState('0 MB');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const downloadForOffline = async () => {
    setIsDownloading(true);
    setDownloadProgress(0);
    
    // Simulate download progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setDownloadProgress(i);
    }
    
    setIsDownloading(false);
    setCacheSize('25 MB');
    localStorage.setItem('gospel-offline-ready', 'true');
  };

  const clearCache = () => {
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
      });
    }
    setCacheSize('0 MB');
    localStorage.removeItem('gospel-offline-ready');
  };

  return (
    <MainLayout title="Offline">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Offline Reading</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Connection Status</h2>
            <div className={`px-3 py-1 rounded-full text-sm ${
              isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isOnline ? '🟢 Online' : '🔴 Offline'}
            </div>
          </div>
          <p className="text-gray-600">
            {isOnline 
              ? 'You are connected to the internet' 
              : 'You are offline but can still access downloaded content'
            }
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Download for Offline</h2>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Cache Size</span>
              <span>{cacheSize}</span>
            </div>
            {isDownloading && (
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-amber-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${downloadProgress}%` }}
                ></div>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={downloadForOffline}
              disabled={isDownloading}
              className="bg-amber-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {isDownloading ? `Downloading... ${downloadProgress}%` : 'Download Bible'}
            </button>
            <button 
              onClick={clearCache}
              className="bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Clear Cache
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Offline Features</h2>
          <ul className="space-y-2 text-gray-600">
            <li>✅ Read downloaded Bible translations</li>
            <li>✅ Access bookmarks and notes</li>
            <li>✅ View reading history</li>
            <li>❌ Search requires internet connection</li>
            <li>❌ Commentary requires internet connection</li>
          </ul>
        </div>
      </div>
    </MainLayout>
  );
};