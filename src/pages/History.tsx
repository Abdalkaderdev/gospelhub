import { useState, useEffect } from 'react';
import { MainLayout } from './layouts';

interface HistoryItem {
  id: string;
  reference: string;
  date: string;
  time: string;
}

export const History = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('gospel-history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('gospel-history');
  };

  return (
    <MainLayout title="History">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Reading History</h1>
          {history.length > 0 && (
            <button 
              onClick={clearHistory}
              className="bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Clear All
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-gray-600">No reading history yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {history.map(item => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm p-4 flex justify-between">
                <span className="font-medium">{item.reference}</span>
                <div className="text-gray-500 text-sm">
                  <span>{item.date}</span>
                  <span className="ml-2">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};