# content/profile.json schema

This is the single structured data source for the site and the digital
twin chatbot. Edit it by hand, or generate it with an AI agent from the
other files in this folder (see README.md → "Make This Your Own").

Don't invent facts, dates, employers, or metrics — every value here should
be traceable back to your actual resume/LinkedIn/other source documents.

```jsonc
{
  "profile": {
    "name": "string",
    "role": "string, e.g. 'Senior Software Engineer'",
    "tagline": "string, one-line pitch shown in the hero section",
    "location": "string, e.g. 'Bengaluru, India'",
    "email": "string",
    "linkedin": "string, full URL",
    "github": "string, full URL",
    "resumeHref": "leave as '/api/resume', which serves content/resume.pdf",
    "yearsExperience": "string, e.g. '8+'"
  },
  "stats": [
    { "value": "string, e.g. '8+'", "label": "string" }
    // any number of {value, label} tiles shown near the top of the page
  ],
  "about": {
    "paragraphs": ["string", "..."],
    "focus": ["string", "..."] // short bullet list of focus areas
  },
  "journey": [
    {
      "company": "string, short name",
      "companyFull": "string, legal/full name",
      "role": "string",
      "period": "string, e.g. 'Apr 2024 - Dec 2025'",
      "location": "string, can be empty",
      "summary": "string, one-line summary of the role",
      "highlights": ["string", "..."], // bullet points, can be empty
      "tags": ["string", "..."] // short topic tags, can be empty
    }
    // one entry per job/role, most recent first
  ],
  "skills": [
    { "category": "string, e.g. 'Languages'", "items": ["string", "..."] }
  ],
  "projects": [
    {
      "name": "string",
      "description": "string, one or two sentences",
      "stack": ["string", "..."], // technologies used, can be empty
      "link": "string, full URL to the repo or live project, can be empty",
      "type": "string, e.g. 'Personal project', 'Open source contribution'"
    }
    // optional: omit the field entirely, or leave as [], to hide the
    // Projects section
  ],
  "education": [
    { "degree": "string", "school": "string", "period": "string" }
  ]
}
```

## Resume file

Put your resume PDF at `content/resume.pdf` — it's served as-is at
`/api/resume` (linked from the "Resume" buttons on the site). Any other
raw source documents (`linkedin_profile.pdf`, `github.txt`, `portfolio.txt`,
etc.) are optional input for generating `profile.json` and aren't served
directly.
