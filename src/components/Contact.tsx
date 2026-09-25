import { profile } from "@/data/profile";

export default function Contact() {
  return (
    <section id="contact" className="relative py-24 sm:py-32 border-t border-border">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="flex items-baseline gap-4 mb-14">
          <span className="font-mono text-xs text-accent">05</span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
            Contact
          </h2>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="rounded-3xl border border-border bg-bg-elevated p-10 sm:p-16 relative overflow-hidden">
          <div
            className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full opacity-[0.12] blur-[100px]"
            style={{ background: "var(--accent)" }}
          />
          <h3 className="font-display text-3xl sm:text-5xl font-semibold tracking-tight max-w-2xl leading-tight relative">
            Let&apos;s build something that has to work.
          </h3>
          <p className="text-muted mt-5 max-w-xl relative">
            Open to conversations about senior backend engineering roles
            focused on building systems that work reliably at scale.
          </p>

          <div className="mt-10 flex flex-wrap gap-4 relative">
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 rounded-full border border-border-strong px-6 py-3 text-sm font-mono text-foreground hover:border-accent hover:text-accent transition"
              >
                {profile.email}
              </a>
            )}
            {profile.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border-strong px-6 py-3 text-sm font-mono text-foreground hover:border-accent hover:text-accent transition"
              >
                LinkedIn ↗
              </a>
            )}
            {profile.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border-strong px-6 py-3 text-sm font-mono text-foreground hover:border-accent hover:text-accent transition"
              >
                GitHub ↗
              </a>
            )}
            <a
              href={profile.resumeHref}
              download
              className="inline-flex items-center gap-2 rounded-full border border-border-strong px-6 py-3 text-sm font-mono text-foreground hover:border-accent hover:text-accent transition"
            >
              Download résumé ↓
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
