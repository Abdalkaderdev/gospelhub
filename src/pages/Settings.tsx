import { useState, useEffect } from 'react';
import { MainLayout } from './layouts';

interface UserSettings {
  fontSize: number;
  theme: string;
  translation: string;
  notifications: boolean;
}

export const Settings = () => {
  const [settings, setSettings] = useState<UserSettings>({
    fontSize: 16,
    theme: 'light',
    translation: 'ESV',
    notifications: true
  });

  useEffect(() => {
    const saved = localStorage.getItem('gospel-settings');
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  const updateSetting = (key: keyof UserSettings, value: any) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    localStorage.setItem('gospel-settings', JSON.stringify(updated));
  };

  return (
    <MainLayout title="Settings">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Font Size</label>
            <input 
              type="range" 
              min="12" 
              max="24" 
              value={settings.fontSize}
              onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
              className="w-full"
            />
            <span className="text-sm text-gray-500">{settings.fontSize}px</span>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Theme</label>
            <select 
              value={settings.theme}
              onChange={(e) => updateSetting('theme', e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="sepia">Sepia</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Default Translation</label>
            <select 
              value={settings.translation}
              onChange={(e) => updateSetting('translation', e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="ESV">ESV</option>
              <option value="NIV">NIV</option>
              <option value="KJV">KJV</option>
            </select>
          </div>

          <div className="flex items-center">
            <input 
              type="checkbox" 
              checked={settings.notifications}
              onChange={(e) => updateSetting('notifications', e.target.checked)}
              className="mr-2"
            />
            <label className="text-sm font-medium">Enable Notifications</label>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};