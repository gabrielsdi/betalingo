'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const interviewQuestions = [
  "What is React and why would you use it?",
  "Explain the difference between var, let, and const in JavaScript.",
  "How does the event loop work in Node.js?",
  "What are closures in JavaScript and can you give an example?",
  "Explain the concept of responsive web design.",
  "What is the difference between REST and GraphQL?",
  "How would you optimize the performance of a React application?",
  "Explain what CORS is and why it's important.",
  "What are promises in JavaScript and how do they work?",
  "Describe the component lifecycle in React."
];

export default function Interview() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [feedback, setFeedback] = useState('');
  const [completedQuestions, setCompletedQuestions] = useState<Set<number>>(new Set());
  const [demoMode, setDemoMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    // Load progress from localStorage
    const saved = localStorage.getItem('interview-progress');
    if (saved) {
      setCompletedQuestions(new Set(JSON.parse(saved)));
    }
  }, []);

  const saveProgress = (newCompleted: Set<number>) => {
    localStorage.setItem('interview-progress', JSON.stringify([...newCompleted]));
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
      setIsProcessing(true); // Start loading immediately when stopping recording
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      if (demoMode) {
        // Demo mode: simulate processing with realistic feedback
        setTranscription(`Demo transcription: "${interviewQuestions[currentQuestionIndex]}"`);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        const demoFeedback = `CONTENT ANALYSIS:
- Strengths of the answer: Good structure and clear communication
- Areas for improvement: Could be more specific with technical details
- Technical accuracy: Basic understanding demonstrated
- Completeness of the response: Covers main points but could be more detailed

PRONUNCIATION & COMMUNICATION:
- Clarity of speech: Clear and understandable
- Professional communication skills: Good pacing and confidence
- Specific words/phrases that need pronunciation improvement: "${interviewQuestions[currentQuestionIndex].split(' ')[0]}" could be more precise
- Suggestions for better delivery: Practice speaking at a slightly slower pace

OVERALL SCORE: 7/10

RECOMMENDATIONS:
1. Add more specific technical examples
2. Practice pronunciation of technical terms
3. Focus on confidence and clarity in delivery
4. Consider time management for longer answers`;

        setFeedback(demoFeedback);

        // Mark as completed
        const newCompleted = new Set(completedQuestions);
        newCompleted.add(currentQuestionIndex);
        setCompletedQuestions(newCompleted);
        saveProgress(newCompleted);
        return;
      }

      // Real API mode
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');
      formData.append('question', interviewQuestions[currentQuestionIndex]);

      const response = await fetch('/api/evaluate-response', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        if (errorData.error?.includes('quota') || errorData.error?.includes('billing') || errorData.error?.includes('insufficient_quota')) {
          throw new Error('OpenAI API quota exceeded. Please check your OpenAI account billing or enable Demo Mode to practice without API calls.');
        }
        throw new Error(`Failed to process response: ${errorData.error || 'Unknown error'}`);
      }

      const data = await response.json();
      setTranscription(data.transcription);
      setFeedback(data.feedback);

      // Mark as completed
      const newCompleted = new Set(completedQuestions);
      newCompleted.add(currentQuestionIndex);
      setCompletedQuestions(newCompleted);
      saveProgress(newCompleted);

    } catch (error) {
      console.error('Error processing audio:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error processing response. Please try again.';
      setFeedback(`❌ Error: ${errorMessage}

💡 Try enabling Demo Mode to practice without API calls.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < interviewQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTranscription('');
      setFeedback('');
      setIsProcessing(false);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setTranscription('');
      setFeedback('');
      setIsProcessing(false);
    }
  };

  const currentQuestion = interviewQuestions[currentQuestionIndex];
  const progress = ((completedQuestions.size) / interviewQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Interview Simulation</h1>
          <p className="text-gray-600 mt-2">Practice answering common web development interview questions</p>
          <div className="mt-4">
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {completedQuestions.size} of {interviewQuestions.length} questions answered
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Question {currentQuestionIndex + 1}
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="demo-mode" className="text-sm text-gray-600">Demo Mode</label>
              <input
                id="demo-mode"
                type="checkbox"
                checked={demoMode}
                onChange={(e) => setDemoMode(e.target.checked)}
                className="rounded"
              />
            </div>
          </div>
          <div className="text-center mb-8">
            <p className="text-lg text-gray-700 leading-relaxed">
              {currentQuestion}
            </p>
          </div>

          <div className="text-center mb-8">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessing}
              className={`px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
                isProcessing
                  ? 'bg-gray-400 cursor-not-allowed opacity-60'
                  : isRecording
                  ? 'bg-red-600 hover:bg-red-700 animate-pulse'
                  : 'bg-green-600 hover:bg-green-700 hover:scale-105'
              }`}
            >
              {isProcessing ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Analyzing...</span>
                </div>
              ) : isRecording ? (
                'Stop Recording'
              ) : (
                `Start Your Answer${demoMode ? ' (Demo)' : ''}`
              )}
            </button>
            <p className="text-sm text-gray-500 mt-2">
              {isProcessing
                ? 'AI is analyzing your response...'
                : isRecording
                ? 'Recording... Click to stop and get feedback'
                : 'Click to record your response using your microphone'
              }
            </p>
          </div>

          {transcription && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Your Response:</h3>
              <p className="text-gray-700">{transcription}</p>
            </div>
          )}

          {isProcessing && (
            <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-600"></div>
                <div>
                  <h3 className="font-semibold text-gray-900">AI is analyzing your response...</h3>
                  <p className="text-sm text-gray-600">This may take a few seconds</p>
                </div>
              </div>
            </div>
          )}

          {feedback && !isProcessing && (
            <div className="mb-6 p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Feedback:</h3>
              <div className="text-gray-700 whitespace-pre-line">{feedback}</div>
            </div>
          )}

          <div className="flex justify-between items-center">
            <button
              onClick={prevQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
            >
              Previous
            </button>
            <span className="text-gray-600">
              {currentQuestionIndex + 1} of {interviewQuestions.length}
            </span>
            <button
              onClick={nextQuestion}
              disabled={currentQuestionIndex === interviewQuestions.length - 1}
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