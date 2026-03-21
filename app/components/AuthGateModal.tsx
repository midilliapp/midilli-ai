"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Props {
  onSuccess: () => void;
  onClose: () => void;
}

export default function AuthGateModal({ onSuccess, onClose }: Props) {
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  // Close on Escape
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const handleGoogle = async () => {
    setError(null);
    setGoogleLoading(true);
    const redirectUrl = `${window.location.origin}/auth/callback?next=/create`;
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirectUrl, queryParams: { access_type: "offline", prompt: "select_account" } },
    });
    if (err) { setError(err.message); setGoogleLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    try {
      if (mode === "signup") {
        const { data, error: err } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/create`,
            data: { full_name: fullName.trim() },
          },
        });
        if (err) { setError(err.message); setLoading(false); return; }
        if (data.session) { onSuccess(); return; }
        setInfo("Check your email to confirm your account, then come back!");
        setLoading(false);
      } else {
        const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) { setError(err.message); setLoading(false); return; }
        if (data.session) { onSuccess(); return; }
        setError("Could not create session. Try again.");
        setLoading(false);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.88)",
        backdropFilter: "blur(16px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20,
      }}
    >
      <style>{`
        @keyframes authGateIn {
          0%   { opacity: 0; transform: translateY(28px) scale(0.96); }
          100% { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes authShake {
          0%,100% { transform: translateX(0); }
          20%,60% { transform: translateX(-6px); }
          40%,80% { transform: translateX(6px); }
        }
        .auth-gate-card { animation: authGateIn 0.4s cubic-bezier(0.22,1,0.36,1) both; }
        .auth-gate-shake { animation: authShake 0.35s ease; }
        .auth-gate-input {
          width: 100%; padding: 11px 14px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px; color: white; font-size: 14px;
          outline: none; font-family: inherit; transition: border-color 0.15s;
        }
        .auth-gate-input:focus { border-color: rgba(168,85,247,0.55); }
        .auth-gate-input::placeholder { color: #4a4a62; }
      `}</style>

      <div className="auth-gate-card" style={{
        width: "100%", maxWidth: 400,
        background: "linear-gradient(160deg, #12121f 0%, #0d0d1a 100%)",
        border: "1px solid rgba(168,85,247,0.25)",
        borderRadius: 24,
        padding: "36px 32px 32px",
        boxShadow: "0 32px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(168,85,247,0.08), inset 0 1px 0 rgba(255,255,255,0.06)",
        position: "relative",
      }}>
        {/* Top glow line */}
        <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: 1, background: "linear-gradient(90deg, transparent, rgba(168,85,247,0.7), transparent)" }} />

        {/* Close */}
        <button
          onClick={onClose}
          style={{ position: "absolute", top: 16, right: 16, width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "#6b7280", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}
        >×</button>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 6 }}>
            <span style={{ background: "linear-gradient(135deg, #c4b8ff, #a78bff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>MIDILLI</span>
          </div>
          <p style={{ fontSize: 15, fontWeight: 600, color: "#e2d9ff", marginBottom: 4 }}>
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </p>
          <p style={{ fontSize: 13, color: "#5a5272" }}>
            {mode === "signup"
              ? "Sign up and get 10 free credits instantly."
              : "Sign in to continue creating."}
          </p>
        </div>

        {/* Google */}
        <button
          onClick={() => void handleGoogle()}
          disabled={googleLoading || loading}
          style={{
            width: "100%", padding: "11px", borderRadius: 11,
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
            color: "#e2d9ff", fontSize: 14, fontWeight: 600, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            transition: "all 0.15s", fontFamily: "inherit", marginBottom: 18,
            opacity: (googleLoading || loading) ? 0.5 : 1,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
        >
          <span style={{ fontSize: 16, fontWeight: 800, color: "#4285F4", fontFamily: "Georgia, serif" }}>G</span>
          {googleLoading ? "Redirecting…" : "Continue with Google"}
        </button>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
          <span style={{ fontSize: 11, color: "#3a3a52", fontWeight: 500 }}>or with email</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
        </div>

        {/* Form */}
        <form onSubmit={(e) => void handleSubmit(e)} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {mode === "signup" && (
            <input
              className="auth-gate-input"
              type="text"
              placeholder="Your name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
            />
          )}
          <input
            className="auth-gate-input"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <input
            className="auth-gate-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            required
            minLength={6}
          />

          {/* Error / info */}
          {error && (
            <div className="auth-gate-shake" style={{ padding: "10px 14px", borderRadius: 9, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5", fontSize: 13, lineHeight: 1.5 }}>
              {error}
            </div>
          )}
          {info && (
            <div style={{ padding: "10px 14px", borderRadius: 9, background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", color: "#86efac", fontSize: 13, lineHeight: 1.5 }}>
              {info}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || googleLoading}
            style={{
              width: "100%", padding: "13px", borderRadius: 11, border: "none",
              background: loading ? "rgba(124,92,252,0.4)" : "linear-gradient(135deg, #7c3aed, #a855f7)",
              color: "white", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit", marginTop: 4,
              boxShadow: loading ? "none" : "0 8px 24px rgba(124,92,252,0.4)",
              transition: "all 0.2s",
            }}
          >
            {loading
              ? (mode === "signup" ? "Creating account…" : "Signing in…")
              : (mode === "signup" ? "Create account — Free" : "Sign in")}
          </button>
        </form>

        {/* Mode switch */}
        <p style={{ textAlign: "center", marginTop: 18, fontSize: 13, color: "#4a4a62" }}>
          {mode === "signup" ? "Already have an account?" : "New here?"}{" "}
          <button
            onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setError(null); setInfo(null); }}
            style={{ background: "none", border: "none", color: "#a78bff", fontSize: 13, cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}
          >
            {mode === "signup" ? "Sign in" : "Create account"}
          </button>
        </p>

        {/* Signup benefit note */}
        {mode === "signup" && (
          <div style={{ marginTop: 14, padding: "10px 14px", borderRadius: 10, background: "rgba(124,92,252,0.08)", border: "1px solid rgba(168,85,247,0.18)", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 18 }}>✦</span>
            <span style={{ fontSize: 12, color: "#8b7aaa", lineHeight: 1.5 }}>
              <strong style={{ color: "#c4b8ff" }}>10 free credits</strong> added to your account on signup. No card needed.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
