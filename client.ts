import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type SupabaseEnv = {
  url: string;
  key: string;
};

function getSupabaseEnv(): SupabaseEnv {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL in .env.local.");
  }

  if (!key) {
    throw new Error(
      "Missing Supabase publishable key. Set NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local."
    );
  }

  try {
    new URL(url);
  } catch {
    throw new Error(`NEXT_PUBLIC_SUPABASE_URL is not a valid URL: ${url}`);
  }

  return { url, key };
}

export function createSupabaseServerClient(): SupabaseClient {
  const { url, key } = getSupabaseEnv();

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

export async function assertSupabaseReachable(): Promise<void> {
  const { url, key } = getSupabaseEnv();

  try {
    const response = await fetch(`${url}/auth/v1/settings`, {
      method: "GET",
      headers: {
        apikey: key,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `Supabase settings check failed with status ${response.status}.`
      );
    }
  } catch (error) {
    const host = new URL(url).host;
    const reason =
      error instanceof Error ? error.message : "Unknown network error.";

    throw new Error(
      `Supabase endpoint is unreachable for host ${host}. Check NEXT_PUBLIC_SUPABASE_URL and confirm the project is active. Original error: ${reason}`
    );
  }
}
