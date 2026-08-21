export const profile = {
  name: "Arpit Jaiswal",
  role: "Senior Software Engineer",
  tagline: "Backend systems at scale, for fintech & e-commerce.",
  location: "Bengaluru, India",
  email: "jaiswal.arpit09@gmail.com",
  linkedin: "https://www.linkedin.com/in/arpit-jaiswal-4b951837",
  github: "https://github.com/arpit-jaiswal",
  resumeHref: "/Arpit_Jaiswal_Resume.pdf",
  yearsExperience: "8+",
};

export const stats = [
  { value: "8+", label: "Years building production systems" },
  { value: "5M+", label: "Notifications in a single campaign" },
  { value: "5M+", label: "Orders/day at peak, checkout systems" },
  { value: "3", label: "Companies across e-commerce & fintech" },
];

export const about = {
  paragraphs: [
    "I'm a backend engineer with 8+ years of experience across e-commerce and fintech, owning systems from initial design through to running them in production.",
    "At Hyperface, I built a bulk notification platform serving campaigns of 5M+ notifications for major banks, and a config-driven credit onboarding platform that lets issuers integrate once and onboard any client without a code change. Earlier, at Meesho, I rebuilt checkout as it scaled past a million orders a day.",
    "I like owning things end-to-end: design, trade-offs, and what happens after it ships. I've been part of founding teams for new product lines, which mostly means being comfortable when the spec doesn't exist yet.",
  ],
  focus: [
    "Distributed systems & service architecture",
    "Fintech onboarding & compliance workflows",
    "High-throughput messaging & notification platforms",
    "Search & discovery at scale",
  ],
};

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

export const journey: JourneyEntry[] = [
  {
    company: "Hyperface",
    companyFull: "Hyperface Technologies Pvt. Ltd.",
    role: "Software Development Engineer 3",
    period: "Apr 2024 - Dec 2025",
    location: "Bengaluru",
    summary:
      "Built core fintech infrastructure connecting banks, issuers and clients, from bulk notification delivery to config-driven credit onboarding.",
    highlights: [
      "Built a bulk notification platform covering the full campaign lifecycle: audience segmentation, scheduling, maker-checker approval, multi-channel dispatch (Email, SMS, WhatsApp, In-App), and real-time delivery analytics, serving major banks with individual campaigns scaling past 5M+ notifications.",
      "Built a configurable credit onboarding platform sitting between clients and issuers, letting issuers integrate once and onboard any new client. Data collection, document uploads, KYC checks and workflow transitions are fully config-driven, so new journeys ship without code changes.",
    ],
    tags: ["Fintech", "Notifications", "Onboarding", "Config-driven systems"],
  },
  {
    company: "Sabbatical",
    companyFull: "Time off for personal reasons",
    role: "Sabbatical",
    period: "Jan 2022 - Mar 2024",
    location: "",
    summary: "Took time off for personal reasons.",
    highlights: [],
    tags: [],
  },
  {
    company: "Meesho",
    companyFull: "Fashnear Technologies Pvt. Ltd.",
    role: "Software Development Engineer 3",
    period: "Apr 2021 - Dec 2021",
    location: "Bengaluru",
    summary:
      "Overhauled checkout for one of India's largest social commerce platforms, moving off a PHP monolith onto microservices.",
    highlights: [
      "Rebuilt the Meesho App checkout flow as a microservices architecture: Cart Service, Order Creation Service (inventory, price and payment verification, credits deduction), Payment Service (third-party gateway integrations), and Meesho Wallet (internal credits for bonuses and referrals).",
      "These services collectively processed 1.5M+ orders daily, scaling to 5M+ during peak sale events.",
    ],
    tags: ["Microservices", "Checkout", "Payments", "Scale"],
  },
  {
    company: "Meesho",
    companyFull: "Fashnear Technologies Pvt. Ltd.",
    role: "Software Development Engineer 2",
    period: "Jan 2019 - Mar 2021",
    location: "Bengaluru",
    summary:
      "Founding engineer on Meesho's social commerce features: social platform, and ratings & reviews.",
    highlights: [
      "Built a social platform enabling posts, comments, likes, shares and multimedia (images, gifs, video) among Meesho entrepreneurs, with system and human moderation of user-generated content.",
      "Built the ratings & reviews platform: text/image/video reviews, aggregated scores and rating distributions on product pages, with relevance-ranked review discovery.",
    ],
    tags: ["Social platform", "Ratings & reviews", "Content moderation"],
  },
  {
    company: "Quikr",
    companyFull: "Quikr India Pvt. Ltd.",
    role: "Software Engineer",
    period: "Apr 2016 - Oct 2018",
    location: "Bengaluru",
    summary:
      "Worked across search, core platform and logistics for one of India's largest classifieds marketplaces.",
    highlights: [
      "Contributed to Quikr's Elasticsearch-powered search platform, handling high query volumes with relevance-based ranking at scale.",
      "Contributed to core platform services: user management, authentication, session management, ad posting/feed, and messaging infrastructure.",
      "Built Quikr Logistics for C2C and B2C delivery. Intracity orders were fulfilled by an internal team, intercity orders were routed through third-party providers, with full order tracking for operations.",
    ],
    tags: ["Search", "Elasticsearch", "Platform", "Logistics"],
  },
  {
    company: "Quikr",
    companyFull: "Quikr India Pvt. Ltd.",
    role: "Associate Software Engineer",
    period: "Jun 2015 - Mar 2016",
    location: "Bengaluru",
    summary: "First engineering role: real-time chat infrastructure.",
    highlights: [
      "Worked on Quikr's XMPP-based in-app chat platform connecting buyers and sellers in real time, with content moderation to filter spam.",
    ],
    tags: ["XMPP", "Real-time systems"],
  },
];

export const skills = [
  {
    category: "Languages",
    items: ["Java", "Python", "C", "C++"],
  },
  {
    category: "Databases",
    items: ["MySQL", "Cassandra", "Redis", "Redshift"],
  },
  {
    category: "Search",
    items: ["Elasticsearch"],
  },
  {
    category: "Message Brokers",
    items: ["Kafka", "RabbitMQ"],
  },
  {
    category: "Frameworks",
    items: ["Spring Boot", "Temporal", "Hystrix"],
  },
  {
    category: "Observability",
    items: ["NewRelic", "CloudWatch", "SigNoz", "Kibana"],
  },
  {
    category: "Infrastructure",
    items: ["AWS", "Jenkins"],
  },
];

export const education = [
  {
    degree: "M.Tech, Computer Science",
    school: "IIIT-Hyderabad",
    period: "2013 - 2015",
  },
  {
    degree: "B.E, Computer Science",
    school: "Jabalpur Engineering College",
    period: "2009 - 2013",
  },
];

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

  return `You are the "digital twin" of ${profile.name}, embedded as an AI chat assistant on his personal portfolio website. You answer questions from recruiters, hiring managers and other visitors about his career, experience and skills, speaking in the first person, as if you were ${profile.name} himself.

Tone: confident, concise, professional, a little sharp/direct, not corporate-bland. No fluff, no over-hedging. Prefer short paragraphs or brief bullet points over walls of text. Do not use em dashes in your responses; use commas, periods, or colons instead.

Ground truth about ${profile.name} (use ONLY this information; do not invent employers, projects, dates, technologies, or achievements that aren't listed below):

SUMMARY
${profile.tagline} ${profile.yearsExperience} years of experience, based in ${profile.location}.

CAREER JOURNEY
${journeyText}

SKILLS
${skillsText}

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
