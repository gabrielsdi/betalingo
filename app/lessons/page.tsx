import Link from 'next/link';

const lessons = [
  {
    id: 'basics',
    title: 'Basic Web Development Terms',
    description: 'Essential vocabulary for web development interviews',
    words: ['HTML', 'CSS', 'JavaScript', 'DOM', 'API', 'HTTP', 'Browser', 'Server']
  },
  {
    id: 'frameworks',
    title: 'Frameworks & Libraries',
    description: 'Popular frameworks and their concepts',
    words: ['React', 'Vue', 'Angular', 'Node.js', 'Express', 'Next.js', 'Tailwind']
  },
  {
    id: 'algorithms',
    title: 'Algorithms & Data Structures',
    description: 'Key terms for algorithmic questions',
    words: ['Array', 'Linked List', 'Stack', 'Queue', 'Hash Table', 'Tree', 'Graph']
  },
  {
    id: 'databases',
    title: 'Databases',
    description: 'Database concepts and technologies',
    words: ['SQL', 'NoSQL', 'MongoDB', 'PostgreSQL', 'Redis', 'ORM', 'Migration']
  }
];

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
          {lessons.map((lesson) => (
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
                {lesson.words.slice(0, 4).map((word) => (
                  <span
                    key={word}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                  >
                    {word}
                  </span>
                ))}
                {lesson.words.length > 4 && (
                  <span className="text-gray-500 text-sm">
                    +{lesson.words.length - 4} more
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}