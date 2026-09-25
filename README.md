# Digital Twin Portfolio

A personal portfolio site built with Next.js: an about/career-journey/skills page, plus an AI "digital twin" chat widget (powered by OpenRouter) that answers career questions grounded in your real work history.

This is a template project: all personal content lives in `content/`, so anyone can fork it and make it their own. See [Make This Your Own](#make-this-your-own) below.

See [`guides/tutorial.md`](./guides/tutorial.md) for a full beginner-friendly walkthrough of how the site and the AI chat are built.

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
docker compose -f deployment/docker-compose.yml up --build
```

Open [http://localhost:3000](http://localhost:3000). The compose file reads env vars from `.env` at runtime, they are never baked into the image.

To build/run without compose:

```bash
docker build -f deployment/Dockerfile -t digital-twin-portfolio .
docker run --env-file .env -p 3000:3000 digital-twin-portfolio
```

## Content

**All dynamic/user-specific data lives in `content/`, not in the source code.** `src/data/profile.ts` is just a loader: it reads `content/profile.json` at runtime and never contains any personal data itself, so nothing under `src/` needs to change to make this your own site.

- `content/profile.json` — the structured data behind the whole site and the digital twin chatbot (name, bio, career journey, skills, education, contact links). See [`content/profile.schema.md`](./content/profile.schema.md) for the exact shape.
- `content/resume.pdf` — served as-is at `/api/resume` (the "Resume" buttons on the site link here).
- `content/linkedin_profile.pdf`, `content/github.txt`, `content/portfolio.txt` — optional raw source documents, only used as input when generating `profile.json` (see below); not served directly.

## Make This Your Own

To turn this into *your* portfolio, everything happens inside `content/` — **no code changes required**, either path below ends with just restarting the app (`npm run dev` / `npm run build && npm run start`, or rebuilding the Docker image).

### Option A: Fill in `content/profile.json` by hand

No AI agent needed, just data entry:

1. Replace `content/resume.pdf` with your own resume.
2. Edit `content/profile.json` directly, following [`content/profile.schema.md`](./content/profile.schema.md).
3. Set your own `OPENROUTER_API_KEY` in `.env` (see above), and optionally `OPENROUTER_MODEL`.
4. Restart the app.

### Option B: Generate `content/profile.json` with an AI agent

If you'd rather not fill in the JSON by hand, drop your raw career documents into `content/`:

- `content/resume.pdf`
- `content/linkedin_profile.pdf`
- `content/github.txt` (a summary of notable repos/projects, if you want them referenced)
- `content/portfolio.txt` (anything else: side projects, publications, talks, whatever you want the site and chatbot to know about)

Any file type an AI agent can read (PDF, `.txt`, `.md`) works. Add as many or as few as you have, then run an AI coding agent non-interactively with this repo open, for example with [Claude Code](https://claude.com/claude-code):

```bash
claude -p "Read every file in the content/ folder (resume.pdf, linkedin_profile.pdf, github.txt, portfolio.txt, and anything else added there). Use them to write content/profile.json matching the schema in content/profile.schema.md. Don't invent facts, dates, employers, or metrics that aren't in the source documents; ask instead of guessing if something is ambiguous."
```

The agent only ever needs to write `content/profile.json`, it doesn't need to (and shouldn't need to) touch anything under `src/`. When it's done, verify with `npx tsc --noEmit` and by starting the app, then set your own `OPENROUTER_API_KEY` in `.env`.
