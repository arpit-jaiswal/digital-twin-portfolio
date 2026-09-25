import { skills } from "@/data/profile";

export default function Skills() {
  if (skills.length === 0) return null;

  return (
    <section id="skills" className="relative py-24 sm:py-32 border-t border-border">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="flex items-baseline gap-4 mb-14">
          <span className="font-mono text-xs text-accent">03</span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
            Skills &amp; Tools
          </h2>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl border border-border bg-border overflow-hidden">
          {skills.map((group) => (
            <div
              key={group.category}
              className="bg-bg-elevated p-6 hover:bg-bg-elevated-2 transition-colors"
            >
              <h3 className="font-mono text-xs uppercase tracking-wider text-accent-dim mb-4">
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="text-sm text-foreground/90 px-2.5 py-1 rounded-md bg-bg border border-border"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
