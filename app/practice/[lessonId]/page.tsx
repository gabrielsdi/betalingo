'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getLessonById, Word } from '@/lib/data';

export default function Practice() {
  const params = useParams();
  const lessonId = params.lessonId as string;
  const lesson = getLessonById(lessonId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [feedback, setFeedback] = useState('');
  const [completedWords, setCompletedWords] = useState<Set<number>>(new Set());

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    // Load progress from localStorage
    const saved = localStorage.getItem(`progress-${lessonId}`);
    if (saved) {
      setCompletedWords(new Set(JSON.parse(saved)));
    }
  }, [lessonId]);

  const saveProgress = (newCompleted: Set<number>) => {
    localStorage.setItem(`progress-${lessonId}`, JSON.stringify([...newCompleted]));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');
      formData.append('expectedWord', currentWord.term);

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        if (errorData.error?.includes('quota') || errorData.error?.includes('billing') || errorData.error?.includes('insufficient_quota')) {
          throw new Error('OpenAI API quota exceeded. Please check your OpenAI account billing or wait for quota reset.');
        }
        throw new Error(`Failed to transcribe audio: ${errorData.error || 'Unknown error'}`);
      }

      const data = await response.json();
      setTranscription(data.transcription);
      setFeedback(data.feedback);

      // Mark as completed
      const newCompleted = new Set(completedWords);
      newCompleted.add(currentIndex);
      setCompletedWords(newCompleted);
      saveProgress(newCompleted);
    } catch (error) {
      console.error('Error processing audio:', error);
      setFeedback(error instanceof Error ? error.message : 'Error processing audio. Please try again.');
    }
  };

  const nextWord = () => {
    if (lesson && currentIndex < lesson.words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setTranscription('');
      setFeedback('');
    }
  };

  const prevWord = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setTranscription('');
      setFeedback('');
    }
  };

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Lesson not found</h1>
          <Link href="/lessons" className="text-blue-600 hover:text-blue-800">
            Back to Lessons
          </Link>
        </div>
      </div>
    );
  }

  const currentWord = lesson.words[currentIndex];
  const progress = ((completedWords.size) / lesson.words.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link href="/lessons" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to Lessons
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">{lesson.title}</h1>
          <div className="mt-4">
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {completedWords.size} of {lesson.words.length} words practiced
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {currentWord.term}
            </h2>
            <p className="text-lg text-gray-600 mb-4">{currentWord.definition}</p>
            <p className="text-gray-500 italic">{currentWord.example}</p>
          </div>

          <div className="text-center mb-8">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`px-6 py-3 rounded-lg font-semibold text-white ${
                isRecording
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-green-600 hover:bg-green-700'
              } transition-colors`}
            >
              {isRecording ? 'Stop Recording' : 'Start Pronunciation Practice'}
            </button>
          </div>

          {transcription && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Your Pronunciation:</h3>
              <p className="text-gray-700">{transcription}</p>
            </div>
          )}

          {feedback && (
            <div className="mb-6 p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Feedback:</h3>
              <p className="text-gray-700">{feedback}</p>
            </div>
          )}

          <div className="flex justify-between items-center">
            <button
              onClick={prevWord}
              disabled={currentIndex === 0}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
            >
              Previous
            </button>
            <span className="text-gray-600">
              {currentIndex + 1} of {lesson.words.length}
            </span>
            <button
              onClick={nextWord}
              disabled={currentIndex === lesson.words.length - 1}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}