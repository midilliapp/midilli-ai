"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

type UserProfile = {
  email: string;
  fullName: string;
};

export default function DashboardClient() {
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session?.user) {
        window.location.replace("/login");
        return;
      }

      setProfile({
        email: session.user.email ?? "",
        fullName:
          (session.user.user_metadata?.full_name as string | undefined) ||
          "Midilli user",
      });
      setLoading(false);
    };

    void loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session?.user) {
        window.location.replace("/login");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    setMessage("");

    const { error } = await supabase.auth.signOut();

    if (error) {
      setMessage(error.message || "Cikis yapilamadi.");
      setLoggingOut(false);
      return;
    }

    window.location.replace("/login");
  };

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#020617",
          color: "white",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        Session kontrol ediliyor...
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "32px 24px",
        background:
          "radial-gradient(circle at top left, rgba(217,70,239,0.16), transparent 32%), radial-gradient(circle at top right, rgba(34,211,238,0.14), transparent 30%), #020617",
        color: "white",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <section
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
            padding: "24px",
            borderRadius: "28px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                color: "rgba(255,255,255,0.6)",
                fontSize: "14px",
              }}
            >
              Protected dashboard
            </p>
            <h1 style={{ margin: "10px 0 8px", fontSize: "38px" }}>
              Hos geldin, {profile?.fullName}
            </h1>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.72)" }}>
              Giris yapan kullanici: {profile?.email}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            style={{
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: "999px",
              padding: "12px 20px",
              color: "white",
              background: "rgba(255,255,255,0.06)",
            }}
          >
            {loggingOut ? "Cikis yapiliyor..." : "Logout"}
          </button>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "18px",
          }}
        >
          <div
            style={{
              padding: "22px",
              borderRadius: "24px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <p style={{ margin: 0, color: "rgba(255,255,255,0.6)" }}>
              Auth status
            </p>
            <h2 style={{ margin: "12px 0 0", fontSize: "28px" }}>Active</h2>
          </div>

          <div
            style={{
              padding: "22px",
              borderRadius: "24px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <p style={{ margin: 0, color: "rgba(255,255,255,0.6)" }}>
              Session storage
            </p>
            <h2 style={{ margin: "12px 0 0", fontSize: "28px" }}>
              Synced with Supabase
            </h2>
          </div>

          <div
            style={{
              padding: "22px",
              borderRadius: "24px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <p style={{ margin: 0, color: "rgba(255,255,255,0.6)" }}>
              Route protection
            </p>
            <h2 style={{ margin: "12px 0 0", fontSize: "28px" }}>
              Redirect on sign-out
            </h2>
          </div>
        </section>

        {message && <p style={{ margin: 0, color: "#fca5a5" }}>{message}</p>}
      </div>
    </main>
  );
}
