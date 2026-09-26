import fs from "fs";
import path from "path";

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

export type Project = {
  name: string;
  description: string;
  stack: string[];
  link: string;
  type: string;
};

type ProfileData = {
  profile: {
    name: string;
    role: string;
    tagline: string;
    location: string;
    email: string;
    linkedin: string;
    github: string;
    resumeHref: string;
    yearsExperience: string;
  };
  chatSuggestions: string[];
  stats: { value: string; label: string }[];
  about: { paragraphs: string[]; focus: string[] };
  journey: JourneyEntry[];
  skills: { category: string; items: string[] }[];
  projects: Project[];
  education: { degree: string; school: string; period: string }[];
};

function loadProfileData(): ProfileData {
  const filePath = path.join(process.cwd(), "content", "profile.json");
  let raw: string;
  try {
    raw = fs.readFileSync(filePath, "utf-8");
  } catch {
    throw new Error(
      `Could not read ${filePath}. Create content/profile.json (see content/profile.schema.md) before starting the app.`,
    );
  }

  const data = JSON.parse(raw) as Partial<ProfileData>;
  const required: (keyof ProfileData)[] = [
    "profile",
    "stats",
    "about",
    "journey",
    "skills",
    "education",
  ];
  for (const key of required) {
    if (!data[key]) {
      throw new Error(`content/profile.json is missing required field "${key}".`);
    }
  }

  return data as ProfileData;
}

const data = loadProfileData();

export const profile = data.profile;
export const chatSuggestions = data.chatSuggestions ?? [];
export const stats = data.stats;
export const about = data.about;
export const journey = data.journey;
export const skills = data.skills;
export const projects = data.projects ?? [];
export const education = data.education;

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

  const skillsText = skills
    .map((s) => `- ${s.category}: ${s.items.join(", ")}`)
    .join("\n");

  const educationText = education
    .map((e) => `- ${e.degree}, ${e.school} (${e.period})`)
    .join("\n");

  const projectsText = projects
    .map((p) => {
      const stack = p.stack.length > 0 ? ` Stack: ${p.stack.join(", ")}.` : "";
      const link = p.link ? ` Link: ${p.link}.` : "";
      return `- ${p.name}${p.type ? ` (${p.type})` : ""}: ${p.description}${stack}${link}`;
    })
    .join("\n");

  return `You are the "digital twin" of ${profile.name}, embedded as an AI chat assistant on his personal portfolio website. You answer questions from recruiters, hiring managers and other visitors about his career, experience and skills, speaking in the first person, as if you were ${profile.name} himself.

Tone: confident, concise, professional, a little sharp/direct, not corporate-bland. No fluff, no over-hedging. Prefer short paragraphs or brief bullet points over walls of text. Do not use em dashes in your responses; use commas, periods, or colons instead.

Ground truth about ${profile.name} (use ONLY this information; do not invent employers, projects, dates, technologies, or achievements that aren't listed below):

SUMMARY
${profile.tagline} ${profile.yearsExperience} years of experience, based in ${profile.location}.

CAREER JOURNEY
${journeyText}

SKILLS
${skillsText}
${projects.length > 0 ? `\nPROJECTS\n${projectsText}\n` : ""}
EDUCATION
${educationText}

CONTACT
Email: ${profile.email}
LinkedIn: ${profile.linkedin}
GitHub: ${profile.github}

Rules:
- Stay in character as ${profile.name}'s digital twin at all times.
- Only discuss his career, work, skills, projects and professional background. If asked something unrelated (general trivia, coding help unrelated to his experience, personal/sensitive matters not listed above, etc.), politely redirect to his career and suggest reaching out directly via email or LinkedIn for anything else.
- Never fabricate details (companies, metrics, technologies) beyond what's provided above. If you don't know something, say so honestly and point the visitor to his email or LinkedIn.
- Keep answers focused and skimmable, this is a chat widget on a website, not an essay.
- It's fine to mention the sabbatical if relevant, framed matter-of-factly as time off for personal reasons.`;
}
