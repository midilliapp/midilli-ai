"use client";

import Link from "next/link";
import { useState } from "react";

import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(error.message || "Giris basarisiz.");
        setLoading(false);
        return;
      }

      if (!data.session) {
        setMessage("Session olusturulamadi. Lutfen tekrar deneyin.");
        setLoading(false);
        return;
      }

      setMessage("Giris basarili. Ana sayfaya yonlendiriliyorsun.");
      setLoading(false);

      setTimeout(() => {
        window.location.href = "/";
      }, 600);
    } catch (err: unknown) {
      const nextMessage =
        err instanceof Error ? err.message : "Istek atilamadi.";

      setMessage(nextMessage);
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "#020617",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "24px",
          padding: "32px",
          backdropFilter: "blur(14px)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
          color: "white",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <h1 style={{ margin: "0 0 12px", fontSize: "32px" }}>Log in</h1>
        <p style={{ margin: "0 0 24px", color: "rgba(255,255,255,0.7)" }}>
          Sign in to your Midilli App account.
        </p>

        <form onSubmit={handleLogin}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.05)",
                color: "white",
                outline: "none",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.05)",
                color: "white",
                outline: "none",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              border: "none",
              borderRadius: "999px",
              padding: "14px 22px",
              fontWeight: 700,
              color: "white",
              cursor: "pointer",
              background: "linear-gradient(90deg, #d946ef, #8b5cf6, #22d3ee)",
              marginTop: "10px",
            }}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        {message && (
          <p style={{ marginTop: "16px", color: "#fff", lineHeight: 1.5 }}>
            {message}
          </p>
        )}

        <div
          style={{
            marginTop: "18px",
            textAlign: "center",
            color: "rgba(255,255,255,0.6)",
            fontSize: "14px",
          }}
        >
          Don&apos;t have an account?{" "}
          <Link href="/signup" style={{ color: "white", fontWeight: 600 }}>
            Create one
          </Link>
        </div>
      </div>
    </main>
  );
}
