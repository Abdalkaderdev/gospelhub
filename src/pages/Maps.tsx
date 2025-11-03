import { useState } from 'react';
import { MainLayout } from './layouts';

const locations = [
  { name: 'Jerusalem', description: 'Holy city, site of the Temple', coordinates: '31.7683,35.2137' },
  { name: 'Bethlehem', description: 'Birthplace of Jesus', coordinates: '31.7054,35.2024' },
  { name: 'Nazareth', description: 'Hometown of Jesus', coordinates: '32.7009,35.2035' },
  { name: 'Sea of Galilee', description: 'Where Jesus called disciples', coordinates: '32.8156,35.5897' },
  { name: 'Mount Sinai', description: 'Where Moses received the Law', coordinates: '28.5392,33.9734' }
];

const timeperiods = ['Old Testament', 'New Testament', 'Paul\'s Journeys'];

export const Maps = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('New Testament');
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);

  return (
    <MainLayout title="Maps">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Biblical Geography</h1>
        
        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Time Period</h2>
              <div className="space-y-2">
                {timeperiods.map(period => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`w-full text-left p-2 rounded ${
                      selectedPeriod === period 
                        ? 'bg-amber-600 text-white' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Locations</h2>
              <div className="space-y-2">
                {locations.map(location => (
                  <button
                    key={location.name}
                    onClick={() => setSelectedLocation(location)}
                    className={`w-full text-left p-2 rounded ${
                      selectedLocation.name === location.name 
                        ? 'bg-amber-50 border border-amber-300' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium">{location.name}</div>
                    <div className="text-sm text-gray-500">{location.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Map View</h2>
                <div className="text-sm text-gray-500">{selectedPeriod}</div>
              </div>
              
              <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center mb-4">
                <div className="text-center">
                  <div className="text-4xl mb-2">🗺️</div>
                  <p className="text-gray-600">Interactive map coming soon</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Showing: {selectedLocation.name}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button className="bg-amber-600 text-white px-4 py-2 rounded-lg">
                  Satellite View
                </button>
                <button className="border border-gray-300 px-4 py-2 rounded-lg">
                  Historical View
                </button>
                <button className="border border-gray-300 px-4 py-2 rounded-lg">
                  3D View
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">{selectedLocation.name}</h2>
              <p className="text-gray-700 mb-4">{selectedLocation.description}</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Biblical Events</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Jesus' birth (Matthew 2:1)</li>
                    <li>• Visit of the Magi (Matthew 2:11)</li>
                    <li>• Prophecy fulfillment (Micah 5:2)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Modern Information</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Population: ~25,000</li>
                    <li>• Distance from Jerusalem: 10 km</li>
                    <li>• Elevation: 765 meters</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};