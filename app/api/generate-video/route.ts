import { fal } from "@fal-ai/client";
import { NextRequest, NextResponse } from "next/server";

// Real fal.ai image-to-video models
const VIDEO_MODEL_MAP: Record<string, string> = {
  kling:    "fal-ai/kling-video/v1.6/standard/image-to-video",
  kling_pro:"fal-ai/kling-video/v1.6/pro/image-to-video",
  luma:     "fal-ai/luma-dream-machine/image-to-video",
  minimax:  "fal-ai/minimax-video/image-to-video",
};

export const maxDuration = 120; // allow up to 2 min for video generation

export async function POST(req: NextRequest) {
  const falKey = process.env.FAL_KEY ?? process.env.FAL_API_KEY;
  if (!falKey) {
    return NextResponse.json({ error: "FAL_KEY not configured." }, { status: 500 });
  }
  fal.config({ credentials: falKey });

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const imageFile = formData.get("image") as File | null;
  const prompt    = (formData.get("prompt") as string | null) ?? "";
  const modelKey  = (formData.get("model")  as string | null) ?? "kling";
  const duration  = (formData.get("duration") as string | null) ?? "5";

  if (!imageFile) {
    return NextResponse.json({ error: "Image file is required." }, { status: 400 });
  }

  const modelId = VIDEO_MODEL_MAP[modelKey] ?? VIDEO_MODEL_MAP.kling;

  try {
    // 1. Upload image to fal storage
    const imageUrl = await fal.storage.upload(imageFile);

    // 2. Build model-specific input
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const input: Record<string, any> = {
      image_url: imageUrl,
      prompt: prompt.trim() || "smooth cinematic motion, subtle movement",
    };

    // Kling supports duration "5" or "10"
    if (modelKey === "kling" || modelKey === "kling_pro") {
      input.duration = duration === "10" ? "10" : "5";
      input.aspect_ratio = "16:9";
    }

    // 3. Generate video
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await fal.subscribe(modelId as any, { input });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = result.data as any;
    const videoUrl =
      data?.video?.url ??
      data?.video_url  ??
      data?.url        ??
      null;

    if (!videoUrl) {
      return NextResponse.json({ error: "No video returned from model." }, { status: 500 });
    }

    return NextResponse.json({ url: videoUrl, model: modelKey, prompt });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Video generation failed.";
    console.error("[generate-video] error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
