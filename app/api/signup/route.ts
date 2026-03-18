import { NextResponse } from "next/server";

import {
  assertSupabaseReachable,
  createSupabaseServerClient,
} from "@/utils/supabase/client";

export async function POST(req: Request) {
  try {
    const { fullName, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email ve password zorunlu." },
        { status: 400 }
      );
    }

    await assertSupabaseReachable();
    const supabase = createSupabaseServerClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || "",
        },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      message: "Kayit basarili. Email dogrulama gerekebilir.",
      user: data.user?.email ?? null,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Sunucu hatasi.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
