# Digital Twin Portfolio

A personal portfolio site built with Next.js: an about/career-journey/skills page, plus an AI "digital twin" chat widget (powered by OpenRouter) that answers career questions grounded in your real work history.

This is Arpit Jaiswal's live site, but the project is set up so anyone can fork it and make it their own. See [Make This Your Own](#make-this-your-own) below.

See [`tutorial.md`](./tutorial.md) for a full beginner-friendly walkthrough of how the site and the AI chat are built.

## Getting Started

```bash
npm install
cp .env.example .env   # then fill in your OPENROUTER_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## Environment variables

Copy `.env.example` to `.env` and fill it in. Never commit `.env`, it's already gitignored.

| Variable | Required | Description |
|---|---|---|
| `OPENROUTER_API_KEY` | Yes | Your OpenRouter API key. Get one at [openrouter.ai/settings/keys](https://openrouter.ai/settings/keys). |
| `OPENROUTER_MODEL` | No | Which chat model the digital twin uses (any model listed at [openrouter.ai/models](https://openrouter.ai/models)). Defaults to `openai/gpt-oss-20b:free` if not set. |

## Run with Docker

```bash
cp .env.example .env   # then fill in your OPENROUTER_API_KEY
docker compose up --build
```

Open [http://localhost:3000](http://localhost:3000). The compose file reads env vars from `.env` at runtime, they are never baked into the image.

To build/run without compose:

```bash
docker build -t digital-twin-portfolio .
docker run --env-file .env -p 3000:3000 digital-twin-portfolio
```

## Content

All site content (bio, career journey, skills, contact links) lives in `src/data/profile.ts`, edit that one file to update the whole site, including what the digital twin chatbot knows.

## Make This Your Own

To turn this into *your* portfolio instead of Arpit's:

1. **Replace the source documents in `docs/`.** Drop in your own career documents, for example:
   - `docs/resume.pdf`
   - `docs/linkedin_profile.pdf`
   - `docs/github.txt` (a summary of notable repos/projects, if you want them referenced)
   - `docs/portfolio.txt` (anything else: side projects, publications, talks, whatever you want the site and chatbot to know about)

   Any file type an AI agent can read (PDF, `.txt`, `.md`) works. Add as many or as few as you have.

2. **Hand the prompt below to an AI coding agent** (Claude Code, or similar) with this repo open. It will read everything in `docs/`, rewrite `src/data/profile.ts` to match, swap in your resume PDF, and verify the site builds.

3. **Set your own `OPENROUTER_API_KEY`** in `.env` (see above), and optionally `OPENROUTER_MODEL` if you don't want the default free model.

### Prompt to give your AI agent

```
Read every file in the docs/ folder (resume, LinkedIn export, and any other
career documents I've added there). Use them to rewrite src/data/profile.ts
so the whole site reflects my background instead of the current placeholder
content.

Keep the exact same structure and exported shape as the current
src/data/profile.ts (profile, stats, about, JourneyEntry type, journey,
skills, education, and the buildDigitalTwinSystemPrompt function), just
replace the values. Don't invent facts, dates, employers, or metrics that
aren't actually in my documents; if something is ambiguous, ask me instead
of guessing.

Style rules to follow:
- No em dashes anywhere (in profile.ts or in the system prompt's own
  instructions to the AI) — use commas, periods, or colons instead.
- Keep prose plain and factual, avoid marketing-style flourishes.
- Job date ranges should use a plain hyphen, e.g. "Apr 2024 - Dec 2025".

Also:
- Copy my resume PDF into public/ and update profile.resumeHref to point
  to it (remove the old placeholder PDF from public/ if it's no longer
  referenced anywhere).
- Update the README's first paragraph to reference me instead of Arpit
  Jaiswal, and leave the rest of the README (including this section)
  intact for whoever forks the project after me.

When you're done, run `npx tsc --noEmit` to confirm there are no type
errors, then start the dev server and confirm the site renders correctly
before telling me you're finished.
```

The agent doing this work is effectively repeating the same process used to build this site in the first place, reading source documents and populating `profile.ts`, so it should produce comparable results without needing any new code in this repo.
