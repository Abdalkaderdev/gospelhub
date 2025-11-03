import { useState, useEffect } from 'react';
import { MainLayout } from './layouts';

interface Note {
  id: string;
  title: string;
  content: string;
  reference?: string;
  date: string;
}

export const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('gospel-notes');
    if (saved) setNotes(JSON.parse(saved));
  }, []);

  const saveNote = () => {
    const note: Note = {
      id: Date.now().toString(),
      title: title || 'Untitled',
      content,
      date: new Date().toLocaleDateString()
    };
    const updated = [note, ...notes];
    setNotes(updated);
    localStorage.setItem('gospel-notes', JSON.stringify(updated));
    setTitle('');
    setContent('');
    setShowForm(false);
  };

  return (
    <MainLayout title="Notes">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Notes</h1>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-amber-600 text-white px-4 py-2 rounded-lg"
          >
            New Note
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <input 
              type="text" 
              placeholder="Note title..." 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <textarea 
              placeholder="Write your note..." 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 border rounded h-32 mb-4"
            />
            <div className="flex gap-2">
              <button onClick={saveNote} className="bg-green-600 text-white px-4 py-2 rounded">
                Save
              </button>
              <button onClick={() => setShowForm(false)} className="bg-gray-500 text-white px-4 py-2 rounded">
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {notes.map(note => (
            <div key={note.id} className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold mb-2">{note.title}</h3>
              <p className="text-gray-600 mb-2">{note.content}</p>
              <small className="text-gray-400">{note.date}</small>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};