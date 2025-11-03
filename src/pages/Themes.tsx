import { useState } from 'react';
import { MainLayout } from './layouts';

const presetThemes = [
  { name: 'Light', bg: 'bg-white', text: 'text-gray-900', accent: 'bg-amber-600' },
  { name: 'Dark', bg: 'bg-gray-900', text: 'text-white', accent: 'bg-amber-500' },
  { name: 'Sepia', bg: 'bg-amber-50', text: 'text-amber-900', accent: 'bg-amber-700' },
  { name: 'Blue', bg: 'bg-blue-50', text: 'text-blue-900', accent: 'bg-blue-600' },
];

export const Themes = () => {
  const [selectedTheme, setSelectedTheme] = useState('Light');
  const [customColors, setCustomColors] = useState({
    background: '#ffffff',
    text: '#000000',
    accent: '#d97706'
  });

  const applyTheme = (theme: string) => {
    setSelectedTheme(theme);
    localStorage.setItem('gospel-theme', theme);
  };

  const saveCustomTheme = () => {
    localStorage.setItem('gospel-custom-theme', JSON.stringify(customColors));
    alert('Custom theme saved!');
  };

  return (
    <MainLayout title="Themes">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Theme Builder</h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Preset Themes</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {presetThemes.map(theme => (
              <div 
                key={theme.name}
                onClick={() => applyTheme(theme.name)}
                className={`${theme.bg} ${theme.text} p-4 rounded-lg border-2 cursor-pointer ${
                  selectedTheme === theme.name ? 'border-amber-500' : 'border-gray-200'
                }`}
              >
                <div className={`${theme.accent} w-full h-2 rounded mb-2`}></div>
                <h3 className="font-semibold">{theme.name}</h3>
                <p className="text-sm opacity-75">Sample text</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Custom Theme</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Background</label>
              <input 
                type="color" 
                value={customColors.background}
                onChange={(e) => setCustomColors({...customColors, background: e.target.value})}
                className="w-full h-10 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Text</label>
              <input 
                type="color" 
                value={customColors.text}
                onChange={(e) => setCustomColors({...customColors, text: e.target.value})}
                className="w-full h-10 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Accent</label>
              <input 
                type="color" 
                value={customColors.accent}
                onChange={(e) => setCustomColors({...customColors, accent: e.target.value})}
                className="w-full h-10 rounded"
              />
            </div>
          </div>
          
          <div 
            className="p-4 rounded-lg mb-4"
            style={{ 
              backgroundColor: customColors.background, 
              color: customColors.text 
            }}
          >
            <div 
              className="w-full h-2 rounded mb-2"
              style={{ backgroundColor: customColors.accent }}
            ></div>
            <h3 className="font-semibold">Custom Theme Preview</h3>
            <p className="text-sm opacity-75">This is how your theme will look</p>
          </div>
          
          <button 
            onClick={saveCustomTheme}
            className="bg-amber-600 text-white px-4 py-2 rounded-lg"
          >
            Save Custom Theme
          </button>
        </div>
      </div>
    </MainLayout>
  );
};