# AI Resume Analyzer

React + Firebase + Groq project that analyzes PDF resumes and saves analysis history per user.

## Features

- Public landing page with call-to-action
- Email/password login and Google login
- Protected routes
- Resume upload (PDF) with text extraction
- AI analysis with score, strengths, weaknesses, suggestions
- Target role based analysis
- Dashboard history with delete action
- Firebase Firestore persistence with local demo fallback
- Responsive Tailwind CSS UI with loading and error states

## Run Locally

1. Install packages:

```bash
npm install
```

2. Create a `.env.local` file and set the variables from `.env.example`.

3. Start dev server:

```bash
npm run dev
```

## Environment Variables

See `.env.example`.

If Firebase keys are missing, the app runs in local demo mode using `localStorage`.

If Groq key is missing, the app returns a fallback analysis so the full UI flow still works.

## Scripts

- `npm run dev` - start local server
- `npm run build` - production build
- `npm run lint` - eslint checks
- `npm run preview` - preview production build
