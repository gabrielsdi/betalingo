import Link from 'next/link';
import { lessons } from '@/lib/data';

export default function Lessons() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Lessons</h1>
          <p className="text-gray-600 mt-2">Choose a lesson to start practicing</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {lessons.filter(lesson => lesson.id === 'interview-phrases').map((lesson) => (
            <Link
              key={lesson.id}
              href={`/practice/${lesson.id}`}
              className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {lesson.title}
              </h2>
              <p className="text-gray-600 mb-4">{lesson.description}</p>
              <div className="flex flex-wrap gap-2">
                {lesson.type === 'vocabulary' && lesson.words ? (
                  <>
                    {lesson.words.slice(0, 4).map((word) => (
                      <span
                        key={word.term}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                      >
                        {word.term}
                      </span>
                    ))}
                    {lesson.words.length > 4 && (
                      <span className="text-gray-500 text-sm">
                        +{lesson.words.length - 4} more
                      </span>
                    )}
                  </>
                ) : lesson.type === 'phrases' && lesson.phrases ? (
                  <>
                    {lesson.phrases.slice(0, 4).map((phrase) => (
                      <span
                        key={phrase.id}
                        className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm"
                      >
                        {phrase.spanish}
                      </span>
                    ))}
                    {lesson.phrases.length > 4 && (
                      <span className="text-gray-500 text-sm">
                        +{lesson.phrases.length - 4} more
                      </span>
                    )}
                  </>
                ) : null}
              </div>
              <div className="mt-4 text-sm text-gray-500">
                {lesson.type === 'vocabulary' && lesson.words && `${lesson.words.length} words`}
                {lesson.type === 'phrases' && lesson.phrases && `${lesson.phrases.length} phrases`}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}