# myHCP - CLL Sales Call Practice Platform

A platform for pharmaceutical sales representatives to practice their sales calls with AI-powered healthcare providers specializing in Chronic Lymphocytic Leukemia (CLL) treatment.

## Features

- Practice sales calls with AI-powered CLL specialists
- Interact with different healthcare provider personalities
- Realistic conversation simulation
- Focus on CLL treatment discussions
- Professional and educational environment

## Prerequisites

- Node.js 18.x or later
- npm or yarn
- OpenAI API key

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd myhcp
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your OpenAI API key:
```
OPENAI_API_KEY=your_openai_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Select a healthcare provider from the home page
2. Start a conversation about CLL treatment options
3. Practice your sales pitch and handle questions/concerns
4. Receive realistic feedback and responses based on the provider's personality and expertise

## Available Healthcare Providers

- Dr. Sarah Chen - Data-driven Hematologist-Oncologist
- Dr. Michael Rodriguez - Research-oriented CLL Specialist
- Dr. Emma Patel - Patient-centered CLL Expert
- Jennifer Martinez, NP - CLL Nurse Practitioner

## Development

The application is built with:
- Next.js 14
- TypeScript
- Tailwind CSS
- OpenAI GPT-4
- React

## License

MIT 