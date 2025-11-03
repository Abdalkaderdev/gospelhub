import { useState } from 'react';
import { MainLayout } from './layouts';

const timelineEvents = [
  { date: '4004 BC', event: 'Creation', description: 'God creates the world', reference: 'Genesis 1' },
  { date: '2348 BC', event: 'The Flood', description: 'Noah and the ark', reference: 'Genesis 6-9' },
  { date: '2091 BC', event: 'Call of Abraham', description: 'God calls Abraham', reference: 'Genesis 12' },
  { date: '1446 BC', event: 'The Exodus', description: 'Israel leaves Egypt', reference: 'Exodus 12' },
  { date: '1406 BC', event: 'Conquest of Canaan', description: 'Joshua leads Israel', reference: 'Joshua 1' },
  { date: '1010 BC', event: 'David becomes King', description: 'David rules Israel', reference: '2 Samuel 2' },
  { date: '586 BC', event: 'Babylonian Exile', description: 'Jerusalem destroyed', reference: '2 Kings 25' },
  { date: '4 BC', event: 'Birth of Jesus', description: 'Jesus born in Bethlehem', reference: 'Matthew 2' },
  { date: '30 AD', event: 'Crucifixion', description: 'Jesus dies and rises', reference: 'Matthew 27-28' },
  { date: '70 AD', event: 'Temple Destroyed', description: 'Romans destroy temple', reference: 'Luke 21:20' }
];

const periods = ['All', 'Creation to Abraham', 'Patriarchs', 'Exodus to Kings', 'Exile and Return', 'New Testament'];

export const Timeline = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState(timelineEvents[0]);

  const filteredEvents = selectedPeriod === 'All' ? timelineEvents : timelineEvents;

  return (
    <MainLayout title="Timeline">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Biblical Chronology</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Time Periods</h2>
          <div className="flex flex-wrap gap-2">
            {periods.map(period => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1 rounded-lg border ${
                  selectedPeriod === period
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Timeline</h2>
              
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-amber-200"></div>
                
                <div className="space-y-6">
                  {filteredEvents.map((event, index) => (
                    <div 
                      key={index}
                      onClick={() => setSelectedEvent(event)}
                      className={`relative pl-10 cursor-pointer p-3 rounded-lg ${
                        selectedEvent === event ? 'bg-amber-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="absolute left-2 w-4 h-4 bg-amber-600 rounded-full border-2 border-white"></div>
                      <div className="font-semibold text-amber-700">{event.date}</div>
                      <div className="font-medium">{event.event}</div>
                      <div className="text-sm text-gray-600">{event.description}</div>
                      <div className="text-xs text-gray-500">{event.reference}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Event Details</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-amber-600">{selectedEvent.date}</h3>
                  <h4 className="font-medium text-lg">{selectedEvent.event}</h4>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-gray-700">{selectedEvent.description}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Scripture Reference</h4>
                  <p className="text-amber-600">{selectedEvent.reference}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Historical Context</h4>
                  <p className="text-sm text-gray-600">
                    This event occurred during a significant period in biblical history, 
                    marking an important milestone in God's plan for humanity.
                  </p>
                </div>
                
                <button className="w-full bg-amber-600 text-white py-2 rounded-lg">
                  Read Scripture
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};