# Review Response Generator

A Next.js web application that generates AI-powered responses to product reviews. Users can select from synthetic reviews, choose a response tone, and get AI-generated responses with options to regenerate, edit, or accept.

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **TanStack Query** (React Query)

## Features

- 15 synthetic product reviews (mix of positive, negative, and neutral)
- Review selection with visual feedback
- Tone selection dropdown (Friendly, Formal, Apologetic, Neutral/Professional)
- AI response generation with loading indicators
- Key concerns highlighting for negative reviews
- Response editing capability
- Regenerate functionality
- Accept action

## Getting Started

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```
GEMINI_API_KEY=your_google_gemini_api_key
```

This key powers the AI response endpoint. Never commit the actual value to source control.

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Build

Build the application for production:

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## Project Structure

```
/app
  /api
    /generate-response
      route.ts          # Mock API endpoint
  /components
    ReviewSelector.tsx  # Review selection component
    ToneSelector.tsx    # Tone dropdown component
    ResponseViewer.tsx  # Response display and editing
    LoadingSpinner.tsx  # Loading indicator
  /lib
    reviews.ts          # Synthetic review data
    types.ts            # TypeScript type definitions
  page.tsx              # Main page
  layout.tsx            # Root layout
  globals.css           # Global styles
```

## Usage

1. **Select a Review**: Click on any review card to select it
2. **Choose a Tone**: Select your desired response tone from the dropdown
3. **Generate Response**: Click "Generate AI Response" button
4. **Review & Edit**: 
   - View the generated response
   - Edit manually if needed
   - Regenerate for a new response
   - Accept when satisfied

## Mock API

The application uses a mock API endpoint (`/api/generate-response`) that simulates a 1-2 second delay and generates contextual responses based on the review sentiment and selected tone.

# Review-Generator
