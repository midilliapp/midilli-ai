"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

const galleryItems = [
  ["Moonlight concept", "@cosmic_art", "linear-gradient(135deg,#1a0a2e,#3d1173,#7c5cfc)"],
  ["Neon skyline", "@neon_dreams", "linear-gradient(135deg,#0a1a2e,#0d4a7a,#38d9f5)"],
  ["Bio forest", "@nature_ai", "linear-gradient(135deg,#0d2010,#1a6b2e,#4cebb8)"],
  ["Dragon forge", "@fantasy_world", "linear-gradient(135deg,#2e0a0a,#7a1a1a,#fc5c5c)"],
] as const;

type CreditPack = {
  credits: number;
  price: number;
  label: string;
};

const packs: CreditPack[] = [
  { credits: 100, price: 5, label: "Starter" },
  { credits: 300, price: 12, label: "Popular" },
  { credits: 700, price: 22, label: "Value" },
  { credits: 2000, price: 50, label: "Power Pack" },
];

export default function HomePageClient() {
  const [tab, setTab] = useState<"image" | "video">("image");
  const [prompt, setPrompt] = useState("");
  const [motionPrompt, setMotionPrompt] = useState("");
  const [credits, setCredits] = useState(20);
  const [toast, setToast] = useState("");
  const [selectedPack, setSelectedPack] = useState(packs[0]);
  const [uploadedFile, setUploadedFile] = useState("");
  const [imageResult, setImageResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [demoIndex, setDemoIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [showDemoOutput, setShowDemoOutput] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const loadSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        setUserName("");
        return;
      }

      const nextName =
        (session.user.user_metadata?.full_name as string | undefined) ||
        session.user.email ||
        "";

      setUserName(nextName.toLocaleUpperCase("tr-TR"));
    };

    void loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextName =
        (session?.user?.user_metadata?.full_name as string | undefined) ||
        session?.user?.email ||
        "";

      setUserName(nextName.toLocaleUpperCase("tr-TR"));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const demoExamples = [
    { prompt: "A neon-lit cyberpunk city at midnight", src: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=700&q=80&auto=format&fit=crop" },
    { prompt: "Deep space nebula, purple and violet", src: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=700&q=80&auto=format&fit=crop" },
    { prompt: "Abstract colorful light explosion", src: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=700&q=80&auto=format&fit=crop" },
  ];

  useEffect(() => {
    let charIndex = 0;
    let currentPrompt = demoExamples[demoIndex].prompt;
    setTypedText("");
    setShowDemoOutput(false);

    const typeInterval = window.setInterval(() => {
      charIndex++;
      setTypedText(currentPrompt.slice(0, charIndex));
      if (charIndex >= currentPrompt.length) {
        window.clearInterval(typeInterval);
        window.setTimeout(() => {
          setShowDemoOutput(true);
          window.setTimeout(() => {
            setDemoIndex((i) => (i + 1) % demoExamples.length);
          }, 3000);
        }, 400);
      }
    }, 45);

    return () => window.clearInterval(typeInterval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demoIndex]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2500);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      showToast("Cikis yaparken bir hata olustu.");
      return;
    }

    setUserName("");
    showToast("Cikis yapildi.");
  };

  const generateImage = () => {
    if (!prompt.trim()) {
      showToast("Prompt girmen gerekiyor.");
      return;
    }

    if (credits < 1) {
      showToast("Kredi bitti. Asagidan paket secebilirsin.");
      return;
    }

    setCredits((current) => current - 1);
    setLoading(true);

    window.setTimeout(() => {
      setImageResult(prompt);
      setLoading(false);
      showToast("Demo gorsel hazirlandi. Istersen gercek API baglayabiliriz.");
    }, 1100);
  };

  const generateVideo = () => {
    if (!uploadedFile) {
      showToast("Once bir gorsel yuklemelisin.");
      return;
    }

    if (credits < 10) {
      showToast("Video icin 10 kredi gerekiyor.");
      return;
    }

    setCredits((current) => current - 10);
    showToast("Video demo akisi hazir. Siradaki adim backend entegrasyonu olabilir.");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        color: "#f0eeff",
        background: "#080810",
        fontFamily: "'DM Sans', Arial, sans-serif",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;700&display=swap");

        /* ── Animated background blobs ── */
        @keyframes blob1 {
          0%   { transform: translate(0px, 0px) scale(1); }
          33%  { transform: translate(60px, -80px) scale(1.15); }
          66%  { transform: translate(-40px, 40px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes blob2 {
          0%   { transform: translate(0px, 0px) scale(1); }
          33%  { transform: translate(-70px, 60px) scale(1.1); }
          66%  { transform: translate(50px, -50px) scale(0.95); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes blob3 {
          0%   { transform: translate(0px, 0px) scale(1); }
          33%  { transform: translate(40px, 70px) scale(1.2); }
          66%  { transform: translate(-60px, -30px) scale(0.85); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes blob4 {
          0%   { transform: translate(0px, 0px) scale(1); }
          50%  { transform: translate(-50px, -60px) scale(1.1); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes gridFloat {
          0%   { opacity: 0.03; }
          50%  { opacity: 0.06; }
          100% { opacity: 0.03; }
        }
        @keyframes pulse-badge {
          0%, 100% { box-shadow: 0 0 0 0 rgba(124,92,252,0.4); }
          50%       { box-shadow: 0 0 0 8px rgba(124,92,252,0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes float-up {
          0%   { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(124,92,252,0.5), 0 0 40px rgba(232,79,188,0.3); }
          50%       { box-shadow: 0 0 35px rgba(124,92,252,0.8), 0 0 70px rgba(232,79,188,0.5); }
        }

        /* ── Blob elements ── */
        .bg-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
        }
        .bg-blob-1 {
          width: 600px; height: 600px;
          top: -100px; left: -150px;
          background: radial-gradient(circle, rgba(124,92,252,0.22) 0%, transparent 70%);
          animation: blob1 18s ease-in-out infinite;
        }
        .bg-blob-2 {
          width: 500px; height: 500px;
          top: 100px; right: -100px;
          background: radial-gradient(circle, rgba(56,217,245,0.18) 0%, transparent 70%);
          animation: blob2 22s ease-in-out infinite;
        }
        .bg-blob-3 {
          width: 400px; height: 400px;
          top: 50vh; left: 30%;
          background: radial-gradient(circle, rgba(232,79,188,0.15) 0%, transparent 70%);
          animation: blob3 16s ease-in-out infinite;
        }
        .bg-blob-4 {
          width: 700px; height: 700px;
          bottom: 0; right: -200px;
          background: radial-gradient(circle, rgba(124,92,252,0.12) 0%, transparent 70%);
          animation: blob4 25s ease-in-out infinite;
        }

        /* ── Grid overlay ── */
        .bg-grid {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
          animation: gridFloat 8s ease-in-out infinite;
        }

        /* ── Buttons ── */
        .btn-primary {
          border: none;
          border-radius: 999px;
          padding: 16px 32px;
          color: white;
          font-weight: 700;
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          background: linear-gradient(135deg, #7c5cfc, #e84fbc);
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          animation: glow-pulse 3s ease-in-out infinite;
        }
        .btn-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .btn-primary:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 8px 30px rgba(124,92,252,0.6), 0 4px 15px rgba(232,79,188,0.4);
          animation: none;
        }
        .btn-primary:hover::before { opacity: 1; }
        .btn-primary:active { transform: translateY(0) scale(0.98); }

        .btn-secondary {
          display: inline-block;
          border-radius: 999px;
          padding: 16px 32px;
          color: #f0eeff;
          font-size: 15px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.15);
          cursor: pointer;
          transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
          backdrop-filter: blur(8px);
        }
        .btn-secondary:hover {
          transform: translateY(-2px);
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.3);
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }

        .btn-tab {
          border-radius: 999px;
          padding: 12px 20px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s ease;
        }
        .btn-tab:hover { opacity: 0.85; }

        /* ── Cards ── */
        .card-hover {
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .card-hover:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 60px rgba(0,0,0,0.4);
          border-color: rgba(124,92,252,0.3) !important;
        }

        /* ── Nav links ── */
        .nav-link {
          color: #c4b8ff;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.2s ease;
          position: relative;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(135deg,#7c5cfc,#e84fbc);
          transform: scaleX(0);
          transition: transform 0.2s ease;
        }
        .nav-link:hover { color: white; }
        .nav-link:hover::after { transform: scaleX(1); }

        /* ── Hero ── */
        .hero-animate { animation: float-up 0.8s ease forwards; }
        .hero-animate-delay { animation: float-up 0.8s ease 0.15s both; }
        .hero-animate-delay2 { animation: float-up 0.8s ease 0.3s both; }

        /* ── Badge ── */
        .badge-pulse { animation: pulse-badge 2.5s ease-in-out infinite; }

        /* ── Shimmer text ── */
        .shimmer-text {
          background: linear-gradient(
            90deg,
            #a78bff 0%, #e84fbc 30%, #38d9f5 50%, #e84fbc 70%, #a78bff 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }

        /* ── Pricing featured ring ── */
        .featured-ring {
          box-shadow: 0 0 0 1px rgba(124,92,252,0.5), 0 20px 60px rgba(124,92,252,0.2);
        }

        /* ── Scrollbar ── */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #080810; }
        ::-webkit-scrollbar-thumb { background: rgba(124,92,252,0.4); border-radius: 3px; }

        /* ── Input focus ── */
        textarea:focus, input:focus {
          outline: none;
          border-color: rgba(124,92,252,0.5) !important;
          box-shadow: 0 0 0 3px rgba(124,92,252,0.15);
        }
      `}</style>

      {/* ── Animated background ── */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div className="bg-blob bg-blob-1" />
        <div className="bg-blob bg-blob-2" />
        <div className="bg-blob bg-blob-3" />
        <div className="bg-blob bg-blob-4" />
      </div>
      <div className="bg-grid" />

      {/* ── Header ── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 32px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(8,8,16,0.75)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, letterSpacing: -0.5 }}>
          <span style={{ color: "#a78bff" }}>MIDILLI</span>
        </div>
        <nav style={{ display: "flex", gap: 28, alignItems: "center", flexWrap: "wrap" }}>
          <a href="#generate" className="nav-link">Generate</a>
          <Link href="/gallery" className="nav-link">Gallery</Link>
          <a href="#pricing" className="nav-link">Pricing</a>
          {userName ? (
            <>
              <Link
                href="/dashboard"
                style={{
                  padding: "9px 18px",
                  borderRadius: 999,
                  color: "#f0eeff",
                  border: "1px solid rgba(124,92,252,0.3)",
                  background: "rgba(124,92,252,0.12)",
                  fontSize: 14,
                  transition: "all 0.2s ease",
                }}
              >
                {userName}
              </Link>
              <button onClick={handleLogout} className="btn-secondary" style={{ padding: "9px 18px", fontSize: 14 }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="nav-link">Login</Link>
              <Link
                href="/signup"
                className="btn-primary"
                style={{ padding: "10px 22px", fontSize: 14 }}
              >
                Get Started
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* ── Hero ── */}
      <section style={{ padding: "90px 24px 70px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>

          {/* Left: Copy */}
          <div>
            <div
              className="badge-pulse hero-animate"
              style={{ display: "inline-flex", gap: 10, padding: "8px 18px", borderRadius: 999, fontSize: 13, marginBottom: 28, color: "#c4b8ff", border: "1px solid rgba(124,92,252,0.35)", background: "rgba(124,92,252,0.1)" }}
            >
              <span style={{ width: 8, height: 8, borderRadius: 999, background: "#38d9f5", marginTop: 4, boxShadow: "0 0 8px #38d9f5", flexShrink: 0 }} />
              No prompts. No tutorials. Just results.
            </div>

            <h1
              className="hero-animate-delay"
              style={{ margin: 0, fontFamily: "'Syne', sans-serif", fontSize: "clamp(44px, 5.5vw, 80px)", lineHeight: 0.96, letterSpacing: -3 }}
            >
              Type it.
              <br />
              <span className="shimmer-text">See it. Done.</span>
            </h1>

            <p className="hero-animate-delay2" style={{ maxWidth: 480, margin: "24px 0 0", color: "#8885a8", lineHeight: 1.85, fontSize: 17 }}>
              MIDILLI turns any idea into a ready-to-use image or video in seconds.
              No skills. No learning curve. No waiting.
            </p>

            <div className="hero-animate-delay2" style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 36 }}>
              <a href="#generate" className="btn-primary" style={{ fontSize: 15, padding: "16px 30px" }}>
                Generate Now — Free, No Card
              </a>
              <Link href="/gallery" className="btn-secondary" style={{ fontSize: 15, padding: "16px 28px" }}>
                See Real Results
              </Link>
            </div>

            <div className="hero-animate-delay2" style={{ marginTop: 16, color: "#8885a8", fontSize: 13 }}>
              20 free credits on signup. No credit card required.
            </div>

            <div style={{ display: "flex", gap: 36, marginTop: 44, flexWrap: "wrap" }}>
              {[
                { value: "10s", label: "Avg. generation" },
                { value: "50K+", label: "Images created" },
                { value: "4.9★", label: "Rating" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 24, fontWeight: 800, background: "linear-gradient(135deg,#a78bff,#38d9f5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{value}</div>
                  <div style={{ color: "#8885a8", fontSize: 12, marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Live Demo Output */}
          <div className="hero-animate-delay" style={{ position: "relative" }}>
            {/* Glow behind card */}
            <div style={{ position: "absolute", inset: -40, background: "radial-gradient(ellipse, rgba(124,92,252,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />

            <div style={{ borderRadius: 24, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(15,15,26,0.9)", backdropFilter: "blur(16px)", boxShadow: "0 32px 80px rgba(0,0,0,0.5)" }}>
              {/* Mock toolbar */}
              <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ display: "flex", gap: 6 }}>
                  {["#fc5c5c","#fbbf24","#4cebb8"].map((c) => (
                    <div key={c} style={{ width: 10, height: 10, borderRadius: 999, background: c, opacity: 0.7 }} />
                  ))}
                </div>
                <div style={{ flex: 1, textAlign: "center", fontSize: 12, color: "#8885a8" }}>midilli.app</div>
              </div>

              {/* Mock prompt input */}
              <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(22,22,42,0.6)" }}>
                <div style={{ fontSize: 12, color: "#8885a8", marginBottom: 8 }}>Prompt</div>
                <div style={{ fontSize: 14, color: "#e0dcff", minHeight: 22, display: "flex", alignItems: "center" }}>
                  {typedText}
                  <span style={{ display: "inline-block", width: 2, height: 16, background: "#7c5cfc", marginLeft: 2, animation: "glow-pulse 0.8s ease-in-out infinite" }} />
                </div>
              </div>

              {/* Output image */}
              <div style={{ position: "relative", height: 320, background: "#0a0a14", overflow: "hidden" }}>
                {demoExamples.map((ex, i) => (
                  <img
                    key={ex.src}
                    src={ex.src}
                    alt={ex.prompt}
                    style={{
                      position: "absolute", inset: 0, width: "100%", height: "100%",
                      objectFit: "cover", display: "block",
                      opacity: i === demoIndex && showDemoOutput ? 1 : 0,
                      transition: "opacity 0.6s ease",
                    }}
                  />
                ))}
                {!showDemoOutput && (
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 999, border: "2px solid transparent", borderTopColor: "#7c5cfc", borderRightColor: "#e84fbc", animation: "spin-slow 0.8s linear infinite" }} />
                    <div style={{ color: "#8885a8", fontSize: 13 }}>Generating...</div>
                  </div>
                )}
                {showDemoOutput && (
                  <div style={{ position: "absolute", bottom: 12, left: 12, padding: "5px 12px", borderRadius: 999, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", fontSize: 11, color: "#4cebb8", border: "1px solid rgba(76,235,184,0.3)", display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 6, height: 6, borderRadius: 999, background: "#4cebb8", boxShadow: "0 0 6px #4cebb8" }} />
                    Generated in 8.4s
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: stack to single column */}
        <style>{`@media (max-width: 768px) { .hero-grid { grid-template-columns: 1fr !important; } }`}</style>
      </section>

      {/* ── Generate ── */}
      <section id="generate" style={{ padding: "20px 24px 0", position: "relative", zIndex: 1 }}>
        <div
          style={{
            maxWidth: 980,
            margin: "0 auto",
            borderRadius: 28,
            padding: 28,
            background: "rgba(15,15,26,0.85)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 40px 100px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div style={{ display: "flex", gap: 10, marginBottom: 22, flexWrap: "wrap" }}>
            <button
              onClick={() => setTab("image")}
              className="btn-tab"
              style={{
                border: tab === "image" ? "1px solid rgba(124,92,252,0.5)" : "1px solid transparent",
                color: tab === "image" ? "white" : "#8885a8",
                background: tab === "image" ? "rgba(124,92,252,0.2)" : "rgba(255,255,255,0.04)",
              }}
            >
              Text to Image
            </button>
            <button
              onClick={() => setTab("video")}
              className="btn-tab"
              style={{
                border: tab === "video" ? "1px solid rgba(56,217,245,0.5)" : "1px solid transparent",
                color: tab === "video" ? "white" : "#8885a8",
                background: tab === "video" ? "rgba(56,217,245,0.15)" : "rgba(255,255,255,0.04)",
              }}
            >
              Image to Video
            </button>
          </div>

          {tab === "image" ? (
            <>
              <textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="Describe the image you want to generate..."
                style={inputStyle({ minHeight: 120, resize: "vertical" })}
              />

              <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginTop: 20, alignItems: "center" }}>
                <div style={{ color: "#8885a8", fontSize: 14 }}>
                  Balance:{" "}
                  <strong style={{
                    color: "#38d9f5",
                    textShadow: "0 0 10px rgba(56,217,245,0.5)",
                  }}>
                    {credits}
                  </strong>{" "}
                  credits
                </div>
                <button onClick={generateImage} className="btn-primary" style={{ padding: "13px 28px" }}>
                  {loading ? "Generating..." : "Generate Image"}
                </button>
              </div>

              {(loading || imageResult) && (
                <div
                  style={{
                    marginTop: 28,
                    minHeight: 280,
                    borderRadius: 22,
                    border: "1px solid rgba(124,92,252,0.2)",
                    background: "linear-gradient(135deg,rgba(22,22,42,0.9),rgba(17,17,29,0.9))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: 14,
                    padding: "24px",
                    textAlign: "center",
                  }}
                >
                  {loading ? (
                    <>
                      <div style={{
                        width: 48, height: 48,
                        borderRadius: 999,
                        border: "2px solid transparent",
                        borderTopColor: "#7c5cfc",
                        borderRightColor: "#e84fbc",
                        animation: "spin-slow 0.8s linear infinite",
                      }} />
                      <div style={{ color: "#8885a8" }}>Generating your image...</div>
                    </>
                  ) : (
                    <>
                      <div style={{
                        fontSize: 24, fontWeight: 700,
                        background: "linear-gradient(135deg,#a78bff,#38d9f5)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}>Preview Ready</div>
                      <div style={{ color: "#8885a8", maxWidth: 520 }}>{imageResult}</div>
                    </>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              <label
                style={{
                  ...inputStyle({ minHeight: 160, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }),
                  transition: "border-color 0.2s ease, background 0.2s ease",
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(event) => setUploadedFile(event.target.files?.[0]?.name || "")}
                />
                {uploadedFile ? `Selected: ${uploadedFile}` : (
                  <div style={{ textAlign: "center", color: "#8885a8" }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>↑</div>
                    <div>Upload source image</div>
                    <div style={{ fontSize: 12, marginTop: 4, opacity: 0.6 }}>PNG, JPG, WEBP</div>
                  </div>
                )}
              </label>
              <textarea
                value={motionPrompt}
                onChange={(event) => setMotionPrompt(event.target.value)}
                placeholder="Camera slowly zooms in, cinematic motion..."
                style={{ ...inputStyle({ minHeight: 100, resize: "vertical" }), marginTop: 16 }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginTop: 20, alignItems: "center" }}>
                <div style={{ color: "#8885a8", fontSize: 14 }}>
                  Balance:{" "}
                  <strong style={{ color: "#38d9f5", textShadow: "0 0 10px rgba(56,217,245,0.5)" }}>
                    {credits}
                  </strong>{" "}
                  credits
                </div>
                <button onClick={generateVideo} className="btn-primary" style={{ padding: "13px 28px" }}>
                  Generate Video
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── Visual Proof ── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "110px 24px 0", position: "relative", zIndex: 1 }}>
        <SectionHead
          label="Results"
          title="Your idea → a visual"
          sub="Plain language in. Professional image out. Every time."
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16, marginTop: 48 }}>
          {[
            { prompt: "A neon-lit cyberpunk city at midnight", src: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&q=80&auto=format&fit=crop" },
            { prompt: "Deep space galaxy with glowing nebula", src: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=600&q=80&auto=format&fit=crop" },
            { prompt: "Abstract colorful light burst, neon explosion", src: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&q=80&auto=format&fit=crop" },
          ].map(({ prompt, src }) => (
            <div key={prompt} className="card-hover" style={{ borderRadius: 20, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", background: "#0f0f1a" }}>
              <div style={{ position: "relative" }}>
                <img src={src} alt={prompt} style={{ width: "100%", height: 240, objectFit: "cover", display: "block" }}
                  onError={(e) => { (e.target as HTMLImageElement).style.background = "linear-gradient(135deg,#1a0a2e,#7c5cfc)"; }} />
                <div style={{ position: "absolute", top: 12, left: 12, padding: "5px 12px", borderRadius: 999, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", fontSize: 11, color: "#c4b8ff", border: "1px solid rgba(255,255,255,0.1)" }}>
                  AI Generated
                </div>
              </div>
              <div style={{ padding: "14px 16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ color: "#8885a8", fontSize: 12, marginBottom: 4 }}>Prompt</div>
                <div style={{ fontSize: 14, fontStyle: "italic", color: "#c4b8ff" }}>"{prompt}"</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <Link href="/gallery" className="btn-secondary" style={{ display: "inline-block" }}>
            See all community works →
          </Link>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "110px 24px 0", position: "relative", zIndex: 1 }}>
        <SectionHead
          label="How It Works"
          title="Three steps. That's it."
          sub="You don't need to learn anything. If you can describe it, you can create it."
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20, marginTop: 52 }}>
          {[
            { step: "01", icon: "✎", title: "Write your idea", desc: "Type anything. "A dragon in a neon city" is enough. Plain language works perfectly." },
            { step: "02", icon: "⚡", title: "Hit generate", desc: "MIDILLI processes in under 10 seconds. No queue. No waiting room. Just instant output." },
            { step: "03", icon: "↓", title: "Download & use", desc: "PNG, JPG, or video. Ready to post, share, or sell. No watermark on paid plans." },
          ].map(({ step, icon, title, desc }) => (
            <div key={step} style={{ padding: 28, borderRadius: 22, background: "rgba(15,15,26,0.85)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(12px)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 20, right: 20, fontFamily: "'Syne',sans-serif", fontSize: 52, fontWeight: 800, color: "rgba(124,92,252,0.08)", lineHeight: 1 }}>{step}</div>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(124,92,252,0.15)", border: "1px solid rgba(124,92,252,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 18, color: "#a78bff" }}>{icon}</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 10 }}>{title}</div>
              <div style={{ color: "#8885a8", lineHeight: 1.75, fontSize: 14 }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Differentiation ── */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "110px 24px 0", position: "relative", zIndex: 1 }}>
        <SectionHead
          label="Why MIDILLI"
          title="Every alternative has a tax. MIDILLI doesn't."
          sub="Other tools make you pay with time, money, or a learning curve. We cut all three."
        />

        {/* Comparison table */}
        <div style={{ marginTop: 52, borderRadius: 24, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
          {/* Header */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", background: "rgba(15,15,26,0.95)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ padding: "16px 20px", color: "#8885a8", fontSize: 13, fontWeight: 600 }}></div>
            {["Hire a designer", "Midjourney", "MIDILLI"].map((h, i) => (
              <div key={h} style={{ padding: "16px 20px", textAlign: "center", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, color: i === 2 ? "#a78bff" : "#8885a8", borderLeft: "1px solid rgba(255,255,255,0.06)", background: i === 2 ? "rgba(124,92,252,0.06)" : "transparent" }}>{h}</div>
            ))}
          </div>
          {/* Rows */}
          {[
            { label: "Time to first result", vals: ["2–5 days", "~10 min setup", "10 seconds"] },
            { label: "Cost to start", vals: ["$200–$500", "$30/month", "Free"] },
            { label: "Skills needed", vals: ["Write a brief", "Learn prompts + Discord", "Plain English"] },
            { label: "Revisions", vals: ["Extra cost", "New credit each time", "Instant, free"] },
            { label: "Works in browser", vals: ["Email back-and-forth", "Requires Discord app", "Yes, instantly"] },
          ].map(({ label, vals }, rowI) => (
            <div key={label} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", borderBottom: rowI < 4 ? "1px solid rgba(255,255,255,0.05)" : "none", background: rowI % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent" }}>
              <div style={{ padding: "16px 20px", fontSize: 14, color: "#c4b8ff", fontWeight: 500 }}>{label}</div>
              {vals.map((v, i) => (
                <div key={v} style={{ padding: "16px 20px", textAlign: "center", fontSize: 13, borderLeft: "1px solid rgba(255,255,255,0.05)", background: i === 2 ? "rgba(124,92,252,0.04)" : "transparent", color: i === 2 ? "#4cebb8" : "#8885a8", fontWeight: i === 2 ? 600 : 400 }}>
                  {i === 2 ? "✓ " : "✗ "}{v}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 28 }}>
          <a href="#generate" className="btn-primary" style={{ fontSize: 15, padding: "15px 32px" }}>
            Try MIDILLI Free — No Card
          </a>
        </div>
      </section>

      {/* ── Use Cases ── */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "110px 24px 0", position: "relative", zIndex: 1 }}>
        <SectionHead
          label="Use Cases"
          title="Whatever you need, in seconds"
          sub="Creators, builders, marketers — everyone gets the same result: done fast."
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 14, marginTop: 48 }}>
          {[
            { label: "YouTube thumbnail", time: "8 sec", color: "#e84fbc", icon: "▶" },
            { label: "Product visuals for your store", time: "8 sec", color: "#38d9f5", icon: "◈" },
            { label: "7 days of social content", time: "3 min", color: "#a78bff", icon: "⬡" },
            { label: "Pitch deck concept image", time: "8 sec", color: "#4cebb8", icon: "✦" },
            { label: "App store screenshots", time: "30 sec", color: "#fbbf24", icon: "⊞" },
            { label: "Blog post cover image", time: "8 sec", color: "#fc5c5c", icon: "✎" },
          ].map(({ label, time, color, icon }) => (
            <div key={label} className="card-hover" style={{ padding: "20px 22px", borderRadius: 18, background: "rgba(15,15,26,0.85)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}18`, border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center", color, fontSize: 14, flexShrink: 0 }}>{icon}</div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{label}</div>
              </div>
              <div style={{ padding: "4px 10px", borderRadius: 999, background: `${color}18`, border: `1px solid ${color}30`, color, fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{time}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Objections ── */}
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "110px 24px 0", position: "relative", zIndex: 1 }}>
        <SectionHead
          label="Real Talk"
          title="The questions you're actually thinking"
          sub="No fluff. Straight answers."
        />
        <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { q: "Is this actually free?", a: "Yes. 20 credits, no card, no catch. You can generate 20 images before we ever ask for a dollar. Most users create something they love within the first 5." },
            { q: "Will the quality be good enough?", a: "The same models used by professional studios. You'll get outputs that look like they were made by a senior designer — first try, every time." },
            { q: "Do I need to know how to write prompts?", a: "No. If you can send a text message, you can use MIDILLI. \"A cozy coffee shop in autumn\" works perfectly. No technical terms needed." },
            { q: "What if I don't like the result?", a: "Hit generate again. It costs one credit, takes 10 seconds, and gives you a completely different result. Most people find something they love within 2–3 tries." },
            { q: "Do I own what I create?", a: "Yes. Everything you generate is yours. Commercial rights are included on paid plans. Free plan output is yours for personal use." },
            { q: "How is this different from Canva or Figma?", a: "Canva and Figma are editors — you still need to design. MIDILLI generates the visual from scratch. You start with a finished result, not a blank canvas." },
          ].map(({ q, a }, i) => (
            <div key={q} style={{ borderRadius: 16, border: `1px solid ${openFaq === i ? "rgba(124,92,252,0.35)" : "rgba(255,255,255,0.07)"}`, background: openFaq === i ? "rgba(124,92,252,0.06)" : "rgba(15,15,26,0.7)", overflow: "hidden", transition: "border-color 0.2s ease, background 0.2s ease" }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 22px", background: "none", border: "none", color: "#f0eeff", cursor: "pointer", textAlign: "left", gap: 16 }}
              >
                <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 15 }}>{q}</span>
                <span style={{ color: "#7c5cfc", fontSize: 18, flexShrink: 0, transition: "transform 0.2s ease", transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)" }}>+</span>
              </button>
              {openFaq === i && (
                <div style={{ padding: "0 22px 18px", color: "#8885a8", fontSize: 14, lineHeight: 1.8 }}>{a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Mid CTA ── */}
      <section style={{ maxWidth: 700, margin: "0 auto", padding: "110px 24px 0", position: "relative", zIndex: 1, textAlign: "center" }}>
        <div style={{ padding: "52px 48px", borderRadius: 28, background: "rgba(124,92,252,0.07)", border: "1px solid rgba(124,92,252,0.2)", backdropFilter: "blur(12px)" }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(24px,3.5vw,38px)", fontWeight: 800, letterSpacing: -1, marginBottom: 16 }}>
            Stop explaining your vision.<br />
            <span style={{ background: "linear-gradient(135deg,#a78bff,#e84fbc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Show it.</span>
          </div>
          <div style={{ color: "#8885a8", marginBottom: 32, fontSize: 15, lineHeight: 1.7 }}>
            Your next visual is 10 seconds away. No skills needed.
          </div>
          <a href="#generate" className="btn-primary" style={{ fontSize: 16, padding: "18px 40px" }}>
            Try It Free — No Card, No Wait
          </a>
        </div>
      </section>

      {/* ── Gallery ── */}
      <section id="gallery" style={{ maxWidth: 1100, margin: "0 auto", padding: "110px 24px 0", position: "relative", zIndex: 1 }}>
        <SectionHead label="Community" title="Made with MIDILLI" sub="Real outputs from real creators. Every image below was generated in under 10 seconds." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16, marginTop: 42 }}>
          {galleryItems.map(([label, user, background]) => (
            <div
              key={label}
              className="card-hover"
              style={{ borderRadius: 20, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div style={{
                minHeight: 260, display: "flex", alignItems: "center", justifyContent: "center",
                flexDirection: "column", gap: 10, background, position: "relative",
              }}>
                <div style={{ fontSize: 12, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.55)" }}>
                  Showcase
                </div>
                <div style={{ fontSize: 22, fontWeight: 700 }}>{label}</div>
              </div>
              <div style={{ padding: "14px 16px", background: "rgba(15,15,26,0.95)" }}>
                <div style={{ color: "#8885a8", fontSize: 13 }}>{user}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" style={{ maxWidth: 1100, margin: "0 auto", padding: "110px 24px 0", position: "relative", zIndex: 1 }}>
        <SectionHead label="Pricing" title="Free to start. Always." sub="20 credits on us. No credit card. No commitment. Pay only when you're ready to scale." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 18, marginTop: 42 }}>
          <PricingCard
            title="Free"
            price="$0"
            credits="20 / mo"
            features={["Basic models", "Public gallery", "Starter workflow"]}
            cta={<Link href="/signup" className="btn-secondary" style={{ display: "block", textAlign: "center" }}>Start Free — No Card</Link>}
          />
          <PricingCard
            title="Pro"
            price="$19"
            credits="500 / mo"
            featured
            features={["Private gallery", "Priority queue", "Commercial usage"]}
            cta={
              <button
                className="btn-primary"
                style={{ width: "100%", padding: "13px 24px" }}
                onClick={() => showToast("Pro checkout sonraki adimda baglanabilir.")}
              >
                Go Pro
              </button>
            }
          />
          <PricingCard
            title="Ultra"
            price="$49"
            credits="2000 / mo"
            features={["4K exports", "API-ready", "Instant queue"]}
            cta={
              <button
                className="btn-secondary"
                style={{ width: "100%", padding: "13px 24px" }}
                onClick={() => showToast("Ultra plan akisi hazir.")}
              >
                Go Ultra
              </button>
            }
          />
        </div>
      </section>

      {/* ── Credits ── */}
      <section id="credits" style={{ maxWidth: 980, margin: "0 auto", padding: "110px 24px 90px", position: "relative", zIndex: 1 }}>
        <SectionHead label="Credit Store" title="Buy Credits" sub="One-time packs for instant access. No subscription needed." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14, marginTop: 42 }}>
          {packs.map((pack) => (
            <button
              key={pack.credits}
              onClick={() => setSelectedPack(pack)}
              className="card-hover"
              style={{
                padding: 22,
                borderRadius: 20,
                border: selectedPack.credits === pack.credits
                  ? "1px solid rgba(124,92,252,0.6)"
                  : "1px solid rgba(255,255,255,0.08)",
                background: selectedPack.credits === pack.credits
                  ? "rgba(124,92,252,0.14)"
                  : "rgba(15,15,26,0.85)",
                color: "#f0eeff",
                cursor: "pointer",
                textAlign: "left",
                backdropFilter: "blur(8px)",
              }}
            >
              <div style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 34,
                fontWeight: 800,
                background: selectedPack.credits === pack.credits
                  ? "linear-gradient(135deg,#a78bff,#38d9f5)"
                  : "none",
                WebkitBackgroundClip: selectedPack.credits === pack.credits ? "text" : "unset",
                WebkitTextFillColor: selectedPack.credits === pack.credits ? "transparent" : "inherit",
              }}>
                {pack.credits}
              </div>
              <div style={{ color: "#8885a8", marginTop: 6, fontSize: 13 }}>{pack.label}</div>
              <div style={{ marginTop: 12, fontWeight: 700, fontSize: 18 }}>${pack.price}</div>
            </button>
          ))}
        </div>

        <div
          style={{
            marginTop: 20,
            padding: 28,
            borderRadius: 24,
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
            background: "rgba(15,15,26,0.85)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(12px)",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700 }}>
              {selectedPack.credits} Credit Pack
            </div>
            <div style={{ color: "#8885a8", marginTop: 6, fontSize: 14 }}>One-time purchase. Instant delivery.</div>
          </div>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 38,
            fontWeight: 800,
            background: "linear-gradient(135deg,#a78bff,#e84fbc)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            ${selectedPack.price}
          </div>
          <button
            onClick={() => {
              setCredits((current) => current + selectedPack.credits);
              showToast(`${selectedPack.credits} demo kredi eklendi.`);
            }}
            className="btn-primary"
            style={{ padding: "14px 32px" }}
          >
            Buy Now
          </button>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "110px 24px 0", position: "relative", zIndex: 1, textAlign: "center" }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(32px,5vw,64px)", fontWeight: 800, letterSpacing: -2, lineHeight: 1.05, marginBottom: 24 }}>
          The image in your head<br />
          <span style={{ background: "linear-gradient(135deg,#a78bff 0%,#e84fbc 50%,#38d9f5 100%)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "shimmer 4s linear infinite" }}>
            is 10 seconds away.
          </span>
        </div>
        <div style={{ color: "#8885a8", fontSize: 16, marginBottom: 40, lineHeight: 1.8 }}>
          Join thousands of creators who stopped waiting and started making.
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
          <Link href="/signup" className="btn-primary" style={{ fontSize: 16, padding: "18px 40px" }}>
            Start Now — 20 Credits Free
          </Link>
          <Link href="/gallery" className="btn-secondary" style={{ fontSize: 16, padding: "18px 36px" }}>
            See Real Results First
          </Link>
        </div>
        <div style={{ marginTop: 20, color: "#8885a8", fontSize: 13 }}>
          No card. No commitment. Unsubscribe with one click.
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        textAlign: "center",
        padding: "0 24px 40px",
        color: "#8885a8",
        fontSize: 13,
        position: "relative",
        zIndex: 1,
        borderTop: "1px solid rgba(255,255,255,0.05)",
        paddingTop: 32,
      }}>
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: 18,
          marginBottom: 12,
        }}>
          <span style={{ color: "#a78bff" }}>Midilli</span>{" "}
          <span style={{ color: "#38d9f5" }}>AI</span>
        </div>
        © 2026 Midilli AI. All rights reserved.
      </footer>

      {/* ── Toast ── */}
      {toast && (
        <div
          style={{
            position: "fixed",
            right: 24,
            bottom: 24,
            padding: "14px 20px",
            borderRadius: 16,
            color: "white",
            background: "rgba(15,15,26,0.95)",
            border: "1px solid rgba(124,92,252,0.4)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(124,92,252,0.1)",
            backdropFilter: "blur(16px)",
            zIndex: 50,
            fontSize: 14,
          }}
        >
          {toast}
        </div>
      )}
    </main>
  );
}

function SectionHead({
  label,
  title,
  sub,
}: {
  label: string;
  title: string;
  sub: string;
}) {
  return (
    <>
      <div style={{
        textAlign: "center",
        color: "#7c5cfc",
        letterSpacing: 3,
        textTransform: "uppercase",
        fontSize: 12,
        fontWeight: 700,
      }}>
        {label}
      </div>
      <h2 style={{
        margin: "14px 0 0",
        textAlign: "center",
        fontFamily: "'Syne', sans-serif",
        fontSize: "clamp(34px,4vw,56px)",
        letterSpacing: -1,
      }}>
        {title}
      </h2>
      <p style={{
        maxWidth: 600,
        margin: "16px auto 0",
        textAlign: "center",
        color: "#8885a8",
        lineHeight: 1.8,
        fontSize: 15,
      }}>
        {sub}
      </p>
    </>
  );
}

function PricingCard({
  title,
  price,
  credits,
  features,
  cta,
  featured = false,
}: {
  title: string;
  price: string;
  credits: string;
  features: string[];
  cta: React.ReactNode;
  featured?: boolean;
}) {
  return (
    <div
      className={`card-hover ${featured ? "featured-ring" : ""}`}
      style={{
        padding: 30,
        borderRadius: 24,
        background: featured
          ? "linear-gradient(145deg, rgba(124,92,252,0.14), rgba(232,79,188,0.07))"
          : "rgba(15,15,26,0.85)",
        border: featured
          ? "1px solid rgba(124,92,252,0.45)"
          : "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {featured && (
        <div style={{
          position: "absolute",
          top: 16, right: 16,
          padding: "4px 12px",
          borderRadius: 999,
          background: "linear-gradient(135deg,#7c5cfc,#e84fbc)",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 1,
          textTransform: "uppercase",
        }}>
          Popular
        </div>
      )}
      <div style={{
        color: "#8885a8",
        fontFamily: "'Syne', sans-serif",
        textTransform: "uppercase",
        letterSpacing: 1.5,
        fontSize: 12,
        fontWeight: 700,
      }}>
        {title}
      </div>
      <div style={{
        marginTop: 14,
        fontFamily: "'Syne', sans-serif",
        fontSize: 52,
        fontWeight: 800,
        letterSpacing: -2,
      }}>
        {price}
      </div>
      <div style={{ marginTop: 10, color: "#38d9f5", fontSize: 14, fontWeight: 600 }}>{credits}</div>
      <ul style={{ margin: "22px 0", paddingLeft: 0, color: "#8885a8", lineHeight: 2, listStyle: "none" }}>
        {features.map((feature) => (
          <li key={feature} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#7c5cfc", fontSize: 16 }}>✓</span>
            {feature}
          </li>
        ))}
      </ul>
      {cta}
    </div>
  );
}

const inputStyle = (extra: React.CSSProperties): React.CSSProperties => ({
  width: "100%",
  padding: "16px 18px",
  color: "#f0eeff",
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(22,22,42,0.8)",
  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  fontSize: 15,
  backdropFilter: "blur(8px)",
  boxSizing: "border-box",
  ...extra,
});
