# Building Your Personal Website: A Beginner's Tutorial

This tutorial walks through **digital-twin-portfolio**, a dark personal portfolio site with an animated career timeline and an AI chatbot that answers questions about your career like a "digital twin" of you.

It's written for someone who has **never written frontend code before**. We'll go slow on the fundamentals and then look at the actual code we wrote, piece by piece.

---

## Table of Contents

1. [Technology Summary](#1-technology-summary)
2. [High-Level Walkthrough](#2-high-level-walkthrough)
3. [Project Anatomy](#3-project-anatomy)
4. [Detailed Code Review](#4-detailed-code-review)
   - [4.1 The content: `content/profile.json`, loaded by `profile.ts`](#41-the-content-contentprofilejson-loaded-by-profilets)
   - [4.2 Global styles: `globals.css`](#42-global-styles-globalscss)
   - [4.3 The root layout: `layout.tsx`](#43-the-root-layout-layouttsx)
   - [4.4 The home page: `page.tsx`](#44-the-home-page-pagetsx)
   - [4.5 A simple component: `Nav.tsx`](#45-a-simple-component-navtsx)
   - [4.6 A data-driven component: `Journey.tsx`](#46-a-data-driven-component-journeytsx)
   - [4.7 The AI backend: `api/chat/route.ts`](#47-the-ai-backend-apichatroutets)
   - [4.8 The AI frontend: `Chat.tsx`](#48-the-ai-frontend-chattsx)
5. [How It All Connects](#5-how-it-all-connects)
6. [Running It Yourself](#6-running-it-yourself)
7. [Glossary](#7-glossary)

---

## 1. Technology Summary

Here's every piece of technology used, and what it's *for* in plain English.

| Technology | What it is | Why we used it |
|---|---|---|
| **HTML** | The skeleton of every web page: headings, paragraphs, buttons, etc. | React generates this for us, but it's still HTML under the hood. |
| **CSS** | The styling language that makes HTML look like a design instead of a plain document. | We use it via **Tailwind CSS** (see below) rather than writing raw `.css` rules for every element. |
| **JavaScript / TypeScript** | The programming language that makes a web page *interactive* (clicking buttons, typing in a chat box, etc.). **TypeScript** is JavaScript with an added layer that catches typos and type mistakes before you even run the code. | TypeScript catches bugs early. For example, it would stop you from accidentally treating a number as a piece of text. |
| **React** | A JavaScript library for building user interfaces out of reusable **components** (small, self-contained pieces of UI, like a button or a navbar). | Instead of one giant HTML file, we build the page out of small, named, reusable pieces: `<Hero />`, `<Nav />`, `<Chat />`, etc. |
| **Next.js** | A "framework" built on top of React. It adds routing (turning URLs into pages), a build system, and, importantly for us, the ability to run **server-side code** (like our AI chat backend) in the same project as the frontend. | It's the industry-standard way to build production React sites, and it let us build both the website *and* its backend API in one project. |
| **Tailwind CSS** | A CSS framework where instead of writing custom style rules, you apply small pre-made classes directly in your HTML, e.g. `className="text-lg font-bold"` means "large text, bold." | Much faster than hand-writing CSS files, and keeps styling co-located with the component that uses it. |
| **Node.js** | The program that runs JavaScript *outside* a browser: on a server, or on your laptop, when you run `npm run dev`. | Next.js itself runs on Node.js, and our AI API route runs as Node.js server code. |
| **npm** | "Node Package Manager," the tool that downloads and manages third-party code libraries (called *packages*) your project depends on. | Used to install React, Next.js, Tailwind, etc. and to run project scripts (`npm run dev`, `npm run build`). |
| **OpenRouter** | A service that gives you one API to talk to many different AI models (OpenAI, Anthropic, Meta, etc.) from different providers, including free ones. | We use it to send chat messages to an AI model and get a reply back, without hosting our own AI model. |
| **Free OpenRouter model (default)** | The AI language model called through OpenRouter, e.g. `openai/gpt-oss-20b:free`. Free-tier model slugs on OpenRouter get discontinued/renamed over time, so the default is set via an environment variable, not hardcoded. | Free to use (with rate limits), and good enough to answer career questions grounded in your resume. |
| **Environment variables (`.env`)** | A file that holds secret configuration values (like API keys) *outside* of your actual code, so secrets never get committed to version control or shipped to the browser. | Keeps your OpenRouter API key private. |
| **Git** | A version control system: it tracks every change to your files over time, in named snapshots called commits. | We initialized a repository, committed the project, and pushed it to GitHub so the code has real history and a home online. |

### The big mental model

```
Browser (what the visitor sees)
   |
   |  HTML + CSS + JavaScript, generated by React/Next.js
   v
Your Next.js app
   |
   +-- Frontend ("client"): React components rendered in the browser
   |     Hero, About, Journey, Skills, Contact, Chat, Nav...
   |
   +-- Backend ("server"): API route running on Node.js, never sent to the browser
         /api/chat  ->  calls OpenRouter  ->  calls the AI model  ->  sends a reply back
```

This is the single most important idea in the whole project: **some code runs in the visitor's browser, and some code runs only on the server**. Your OpenRouter API key lives *only* on the server side; the browser never sees it. We'll point this out again when we get to the chat feature.

---

## 2. High-Level Walkthrough

Here's what the site actually does, section by section, as a visitor would experience it top to bottom:

1. **Nav bar** (`Nav.tsx`): a fixed bar at the top with your name and links that jump to sections on the page (`#about`, `#journey`, etc.), plus a "Resume" download button. On mobile it collapses into a hamburger menu.

2. **Hero** (`Hero.tsx`): the big introduction. Your name, role, a one-line pitch, two buttons ("See the journey," which jumps to the timeline, and "Get in touch," which opens your LinkedIn profile), and a row of stat tiles (8+ years, 5M+ notifications, etc.) pulled straight from your resume.

3. **About** (`About.tsx`): a short bio in your own voice, a list of focus areas, and your education, split into a wide text column and a narrow sidebar.

4. **Career Journey** (`Journey.tsx`): the centerpiece. A vertical timeline connecting every job you've held, in order, each with a title, dates, a summary, bullet-point highlights, and topic tags. The sabbatical is shown as a quiet, de-emphasized entry on the same timeline.

5. **Skills** (`Skills.tsx`): your technical skills grouped into categories (Languages, Databases, Frameworks, etc.) as a grid of cards.

6. **Projects** (`Projects.tsx`): a grid of project cards (name, description, tech stack, and a link), if you've listed any. This section hides itself entirely if you haven't.

7. **Contact** (`Contact.tsx`): a call-to-action block with your email, LinkedIn, GitHub, and resume download, all styled as equal-weight buttons inside a large highlighted card. Each button only shows up if you've actually filled in that field.

8. **Footer** (`Footer.tsx`): a small copyright line at the very bottom.

9. **Digital Twin Chat** (`Chat.tsx`): a floating button in the bottom-right corner, always visible, that opens a chat window. A visitor can ask things like *"What's your strongest skill set?"* and get an answer written in first person, generated by an AI model that's been given your entire career history as context. This is powered by a backend API route (`api/chat/route.ts`) that talks to OpenRouter.

All the actual *content* (your bio, job history, skills, projects, contact links) lives in **one single file**, `content/profile.json`. Every component (`Hero`, `About`, `Journey`, `Skills`, `Projects`, `Contact`, the AI's system prompt) reads from it, via the loader in `src/data/profile.ts`. This means if you get a new job tomorrow, you only need to edit `content/profile.json` once, and the entire site, including what the AI chatbot knows about you, updates automatically.

---

## 3. Project Anatomy

Here's the folder structure, and what each part is responsible for:

```
digital-twin-portfolio/
├── .env                          # secret config (your OpenRouter API key), never committed
├── package.json                  # lists dependencies + scripts (npm run dev, build, etc.)
├── content/                          # ALL your content lives here, the single source of truth
│   ├── profile.json               #   structured data: bio, journey, skills, projects, education
│   ├── profile.schema.md          #   describes the exact shape profile.json must have
│   ├── resume.pdf                  #   served as-is at /api/resume
│   ├── linkedin_profile.pdf        #   (optional) raw source doc, AI-agent input only
│   └── github.txt                  #   (optional) raw source doc, AI-agent input only
├── public/                       # static files served as-is (icons, svgs; no personal data)
├── deployment/                    # Dockerfile, docker-compose.yml, Dockerfile.dockerignore,
│                                   #   plus optional prod-only Caddyfile + docker-compose.prod.yml
├── .github/workflows/
│   └── deploy.yml                 # optional: manual GitHub Actions deploy to your own server
├── src/
│   ├── app/                      # Next.js "App Router": pages & API routes live here
│   │   ├── layout.tsx            #   the outer HTML shell shared by every page
│   │   ├── page.tsx              #   the homepage, assembles all the sections
│   │   ├── globals.css           #   site-wide CSS (colors, fonts, custom effects)
│   │   └── api/
│   │       ├── chat/
│   │       │   └── route.ts      #   backend endpoint the Chat widget calls
│   │       └── resume/
│   │           └── route.ts      #   streams content/resume.pdf to the browser
│   ├── components/                # one file per reusable UI piece
│   │   ├── Nav.tsx
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Journey.tsx
│   │   ├── Skills.tsx
│   │   ├── Projects.tsx
│   │   ├── Contact.tsx
│   │   ├── Footer.tsx
│   │   └── Chat.tsx
│   └── data/
│       └── profile.ts             # a LOADER: reads content/profile.json at runtime, contains
│                                   #   no personal data itself
└── guides/
    └── tutorial.md                 # this file
```

A useful rule of thumb: **`content/` holds the actual content (the only thing you edit to make this your own site); `app/` decides what pages exist and how they're wired together; `components/` holds the reusable visual building blocks; `data/profile.ts` is just the plumbing that connects the two.**

---

## 4. Detailed Code Review

Let's go file by file. If you're brand new to code, read the "What this teaches you" callouts. They explain the *general* programming concept, not just what this specific file does.

### 4.1 The content: `content/profile.json`, loaded by `profile.ts`

This is the most important part to understand first, because everything else depends on it. It's split across two files with two different jobs:

- **`content/profile.json`** holds the actual content: your name, bio, journey, skills, projects, education, contact links. This is the *only* file you edit to make the site yours.
- **`src/data/profile.ts`** is a small loader: it reads `content/profile.json` off disk when the server starts, and re-exports it with proper TypeScript types so the rest of the app gets type-checked access to it.

```json
// content/profile.json (excerpt)

{
  "profile": {
    "name": "Your Name",
    "role": "Senior Software Engineer",
    "tagline": "Backend systems at scale, for fintech & e-commerce.",
    "location": "Bengaluru, India",
    "email": "you@example.com",
    "linkedin": "https://www.linkedin.com/in/you",
    "github": "https://github.com/you",
    "resumeHref": "/api/resume",
    "yearsExperience": "8+"
  }
}
```

> **What this teaches you: JSON.** `{ "key": "value", "key": "value" }` is **JSON** (JavaScript Object Notation), a plain-text data format, basically an object with no code allowed inside it, just data. Editing this file is pure data entry: no functions, no logic, nothing to "break" in a programming sense (though it does need valid JSON syntax, matching quotes and commas).

```typescript
// src/data/profile.ts (the loader)

function loadProfileData(): ProfileData {
  const filePath = path.join(process.cwd(), "content", "profile.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as ProfileData;
}

const data = loadProfileData();
export const profile = data.profile;
export const journey = data.journey;
// ...and so on for stats, about, skills, projects, education
```

> **What this teaches you: reading files with `fs`.** `fs` (Node's built-in "file system" module) lets server-side code read files off disk. `fs.readFileSync(filePath, "utf-8")` reads the whole file synchronously and returns its raw text; `JSON.parse(...)` turns that text into a real JavaScript object. This only works in server-side code (Node.js), never in the browser, that's why `profile.ts` can never be imported by a `"use client"` component directly (more on this in [4.5](#45-a-simple-component-navtsx)).

A bit further down, the job history is a **list of objects**, an array:

```typescript
export type JourneyEntry = {
  company: string;
  companyFull: string;
  role: string;
  period: string;
  location: string;
  summary: string;
  highlights: string[];
  tags: string[];
};
```

```json
// content/profile.json (excerpt)
"journey": [
  {
    "company": "Acme Corp",
    "companyFull": "Acme Corporation Pvt. Ltd.",
    "role": "Senior Software Engineer",
    "period": "Apr 2024 - Present",
    "location": "Bengaluru",
    "summary": "Built core backend infrastructure connecting internal services and external partners.",
    "highlights": [
      "Built a notification platform covering the full campaign lifecycle...",
      "Built a configurable onboarding platform..."
    ],
    "tags": ["Backend", "Notifications", "Onboarding", "Config-driven systems"]
  }
]
```

> **What this teaches you: types and arrays.**
> - `type JourneyEntry = { ... }` (in `profile.ts`) defines a **shape**: a contract saying "every journey entry must have these exact fields, and `highlights` must specifically be a list of strings." TypeScript checks the *code* against this shape at build time; it doesn't validate `profile.json` itself; that file's structure is documented separately in `content/profile.schema.md` for humans (and AI agents) filling it in.
> - `JourneyEntry[]` means "an array (list) of `JourneyEntry` objects." The square brackets after a type mean "a list of this type."
> - Because `journey` is just data, the `Journey.tsx` component ([section 4.6](#46-a-data-driven-component-journeytsx)) can simply *loop* over it and render one timeline entry per item, no matter how many jobs are in the list.

Finally, there's a function at the bottom of `profile.ts` that builds the instructions given to the AI chatbot:

```typescript
export function buildDigitalTwinSystemPrompt(): string {
  const journeyText = journey
    .map((j) => {
      if (j.role === "Sabbatical") {
        return `- Sabbatical (${j.period}): Took time off for personal reasons.`;
      }
      return [
        `- ${j.role} at ${j.company} (${j.companyFull}), ${j.period}, ${j.location}.`,
        `  Summary: ${j.summary}`,
        ...j.highlights.map((h) => `  * ${h}`),
      ].join("\n");
    })
    .join("\n");

  // ...similar for skillsText, educationText, projectsText...

  return `You are the "digital twin" of ${profile.name}...
  Ground truth about ${profile.name} (use ONLY this information...):
  CAREER JOURNEY
  ${journeyText}
  ...`;
}
```

> **What this teaches you: functions, and `.map()`.**
> - A **function** is a named, reusable block of logic. `buildDigitalTwinSystemPrompt()` takes no input and returns one big string of text: the instructions for the AI.
> - `journey.map(...)` is one of the most common patterns in JavaScript: **take a list, and turn each item into something else.** Here we take the list of job objects and turn each one into a line of readable text, then glue them all together with `.join("\n")` (join with newlines). The result is a plain-text career history that gets sent to the AI model as instructions every time someone opens the chat. This is exactly why the chatbot only knows real facts about you: it's *literally being handed the contents of `content/profile.json` as text* before answering any question.

This file also carries a couple of small, deliberate rules worth calling out, because they came from real feedback while building the site:

- The system prompt explicitly says: *"Do not use em dashes in your responses; use commas, periods, or colons instead."* That's not a technical requirement, it's a style choice, added because em dashes are considered a giveaway that text was AI-written, and the goal here is for the chatbot's answers to read naturally.
- All the date ranges (`"Apr 2024 - Dec 2025"`) and prose in this file use plain hyphens and colons rather than em dashes, for the same reason.

---

### 4.2 Global styles: `globals.css`

Most of the visual styling in this project happens per-component via Tailwind classes (you'll see those next), but a handful of foundational things live in one shared CSS file:

```css
:root {
  --bg: #08090c;
  --foreground: #eef0f4;
  --accent: #c7ff3e;
  --accent-2: #5b7dff;
  --border: rgba(255, 255, 255, 0.09);
}
```

> **What this teaches you: CSS custom properties (variables).** `:root` means "the whole page." Each `--name: value` line defines a reusable variable. Here, `--bg` is the near-black background color, `--accent` is the acid-lime highlight color used for buttons and glowing dots throughout the site. Defining colors once as variables means changing the whole site's palette is a one-line edit instead of hunting through every file.

```css
@theme inline {
  --color-bg: var(--bg);
  --color-accent: var(--accent);
  --font-sans: var(--font-geist-sans);
  --font-display: var(--font-space-grotesk);
}
```

> This block is Tailwind-specific: it tells Tailwind "make these CSS variables available as utility classes," which is why you'll see `bg-bg`, `text-accent`, and `font-display` used directly as class names in the components below.

```css
.bg-grid {
  background-image:
    linear-gradient(to right, var(--border) 1px, transparent 1px),
    linear-gradient(to bottom, var(--border) 1px, transparent 1px);
  background-size: 64px 64px;
}
```

> This is a small hand-written CSS "recipe" for the faint grid-line texture behind the Hero section: two very thin, repeating gradient lines (one vertical, one horizontal) tiled every 64 pixels. It's applied by writing `className="bg-grid"` on an element.

---

### 4.3 The root layout: `layout.tsx`

Every Next.js "App Router" project needs a `layout.tsx` at the top of the `app/` folder. It wraps *every* page (we only have one page, but this pattern scales to many).

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { profile } from "@/data/profile";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"], weight: ["500", "600", "700"] });

export const metadata: Metadata = {
  title: `${profile.name} | ${profile.role}`,
  description: profile.tagline,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg text-foreground">
        {children}
      </body>
    </html>
  );
}
```

> **What this teaches you, several things at once:**
> - **JSX.** The `<html>...</html>` block inside a JavaScript function looks like HTML but is actually **JSX**, a syntax that lets you write HTML-like markup directly inside JavaScript/TypeScript. React converts this into real DOM elements in the browser.
> - **`next/font/google`.** Instead of linking to Google Fonts via a `<link>` tag (which can slow down page loads), Next.js downloads and self-hosts the fonts at build time. `Geist({...})` returns a CSS variable name (`--font-geist-sans`) that we then apply as a class on `<html>`.
> - **`{children}`.** This is React's way of saying "whatever page content gets passed in, render it *here*." The `RootLayout` doesn't know or care what the actual page looks like; it just provides the outer `<html>`/`<body>` shell, fonts, and background color, and lets `page.tsx` fill in `{children}`.
> - **`metadata`.** This exported object controls the browser tab title (`{profile.name} | {profile.role}`, e.g. "Jane Doe | Senior Software Engineer") and the description search engines see, set once, applies to the whole site.

---

### 4.4 The home page: `page.tsx`

This file is refreshingly simple, because all the real work happens inside each component:

```tsx
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Journey from "@/components/Journey";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Chat from "@/components/Chat";
import { profile, projects } from "@/data/profile";

export default function Home() {
  return (
    <>
      <Nav
        name={profile.name}
        resumeHref={profile.resumeHref}
        hasProjects={projects.length > 0}
      />
      <main className="flex-1">
        <Hero />
        <About />
        <Journey />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <Chat name={profile.name} />
    </>
  );
}
```

> **What this teaches you: composition.** This is the core idea of React: build small, focused, independently-understandable components, then **compose** them together like LEGO bricks to build the full page. `page.tsx` reads almost like an outline of the page in plain English: Nav, then Hero, then About, etc., because that's literally what it is. `Projects.tsx` and `Skills.tsx` hide themselves entirely (return `null`) if their data is empty, so a fork with no projects listed in `content/profile.json` just doesn't show that section, no code change needed. Want to reorder or remove a section? Delete or move one line here; no need to touch the component itself.
>
> The `<> ... </>` wrapper is called a **React Fragment**. It groups multiple elements together without adding an extra, meaningless `<div>` to the actual HTML output. Notice `<Chat />` sits outside `<main>`, alongside `<Footer />`: it's a floating widget that should appear on top of everything, not flow inline with the page content.
>
> **Props, for real this time.** `page.tsx` runs on the server, so it's the one place that can freely import `profile` (which needs `fs` under the hood, see [4.1](#41-the-content-contentprofilejson-loaded-by-profilets)). `Nav` and `Chat` are `"use client"` components (they need interactivity), and client components can't import a module that uses `fs`, so instead `page.tsx` reads the data once and passes down just the pieces each one needs (`name`, `resumeHref`, `hasProjects`) as **props**, plain function arguments passed from parent to child component. This is the standard React fix whenever a client component needs server-only data.

---

### 4.5 A simple component: `Nav.tsx`

Let's look at a full component to see React patterns in action. Here's the top-level structure of `Nav.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";

export default function Nav({
  name,
  resumeHref,
  hasProjects,
}: {
  name: string;
  resumeHref: string;
  hasProjects: boolean;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const links = [
    { href: "#about", label: "About" },
    { href: "#journey", label: "Journey" },
    { href: "#skills", label: "Skills" },
    ...(hasProjects ? [{ href: "#projects", label: "Projects" }] : []),
    { href: "#contact", label: "Contact" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
      scrolled ? "bg-bg/85 backdrop-blur-md border-b border-border" : "bg-transparent border-b border-transparent"
    }`}>
      {/* ... */}
    </header>
  );
}
```

Let's unpack each new idea:

> **`"use client"`.** By default in Next.js's App Router, components run *on the server* and send plain HTML to the browser, great for performance, but it means they can't use things like `useState` (which needs to run live, in the browser, in response to user actions). Adding `"use client"` at the top of a file tells Next.js: *"this component needs to run in the browser, with interactivity."* Any component using clicks, scroll listeners, or React state needs this.

> **`useState`.** This is a **React Hook**, a special function that lets a component "remember" a value between renders, and re-render itself whenever that value changes. `const [scrolled, setScrolled] = useState(false)` creates a piece of state called `scrolled`, starting as `false`, plus a function `setScrolled` to update it. Whenever you call `setScrolled(true)`, React automatically re-renders the component with the new value. Here, `scrolled` tracks whether the user has scrolled down the page (so we can make the nav bar's background solid instead of transparent), and `open` tracks whether the mobile hamburger menu is open.

> **`useEffect`.** Another Hook, this one runs a block of code in response to the component appearing on screen (and cleans up after itself when it disappears). Here, it attaches a `scroll` event listener to the browser window when the Nav first appears, and removes that listener if the Nav is ever removed (the `return () => window.removeEventListener(...)` line is the "cleanup," this prevents memory leaks). The empty array `[]` at the end means "only run this setup once, not on every re-render."

> **Template literals and conditional classes.** The line
> ```tsx
> className={`fixed top-0 ... ${scrolled ? "bg-bg/85 backdrop-blur-md ..." : "bg-transparent ..."}`}
> ```
> uses backticks (`` ` ``) to build a string with embedded JavaScript expressions inside `${...}`. The `condition ? valueIfTrue : valueIfFalse` syntax is a **ternary operator**, a compact if/else. In plain English: "give this element a solid, blurred background if `scrolled` is true, otherwise keep it transparent." This is how the Nav bar visually reacts to scrolling.

Rendering the nav links is a loop, just like we saw in `profile.ts`:

```tsx
<div className="hidden md:flex items-center gap-8">
  {links.map((l) => (
    <a key={l.href} href={l.href} className="text-sm text-muted hover:text-foreground transition-colors font-mono">
      {l.label}
    </a>
  ))}
</div>
```

> **`.map()` in JSX, and `key`.** Just like before, `.map()` transforms each item in the `links` array into a piece of JSX (an `<a>` tag). React requires every item produced this way to have a unique `key` prop (here, `l.href`, e.g. `"#about"`) so it can efficiently track which item is which if the list ever changes. This one small block replaces having to hand-write four nearly-identical `<a>` tags.

> **Tailwind responsive classes.** `className="hidden md:flex ..."` means: *hidden by default, but displayed as a flex row once the screen is at least "medium" width (`md:`)*. This is how the whole site adapts between mobile (hamburger menu) and desktop (horizontal nav) layouts, without writing a single `@media` query by hand. Tailwind's `sm:`, `md:`, `lg:` prefixes handle responsive breakpoints inline.

---

### 4.6 A data-driven component: `Journey.tsx`

This component is the best example in the project of **separating data from presentation**. It contains almost no actual content, just the *shape* the content should be displayed in:

```tsx
import { journey } from "@/data/profile";

export default function Journey() {
  return (
    <section id="journey" className="relative py-24 sm:py-32 border-t border-border bg-bg-elevated/40">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <ol className="relative">
          <div aria-hidden className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-accent/70 via-border to-transparent" />

          {journey.map((entry) => {
            const isSabbatical = entry.role === "Sabbatical";
            return (
              <li key={`${entry.company}-${entry.role}`} className="relative pl-8 pb-14 last:pb-0">
                <span className={`absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-2 ${
                  isSabbatical ? "bg-bg border-muted-2" : "bg-bg border-accent shadow-[0_0_16px_rgba(199,255,62,0.35)]"
                }`} />

                {isSabbatical ? (
                  <div className="flex flex-wrap items-center gap-x-3 font-mono text-xs text-muted-2">
                    <span className="uppercase tracking-wider">{entry.company}</span>
                    <span>·</span>
                    <span>{entry.period}</span>
                  </div>
                ) : (
                  <div className="group">
                    <h3 className="font-display text-xl font-semibold tracking-tight">
                      {entry.role}
                      <span className="text-muted font-normal"> · {entry.company}</span>
                    </h3>
                    {/* summary, highlights, tags... */}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
```

> **What this teaches you: rendering a whole UI from a list.** There is exactly one `<li>` block defined in this file's code, but the actual page shows *six* timeline entries. React runs that one block once per item in the `journey` array (imported from `profile.ts`) and stacks the results vertically. Add a seventh job to `profile.ts` tomorrow, and a seventh timeline entry appears automatically, you never touch this file again.

> **Conditional rendering.** The line `{isSabbatical ? (...) : (...)}` renders *completely different* JSX depending on a condition: a plain text line for the sabbatical entry, versus the full card (title, summary, bullet highlights, tags) for a real job. This is how one component handles two visually different cases cleanly, instead of needing two separate components.

> **The connecting timeline line.** The single `<div className="absolute ... w-px bg-gradient-to-b ...">` right before the `.map()` is a one-pixel-wide vertical line, positioned (`absolute`) to sit behind all the timeline dots, with a gradient that fades from bright green at the top to transparent at the bottom, a nice example of how a small, purely decorative element (drawn once) can visually tie together a dynamically-generated list.

---

### 4.7 The AI backend: `api/chat/route.ts`

This is where the "digital twin" chat actually talks to an AI model. It's not a React component at all, it's a **server-side API endpoint**.

**First, some Next.js API-route basics:**

> Any file at `src/app/api/<name>/route.ts` automatically becomes a URL: `/api/<name>`. Exporting a function called `POST` means "when someone sends an HTTP POST request to this URL, run this function." This code runs **only on the server** (in Node.js) and is never sent to the browser, which is exactly why it's safe to use a secret API key here.

Let's walk through it top to bottom.

**Step 1: reject requests if the server isn't configured:**

```typescript
export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Chat is not configured on the server." },
      { status: 500 },
    );
  }
  ...
```

> **`process.env`.** This is how Node.js reads environment variables. `OPENROUTER_API_KEY` isn't written anywhere in the code, it's loaded automatically from the `.env` file in the project root (`.env` contains `OPENROUTER_API_KEY=sk-or-v1-...`). Next.js loads `.env` files into `process.env` automatically, server-side only. This is the standard, safe way to handle secrets: **never hard-code an API key directly in your source code.**

**Step 2: validate the incoming request:**

```typescript
type ChatMessage = { role: "user" | "assistant"; content: string };

function isChatMessage(value: unknown): value is ChatMessage {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    (v.role === "user" || v.role === "assistant") &&
    typeof v.content === "string" &&
    v.content.trim().length > 0 &&
    v.content.length <= MAX_MESSAGE_LENGTH
  );
}

const messages = rawMessages.filter(isChatMessage).slice(-MAX_HISTORY_MESSAGES);
```

> **Why validate?** The request body is coming from a web browser. Anyone could, in theory, send this API a malformed or malicious request directly (not through your actual chat widget). `isChatMessage` is a **type guard**: a function that checks, at runtime, whether some unknown data actually matches the shape we expect (`role` is either `"user"` or `"assistant"`, `content` is a non-empty string under 2000 characters). `.filter(isChatMessage)` throws out anything that doesn't pass. `.slice(-MAX_HISTORY_MESSAGES)` keeps only the most recent 16 messages, so a very long conversation doesn't send unbounded data to the AI model (which would be slow and expensive).

**Step 3: call OpenRouter, with a safety timeout:**

```typescript
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

try {
  const upstream = await fetch(OPENROUTER_URL, {
    method: "POST",
    signal: controller.signal,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://your-portfolio.local",
      "X-Title": "Digital Twin",
    },
    body: JSON.stringify({
      model: MODEL, // defaults to a free OpenRouter model, overridable via OPENROUTER_MODEL
      messages: [
        { role: "system", content: buildDigitalTwinSystemPrompt() },
        ...messages,
      ],
      temperature: 0.6,
      max_tokens: 1000,
    }),
  });
  ...
```

> **`fetch`.** This is the standard JavaScript way to make an HTTP request to another server, here, to OpenRouter's API. We `await` it, meaning "pause this function here until the network response comes back" (more on `async`/`await` below).

> **`Authorization: Bearer ${apiKey}`.** This is the standard way APIs authenticate requests: your secret key is sent in a request header, proving to OpenRouter that you're allowed to use their service (and that usage gets billed/tracked to your account).

> **The `messages` array sent to the AI.** Every AI chat model expects a list of messages with roles: `"system"` (instructions about how to behave, invisible to the end user), `"user"` (what the visitor typed), and `"assistant"` (the AI's own previous replies, for conversation context). We always put `buildDigitalTwinSystemPrompt()`, the full career history from `profile.ts`, as the *first* message, before any of the visitor's actual questions. This is called **grounding**: forcing the model to answer based on real, provided facts instead of just guessing from its general training.

> **Note the header values.** `HTTP-Referer` and `X-Title` are plain ASCII strings, on purpose. Early in development, one of these headers contained an em dash character, and it broke the request entirely with a cryptic `ByteString` error, because HTTP headers can only contain a limited character set. That's a good real-world lesson: HTTP headers are stricter about characters than regular text, so keep them to plain ASCII.

> **`AbortController` and the timeout.** Free AI models can occasionally hang or respond very slowly. `AbortController` is a browser/Node.js built-in for cancelling an in-progress operation. We start a timer (`setTimeout`) that will call `controller.abort()` after 55 seconds; we pass `controller.signal` into `fetch` so it knows to watch for that cancellation. If the AI hasn't responded within 55 seconds, the request is forcibly cut off instead of hanging forever, and the code below catches that specific case (`err.name === "AbortError"`) to show a clear, honest error message instead of leaving the visitor staring at a spinner.

**Step 4: handle errors thoughtfully, especially rate limits:**

```typescript
if (!upstream.ok) {
  const errText = await upstream.text();
  console.error("OpenRouter error", upstream.status, errText);

  if (upstream.status === 429) {
    let retryAfter: number | undefined;
    try {
      const parsed = JSON.parse(errText);
      retryAfter = parsed?.error?.metadata?.retry_after_seconds;
    } catch {
      // ignore parse failure, fall back to generic message
    }
    return NextResponse.json(
      {
        error: retryAfter
          ? `The free AI model is rate-limited right now... Try again in about ${retryAfter}s.`
          : "The free AI model is rate-limited right now. Try again in a moment.",
        retryAfterSeconds: retryAfter,
      },
      { status: 429 },
    );
  }

  return NextResponse.json(
    { error: "The digital twin is unavailable right now. Try again in a moment." },
    { status: 502 },
  );
}
```

> **HTTP status codes.** `upstream.ok` is `true` only for successful responses (status 200-299). Status `429` specifically means **"Too Many Requests,"** OpenRouter's way of saying "this free model is oversubscribed right now, slow down." We specifically detect this code and dig into the error response's JSON body to extract *how long* to wait (`retry_after_seconds`), so we can tell the visitor something genuinely useful ("try again in 30s") instead of a vague "something went wrong." Any *other* failure gets a generic fallback message with a `502` status ("Bad Gateway," meaning "the service we depend on failed").
>
> This handling exists because it actually happened during development: the default free-tier model is shared across everyone using it for free, and it was occasionally rate-limited (429) or slow (one real response took 37 seconds) under load. That's expected behavior for a free model, and this code exists specifically to degrade gracefully around it instead of just showing a generic error.

**Step 5: on success, extract and return the AI's reply:**

```typescript
const data = await upstream.json();
const reply: string | undefined = data?.choices?.[0]?.message?.content;

if (!reply) {
  return NextResponse.json(
    { error: "Got an empty response. Try rephrasing your question." },
    { status: 502 },
  );
}

return NextResponse.json({ reply });
```

> **`data?.choices?.[0]?.message?.content`.** OpenRouter (like most AI chat APIs) returns a response shaped like `{ choices: [{ message: { content: "..." } }] }`. The `?.` ("optional chaining") means "if any link in this chain is missing or null, don't crash, just produce `undefined`." This defends against OpenRouter occasionally returning an unexpected shape. If we truly got nothing usable back, we return a friendly error instead of crashing or sending `undefined` to the browser.

> **`async` / `await`, tied together.** You'll notice the whole `POST` function is declared `async`, and every network call (`req.json()`, `fetch(...)`, `upstream.json()`) is preceded by `await`. In JavaScript, network requests are **asynchronous**: they take time, and you don't want to freeze the whole program waiting. `async`/`await` is the modern, readable way to write "do this, then wait for it to finish, then do the next thing" without deeply nested callback functions. Reading top to bottom, this function reads almost like a simple step-by-step recipe, even though under the hood it's all non-blocking.

---

### 4.8 The AI frontend: `Chat.tsx`

Finally, the piece the visitor actually sees and clicks. This is a `"use client"` component (interactive, runs in the browser) that talks to the `/api/chat` backend we just reviewed.

**State: what this component remembers:**

```tsx
const [open, setOpen] = useState(false);
const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
const [input, setInput] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [lastFailed, setLastFailed] = useState<string | null>(null);
```

> Six independent pieces of state: whether the chat window is open, the full conversation history so far, what's currently typed in the input box, whether we're waiting on a reply, any current error message, and, if a message failed to send, what that message was, so a "Retry" button can resend it.

**Sending a message:**

```tsx
async function send(text: string) {
  const trimmed = text.trim();
  if (!trimmed || loading) return;

  const nextMessages: Message[] = [...messages, { role: "user", content: trimmed }];
  setMessages(nextMessages);
  setInput("");
  setError(null);
  setLastFailed(null);
  setLoading(true);

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: nextMessages
          .filter((m) => m !== INITIAL_MESSAGE)
          .map((m) => ({ role: m.role, content: m.content })),
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error ?? "Something went wrong.");

    setMessages((prev) => [...prev, { role: "assistant", content: data.reply as string }]);
  } catch (err) {
    setError(err instanceof Error ? err.message : "Something went wrong.");
    setLastFailed(trimmed);
    setMessages((prev) => prev.filter((m) => m !== nextMessages[nextMessages.length - 1]));
  } finally {
    setLoading(false);
  }
}
```

Walking through it:

> **`[...messages, { role: "user", content: trimmed }]`.** The `...` ("spread") syntax copies every existing message into a new array, then adds the visitor's new message at the end. React state should never be mutated directly (e.g. `messages.push(...)` is wrong), you always create a *new* array/object and hand it to the setter function (`setMessages`). This is a core React rule: it's how React knows something actually changed and a re-render is needed.

> **The `fetch` call mirrors the backend exactly.** `fetch("/api/chat", { method: "POST", ... })` calls the very route we reviewed in [4.7](#47-the-ai-backend-apichatroutets), this is the "wire" connecting frontend to backend. The `body` is `JSON.stringify(...)`'d (turned into a JSON text string) because that's the format HTTP request bodies are sent in; the server then calls `req.json()` to parse it back into an object.

> **`try / catch / finally`.** This is JavaScript's standard error-handling structure: *try* the risky operation (the network call); if anything throws an error (network failure, or the server responding with a non-OK status, which we manually `throw` on), jump to *catch* and handle it gracefully; *finally* always runs regardless of success or failure, here, turning off the loading spinner either way.

> **Removing the failed message.** Notice `setMessages((prev) => prev.filter((m) => m !== nextMessages[nextMessages.length - 1]))` inside `catch`. If sending fails, we quietly remove the visitor's just-added message from the visible chat, and remember it in `lastFailed` so a **Retry** button can resend the *exact same text* without the visitor retyping it, and without leaving a confusing "orphaned" message with no reply in the chat log.

**Rendering the conversation:**

```tsx
{messages.map((m, i) => (
  <div key={i} className={`text-sm leading-relaxed ${m.role === "user" ? "text-right" : "text-left"}`}>
    <span className={`inline-block max-w-[85%] rounded-2xl px-3.5 py-2.5 whitespace-pre-wrap ${
      m.role === "user"
        ? "bg-accent text-[#08090c] rounded-br-sm"
        : "bg-bg-elevated-2 text-foreground/90 border border-border rounded-bl-sm"
    }`}>
      {m.content}
    </span>
  </div>
))}
```

> Same `.map()` pattern as everywhere else in this project, one bubble rendered per message in the `messages` array. The only new idea here is **conditional styling based on data**: a user's message is right-aligned with a bright green background; the AI's reply is left-aligned with a dark, bordered bubble. A single ternary expression decides which, based on `m.role`.

**Auto-scrolling to the newest message:**

```tsx
const scrollRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
}, [messages, open, loading]);
```

> **`useRef`.** Another Hook, this one gives you a direct handle to an actual DOM element (the scrollable message container, in this case), so you can imperatively call browser APIs on it (`scrollTo`), something you can't do by just describing UI declaratively. We attach `ref={scrollRef}` to the message list `<div>` further down. The `useEffect` re-runs (and scrolls to the bottom) every time `messages`, `open`, or `loading` changes: i.e. every time a new message is added, the chat opens, or the loading state toggles.

**The floating toggle button and conditional window:**

```tsx
<button
  onClick={() => setOpen((v) => !v)}
  aria-label={open ? "Close chat" : "Chat with digital twin"}
  className="fixed bottom-6 right-6 z-50 ..."
>
  {open ? "Close" : "Ask my digital twin"}
</button>

{open && (
  <div className="fixed bottom-24 right-6 z-50 ...">
    {/* chat window contents */}
  </div>
)}
```

> **`{open && (...)}`.** In JSX, `condition && <SomeElement />` is a common shorthand: if `condition` is `false`, React renders nothing at all; if `true`, it renders the element. This is how the entire chat window is mounted/unmounted just by toggling one boolean.
>
> **`aria-label`.** This is an *accessibility* attribute, it gives screen readers (used by visually impaired visitors) a clear description of what a button does, even though sighted users just see an icon/short label. Good practice on any icon-only or ambiguous button.

---

## 5. How It All Connects

Here's the full request/response journey when a visitor asks the chatbot a question, tying together everything above:

```
1. Visitor clicks "Ask my digital twin"          ->  Chat.tsx: setOpen(true)
2. Visitor types "What's your strongest skill set?"
   and hits Send                                  ->  Chat.tsx: send() is called

3. Chat.tsx sends a POST request to /api/chat
   with the full message history as JSON          ->  fetch("/api/chat", { ... })

4. Next.js routes this request to                 ->  src/app/api/chat/route.ts (POST)

5. route.ts:
     - reads OPENROUTER_API_KEY from .env
     - validates the incoming messages
     - builds a system prompt from content/profile.json
       (buildDigitalTwinSystemPrompt(), via profile.ts)
     - calls OpenRouter's API with the configured model

6. OpenRouter forwards the request to the AI
   model, which generates a reply grounded in
   the career facts from content/profile.json

7. route.ts receives the reply, extracts the
   text, and sends it back as JSON               ->  { "reply": "My strongest skill is..." }

8. Chat.tsx receives the JSON, adds it to
   `messages` as an assistant message             ->  setMessages(prev => [...prev, ...])

9. React re-renders, the new bubble appears,
   and the chat auto-scrolls to show it           ->  useEffect + scrollRef
```

Every step from 4 onward happens **on the server**. The visitor's browser never sees your API key, never talks to OpenRouter directly, and can't see the system prompt or your `.env` file. That's the entire reason for having a backend API route instead of calling OpenRouter directly from `Chat.tsx`.

---

## 6. Running It Yourself

```bash
# Install dependencies (only needed once, or after changing package.json)
npm install

# Start the local development server, with hot-reload on every save
npm run dev
```

Then open the URL it prints (usually `http://localhost:3000`, or the next free port if that's taken).

Other useful commands:

```bash
npm run build     # Create an optimized production build (also type-checks everything)
npm run start     # Run that production build locally
npx tsc --noEmit  # Type-check the whole project without building
```

To update your content (bio, jobs, skills, projects, links), the only file you should ever need to touch is:

```
content/profile.json
```

Every section of the site, and the AI chatbot's knowledge, reads from this one file (see [`content/profile.schema.md`](./content/profile.schema.md) for its exact shape). Because it's read from disk at server start rather than compiled into the code, a production build (`npm run build && npm run start`) picks up new content on the next rebuild; `npm run dev` picks it up on restart.

### Version control

This project is tracked with git. If you're new to it: git records a snapshot ("commit") of your files every time you explicitly ask it to, and keeps the full history so you can see what changed and when.

```bash
git status              # see what's changed since the last commit
git add <file>          # stage a specific file's changes
git commit -m "message" # save a snapshot of the staged changes
git push                # send your commits to GitHub (or another remote)
```

The `.gitignore` file in this project already excludes things that should never be committed, most importantly `.env` (your secret API key), `node_modules` (reinstallable via `npm install`), and `.next` (a generated build folder).

---

## 7. Glossary

A quick reference for terms used throughout this tutorial.

| Term | Meaning |
|---|---|
| **Component** | A self-contained, reusable piece of UI, written as a function that returns JSX. |
| **Props** | Data passed *into* a component from its parent. Most components import content directly from `profile.ts` instead, but `Nav` and `Chat` (client components) receive `name`/`resumeHref`/`hasProjects` as props from `page.tsx`, since they can't import the `fs`-based loader themselves (see [4.4](#44-the-home-page-pagetsx)). |
| **State** | Data a component "remembers" between renders, managed with `useState`, that triggers a re-render when changed. |
| **Hook** | A special React function (always starting with `use`, e.g. `useState`, `useEffect`, `useRef`) that lets a component tap into React features like state, lifecycle, or DOM refs. |
| **JSX** | HTML-like syntax you can write directly inside JavaScript/TypeScript files; compiled into real DOM elements. |
| **Client component** | A component marked `"use client"` that runs in the browser and can be interactive. |
| **Server component / route** | Code that runs only on the server (Node.js), never sent to the browser, used here for the `/api/chat` endpoint. |
| **API route** | A backend endpoint defined by a `route.ts` file, reachable at a URL, that can run server-only logic like calling external APIs with secret keys. |
| **`fetch`** | The standard way to make an HTTP request from JavaScript, whether from the browser or from server code. |
| **`async` / `await`** | Syntax for writing asynchronous (non-blocking, takes-time) code in a readable, top-to-bottom style. |
| **Environment variable** | A configuration value (often secret, like an API key) stored outside your source code, typically in a `.env` file, and read via `process.env`. |
| **Tailwind utility class** | A small, single-purpose CSS class (e.g. `text-lg`, `flex`, `rounded-full`) applied directly in `className`, instead of writing custom CSS rules. |
| **Type / TypeScript** | A layer on top of JavaScript that lets you describe the expected shape of data, catching many bugs before the code ever runs. |
| **System prompt** | Hidden instructions given to an AI model before the user's actual message, defining its behavior and the facts it should ground its answers in. |
| **Rate limit (HTTP 429)** | A server telling you "you're sending requests too fast / this resource is oversubscribed, try again later." |
| **Commit** | A saved snapshot of your files in git, with a message describing what changed. |
| **Repository (repo)** | A project folder tracked by git, including its full commit history. |

---

That's the whole site. If you want a next step to practice: try editing one bullet point in `content/profile.json`, restart `npm run dev`, and watch it update in the browser, both on the page itself, and in what the AI chatbot knows the next time you ask it a question.
