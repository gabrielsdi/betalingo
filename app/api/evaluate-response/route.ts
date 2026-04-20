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

    // Transcribe audio using Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'en',
    });

    console.log('Transcription:', transcription.text);

    // Evaluate the response using GPT
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

    const evaluationResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: evaluationPrompt }],
      max_tokens: 800,
    });

    const feedback = evaluationResponse.choices[0]?.message?.content || 'Good response! Keep practicing.';

    return NextResponse.json({
      transcription: transcription.text,
      feedback,
    });
  } catch (error) {
    console.error('Error evaluating response:', error);
    return NextResponse.json({ error: 'Failed to evaluate response' }, { status: 500 });
  }
}