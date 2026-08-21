import { NextRequest, NextResponse } from "next/server";
import { buildDigitalTwinSystemPrompt } from "@/data/profile";

export const runtime = "nodejs";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "openai/gpt-oss-20b:free";
const MAX_HISTORY_MESSAGES = 16;
const MAX_MESSAGE_LENGTH = 2000;
const UPSTREAM_TIMEOUT_MS = 55_000;

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

function isChatMessage(value: unknown): value is ChatMessage {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    (v.role === "user" || v.role === "assistant") &&
    typeof v.content === "string" &&
    v.content.trim().length > 0 &&
    v.content.length <= MAX_MESSAGE_LENGTH
  );
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Chat is not configured on the server." },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const rawMessages = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(rawMessages) || rawMessages.length === 0) {
    return NextResponse.json({ error: "No messages provided." }, { status: 400 });
  }

  const messages = rawMessages.filter(isChatMessage).slice(-MAX_HISTORY_MESSAGES);
  if (messages.length === 0) {
    return NextResponse.json({ error: "No valid messages provided." }, { status: 400 });
  }

  const model = process.env.OPENROUTER_MODEL || DEFAULT_MODEL;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  try {
    const upstream = await fetch(OPENROUTER_URL, {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://digital-twin-portfolio.local",
        "X-Title": "Digital Twin Portfolio Chat",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: buildDigitalTwinSystemPrompt() },
          ...messages,
        ],
        temperature: 0.6,
        max_tokens: 600,
      }),
    });

    if (!upstream.ok) {
      const errText = await upstream.text();
      console.error("OpenRouter error", upstream.status, errText);

      if (upstream.status === 429) {
        let retryAfter: number | undefined;
        try {
          const parsed = JSON.parse(errText);
          retryAfter = parsed?.error?.metadata?.retry_after_seconds;
        } catch {
          // ignore parse failure, fall back to generic message
        }
        return NextResponse.json(
          {
            error: retryAfter
              ? `The free AI model is rate-limited right now (it's shared across all OpenRouter users). Try again in about ${retryAfter}s.`
              : "The free AI model is rate-limited right now. Try again in a moment.",
            retryAfterSeconds: retryAfter,
          },
          { status: 429 },
        );
      }

      return NextResponse.json(
        { error: "The digital twin is unavailable right now. Try again in a moment." },
        { status: 502 },
      );
    }

    const data = await upstream.json();
    const reply: string | undefined = data?.choices?.[0]?.message?.content;

    if (!reply) {
      return NextResponse.json(
        { error: "Got an empty response. Try rephrasing your question." },
        { status: 502 },
      );
    }

    return NextResponse.json({ reply });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      console.error("Chat route timeout after", UPSTREAM_TIMEOUT_MS, "ms");
      return NextResponse.json(
        {
          error:
            "The free model is taking too long to respond (it can be slow under load). Please try again.",
        },
        { status: 504 },
      );
    }
    console.error("Chat route failure", err);
    return NextResponse.json(
      { error: "Something went wrong reaching the digital twin. Please try again." },
      { status: 500 },
    );
  } finally {
    clearTimeout(timeout);
  }
}
