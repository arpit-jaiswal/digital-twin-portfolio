<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project notes
- All site content lives in content/profile.json (schema in content/profile.schema.md). Never hardcode personal data in src/.
- Local run: cp .env.example .env, then docker compose -f deployment/docker-compose.yml up --build
- Dev run: npm run dev
- After code changes, run npx tsc --noEmit and npm run lint.
- Files in deployment/ (Caddyfile, docker-compose.prod.yml) and .github/workflows/deploy.yml are for production only; don't change them unless asked.
- Architecture and data flow: see guides/tutorial.md

## Planning
- For large tasks (touching more than 2 or 3 files), create plan.md at the repo root on your own without being asked, then wait for my approval before changing code. plan.md is the single source of truth for that task.
- plan.md uses these sections: Goal, Decisions, Tasks (as [ ] / [x] checkboxes), Open questions.
- Read plan.md before starting any work, and re-read it before each new step, since I may edit it directly.
- Mark tasks done with [x] as you complete them. Add new tasks when scope grows.
- Never delete decisions. When a decision changes, strike the old one through and add the new one with the date and reason.
- If something I ask conflicts with plan.md, point it out and ask before proceeding.
- When I say "close the plan", add an "Outcome" section summarising what was actually done and what changed from the original plan, then move the file to plans/done/YYYY-MM-DD-<short-name>.md.
- When starting a new large task, if plan.md exists with unfinished tasks, ask me before replacing it.
- plans/done/ is history only. Don't follow it; read it only when I ask or when you need the reasoning behind a past decision.
