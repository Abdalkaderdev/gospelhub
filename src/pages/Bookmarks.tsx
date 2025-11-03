import { useState, useEffect } from 'react';
import { MainLayout } from './layouts';

interface Bookmark {
  id: string;
  verse: string;
  reference: string;
  date: string;
}

export const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('gospel-bookmarks');
    if (saved) setBookmarks(JSON.parse(saved));
  }, []);

  const removeBookmark = (id: string) => {
    const updated = bookmarks.filter(b => b.id !== id);
    setBookmarks(updated);
    localStorage.setItem('gospel-bookmarks', JSON.stringify(updated));
  };

  return (
    <MainLayout title="Bookmarks">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Bookmarks</h1>
        {bookmarks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-gray-600">No bookmarks yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookmarks.map(bookmark => (
              <div key={bookmark.id} className="bg-white rounded-lg shadow-sm p-4 flex justify-between">
                <div>
                  <h3 className="font-semibold">{bookmark.reference}</h3>
                  <p className="text-gray-600">{bookmark.verse}</p>
                  <small className="text-gray-400">{bookmark.date}</small>
                </div>
                <button 
                  onClick={() => removeBookmark(bookmark.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};