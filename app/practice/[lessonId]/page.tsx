'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getLessonById, InterviewPhrase } from '@/lib/data';

type ExerciseType = 'translate-spanish' | 'translate-english' | 'multiple-choice';

interface Exercise {
  type: ExerciseType;
  question: string;
  correctAnswer: string;
  options?: string[];
  explanation: string;
  culturalNote?: string;
}

export default function Practice() {
  const params = useParams();
  const lessonId = params.lessonId as string;
  const lesson = getLessonById(lessonId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [completedItems, setCompletedItems] = useState<Set<number>>(new Set());
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    // Load progress from localStorage
    const saved = localStorage.getItem(`progress-${lessonId}`);
    if (saved) {
      setCompletedItems(new Set(JSON.parse(saved)));
    }
  }, [lessonId]);

  const saveProgress = (newCompleted: Set<number>) => {
    localStorage.setItem(`progress-${lessonId}`, JSON.stringify([...newCompleted]));
  };

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Lesson not found</h1>
          <Link href="/lessons" className="text-blue-600 hover:text-blue-800">
            ← Back to Lessons
          </Link>
        </div>
      </div>
    );
  }

  // Generate exercises based on lesson type
  const generateExercises = (): Exercise[] => {
    if (lesson.type === 'vocabulary' && lesson.words) {
      return lesson.words.map(word => ({
        type: 'multiple-choice' as ExerciseType,
        question: `What does "${word.term}" stand for?`,
        correctAnswer: word.definition,
        options: [
          word.definition,
          `A programming language called ${word.term}`,
          `A type of database named ${word.term}`,
          `A web browser extension for ${word.term}`
        ].sort(() => Math.random() - 0.5),
        explanation: word.example
      }));
    } else if (lesson.type === 'phrases' && lesson.phrases) {
      return lesson.phrases.map(phrase => ({
        type: 'translate-spanish' as ExerciseType,
        question: `How do you say in English: "${phrase.spanish}"?`,
        correctAnswer: phrase.english,
        explanation: `Context: ${phrase.context}`,
        culturalNote: phrase.culturalNote
      }));
    }
    return [];
  };

  const exercises = generateExercises();
  const currentExercise = exercises[currentIndex];
  const progress = ((completedItems.size) / exercises.length) * 100;

  const checkAnswer = () => {
    if (!selectedAnswer) return;

    const correct = selectedAnswer === currentExercise.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setStreak(prev => prev + 1);
      const newCompleted = new Set(completedItems);
      newCompleted.add(currentIndex);
      setCompletedItems(newCompleted);
      saveProgress(newCompleted);
    } else {
      setStreak(0);
    }
  };

  const nextExercise = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer('');
      setShowResult(false);
    }
  };

  const prevExercise = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedAnswer('');
      setShowResult(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/lessons" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to Lessons
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">{lesson.title}</h1>
          <p className="text-gray-600 mt-2">{lesson.description}</p>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-gray-600">
                {completedItems.size} of {exercises.length} exercises completed
              </p>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-orange-600">🔥 {streak}</span>
                <span className="text-sm text-gray-500">
                  {currentIndex + 1} of {exercises.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Exercise Card */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Exercise {currentIndex + 1}
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              {currentExercise.question}
            </p>

            {/* Answer Input */}
            {!showResult && (
              <div className="space-y-4">
                {currentExercise.type === 'multiple-choice' && currentExercise.options ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                    {currentExercise.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedAnswer(option)}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                          selectedAnswer === option
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="max-w-md mx-auto">
                    <input
                      type="text"
                      value={selectedAnswer}
                      onChange={(e) => setSelectedAnswer(e.target.value)}
                      placeholder="Type your answer..."
                      className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-center text-lg text-gray-900"
                      onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                    />
                  </div>
                )}

                <button
                  onClick={checkAnswer}
                  disabled={!selectedAnswer}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Check Answer
                </button>
              </div>
            )}

            {/* Result */}
            {showResult && (
              <div className={`p-6 rounded-lg mb-6 ${
                isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center justify-center mb-4">
                  <span className="text-4xl mr-3">{isCorrect ? '✅' : '❌'}</span>
                  <h3 className={`text-xl font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                    {isCorrect ? 'Correct!' : 'Not quite right'}
                  </h3>
                </div>

                {!isCorrect && (
                  <div className="mb-4">
                    <p className="text-gray-700 mb-2">
                      <strong>Correct answer:</strong> {currentExercise.correctAnswer}
                    </p>
                    <p className="text-gray-600 text-sm">
                      <strong>Your answer:</strong> {selectedAnswer}
                    </p>
                  </div>
                )}

                <div className="mb-4">
                  <p className="text-gray-700">
                    <strong>Explanation:</strong> {currentExercise.explanation}
                  </p>
                </div>

                {currentExercise.culturalNote && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-blue-700 text-sm">
                      <strong>💡 Cultural Note:</strong> {currentExercise.culturalNote}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevExercise}
            disabled={currentIndex === 0}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
          >
            Previous
          </button>

          {showResult && (
            <button
              onClick={nextExercise}
              disabled={currentIndex === exercises.length - 1}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
            >
              {currentIndex === exercises.length - 1 ? 'Finish Lesson' : 'Next Exercise'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}