import { profile, stats } from "@/data/profile";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-grid pt-40 pb-28 sm:pt-48 sm:pb-36"
    >
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full opacity-20 blur-[120px]"
        style={{ background: "var(--accent)" }}
      />
      <div
        className="pointer-events-none absolute top-1/3 right-0 h-[420px] w-[420px] translate-x-1/3 rounded-full opacity-[0.14] blur-[120px]"
        style={{ background: "var(--accent-2)" }}
      />

      <div className="relative max-w-6xl mx-auto px-6 sm:px-8">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-border-strong px-4 py-1.5 font-mono text-xs text-muted mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            Open to new opportunities · {profile.location}
          </div>

          <h1 className="font-display font-semibold leading-[0.95] tracking-tight text-5xl sm:text-6xl lg:text-7xl">
            {profile.name}
          </h1>

          <p className="mt-8 max-w-2xl text-lg sm:text-xl text-muted leading-relaxed">
            {profile.role} building scalable, distributed backend systems
            across e-commerce and fintech: onboarding, notifications, checkout,
            ratings &amp; reviews, and search.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#journey"
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-mono font-medium text-[#08090c] hover:brightness-110 transition"
            >
              See the journey
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
            {(profile.linkedin || profile.email) && (
              <a
                href={profile.linkedin || `mailto:${profile.email}`}
                target={profile.linkedin ? "_blank" : undefined}
                rel={profile.linkedin ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-2 rounded-full border border-border-strong px-6 py-3 text-sm font-mono text-foreground hover:border-accent hover:text-accent transition"
              >
                Get in touch
              </a>
            )}
          </div>
        </div>

        <dl className="mt-24 grid grid-cols-2 sm:grid-cols-4 gap-px rounded-2xl border border-border bg-border overflow-hidden">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-bg-elevated px-5 py-6 sm:px-6 sm:py-7"
            >
              <dt className="font-display text-2xl sm:text-3xl font-semibold text-accent">
                {s.value}
              </dt>
              <dd className="mt-1 text-xs sm:text-sm text-muted leading-snug">
                {s.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
