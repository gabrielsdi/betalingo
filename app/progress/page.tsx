'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { lessons } from '@/lib/data';

interface ProgressData {
  [lessonId: string]: number[];
}

export default function Progress() {
  const [progress, setProgress] = useState<ProgressData>({});
  const [interviewProgress, setInterviewProgress] = useState<Set<number>>(new Set());

  useEffect(() => {
    // Load progress for all lessons
    const allProgress: ProgressData = {};
    lessons.forEach(lesson => {
      const saved = localStorage.getItem(`progress-${lesson.id}`);
      if (saved) {
        allProgress[lesson.id] = JSON.parse(saved);
      } else {
        allProgress[lesson.id] = [];
      }
    });
    setProgress(allProgress);

    // Load interview progress
    const interviewSaved = localStorage.getItem('interview-progress');
    if (interviewSaved) {
      setInterviewProgress(new Set(JSON.parse(interviewSaved)));
    }
  }, []);

  const getInterviewProgress = () => {
    return (interviewProgress.size / 10) * 100; // 10 questions
  };

  const getLessonProgress = (lessonId: string) => {
    const completed = progress[lessonId] || [];
    const lesson = lessons.find(l => l.id === lessonId);
    return lesson && lesson.words ? (completed.length / lesson.words.length) * 100 : 0;
  };

  const getTotalProgress = () => {
    const totalWords = lessons.reduce((sum, lesson) => sum + (lesson.words ? lesson.words.length : 0), 0);
    const totalCompleted = Object.values(progress).reduce((sum, completed) => sum + completed.length, 0);
    return totalWords > 0 ? (totalCompleted / totalWords) * 100 : 0;
  };

  const getAreasForImprovement = () => {
    const areas: string[] = [];
    lessons.forEach(lesson => {
      const progressPercent = getLessonProgress(lesson.id);
      if (progressPercent < 50) {
        areas.push(lesson.title);
      }
    });
    return areas;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Your Progress</h1>
          <p className="text-gray-600 mt-2">Track your learning journey</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Overall Progress</h2>
          <div className="mb-4">
            <div className="bg-gray-200 rounded-full h-4">
              <div
                className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                style={{ width: `${getTotalProgress()}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {getTotalProgress().toFixed(1)}% complete
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {lessons.map(lesson => {
            const progressPercent = getLessonProgress(lesson.id);
            const completedCount = progress[lesson.id]?.length || 0;

            return (
              <div key={lesson.id} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {lesson.title}
                </h3>
                <p className="text-gray-600 mb-4">{lesson.description}</p>
                <div className="mb-4">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {completedCount} of {lesson.words ? lesson.words.length : 0} words practiced ({progressPercent.toFixed(1)}%)
                  </p>
                </div>
                <Link
                  href={`/practice/${lesson.id}`}
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Continue Practice
                </Link>
              </div>
            );
          })}

          {/* Interview Progress */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Interview Simulation
            </h3>
            <p className="text-gray-600 mb-4">Practice answering technical interview questions</p>
            <div className="mb-4">
              <div className="bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getInterviewProgress()}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {interviewProgress.size} of 10 questions answered ({getInterviewProgress().toFixed(1)}%)
              </p>
            </div>
            <Link
              href="/interview"
              className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Start Interview
            </Link>
          </div>
        </div>

        {getAreasForImprovement().length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              Areas for Improvement
            </h3>
            <p className="text-yellow-700 mb-4">
              Focus on these lessons to boost your progress:
            </p>
            <ul className="list-disc list-inside text-yellow-700">
              {getAreasForImprovement().map(area => (
                <li key={area}>{area}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Keep Practicing!
          </h3>
          <p className="text-green-700">
            Regular practice with pronunciation exercises will help you master these terms for your interviews.
          </p>
        </div>
      </div>
    </div>
  );
}