import { fal } from "@fal-ai/client";
import { NextRequest, NextResponse } from "next/server";

// All supported text-to-image models
export const MODELS = [
  { id: "fal-ai/flux/schnell",       name: "Flux Schnell",    speed: "~3s",  tier: "free"    },
  { id: "fal-ai/flux/dev",           name: "Flux Dev",        speed: "~8s",  tier: "free"    },
  { id: "fal-ai/flux-pro",           name: "Flux Pro",        speed: "~12s", tier: "pro"     },
  { id: "fal-ai/flux-pro/v1.1",      name: "Flux Pro v1.1",   speed: "~10s", tier: "pro"     },
  { id: "fal-ai/flux-2-pro",         name: "Flux 2 Pro",      speed: "~15s", tier: "pro"     },
  { id: "fal-ai/stable-diffusion-v3-medium", name: "SD3 Medium", speed: "~10s", tier: "free" },
  { id: "fal-ai/aura-flow",          name: "AuraFlow",        speed: "~12s", tier: "free"    },
  { id: "fal-ai/kolors",             name: "Kolors",          speed: "~10s", tier: "free"    },
  { id: "fal-ai/ideogram/v2",        name: "Ideogram v2",     speed: "~12s", tier: "pro"     },
  { id: "fal-ai/recraft-v3",         name: "Recraft v3",      speed: "~10s", tier: "pro"     },
  { id: "fal-ai/imagen4/preview",    name: "Imagen 4",        speed: "~10s", tier: "pro"     },
  { id: "fal-ai/gpt-image-1",        name: "GPT-Image-1",     speed: "~20s", tier: "pro"     },
] as const;

export type ModelId = typeof MODELS[number]["id"];

export async function POST(req: NextRequest) {
  const falKey = process.env.FAL_KEY ?? process.env.FAL_API_KEY;

  if (!falKey) {
    return NextResponse.json(
      { error: "FAL_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  fal.config({ credentials: falKey });

  let body: { prompt?: string; model?: string; aspect_ratio?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { prompt, model = "fal-ai/flux/schnell", aspect_ratio = "1:1" } = body;

  if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
    return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await fal.subscribe(model as any, {
      input: {
        prompt: prompt.trim(),
        image_size: aspect_ratio === "16:9" ? "landscape_16_9"
          : aspect_ratio === "9:16" ? "portrait_16_9"
          : "square_hd",
        num_images: 1,
        enable_safety_checker: true,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = result.data as any;
    const images: { url: string }[] = data?.images ?? data?.image ? [data.image] : [];

    if (!images || images.length === 0) {
      return NextResponse.json({ error: "No image returned from model." }, { status: 500 });
    }

    return NextResponse.json({
      url: images[0].url,
      model,
      prompt,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Generation failed.";
    console.error("[generate] fal error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ models: MODELS });
}
