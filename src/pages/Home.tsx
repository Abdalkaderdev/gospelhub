import { Link } from 'react-router-dom';
import { MainLayout } from './layouts';

export const Home = () => {
  return (
    <MainLayout title="Gospel Hub">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Gospel Hub
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your premium Bible reading and study experience
          </p>
          <div className="flex gap-4">
            <Link 
              to="/bible" 
              className="bg-amber-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-amber-700 transition-colors"
            >
              Start Reading
            </Link>
            <Link 
              to="/app" 
              className="bg-gray-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Full App
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          <Link to="/bible" className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl mb-4">📖</div>
            <h3 className="text-lg font-semibold mb-2">Bible Reader</h3>
            <p className="text-gray-600">Read with multiple translations</p>
          </Link>
          <Link to="/search" className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold mb-2">Search</h3>
            <p className="text-gray-600">Find verses instantly</p>
          </Link>
          <Link to="/study" className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl mb-4">📚</div>
            <h3 className="text-lg font-semibold mb-2">Study Tools</h3>
            <p className="text-gray-600">Commentary and references</p>
          </Link>
          <Link to="/plans" className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl mb-4">📅</div>
            <h3 className="text-lg font-semibold mb-2">Reading Plans</h3>
            <p className="text-gray-600">Guided schedules</p>
          </Link>
          <Link to="/bookmarks" className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl mb-4">🔖</div>
            <h3 className="text-lg font-semibold mb-2">Bookmarks</h3>
            <p className="text-gray-600">Save favorite verses</p>
          </Link>
          <Link to="/notes" className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl mb-4">📝</div>
            <h3 className="text-lg font-semibold mb-2">Notes</h3>
            <p className="text-gray-600">Personal study notes</p>
          </Link>
          <Link to="/highlights" className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl mb-4">🖍️</div>
            <h3 className="text-lg font-semibold mb-2">Highlights</h3>
            <p className="text-gray-600">Color-coded verses</p>
          </Link>
          <Link to="/analytics" className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-lg font-semibold mb-2">Analytics</h3>
            <p className="text-gray-600">Reading statistics</p>
          </Link>
          <Link to="/parallel" className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl mb-4">📋</div>
            <h3 className="text-lg font-semibold mb-2">Parallel View</h3>
            <p className="text-gray-600">Compare translations</p>
          </Link>
          <Link to="/languages" className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl mb-4">🏛️</div>
            <h3 className="text-lg font-semibold mb-2">Original Languages</h3>
            <p className="text-gray-600">Hebrew & Greek tools</p>
          </Link>
          <Link to="/maps" className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl mb-4">🗺️</div>
            <h3 className="text-lg font-semibold mb-2">Maps</h3>
            <p className="text-gray-600">Biblical geography</p>
          </Link>
          <Link to="/timeline" className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl mb-4">⏰</div>
            <h3 className="text-lg font-semibold mb-2">Timeline</h3>
            <p className="text-gray-600">Biblical chronology</p>
          </Link>
          <Link to="/characters" className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl mb-4">👥</div>
            <h3 className="text-lg font-semibold mb-2">Characters</h3>
            <p className="text-gray-600">Biblical figures</p>
          </Link>
          <Link to="/settings" className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl mb-4">⚙️</div>
            <h3 className="text-lg font-semibold mb-2">Settings</h3>
            <p className="text-gray-600">Preferences</p>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};