import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are MIDILLI's friendly AI support assistant. MIDILLI is a premium AI image and video generation platform.

ABOUT MIDILLI:
- Turns any text description into ready-to-use visuals in ~8-10 seconds
- No prompt engineering skills needed — plain language works perfectly
- Supports 10+ AI models: Flux Schnell, Flux Dev, Flux Pro, Flux 2 Pro, Kolors, AuraFlow, Recraft v3, Ideogram v2, Imagen 4, GPT-Image-1
- Use cases: YouTube thumbnails, Shopify product images, Instagram ads, pitch deck visuals, blog covers, gaming banners
- Free plan: 20 credits (no credit card needed)
- Pro plan: $19/month — 500 credits, commercial rights, priority queue
- Ultra plan: $49/month — 2000 credits, 4K exports, API access
- Credit packs: 100 credits ($5), 300 credits ($12), 700 credits ($22), 2000 credits ($50)
- Commercial rights included on paid plans
- No watermarks on paid plans
- Images generated are owned by the user

YOUR BEHAVIOR:
- Be friendly, concise, and helpful
- Answer questions about MIDILLI features, pricing, and how to use it
- If asked about generating images, guide them to the Generate section
- If there's a technical issue, ask them to describe it and suggest solutions
- Keep replies short — max 3-4 sentences unless more detail is needed
- Always respond in English
- Never make up features that don't exist
- If unsure, say "I'll connect you with our team" and suggest emailing support`;

export async function POST(req: NextRequest) {
  const groqKey = process.env.GROQ_KEY;

  if (!groqKey) {
    return NextResponse.json({ error: "GROQ_KEY not configured." }, { status: 500 });
  }

  let body: { messages?: { role: string; content: string }[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const messages = body.messages ?? [];

  if (!messages.length) {
    return NextResponse.json({ error: "No messages provided." }, { status: 400 });
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${groqKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        max_tokens: 400,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages.map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })),
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: JSON.stringify(data) }, { status: 500 });
    }

    const text = data.choices?.[0]?.message?.content ?? "";
    return NextResponse.json({ reply: text });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Chat failed.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
