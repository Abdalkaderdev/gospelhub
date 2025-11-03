import { useState, useEffect } from 'react';
import { MainLayout } from './layouts';

interface Highlight {
  id: string;
  text: string;
  reference: string;
  color: string;
  date: string;
}

const colors = ['yellow', 'green', 'blue', 'pink', 'purple'];

export const Highlights = () => {
  const [highlights, setHighlights] = useState<Highlight[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('gospel-highlights');
    if (saved) setHighlights(JSON.parse(saved));
  }, []);

  const removeHighlight = (id: string) => {
    const updated = highlights.filter(h => h.id !== id);
    setHighlights(updated);
    localStorage.setItem('gospel-highlights', JSON.stringify(updated));
  };

  return (
    <MainLayout title="Highlights">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Highlights</h1>
        
        <div className="flex gap-2 mb-6">
          {colors.map(color => (
            <div key={color} className={`w-6 h-6 rounded bg-${color}-200 border`} />
          ))}
        </div>

        {highlights.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-gray-600">No highlights yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {highlights.map(highlight => (
              <div key={highlight.id} className="bg-white rounded-lg shadow-sm p-4 flex justify-between">
                <div className="flex-1">
                  <div className={`bg-${highlight.color}-200 p-2 rounded mb-2`}>
                    <p>{highlight.text}</p>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{highlight.reference}</span>
                    <span>{highlight.date}</span>
                  </div>
                </div>
                <button 
                  onClick={() => removeHighlight(highlight.id)}
                  className="text-red-500 hover:text-red-700 ml-4"
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