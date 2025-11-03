import { useState } from 'react';
import { MainLayout } from './layouts';

const characters = [
  { 
    name: 'Abraham', 
    title: 'Father of Faith', 
    period: 'Patriarchs',
    description: 'Called by God to leave his homeland and become the father of many nations',
    keyVerses: ['Genesis 12:1-3', 'Romans 4:16'],
    significance: 'Covenant with God, father of Isaac'
  },
  { 
    name: 'Moses', 
    title: 'The Lawgiver', 
    period: 'Exodus',
    description: 'Led Israel out of Egypt and received the Ten Commandments',
    keyVerses: ['Exodus 3:10', 'Deuteronomy 34:10'],
    significance: 'Delivered Israel, gave the Law'
  },
  { 
    name: 'David', 
    title: 'King of Israel', 
    period: 'Kingdom',
    description: 'Shepherd boy who became king, man after God\'s own heart',
    keyVerses: ['1 Samuel 16:13', '2 Samuel 7:16'],
    significance: 'United kingdom, Messianic lineage'
  },
  { 
    name: 'Jesus', 
    title: 'Son of God', 
    period: 'New Testament',
    description: 'The promised Messiah, Savior of the world',
    keyVerses: ['John 3:16', 'Matthew 1:21'],
    significance: 'Salvation, eternal life'
  },
  { 
    name: 'Paul', 
    title: 'Apostle to Gentiles', 
    period: 'Early Church',
    description: 'Former persecutor turned missionary and church planter',
    keyVerses: ['Acts 9:15', 'Galatians 2:8'],
    significance: 'Spread Gospel, wrote epistles'
  }
];

const periods = ['All', 'Patriarchs', 'Exodus', 'Kingdom', 'New Testament', 'Early Church'];

export const Characters = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('All');
  const [selectedCharacter, setSelectedCharacter] = useState(characters[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCharacters = characters.filter(char => 
    (selectedPeriod === 'All' || char.period === selectedPeriod) &&
    char.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout title="Characters">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Biblical Characters</h1>
        
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Search & Filter</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Search</label>
                  <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search characters..." 
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Period</label>
                  <select 
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    {periods.map(period => (
                      <option key={period} value={period}>{period}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Characters</h2>
              <div className="space-y-2">
                {filteredCharacters.map(character => (
                  <button
                    key={character.name}
                    onClick={() => setSelectedCharacter(character)}
                    className={`w-full text-left p-3 rounded border ${
                      selectedCharacter.name === character.name 
                        ? 'bg-amber-50 border-amber-300' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium">{character.name}</div>
                    <div className="text-sm text-gray-500">{character.title}</div>
                    <div className="text-xs text-amber-600">{character.period}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{selectedCharacter.name}</h2>
                  <p className="text-amber-600 font-medium">{selectedCharacter.title}</p>
                  <p className="text-sm text-gray-500">{selectedCharacter.period}</p>
                </div>
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-700">{selectedCharacter.description}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Key Verses</h3>
                  <div className="space-y-1">
                    {selectedCharacter.keyVerses.map((verse, index) => (
                      <div key={index} className="text-amber-600 text-sm">{verse}</div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Significance</h3>
                  <p className="text-gray-700">{selectedCharacter.significance}</p>
                </div>
                
                <div className="flex gap-2">
                  <button className="bg-amber-600 text-white px-4 py-2 rounded-lg">
                    Read Story
                  </button>
                  <button className="border border-gray-300 px-4 py-2 rounded-lg">
                    Related Characters
                  </button>
                  <button className="border border-gray-300 px-4 py-2 rounded-lg">
                    Timeline
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};