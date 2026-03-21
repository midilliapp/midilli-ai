import type { NextRequest } from "next/server";

import { createClient } from "@supabase/supabase-js";

type AuthIdentity = {
  username: string;
};

export function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Supabase not configured");
  }

  return createClient(url, key);
}

export async function getAuthenticatedIdentity(
  req: NextRequest,
): Promise<AuthIdentity | null> {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;

  if (!token) return null;

  const supabase = getSupabaseServer();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) return null;

  const username =
    (user.user_metadata?.full_name as string | undefined)?.trim() ||
    user.email?.trim() ||
    "MIDILLI user";

  return { username };
}
