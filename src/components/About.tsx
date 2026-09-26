import { about, education } from "@/data/profile";

export default function About() {
  const hasParagraphs = about.paragraphs.length > 0;
  const hasFocus = about.focus.length > 0;
  const hasEducation = education.length > 0;
  const hasSidebar = hasFocus || hasEducation;

  if (!hasParagraphs && !hasSidebar) return null;

  return (
    <section id="about" className="relative py-24 sm:py-32 border-t border-border">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="flex items-baseline gap-4 mb-14">
          <span className="font-mono text-xs text-accent">01</span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
            About
          </h2>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          {hasParagraphs && (
            <div className="lg:col-span-8">
              {about.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="text-lg sm:text-xl leading-relaxed text-muted mb-6 last:mb-0"
                >
                  {i === 0 ? (
                    <span className="text-foreground">{p}</span>
                  ) : (
                    p
                  )}
                </p>
              ))}
            </div>
          )}

          {hasSidebar && (
            <div className="lg:col-span-4 space-y-10">
              {hasFocus && (
                <div>
                  <h3 className="font-mono text-xs uppercase tracking-wider text-muted-2 mb-4">
                    Focus areas
                  </h3>
                  <ul className="space-y-3">
                    {about.focus.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-3 text-sm text-foreground"
                      >
                        <span className="mt-1.5 h-1 w-4 shrink-0 bg-accent" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {hasEducation && (
                <div>
                  <h3 className="font-mono text-xs uppercase tracking-wider text-muted-2 mb-4">
                    Education
                  </h3>
                  <ul className="space-y-4">
                    {education.map((e) => (
                      <li key={e.degree} className="text-sm">
                        <p className="text-foreground">{e.degree}</p>
                        <p className="text-muted mt-0.5">
                          {e.school} <span className="text-muted-2">· {e.period}</span>
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
