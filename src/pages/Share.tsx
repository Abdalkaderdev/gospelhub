import { useState } from 'react';
import { MainLayout } from './layouts';

export const Share = () => {
  const [selectedVerse, setSelectedVerse] = useState({
    text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
    reference: "John 3:16"
  });
  const [shareMessage, setShareMessage] = useState('');

  const shareVerse = async (platform: string) => {
    const text = `"${selectedVerse.text}" - ${selectedVerse.reference}`;
    
    if (navigator.share && platform === 'native') {
      try {
        await navigator.share({
          title: 'Bible Verse',
          text: text,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      const urls = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(text)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(text)}`,
        email: `mailto:?subject=Bible Verse&body=${encodeURIComponent(text)}`
      };
      
      if (urls[platform as keyof typeof urls]) {
        window.open(urls[platform as keyof typeof urls], '_blank');
      }
    }
  };

  const copyToClipboard = () => {
    const text = `"${selectedVerse.text}" - ${selectedVerse.reference}`;
    navigator.clipboard.writeText(text).then(() => {
      setShareMessage('Copied to clipboard!');
      setTimeout(() => setShareMessage(''), 2000);
    });
  };

  return (
    <MainLayout title="Share">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Share Verses</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Selected Verse</h2>
          <div className="bg-amber-50 p-4 rounded-lg mb-4">
            <p className="text-gray-700 mb-2">"{selectedVerse.text}"</p>
            <p className="text-amber-700 font-semibold">{selectedVerse.reference}</p>
          </div>
          
          {shareMessage && (
            <div className="bg-green-100 text-green-800 p-2 rounded mb-4">
              {shareMessage}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Share Options</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button 
              onClick={() => shareVerse('native')}
              className="flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-gray-50"
            >
              📱 Native Share
            </button>
            <button 
              onClick={() => shareVerse('twitter')}
              className="flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-gray-50"
            >
              🐦 Twitter
            </button>
            <button 
              onClick={() => shareVerse('facebook')}
              className="flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-gray-50"
            >
              📘 Facebook
            </button>
            <button 
              onClick={() => shareVerse('whatsapp')}
              className="flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-gray-50"
            >
              💬 WhatsApp
            </button>
            <button 
              onClick={() => shareVerse('email')}
              className="flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-gray-50"
            >
              📧 Email
            </button>
            <button 
              onClick={copyToClipboard}
              className="flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-gray-50"
            >
              📋 Copy
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Share Templates</h2>
          <div className="space-y-2">
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm">"[Verse]" - [Reference] #BibleVerse #Faith</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm">Today's inspiration: "[Verse]" - [Reference]</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm">Reflecting on: "[Verse]" - [Reference] 🙏</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};