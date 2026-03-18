"use client";

import { useEffect } from "react";

import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  useEffect(() => {
    const finalizeAuth = async () => {
      const currentUrl = new URL(window.location.href);
      const nextPath = currentUrl.searchParams.get("next") || "/dashboard";

      await supabase.auth.getSession();
      window.location.replace(nextPath);
    };

    void finalizeAuth();
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at top left, rgba(124,92,252,0.18), transparent 30%), #070b16",
        color: "white",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      Google girisi tamamlanıyor...
    </main>
  );
}
