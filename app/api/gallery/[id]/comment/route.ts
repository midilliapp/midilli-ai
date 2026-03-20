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

// GET /api/gallery/[id]/comment — fetch comments for a post
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sb = getSupabase();
    const { id: postId } = await params;

    const { data, error } = await sb
      .from("gallery_comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return NextResponse.json({ comments: data ?? [] });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

// POST /api/gallery/[id]/comment — add a comment
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sb = getSupabase();
    const { id: postId } = await params;
    const { username, content } = (await req.json()) as {
      username: string;
      content: string;
    };

    if (!username?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: "username and content required" },
        { status: 400 }
      );
    }

    const { data, error } = await sb
      .from("gallery_comments")
      .insert({
        post_id: postId,
        username: username.trim(),
        content: content.trim(),
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ comment: data });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
