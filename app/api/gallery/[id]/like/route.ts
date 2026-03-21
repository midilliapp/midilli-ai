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

// POST /api/gallery/[id]/like — toggle like
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sb = getSupabase();
    const { id: postId } = await params;
    const { username } = (await req.json()) as { username: string };

    if (!username?.trim()) {
      return NextResponse.json({ error: "username required" }, { status: 400 });
    }

    // Check existing like
    const { data: existing } = await sb
      .from("gallery_likes")
      .select("id")
      .eq("post_id", postId)
      .eq("username", username.trim())
      .maybeSingle();

    if (existing) {
      await sb.from("gallery_likes").delete().eq("id", existing.id);
    } else {
      await sb
        .from("gallery_likes")
        .insert({ post_id: postId, username: username.trim() });
    }

    // Return updated count
    const { data: likes } = await sb
      .from("gallery_likes")
      .select("id")
      .eq("post_id", postId);

    return NextResponse.json({
      liked: !existing,
      likes_count: likes?.length ?? 0,
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
