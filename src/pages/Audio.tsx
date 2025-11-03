import { useState, useRef } from 'react';
import { MainLayout } from './layouts';

export const Audio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVerse, setCurrentVerse] = useState('');
  const [speed, setSpeed] = useState(1);
  const [voice, setVoice] = useState('default');
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const sampleText = "In the beginning was the Word, and the Word was with God, and the Word was God.";

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = speed;
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      speechRef.current = utterance;
      speechSynthesis.speak(utterance);
    }
  };

  const stop = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const testAudio = () => {
    speak(sampleText);
  };

  return (
    <MainLayout title="Audio">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Text-to-Speech</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Audio Settings</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Reading Speed</label>
              <input 
                type="range" 
                min="0.5" 
                max="2" 
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full"
              />
              <span className="text-sm text-gray-500">{speed}x</span>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Voice</label>
              <select 
                value={voice}
                onChange={(e) => setVoice(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="default">Default</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Audio</h2>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="text-gray-700">{sampleText}</p>
            <small className="text-gray-500">John 1:1</small>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={testAudio}
              disabled={isPlaying}
              className="bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {isPlaying ? 'Playing...' : 'Play Test'}
            </button>
            <button 
              onClick={stop}
              className="bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Stop
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Audio Controls</h2>
          <p className="text-gray-600 mb-4">Audio controls will appear when reading Bible passages</p>
          <div className="flex gap-2 opacity-50">
            <button className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg">⏮️ Previous</button>
            <button className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg">⏯️ Play/Pause</button>
            <button className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg">⏭️ Next</button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};