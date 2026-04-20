# BetaLingo

A Next.js application for learning web development interview vocabulary with AI-powered pronunciation practice.

## Features

- **Vocabulary Lessons**: Organized lessons covering essential web development terms
- **Pronunciation Practice**: Record and get feedback on your pronunciation using OpenAI's Whisper and GPT
- **Progress Tracking**: Local storage-based progress tracking to identify areas for improvement
- **Responsive Design**: Built with Tailwind CSS for a modern, mobile-friendly interface

## Getting Started

### Prerequisites

- Node.js 18+
- OpenAI API key (free tier available)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Home**: Welcome page with navigation
2. **Lessons**: Browse available vocabulary lessons
3. **Practice**: Interactive pronunciation practice with AI feedback
4. **Progress**: View your learning progress and areas for improvement

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: OpenAI API (Whisper for transcription, GPT for feedback)
- **Storage**: Local Storage for progress tracking

## API Routes

- `POST /api/transcribe`: Processes audio recordings for transcription and feedback

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License
