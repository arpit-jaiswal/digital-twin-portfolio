import { projects } from "@/data/profile";

export default function Projects() {
  if (projects.length === 0) return null;

  return (
    <section id="projects" className="relative py-24 sm:py-32 border-t border-border">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="flex items-baseline gap-4 mb-14">
          <span className="font-mono text-xs text-accent">04</span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
            Projects
          </h2>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px rounded-2xl border border-border bg-border overflow-hidden">
          {projects.map((p) => (
            <div
              key={p.name}
              className="bg-bg-elevated p-6 sm:p-8 hover:bg-bg-elevated-2 transition-colors flex flex-col"
            >
              <div className="flex items-baseline justify-between gap-4 mb-2">
                <h3 className="font-display text-xl font-semibold tracking-tight">
                  {p.name}
                </h3>
                {p.type && (
                  <span className="font-mono text-[11px] uppercase tracking-wide text-muted-2 whitespace-nowrap">
                    {p.type}
                  </span>
                )}
              </div>

              <p className="text-sm sm:text-[15px] text-muted leading-relaxed mb-5">
                {p.description}
              </p>

              {p.stack.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {p.stack.map((s) => (
                    <span
                      key={s}
                      className="text-xs text-foreground/90 px-2.5 py-1 rounded-md bg-bg border border-border"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}

              {p.link && (
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center gap-1 text-sm font-mono text-accent hover:brightness-110 transition"
                >
                  View project ↗
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
