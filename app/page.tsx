import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          BetaLingo
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Master web development interview vocabulary with AI-powered pronunciation practice
        </p>
        <div className="space-y-4">
          <Link
            href="/lessons"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Start Vocabulary Practice
          </Link>
          <br />
          <Link
            href="/interview"
            className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Practice Interview Questions
          </Link>
          <br />
          <Link
            href="/progress"
            className="inline-block text-blue-600 hover:text-blue-800 font-medium"
          >
            View Progress
          </Link>
        </div>
      </div>
    </div>
  );
}
