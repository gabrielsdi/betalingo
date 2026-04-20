import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const expectedWord = formData.get('expectedWord') as string;

    if (!audioFile || !expectedWord) {
      return NextResponse.json({ error: 'Missing audio file or expected word' }, { status: 400 });
    }

    console.log('Processing audio for word:', expectedWord);
    console.log('Audio file size:', audioFile.size, 'type:', audioFile.type);

    // Transcribe audio using Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'en',
    });

    console.log('Transcription:', transcription.text);

    // Generate feedback using GPT
    const feedbackPrompt = `
You are a pronunciation coach for web development interview preparation.
The user was asked to pronounce: "${expectedWord}"
Their transcription: "${transcription.text}"

Provide brief, encouraging feedback on their pronunciation. If there are issues, suggest improvements.
Keep it positive and motivating. Focus on clarity and accuracy for professional communication.
`;

    const feedbackResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: feedbackPrompt }],
      max_tokens: 150,
    });

    const feedback = feedbackResponse.choices[0]?.message?.content || 'Good job!';

    return NextResponse.json({
      transcription: transcription.text,
      feedback,
    });
  } catch (error) {
    console.error('Error processing audio:', error);
    return NextResponse.json({ error: 'Failed to process audio' }, { status: 500 });
  }
}