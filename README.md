# Digital Twin Portfolio

Arpit Jaiswal's personal portfolio site: an about/career-journey/skills page built with Next.js, plus an AI "digital twin" chat widget (powered by OpenRouter) that answers career questions grounded in his real work history.

See [`tutorial.md`](./tutorial.md) for a full beginner-friendly walkthrough of how the site and the AI chat are built.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

The chat widget needs an `OPENROUTER_API_KEY` in `.env` (see `.env` in the project root; never commit this file).

## Content

All site content (bio, career journey, skills, contact links) lives in `src/data/profile.ts` — edit that one file to update the whole site, including what the digital twin chatbot knows.
