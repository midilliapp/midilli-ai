import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase not configured");
  return createClient(url, key);
}

// GET /api/gallery — list posts with like counts
export async function GET() {
  try {
    const sb = getSupabase();

    const { data: posts, error } = await sb
      .from("gallery_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(40);

    if (error) throw error;

    // Fetch like counts for all posts in one query
    const ids = (posts ?? []).map((p) => p.id as string);
    let likeCounts: Record<string, number> = {};

    if (ids.length > 0) {
      const { data: likes } = await sb
        .from("gallery_likes")
        .select("post_id")
        .in("post_id", ids);

      (likes ?? []).forEach((l: { post_id: string }) => {
        likeCounts[l.post_id] = (likeCounts[l.post_id] ?? 0) + 1;
      });
    }

    const result = (posts ?? []).map((p) => ({
      ...p,
      likes_count: likeCounts[p.id as string] ?? 0,
    }));

    return NextResponse.json({ posts: result });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

// POST /api/gallery — share a new image
export async function POST(req: NextRequest) {
  try {
    const sb = getSupabase();
    const { image_url, prompt, username, model } = (await req.json()) as {
      image_url: string;
      prompt?: string;
      username: string;
      model?: string;
    };

    if (!image_url || !username?.trim()) {
      return NextResponse.json(
        { error: "image_url and username are required" },
        { status: 400 }
      );
    }

    const { data, error } = await sb
      .from("gallery_posts")
      .insert({
        image_url,
        prompt: prompt?.trim() ?? null,
        username: username.trim(),
        model: model ?? null,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ post: data });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
