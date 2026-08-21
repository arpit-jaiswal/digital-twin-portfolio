import { journey } from "@/data/profile";

export default function Journey() {
  return (
    <section
      id="journey"
      className="relative py-24 sm:py-32 border-t border-border bg-bg-elevated/40"
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="flex items-baseline gap-4 mb-14 sm:mb-20">
          <span className="font-mono text-xs text-accent">02</span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
            Career Journey
          </h2>
          <div className="h-px flex-1 bg-border" />
        </div>

        <ol className="relative">
          <div
            aria-hidden
            className="absolute left-[7px] sm:left-[9px] top-2 bottom-2 w-px bg-gradient-to-b from-accent/70 via-border to-transparent"
          />

          {journey.map((entry, i) => {
            const isSabbatical = entry.role === "Sabbatical";
            return (
              <li key={`${entry.company}-${entry.role}`} className="relative pl-8 sm:pl-12 pb-14 last:pb-0">
                <span
                  className={`absolute left-0 top-1.5 h-[15px] w-[15px] sm:h-[19px] sm:w-[19px] rounded-full border-2 ${
                    isSabbatical
                      ? "bg-bg border-muted-2"
                      : "bg-bg border-accent shadow-[0_0_16px_rgba(199,255,62,0.35)]"
                  }`}
                />

                {isSabbatical ? (
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs sm:text-sm text-muted-2">
                    <span className="uppercase tracking-wider">{entry.company}</span>
                    <span>·</span>
                    <span>{entry.period}</span>
                  </div>
                ) : (
                  <div className="group">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 mb-2">
                      <h3 className="font-display text-xl sm:text-2xl font-semibold tracking-tight">
                        {entry.role}
                        <span className="text-muted font-normal"> · {entry.company}</span>
                      </h3>
                      <span className="font-mono text-xs sm:text-sm text-muted-2 whitespace-nowrap">
                        {entry.period}
                      </span>
                    </div>

                    <p className="font-mono text-xs text-muted-2 mb-4">
                      {entry.companyFull}
                      {entry.location ? ` · ${entry.location}` : ""}
                    </p>

                    <p className="text-base sm:text-lg text-muted mb-5 max-w-3xl">
                      {entry.summary}
                    </p>

                    <ul className="space-y-3 mb-5 max-w-3xl">
                      {entry.highlights.map((h, idx) => (
                        <li
                          key={idx}
                          className="flex gap-3 text-sm sm:text-[15px] leading-relaxed text-foreground/90"
                        >
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                          {h}
                        </li>
                      ))}
                    </ul>

                    {entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {entry.tags.map((t) => (
                          <span
                            key={t}
                            className="font-mono text-[11px] uppercase tracking-wide px-2.5 py-1 rounded-full border border-border text-muted"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
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
