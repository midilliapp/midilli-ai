import { NextResponse } from "next/server";

import {
  assertSupabaseReachable,
  createSupabaseServerClient,
} from "@/utils/supabase/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email ve password zorunlu." },
        { status: 400 }
      );
    }

    await assertSupabaseReachable();
    const supabase = createSupabaseServerClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      message: "Giris basarili.",
      user: data.user?.email ?? null,
      session: !!data.session,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Bilinmeyen sunucu hatasi.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
