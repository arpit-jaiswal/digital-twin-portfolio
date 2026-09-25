"use client";

import { useEffect, useRef, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const SUGGESTIONS = [
  "What did you build at Hyperface?",
  "Why the sabbatical?",
  "What's your strongest skill set?",
];

export default function Chat({ name }: { name: string }) {
  const firstName = name.split(" ")[0];
  const INITIAL_MESSAGE: Message = {
    role: "assistant",
    content: `Hey, I'm ${firstName}'s digital twin. Ask me anything about his career, the systems he's built, or his experience across fintech and e-commerce.`,
  };

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFailed, setLastFailed] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open, loading]);

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

      if (!res.ok) {
        throw new Error(data?.error ?? "Something went wrong.");
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.reply as string }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLastFailed(trimmed);
      setMessages((prev) => prev.filter((m) => m !== nextMessages[nextMessages.length - 1]));
    } finally {
      setLoading(false);
    }
  }

  function retry() {
    if (lastFailed) send(lastFailed);
  }

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Chat with digital twin"}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-accent px-5 py-3.5 text-sm font-mono font-medium text-[#08090c] shadow-[0_8px_30px_rgba(199,255,62,0.35)] hover:brightness-110 transition"
      >
        <span className="h-2 w-2 rounded-full bg-[#08090c]" />
        {open ? "Close" : "Ask my digital twin"}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[92vw] max-w-sm rounded-2xl border border-border-strong bg-bg-elevated shadow-2xl flex flex-col overflow-hidden animate-fade-up">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
            <span className="h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_10px_var(--accent)]" />
            <div>
              <p className="font-display text-sm font-semibold leading-tight">
                {name} · Digital Twin
              </p>
              <p className="font-mono text-[11px] text-muted-2 leading-tight">
                AI, answers from his real career history
              </p>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 max-h-96 overflow-y-auto px-5 py-4 space-y-4"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`text-sm leading-relaxed ${
                  m.role === "user" ? "text-right" : "text-left"
                }`}
              >
                <span
                  className={`inline-block max-w-[85%] rounded-2xl px-3.5 py-2.5 whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-accent text-[#08090c] rounded-br-sm"
                      : "bg-bg-elevated-2 text-foreground/90 border border-border rounded-bl-sm"
                  }`}
                >
                  {m.content}
                </span>
              </div>
            ))}

            {loading && (
              <div className="text-left space-y-1.5">
                <span className="inline-flex items-center gap-1 rounded-2xl rounded-bl-sm border border-border bg-bg-elevated-2 px-3.5 py-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-2 animate-bounce [animation-delay:-0.2s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-2 animate-bounce [animation-delay:-0.1s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-2 animate-bounce" />
                </span>
                <p className="font-mono text-[10px] text-muted-2 pl-1">
                  Free-tier model, can take up to ~30s…
                </p>
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-400/30 bg-red-400/5 px-3.5 py-2.5">
                <p className="text-xs text-red-400 font-mono">{error}</p>
                {lastFailed && (
                  <button
                    onClick={retry}
                    className="mt-2 font-mono text-[11px] px-2.5 py-1 rounded-full border border-red-400/40 text-red-300 hover:bg-red-400/10 transition"
                  >
                    Retry
                  </button>
                )}
              </div>
            )}
          </div>

          {messages.length <= 1 && (
            <div className="px-5 pb-3 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="font-mono text-[11px] px-2.5 py-1 rounded-full border border-border text-muted hover:border-accent hover:text-accent transition"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-border p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about his experience…"
              className="flex-1 bg-transparent text-sm px-2 py-2 outline-none placeholder:text-muted-2"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-full bg-accent px-4 py-2 text-xs font-mono font-medium text-[#08090c] disabled:opacity-40 hover:brightness-110 transition"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
