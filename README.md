# BetaLingo

A comprehensive Next.js application for learning web development interview skills with AI-powered pronunciation practice and interview simulation.

## Features

- **Vocabulary Lessons**: Organized lessons covering essential web development terms
- **Pronunciation Practice**: Record and get detailed feedback on your pronunciation using OpenAI's Whisper and GPT
- **Interview Simulation**: Practice answering common web development interview questions with AI evaluation
- **Progress Tracking**: Local storage-based progress tracking to identify areas for improvement
- **Demo Mode**: Practice without API calls when quota is exceeded
- **Responsive Design**: Built with Tailwind CSS for a modern, mobile-friendly interface

## Getting Started

### Prerequisites

- Node.js 18+
- OpenAI API key (free tier available at https://platform.openai.com)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/gabrielsdi/betalingo.git
   cd betalingo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```
   Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys).

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Navigation
1. **Home**: Welcome page with navigation to all features
2. **Lessons**: Browse available vocabulary lessons
3. **Practice**: Interactive pronunciation practice with AI feedback
4. **Interview**: Practice answering common web development interview questions
5. **Progress**: View your learning progress and completed activities

### Demo Mode
When OpenAI API quota is exceeded, enable **Demo Mode** to practice without API calls:
- Vocabulary practice shows simulated feedback
- Interview simulation provides sample evaluation responses
- All progress tracking continues to work normally

### API Usage & Quotas
- **Free Tier**: OpenAI provides $5 credit for new accounts
- **Cost Estimation**: ~$0.006 per vocabulary practice, ~$0.02 per interview evaluation
- **Demo Mode**: Unlimited practice when API quota is exceeded

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI Integration**: OpenAI GPT-4 and Whisper API
- **Audio Processing**: Web Audio API for microphone recording
- **Storage**: Browser localStorage for progress tracking

## Project Structure

```
betalingo/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── interview/         # Interview simulation page
│   ├── lessons/           # Vocabulary lessons page
│   ├── practice/          # Pronunciation practice pages
│   └── progress/          # Progress tracking page
├── lib/                   # Utility functions and data
└── public/               # Static assets
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly (including demo mode)
5. Submit a pull request

## License

MIT License - feel free to use this project for learning and development.
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
