import { MainLayout } from './layouts';

export const StudyTools = () => {
  return (
    <MainLayout title="Study Tools">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Study Tools</h1>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-2">Commentary</h3>
            <p className="text-gray-600">Verse commentary coming soon...</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-2">Cross References</h3>
            <p className="text-gray-600">Related verses coming soon...</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};