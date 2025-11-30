# Customer-Service Desk power by AI

AI-powered customer comms workspace built with Next.js 16, covering phone calls, customer emails, and product reviews. It ships with synthetic data, guided workflows, and mock/real API endpoints so you can try everything locally.

## What you get
- Phone Calls: searchable queue with product model filters and a priority (“Periority”) dropdown (All/High/medium/low), live assist checklist, tone suggestions, AI follow-up drafts, and recap generation.
- Emails: inbox with priority filtering, tone selection, Gemini-powered reply drafting/regeneration, and product-level summaries.
- Reviews: curated reviews with tone selection, AI replies, key-concern highlights, regeneration, and accept flow.
- Shared: glassy Tailwind UI, TanStack Query mutations, and mock data sources for instant bootstrapping.

## Tech stack
- Next.js 16 (App Router), TypeScript, Tailwind CSS
- TanStack Query for mutations and async state
- Sonner for toasts

## Getting started
1) Install dependencies
```bash
npm install
```
2) Set environment variables (required for email drafting)
```bash
cp .env.local.example .env.local # if you keep one, otherwise create manually
GEMINI_API_KEY=your_google_gemini_api_key
```
3) Run the dev server
```bash
npm run dev
```
Visit `http://localhost:3000`.

## Available scripts
- `npm run dev` - start Next.js in development
- `npm run build` - production build
- `npm run start` - run the built app
- `npm run lint` - lint the codebase

## Key routes & data
- UI pages: `app/phone-calls/page.tsx`, `app/emails/page.tsx`, `app/reviews/page.tsx`
- Core data: `app/lib/calls.ts`, `app/lib/emails.ts`, `app/lib/reviews.ts`, `app/lib/types.ts`
- API routes:
  - `/api/generate-call-followup` - builds follow-up drafts from call data
  - `/api/generate-call-recap` - returns recap content for a call
  - `/api/generate-email-response` - calls Gemini (requires `GEMINI_API_KEY`)
  - `/api/generate-email-summary` - summarizes emails by product
  - `/api/generate-response` and `/api/generate-summary` - review responses/summaries

## Notes
- Phone calls and reviews rely on in-repo mock data and run offline.
- Email drafting requires a valid Gemini API key; without it, the email responder endpoint will fail fast.
- The “Periority” label/choices in the Phone Calls sidebar mirror the UI terminology intentionally.
