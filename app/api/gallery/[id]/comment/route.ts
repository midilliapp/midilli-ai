import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedIdentity, getSupabaseServer } from "@/lib/gallery-auth";

// GET /api/gallery/[id]/comment — fetch comments for a post
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sb = getSupabaseServer();
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
    const identity = await getAuthenticatedIdentity(req);
    if (!identity) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const sb = getSupabaseServer();
    const { id: postId } = await params;
    const { content } = (await req.json()) as {
      content: string;
    };

    if (!content?.trim()) {
      return NextResponse.json(
        { error: "content required" },
        { status: 400 }
      );
    }

    const { data, error } = await sb
      .from("gallery_comments")
      .insert({
        post_id: postId,
        username: identity.username,
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
