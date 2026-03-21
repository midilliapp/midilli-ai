import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedIdentity, getSupabaseServer } from "@/lib/gallery-auth";

// POST /api/gallery/[id]/like — toggle like
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
    const username = identity.username;

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
