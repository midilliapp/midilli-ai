import { fal } from "@fal-ai/client";
import { NextRequest, NextResponse } from "next/server";

// All supported text-to-image models
export const MODELS = [
  { id: "fal-ai/flux/schnell",       name: "Flux Schnell",    speed: "~3s",  tier: "free" },
  { id: "fal-ai/flux/dev",           name: "Flux Dev",        speed: "~8s",  tier: "free" },
  { id: "fal-ai/flux-pro/v1.1",      name: "Flux Pro",        speed: "~10s", tier: "pro"  },
  { id: "fal-ai/flux-2-pro",         name: "Flux 2 Pro",      speed: "~15s", tier: "pro"  },
  { id: "fal-ai/kolors",             name: "Kolors",          speed: "~10s", tier: "free" },
  { id: "fal-ai/aura-flow",          name: "AuraFlow",        speed: "~12s", tier: "free" },
  { id: "fal-ai/recraft-v3",         name: "Recraft v3",      speed: "~10s", tier: "pro"  },
  { id: "fal-ai/ideogram/v2",        name: "Ideogram v2",     speed: "~12s", tier: "pro"  },
  { id: "fal-ai/imagen4/preview",    name: "Imagen 4",        speed: "~10s", tier: "pro"  },
  { id: "fal-ai/gpt-image-1",        name: "GPT-Image-1",     speed: "~20s", tier: "pro"  },
] as const;

export type ModelId = typeof MODELS[number]["id"];

function getImageSize(aspect_ratio: string) {
  switch (aspect_ratio) {
    case "16:9":  return "landscape_16_9";
    case "9:16":  return "portrait_16_9";
    case "4:3":   return "landscape_4_3";
    case "3:4":   return "portrait_4_3";
    case "3:2":   return "landscape_4_3";   // closest supported
    case "2:3":   return "portrait_4_3";    // closest supported
    case "21:9":  return "landscape_16_9";  // closest supported
    default:      return "square_hd";
  }
}

// Build model-specific input to avoid unsupported param errors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildInput(model: string, prompt: string, aspect_ratio: string): Record<string, any> {
  const imageSize = getImageSize(aspect_ratio);

  // GPT-Image-1: uses 'size' string format
  if (model === "fal-ai/gpt-image-1") {
    const size =
      (aspect_ratio === "16:9" || aspect_ratio === "3:2" || aspect_ratio === "21:9") ? "1792x1024" :
      (aspect_ratio === "9:16" || aspect_ratio === "2:3" || aspect_ratio === "3:4") ? "1024x1792" :
      "1024x1024";
    return { prompt, size };
  }

  // Imagen 4: supports aspect_ratio string directly
  if (model === "fal-ai/imagen4/preview") {
    const ar =
      aspect_ratio === "21:9" ? "16:9" :
      aspect_ratio === "3:2"  ? "4:3"  :
      aspect_ratio === "2:3"  ? "3:4"  :
      aspect_ratio;
    return { prompt, aspect_ratio: ar };
  }

  // Recraft v3: uses image_size but no safety checker
  if (model === "fal-ai/recraft-v3") {
    return { prompt, image_size: imageSize, num_images: 1 };
  }

  // Ideogram v2: uses aspect_ratio string
  if (model === "fal-ai/ideogram/v2") {
    return {
      prompt,
      aspect_ratio: aspect_ratio === "1:1" ? "ASPECT_1_1" : aspect_ratio === "16:9" ? "ASPECT_16_9" : "ASPECT_9_16",
    };
  }

  // AuraFlow: no safety checker, no image_size name
  if (model === "fal-ai/aura-flow") {
    return { prompt, num_images: 1 };
  }

  // Default (Flux family, Kolors, SD3 etc.)
  return {
    prompt,
    image_size: imageSize,
    num_images: 1,
    enable_safety_checker: false,
  };
}

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
      input: buildInput(model, prompt.trim(), aspect_ratio),
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = result.data as any;

    // Fix: proper operator precedence for image extraction
    const images: { url: string }[] =
      data?.images ??
      (data?.image ? [data.image] : []);

    if (!images || images.length === 0) {
      return NextResponse.json({ error: "No image returned from model." }, { status: 500 });
    }

    return NextResponse.json({ url: images[0].url, model, prompt });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Generation failed.";
    console.error("[generate] fal error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ models: MODELS });
}
