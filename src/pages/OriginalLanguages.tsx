import { useState } from 'react';
import { MainLayout } from './layouts';

const sampleWords = [
  { english: 'love', greek: 'ἀγαπάω', transliteration: 'agapao', strongs: 'G25', definition: 'to love, have affection for' },
  { english: 'world', greek: 'κόσμος', transliteration: 'kosmos', strongs: 'G2889', definition: 'order, world, universe' },
  { english: 'gave', greek: 'δίδωμι', transliteration: 'didomi', strongs: 'G1325', definition: 'to give, grant, supply' }
];

export const OriginalLanguages = () => {
  const [selectedWord, setSelectedWord] = useState(sampleWords[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [language, setLanguage] = useState('greek');

  return (
    <MainLayout title="Original Languages">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Hebrew & Greek Tools</h1>
        
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Search</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Language</label>
                  <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="greek">Greek</option>
                    <option value="hebrew">Hebrew</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Search Term</label>
                  <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Enter English word..." 
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Results</h3>
                <div className="space-y-2">
                  {sampleWords.map((word, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedWord(word)}
                      className={`w-full text-left p-2 rounded border ${
                        selectedWord === word ? 'bg-amber-50 border-amber-300' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-medium">{word.english}</div>
                      <div className="text-sm text-gray-500">{word.transliteration}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Word Study</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold mb-2">Original Text</h3>
                  <div className="text-3xl mb-2">{selectedWord.greek}</div>
                  <div className="text-gray-600">{selectedWord.transliteration}</div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Strong's Number</h3>
                  <div className="text-xl text-amber-600 mb-2">{selectedWord.strongs}</div>
                  <div className="text-gray-600">Concordance Reference</div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Definition</h3>
                <p className="text-gray-700">{selectedWord.definition}</p>
              </div>
              
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Usage in Scripture</h3>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-600">
                    This word appears 142 times in the New Testament
                  </p>
                  <div className="mt-2 space-y-1">
                    <div className="text-sm">John 3:16 - "For God so <span className="font-semibold text-amber-600">loved</span> the world..."</div>
                    <div className="text-sm">1 John 4:8 - "God is <span className="font-semibold text-amber-600">love</span>"</div>
                    <div className="text-sm">Romans 5:8 - "God demonstrates his <span className="font-semibold text-amber-600">love</span> for us..."</div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button className="bg-amber-600 text-white px-4 py-2 rounded-lg">
                  View All Occurrences
                </button>
                <button className="border border-gray-300 px-4 py-2 rounded-lg">
                  Related Words
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};