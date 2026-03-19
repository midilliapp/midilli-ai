"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

type UserProfile = {
  email: string;
  fullName: string;
};

const recentImages = [
  { prompt: "Cyberpunk city at night, neon lights", time: "2 hours ago", gradient: "linear-gradient(135deg,#0a1a2e,#0d4a7a,#38d9f5)" },
  { prompt: "Fantasy dragon in a volcanic landscape", time: "5 hours ago", gradient: "linear-gradient(135deg,#2e0a0a,#7a1a1a,#fc5c5c)" },
  { prompt: "Ethereal forest with glowing mushrooms", time: "1 day ago", gradient: "linear-gradient(135deg,#0d2010,#1a6b2e,#4cebb8)" },
  { prompt: "Abstract cosmic nebula explosion", time: "2 days ago", gradient: "linear-gradient(135deg,#1a0a2e,#3d1173,#7c5cfc)" },
];

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
      <main style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#080810",
        color: "white",
        fontFamily: "'DM Sans', Arial, sans-serif",
        flexDirection: "column",
        gap: 16,
      }}>
        <style jsx global>{`
          @import url("https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;700&display=swap");
          @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
        <div style={{
          width: 44, height: 44,
          borderRadius: 999,
          border: "2px solid transparent",
          borderTopColor: "#7c5cfc",
          borderRightColor: "#e84fbc",
          animation: "spin-slow 0.8s linear infinite",
        }} />
        <div style={{ color: "#8885a8", fontSize: 14 }}>Loading your dashboard...</div>
      </main>
    );
  }

  const initials = profile?.fullName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "M";

  return (
    <main style={{
      minHeight: "100vh",
      color: "#f0eeff",
      background: "#080810",
      fontFamily: "'DM Sans', Arial, sans-serif",
      overflowX: "hidden",
      position: "relative",
    }}>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;700&display=swap");

        @keyframes blob1 {
          0%   { transform: translate(0px,0px) scale(1); }
          33%  { transform: translate(60px,-80px) scale(1.15); }
          66%  { transform: translate(-40px,40px) scale(0.9); }
          100% { transform: translate(0px,0px) scale(1); }
        }
        @keyframes blob2 {
          0%   { transform: translate(0px,0px) scale(1); }
          33%  { transform: translate(-70px,60px) scale(1.1); }
          66%  { transform: translate(50px,-50px) scale(0.95); }
          100% { transform: translate(0px,0px) scale(1); }
        }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fade-in { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes glow-pulse {
          0%,100% { box-shadow: 0 0 20px rgba(124,92,252,0.5), 0 0 40px rgba(232,79,188,0.3); }
          50%      { box-shadow: 0 0 35px rgba(124,92,252,0.8), 0 0 70px rgba(232,79,188,0.5); }
        }

        .dash-animate { animation: fade-in 0.6s ease forwards; }
        .dash-animate-2 { animation: fade-in 0.6s ease 0.1s both; }
        .dash-animate-3 { animation: fade-in 0.6s ease 0.2s both; }

        .stat-card {
          padding: 24px;
          border-radius: 20px;
          background: rgba(15,15,26,0.85);
          border: 1px solid rgba(255,255,255,0.08);
          backdropFilter: blur(12px);
          transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .stat-card:hover {
          transform: translateY(-4px);
          border-color: rgba(124,92,252,0.3);
          box-shadow: 0 16px 48px rgba(0,0,0,0.4);
        }

        .action-card {
          padding: 20px;
          border-radius: 18px;
          background: rgba(15,15,26,0.85);
          border: 1px solid rgba(255,255,255,0.08);
          cursor: pointer;
          transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
          text-decoration: none;
          color: inherit;
          display: block;
        }
        .action-card:hover {
          transform: translateY(-3px);
          border-color: rgba(124,92,252,0.4);
          background: rgba(124,92,252,0.08);
        }

        .recent-item {
          display: flex;
          gap: 14px;
          align-items: center;
          padding: 14px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          transition: opacity 0.2s ease;
        }
        .recent-item:last-child { border-bottom: none; }
        .recent-item:hover { opacity: 0.8; }

        .btn-primary-dash {
          border: none;
          border-radius: 999px;
          padding: 12px 24px;
          color: white;
          font-weight: 700;
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          background: linear-gradient(135deg,#7c5cfc,#e84fbc);
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          animation: glow-pulse 3s ease-in-out infinite;
        }
        .btn-primary-dash:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(124,92,252,0.5);
          animation: none;
        }

        .btn-ghost {
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 999px;
          padding: 10px 20px;
          color: #f0eeff;
          font-size: 14px;
          background: rgba(255,255,255,0.04);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-ghost:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.2);
        }

        .nav-link-dash {
          color: #8885a8;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.2s ease;
        }
        .nav-link-dash:hover { color: white; }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #080810; }
        ::-webkit-scrollbar-thumb { background: rgba(124,92,252,0.4); border-radius: 3px; }
      `}</style>

      {/* Animated blobs */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{
          position: "absolute", borderRadius: "50%", filter: "blur(80px)",
          width: 500, height: 500, top: -100, left: -100,
          background: "radial-gradient(circle, rgba(124,92,252,0.18) 0%, transparent 70%)",
          animation: "blob1 20s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", borderRadius: "50%", filter: "blur(80px)",
          width: 400, height: 400, bottom: 100, right: -100,
          background: "radial-gradient(circle, rgba(56,217,245,0.14) 0%, transparent 70%)",
          animation: "blob2 24s ease-in-out infinite",
        }} />
      </div>

      {/* Header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 20,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 32px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(8,8,16,0.75)",
        backdropFilter: "blur(20px)",
      }}>
        <Link href="/" style={{ textDecoration: "none", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20 }}>
          <span style={{ color: "#a78bff" }}>Midilli</span>{" "}
          <span style={{ color: "#38d9f5" }}>AI</span>
        </Link>
        <nav style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <Link href="/#generate" className="nav-link-dash">Generate</Link>
          <Link href="/#gallery" className="nav-link-dash">Gallery</Link>
          <Link href="/#pricing" className="nav-link-dash">Pricing</Link>
          <button onClick={handleLogout} disabled={loggingOut} className="btn-ghost">
            {loggingOut ? "..." : "Logout"}
          </button>
        </nav>
      </header>

      {/* Content */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>

        {/* Welcome */}
        <div className="dash-animate" style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 999,
                background: "linear-gradient(135deg,#7c5cfc,#e84fbc)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18,
                flexShrink: 0,
              }}>
                {initials}
              </div>
              <div>
                <div style={{ color: "#8885a8", fontSize: 13, marginBottom: 4 }}>Welcome back</div>
                <h1 style={{
                  margin: 0,
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "clamp(22px,3vw,32px)",
                  fontWeight: 800,
                  letterSpacing: -0.5,
                }}>
                  {profile?.fullName}
                </h1>
              </div>
            </div>
            <Link href="/#generate" className="btn-primary-dash">
              ✦ New Generation
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="dash-animate-2" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 32,
        }}>
          {[
            { label: "Credits Balance", value: "20", unit: "credits", color: "#38d9f5", icon: "◈" },
            { label: "Images Created", value: "0", unit: "total", color: "#a78bff", icon: "⬡" },
            { label: "Videos Created", value: "0", unit: "total", color: "#e84fbc", icon: "▶" },
            { label: "Plan", value: "Free", unit: "tier", color: "#4cebb8", icon: "★" },
          ].map(({ label, value, unit, color, icon }) => (
            <div key={label} className="stat-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ color: "#8885a8", fontSize: 13 }}>{label}</div>
                <div style={{ color, fontSize: 18, opacity: 0.8 }}>{icon}</div>
              </div>
              <div style={{
                marginTop: 14,
                fontFamily: "'Syne', sans-serif",
                fontSize: 36,
                fontWeight: 800,
                color,
                textShadow: `0 0 20px ${color}40`,
              }}>
                {value}
              </div>
              <div style={{ color: "#8885a8", fontSize: 12, marginTop: 4 }}>{unit}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions + Recent */}
        <div className="dash-animate-3" style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.6fr",
          gap: 20,
        }}>
          {/* Quick Actions */}
          <div style={{
            padding: 24,
            borderRadius: 24,
            background: "rgba(15,15,26,0.85)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(12px)",
          }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 18 }}>
              Quick Actions
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: "✦", label: "Generate Image", sub: "Text to image", href: "/#generate", color: "#a78bff" },
                { icon: "▶", label: "Create Video", sub: "Image to video", href: "/#generate", color: "#38d9f5" },
                { icon: "◈", label: "Buy Credits", sub: "Top up balance", href: "/#credits", color: "#e84fbc" },
                { icon: "⬡", label: "View Gallery", sub: "Community works", href: "/#gallery", color: "#4cebb8" },
              ].map(({ icon, label, sub, href, color }) => (
                <Link key={label} href={href} className="action-card">
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 12,
                      background: `${color}18`,
                      border: `1px solid ${color}30`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color, fontSize: 16, flexShrink: 0,
                    }}>
                      {icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{label}</div>
                      <div style={{ fontSize: 12, color: "#8885a8", marginTop: 2 }}>{sub}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Generations */}
          <div style={{
            padding: 24,
            borderRadius: 24,
            background: "rgba(15,15,26,0.85)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(12px)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16 }}>
                Recent Generations
              </div>
              <Link href="/#gallery" style={{ color: "#7c5cfc", fontSize: 13, textDecoration: "none" }}>
                View all →
              </Link>
            </div>

            {recentImages.map(({ prompt, time, gradient }) => (
              <div key={prompt} className="recent-item">
                <div style={{
                  width: 48, height: 48,
                  borderRadius: 12,
                  background: gradient,
                  flexShrink: 0,
                  border: "1px solid rgba(255,255,255,0.08)",
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 14, fontWeight: 500,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>
                    {prompt}
                  </div>
                  <div style={{ color: "#8885a8", fontSize: 12, marginTop: 3 }}>{time}</div>
                </div>
                <div style={{
                  padding: "4px 10px",
                  borderRadius: 999,
                  background: "rgba(124,92,252,0.12)",
                  border: "1px solid rgba(124,92,252,0.2)",
                  color: "#a78bff",
                  fontSize: 11,
                  flexShrink: 0,
                }}>
                  Demo
                </div>
              </div>
            ))}

            <div style={{
              marginTop: 16,
              padding: "14px 18px",
              borderRadius: 14,
              background: "rgba(124,92,252,0.06)",
              border: "1px dashed rgba(124,92,252,0.2)",
              textAlign: "center",
            }}>
              <div style={{ color: "#8885a8", fontSize: 13 }}>
                Connect real API to see your actual generations here
              </div>
            </div>
          </div>
        </div>

        {/* Account info */}
        <div style={{
          marginTop: 20,
          padding: "18px 24px",
          borderRadius: 18,
          background: "rgba(15,15,26,0.6)",
          border: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 8, height: 8, borderRadius: 999,
              background: "#4cebb8",
              boxShadow: "0 0 6px #4cebb8",
            }} />
            <span style={{ color: "#8885a8", fontSize: 13 }}>
              Signed in as <strong style={{ color: "#f0eeff" }}>{profile?.email}</strong>
            </span>
          </div>
          <Link href="/#pricing" style={{
            color: "#7c5cfc",
            fontSize: 13,
            textDecoration: "none",
            fontWeight: 600,
          }}>
            Upgrade to Pro →
          </Link>
        </div>

        {message && (
          <p style={{ margin: "16px 0 0", color: "#fca5a5", fontSize: 14 }}>{message}</p>
        )}
      </div>
    </main>
  );
}
