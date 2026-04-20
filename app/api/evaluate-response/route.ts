import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const question = formData.get('question') as string;

    if (!audioFile || !question) {
      return NextResponse.json({ error: 'Missing audio file or question' }, { status: 400 });
    }

    console.log('Evaluating response for question:', question);
    console.log('Audio file size:', audioFile.size, 'type:', audioFile.type);

    let transcription;
    try {
      // Transcribe audio using Whisper
      transcription = await openai.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1',
        language: 'en',
      });
    } catch (transcriptionError: any) {
      console.error('Transcription error:', transcriptionError);

      // Check for specific OpenAI errors
      if (transcriptionError?.status === 429) {
        return NextResponse.json({
          error: 'OpenAI API quota exceeded. You have reached your daily/monthly usage limit. Please check your OpenAI account billing or wait for quota reset.',
          type: 'quota_exceeded',
          details: 'This affects both transcription and evaluation services.'
        }, { status: 429 });
      }

      if (transcriptionError?.code === 'insufficient_quota') {
        return NextResponse.json({
          error: 'OpenAI API quota exceeded. You have reached your daily/monthly usage limit. Please check your OpenAI account billing or wait for quota reset.',
          type: 'quota_exceeded',
          details: 'This affects both transcription and evaluation services.'
        }, { status: 429 });
      }

      // For other transcription errors
      return NextResponse.json({
        error: `Transcription failed: ${transcriptionError?.message || 'Unknown error'}`,
        type: 'transcription_error'
      }, { status: 500 });
    }

    console.log('Transcription:', transcription.text);

    let evaluationResponse;
    const evaluationPrompt = `
You are an expert technical interviewer evaluating a candidate's response to: "${question}"

Candidate's response: "${transcription.text}"

Please provide detailed feedback in the following format:

CONTENT ANALYSIS:
- Strengths of the answer
- Areas for improvement
- Technical accuracy
- Completeness of the response

PRONUNCIATION & COMMUNICATION:
- Clarity of speech
- Professional communication skills
- Specific words/phrases that need pronunciation improvement
- Suggestions for better delivery

OVERALL SCORE: [1-10]

RECOMMENDATIONS: [3-5 specific suggestions for improvement]

Keep the feedback constructive, encouraging, and actionable. Focus on both technical content and communication skills.
`;

    try {
      // Evaluate the response using GPT
      evaluationResponse = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: evaluationPrompt }],
        max_tokens: 800,
      });
    } catch (evaluationError: any) {
      console.error('Evaluation error:', evaluationError);

      // Check for specific OpenAI errors in evaluation
      if (evaluationError?.status === 429 || evaluationError?.code === 'insufficient_quota') {
        return NextResponse.json({
          error: 'OpenAI API quota exceeded during evaluation. You have reached your daily/monthly usage limit. Transcription was successful, but evaluation failed.',
          type: 'quota_exceeded_evaluation',
          transcription: transcription.text,
          details: 'Transcription completed but evaluation failed due to quota limits.'
        }, { status: 429 });
      }

      // For other evaluation errors, still return transcription if available
      return NextResponse.json({
        error: `Evaluation failed: ${evaluationError?.message || 'Unknown error'}`,
        type: 'evaluation_error',
        transcription: transcription.text
      }, { status: 500 });
    }

    const feedback = evaluationResponse.choices[0]?.message?.content || 'Good response! Keep practicing.';

    return NextResponse.json({
      transcription: transcription.text,
      feedback,
    });
  } catch (error: any) {
    console.error('Unexpected error in evaluate-response:', error);
    return NextResponse.json({
      error: 'An unexpected error occurred while processing your response.',
      type: 'unexpected_error'
    }, { status: 500 });
  }
}