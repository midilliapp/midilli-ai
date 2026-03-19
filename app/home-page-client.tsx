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

const SUGGESTIONS = [
  "YouTube thumbnail for a tech video",
  "Product image for Shopify store",
  "Instagram ad creative, bold colors",
  "Pitch deck cover, futuristic city",
  "A Nike-style ad with a robot",
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
  const [showDemoOutput, setShowDemoOutput] = useState(true);
  const [typingDone, setTypingDone] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [sliderPaused, setSliderPaused] = useState(false);

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
    {
      prompt: "Cyberpunk city at night, neon rain, cinematic",
      src: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=900&q=85&auto=format&fit=crop",
      use: "YouTube Thumbnail — 120K views",
      tag: "Sci-Fi / Cinematic",
    },
    {
      prompt: "Futuristic product ad, chrome robot, dark studio",
      src: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=900&q=85&auto=format&fit=crop",
      use: "Product Ad — Used in paid campaign",
      tag: "AI Product Ad",
    },
    {
      prompt: "Luxury fashion editorial, minimal white background",
      src: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=900&q=85&auto=format&fit=crop",
      use: "Instagram Campaign — 4.1% CTR",
      tag: "Fashion Editorial",
    },
  ];

  useEffect(() => {
    let charIndex = 0;
    const currentPrompt = demoExamples[demoIndex].prompt;
    setTypedText("");
    setTypingDone(false);

    // Small delay before typing starts — image already visible
    const startDelay = window.setTimeout(() => {
      const typeInterval = window.setInterval(() => {
        charIndex++;
        setTypedText(currentPrompt.slice(0, charIndex));
        if (charIndex >= currentPrompt.length) {
          window.clearInterval(typeInterval);
          setTypingDone(true);
          window.setTimeout(() => {
            setTypingDone(false);
            setDemoIndex((i) => (i + 1) % demoExamples.length);
          }, 2800);
        }
      }, 48);
      return () => window.clearInterval(typeInterval);
    }, 600);

    return () => window.clearTimeout(startDelay);
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
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes slideLeft {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes slideRight {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }

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

        .card-hover {
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .card-hover:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 60px rgba(0,0,0,0.4);
          border-color: rgba(124,92,252,0.3) !important;
        }

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

        .hero-animate { animation: float-up 0.8s ease forwards; }
        .hero-animate-delay { animation: float-up 0.8s ease 0.15s both; }
        .hero-animate-delay2 { animation: float-up 0.8s ease 0.3s both; }

        .badge-pulse { animation: pulse-badge 2.5s ease-in-out infinite; }

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

        .featured-ring {
          box-shadow: 0 0 0 1px rgba(124,92,252,0.5), 0 20px 60px rgba(124,92,252,0.2);
        }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #080810; }
        ::-webkit-scrollbar-thumb { background: rgba(124,92,252,0.4); border-radius: 3px; }

        textarea:focus, input:focus {
          outline: none;
          border-color: rgba(124,92,252,0.5) !important;
          box-shadow: 0 0 0 3px rgba(124,92,252,0.15);
        }

        .suggestion-chip {
          padding: 7px 14px;
          border-radius: 999px;
          font-size: 12px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: #c4b8ff;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .suggestion-chip:hover {
          background: rgba(124,92,252,0.15);
          border-color: rgba(124,92,252,0.4);
          color: #fff;
        }

        .ticker-wrap {
          overflow: hidden;
          width: 100%;
          mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
        }
        .ticker-inner {
          display: flex;
          gap: 32px;
          width: max-content;
          animation: ticker 28s linear infinite;
        }

        /* ── Image Showcase Slider ── */
        .showcase-row {
          overflow: hidden;
          mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
        }
        .showcase-track {
          display: flex;
          width: max-content;
        }
        .showcase-card {
          position: relative;
          flex-shrink: 0;
          border-radius: 18px;
          overflow: hidden;
          cursor: pointer;
        }
        .showcase-card img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .showcase-card:hover img {
          transform: scale(1.06);
        }
        .showcase-card .card-label {
          position: absolute;
          bottom: 10px;
          left: 10px;
          padding: 5px 12px;
          border-radius: 8px;
          background: rgba(0,0,0,0.65);
          backdrop-filter: blur(8px);
          font-size: 12px;
          font-weight: 600;
          color: rgba(255,255,255,0.9);
          letter-spacing: 0.3px;
          border: 1px solid rgba(255,255,255,0.1);
          transition: opacity 0.3s ease;
        }
        .showcase-card .gen-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          padding: 4px 10px;
          border-radius: 999px;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(8px);
          font-size: 11px;
          color: #4cebb8;
          border: 1px solid rgba(76,235,184,0.3);
          display: flex;
          align-items: center;
          gap: 5px;
          opacity: 0;
          transform: translateY(-4px);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .showcase-card:hover .gen-badge {
          opacity: 1;
          transform: translateY(0);
        }

        @media (max-width: 900px) {
          .hero-two-col {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
          }
          .hero-two-col > div:first-child {
            order: 2;
          }
          .hero-two-col > div:last-child {
            order: 1;
          }
          .compare-grid { grid-template-columns: 1fr 1fr !important; font-size: 12px !important; }
        }
        @media (max-width: 600px) {
          .hero-section-pad { padding: 48px 20px 56px !important; }
          .hero-canvas { height: 280px !important; }
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
                Start Free
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* ── HERO ── */}
      <section className="hero-section-pad" style={{ padding: "80px 40px 72px", position: "relative", zIndex: 1 }}>
        <div
          className="hero-two-col"
          style={{ maxWidth: 1360, margin: "0 auto", display: "grid", gridTemplateColumns: "38% 62%", gap: 56, alignItems: "center" }}
        >

          {/* ── LEFT: editorial copy ── */}
          <div>
            <div
              className="badge-pulse hero-animate"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 14px", borderRadius: 999, fontSize: 12, marginBottom: 24, color: "#c4b8ff", border: "1px solid rgba(124,92,252,0.28)", background: "rgba(124,92,252,0.07)" }}
            >
              <span style={{ width: 6, height: 6, borderRadius: 999, background: "#38d9f5", boxShadow: "0 0 7px #38d9f5", flexShrink: 0 }} />
              No prompt skills needed
            </div>

            <h1
              className="hero-animate-delay"
              style={{ margin: 0, fontFamily: "'Syne', sans-serif", fontSize: "clamp(32px, 3.6vw, 58px)", lineHeight: 1.08, letterSpacing: -2, fontWeight: 800 }}
            >
              From idea
              <br />to image.
              <br /><span className="shimmer-text">10 seconds.</span>
            </h1>

            <p
              className="hero-animate-delay2"
              style={{ maxWidth: 380, margin: "20px 0 0", color: "#8885a8", lineHeight: 1.8, fontSize: 15 }}
            >
              Describe what you want in plain language. MIDILLI turns it into a ready-to-use visual. No learning curve. No designer.
            </p>

            <div className="hero-animate-delay2" style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 32 }}>
              <a href="#generate" className="btn-primary" style={{ fontSize: 14, padding: "14px 26px" }}>
                Create Your First Image — Free
              </a>
              <Link href="/gallery" className="btn-secondary" style={{ fontSize: 14, padding: "14px 22px" }}>
                See Results →
              </Link>
            </div>

            <div className="hero-animate-delay2" style={{ marginTop: 14, color: "#8885a8", fontSize: 12 }}>
              20 free credits · No credit card · No tutorial
            </div>
            <div className="hero-animate-delay2" style={{ marginTop: 6, color: "#8885a8", fontSize: 12 }}>
              Used for{" "}
              {["ads", "thumbnails", "products", "pitch decks"].map((t, i, arr) => (
                <span key={t}><span style={{ color: "#a78bff" }}>{t}</span>{i < arr.length - 1 ? " · " : ""}</span>
              ))}
            </div>

            <div style={{ display: "flex", gap: 28, marginTop: 36, flexWrap: "wrap", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 24 }}>
              {[
                { value: "~8s", label: "Avg. generation" },
                { value: "50K+", label: "Images created" },
                { value: "4.9★", label: "User rating" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg,#a78bff,#38d9f5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1 }}>{value}</div>
                  <div style={{ color: "#8885a8", fontSize: 11, marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Visual engine — always alive ── */}
          <div className="hero-animate-delay" style={{ position: "relative" }}>

            {/* Ambient glow layers */}
            <div style={{ position: "absolute", top: "5%", left: "5%", width: "90%", height: "90%", background: "radial-gradient(ellipse at 55% 45%, rgba(124,92,252,0.3) 0%, rgba(232,79,188,0.1) 40%, transparent 68%)", filter: "blur(48px)", pointerEvents: "none", zIndex: 0 }} />
            <div style={{ position: "absolute", top: "15%", right: "-5%", width: "55%", height: "65%", background: "radial-gradient(ellipse, rgba(56,217,245,0.1) 0%, transparent 65%)", filter: "blur(40px)", pointerEvents: "none", zIndex: 0 }} />

            {/* Canvas — no app chrome, pure visual */}
            <div
              style={{
                position: "relative", zIndex: 1,
                borderRadius: 24,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.09)",
                boxShadow: "0 40px 120px rgba(0,0,0,0.8), 0 0 0 1px rgba(124,92,252,0.1)",
              }}
            >
              {/* Full-bleed image area */}
              <div className="hero-canvas" style={{ position: "relative", height: 460, overflow: "hidden", background: "#050508" }}>

                {/* All images — always rendered, crossfade between them */}
                {demoExamples.map((ex, i) => (
                  <img
                    key={ex.src}
                    src={ex.src}
                    alt={ex.prompt}
                    style={{
                      position: "absolute", inset: 0,
                      width: "100%", height: "100%",
                      objectFit: "cover", display: "block",
                      opacity: i === demoIndex ? 1 : 0,
                      transition: "opacity 1.1s ease",
                    }}
                  />
                ))}

                {/* Category tag — top left, subtle */}
                <div style={{
                  position: "absolute", top: 18, left: 18,
                  padding: "5px 12px", borderRadius: 999,
                  background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)",
                  fontSize: 11, fontWeight: 700, color: "#c4b8ff",
                  border: "1px solid rgba(124,92,252,0.2)",
                  letterSpacing: 0.8, textTransform: "uppercase",
                  transition: "opacity 0.5s ease",
                }}>
                  {demoExamples[demoIndex].tag}
                </div>

                {/* Bottom overlay — always visible, shows prompt while typing, use case when done */}
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  padding: "72px 26px 24px",
                  background: "linear-gradient(to top, rgba(3,3,10,0.96) 0%, rgba(3,3,10,0.55) 50%, transparent 100%)",
                }}>
                  {/* Prompt line — typing animation */}
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontStyle: "italic", marginBottom: 12, lineHeight: 1.5, minHeight: 20 }}>
                    {typedText
                      ? <>&ldquo;{typedText}<span style={{ display: "inline-block", width: 1.5, height: 13, background: "#7c5cfc", marginLeft: 2, verticalAlign: "middle", animation: typingDone ? "none" : "glow-pulse 0.7s ease-in-out infinite" }} />&rdquo;</>
                      : <>&ldquo;{demoExamples[demoIndex].prompt}&rdquo;</>
                    }
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                    {/* Use case */}
                    <div style={{ display: "flex", alignItems: "center", gap: 7, color: "#4cebb8", fontSize: 13, fontWeight: 600 }}>
                      <span style={{ width: 6, height: 6, borderRadius: 999, background: "#4cebb8", boxShadow: "0 0 7px #4cebb8", flexShrink: 0 }} />
                      {demoExamples[demoIndex].use}
                    </div>

                    {/* Progress dots inline */}
                    <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                      {demoExamples.map((_, i) => (
                        <div
                          key={i}
                          style={{
                            width: i === demoIndex ? 18 : 5,
                            height: 5, borderRadius: 999,
                            background: i === demoIndex ? "linear-gradient(90deg,#7c5cfc,#e84fbc)" : "rgba(255,255,255,0.2)",
                            backgroundImage: i === demoIndex ? "linear-gradient(90deg,#7c5cfc,#e84fbc)" : "none",
                            transition: "width 0.4s ease",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── Hero → Slider Bridge ── */}
      <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 24px 0" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "10px 24px", borderRadius: 999, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "#8885a8", fontSize: 13 }}>
          <span style={{ display: "inline-flex", gap: 4 }}>
            {[0,1,2].map(i => <span key={i} style={{ width: 6, height: 6, borderRadius: 999, background: i === 0 ? "#7c5cfc" : i === 1 ? "#e84fbc" : "#38d9f5", opacity: 0.7 }} />)}
          </span>
          Here is what people are creating right now
          <span style={{ opacity: 0.4 }}>↓</span>
        </div>
      </div>

      {/* ── Image Showcase Slider ── */}
      <section
        style={{ padding: "36px 0 64px", position: "relative", zIndex: 1, overflow: "hidden" }}
        onMouseEnter={() => setSliderPaused(true)}
        onMouseLeave={() => setSliderPaused(false)}
      >
        {/* Section header */}
        <div style={{ textAlign: "center", marginBottom: 44, padding: "0 24px" }}>
          <div style={{ color: "#7c5cfc", fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 14 }}>
            Unlimited range
          </div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 800, letterSpacing: -1, margin: 0, color: "#f0eeff", lineHeight: 1.1 }}>
            Not concepts.{" "}
            <span style={{ background: "linear-gradient(135deg,#a78bff,#e84fbc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Real outputs.
            </span>
          </h2>
          <p style={{ color: "#8885a8", fontSize: 15, marginTop: 14, marginBottom: 0, maxWidth: 480, margin: "14px auto 0" }}>
            Every image below was created from a single sentence. Sci-fi, fashion, product ads, gaming — no limits.
          </p>
        </div>

        {/* Row 1 — slides left */}
        <div className="showcase-row" style={{ marginBottom: 16 }}>
          <div
            className="showcase-track"
            style={{
              gap: 16,
              animation: "slideLeft 55s linear infinite",
              animationPlayState: sliderPaused ? "paused" : "running",
            }}
          >
            {[
              { src: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&q=85&auto=format&fit=crop", label: "YouTube Thumbnail (ready to upload)", time: "7s", w: 440 },
              { src: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&q=85&auto=format&fit=crop", label: "AI Product Ad (for store)", time: "9s", w: 360 },
              { src: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&q=85&auto=format&fit=crop", label: "Instagram Ad (ready to run)", time: "6s", w: 400 },
              { src: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&q=85&auto=format&fit=crop", label: "Sci-Fi Scene (cinematic)", time: "11s", w: 460 },
              { src: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=85&auto=format&fit=crop", label: "Gaming Banner (for stream)", time: "8s", w: 380 },
              { src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=85&auto=format&fit=crop", label: "Blog Cover (ready to publish)", time: "7s", w: 420 },
              { src: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&q=85&auto=format&fit=crop", label: "Abstract Brand Visual", time: "9s", w: 350 },
              { src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=85&auto=format&fit=crop", label: "Tech Visual (for deck)", time: "6s", w: 380 },
              { src: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&q=85&auto=format&fit=crop", label: "YouTube Thumbnail (ready to upload)", time: "7s", w: 440 },
              { src: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&q=85&auto=format&fit=crop", label: "AI Product Ad (for store)", time: "9s", w: 360 },
              { src: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&q=85&auto=format&fit=crop", label: "Instagram Ad (ready to run)", time: "6s", w: 400 },
              { src: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&q=85&auto=format&fit=crop", label: "Sci-Fi Scene (cinematic)", time: "11s", w: 460 },
              { src: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=85&auto=format&fit=crop", label: "Gaming Banner (for stream)", time: "8s", w: 380 },
              { src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=85&auto=format&fit=crop", label: "Blog Cover (ready to publish)", time: "7s", w: 420 },
              { src: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&q=85&auto=format&fit=crop", label: "Abstract Brand Visual", time: "9s", w: 350 },
              { src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=85&auto=format&fit=crop", label: "Tech Visual (for deck)", time: "6s", w: 380 },
            ].map((img, i) => (
              <div
                key={i}
                className="showcase-card"
                style={{
                  width: img.w,
                  height: 290,
                  boxShadow: "0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)",
                }}
              >
                <img
                  src={img.src}
                  alt={img.label}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                <div className="card-label">{img.label}</div>
                <div className="gen-badge">
                  <span style={{ width: 5, height: 5, borderRadius: 999, background: "#4cebb8", boxShadow: "0 0 4px #4cebb8", display: "inline-block" }} />
                  ~{img.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 — slides right (opposite direction) */}
        <div className="showcase-row">
          <div
            className="showcase-track"
            style={{
              gap: 16,
              animation: "slideRight 65s linear infinite",
              animationPlayState: sliderPaused ? "paused" : "running",
            }}
          >
            {[
              { src: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=85&auto=format&fit=crop", label: "Fashion Editorial (campaign-ready)", time: "8s", w: 370 },
              { src: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=600&q=85&auto=format&fit=crop", label: "Cosmic Visual (for merch)", time: "12s", w: 430 },
              { src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=85&auto=format&fit=crop", label: "Landscape (for print)", time: "9s", w: 400 },
              { src: "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=600&q=85&auto=format&fit=crop", label: "City Aerial (pitch deck)", time: "7s", w: 380 },
              { src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=85&auto=format&fit=crop", label: "Product Image (for store)", time: "6s", w: 350 },
              { src: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=85&auto=format&fit=crop", label: "Architecture (brand identity)", time: "10s", w: 420 },
              { src: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=600&q=85&auto=format&fit=crop", label: "Abstract Neon (NFT / merch)", time: "8s", w: 360 },
              { src: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=85&auto=format&fit=crop", label: "Social Content (7-day pack)", time: "5s", w: 390 },
              { src: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=85&auto=format&fit=crop", label: "Fashion Editorial (campaign-ready)", time: "8s", w: 370 },
              { src: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=600&q=85&auto=format&fit=crop", label: "Cosmic Visual (for merch)", time: "12s", w: 430 },
              { src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=85&auto=format&fit=crop", label: "Landscape (for print)", time: "9s", w: 400 },
              { src: "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=600&q=85&auto=format&fit=crop", label: "City Aerial (pitch deck)", time: "7s", w: 380 },
              { src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=85&auto=format&fit=crop", label: "Product Image (for store)", time: "6s", w: 350 },
              { src: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=85&auto=format&fit=crop", label: "Architecture (brand identity)", time: "10s", w: 420 },
              { src: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=600&q=85&auto=format&fit=crop", label: "Abstract Neon (NFT / merch)", time: "8s", w: 360 },
              { src: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=85&auto=format&fit=crop", label: "Social Content (7-day pack)", time: "5s", w: 390 },
            ].map((img, i) => (
              <div
                key={i}
                className="showcase-card"
                style={{
                  width: img.w,
                  height: 270,
                  boxShadow: "0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)",
                }}
              >
                <img
                  src={img.src}
                  alt={img.label}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                <div className="card-label">{img.label}</div>
                <div className="gen-badge">
                  <span style={{ width: 5, height: 5, borderRadius: 999, background: "#4cebb8", boxShadow: "0 0 4px #4cebb8", display: "inline-block" }} />
                  ~{img.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom fade hint */}
        <div style={{ textAlign: "center", marginTop: 32, color: "#8885a8", fontSize: 13 }}>
          Hover to pause · Every image generated from a single sentence
        </div>
      </section>

      {/* ── Generate ── */}
      <section id="generate" style={{ padding: "80px 24px 0", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ color: "#7c5cfc", letterSpacing: 3, textTransform: "uppercase", fontSize: 12, fontWeight: 700, marginBottom: 12 }}>Try it now</div>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(28px,3.5vw,44px)", letterSpacing: -1, margin: 0 }}>
              Stop thinking. Generate something.
            </h2>
            <p style={{ color: "#8885a8", marginTop: 12, fontSize: 15 }}>
              Type anything. It works on your first try.
            </p>
          </div>

          <div
            style={{
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
                  placeholder="Try: A Nike-style ad with a futuristic robot..."
                  style={inputStyle({ minHeight: 120, resize: "vertical" })}
                />

                {/* Suggestion chips */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      className="suggestion-chip"
                      onClick={() => setPrompt(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>

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
                    {loading ? "Generating..." : "Generate Image →"}
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
        </div>
      </section>

      {/* ── Visual Proof ── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "110px 24px 0", position: "relative", zIndex: 1 }}>
        <SectionHead
          label="Real Results"
          title="Idea → usable visual. Every time."
          sub="These are real outputs. Real prompts. Real use cases. No touching up, no fixing needed."
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16, marginTop: 48 }}>
          {[
            {
              prompt: "A neon-lit cyberpunk city at midnight",
              src: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&q=80&auto=format&fit=crop",
              use: "Used as YouTube thumbnail",
              result: "120K views",
              color: "#e84fbc",
            },
            {
              prompt: "Deep space galaxy with glowing nebula",
              src: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=600&q=80&auto=format&fit=crop",
              use: "Used as Shopify product visual",
              result: "2x conversion rate",
              color: "#38d9f5",
            },
            {
              prompt: "Abstract colorful light burst, neon explosion",
              src: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&q=80&auto=format&fit=crop",
              use: "Used as Instagram ad creative",
              result: "3.8% CTR",
              color: "#a78bff",
            },
          ].map(({ prompt, src, use, result, color }) => (
            <div key={prompt} className="card-hover" style={{ borderRadius: 20, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", background: "#0f0f1a" }}>
              <div style={{ position: "relative" }}>
                <img src={src} alt={prompt} style={{ width: "100%", height: 240, objectFit: "cover", display: "block" }}
                  onError={(e) => { (e.target as HTMLImageElement).style.background = "linear-gradient(135deg,#1a0a2e,#7c5cfc)"; }} />
                <div style={{ position: "absolute", top: 12, left: 12, padding: "5px 12px", borderRadius: 999, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)", fontSize: 11, color: "#4cebb8", border: "1px solid rgba(76,235,184,0.25)", display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 5, height: 5, borderRadius: 999, background: "#4cebb8", display: "inline-block" }} />
                  ~8s
                </div>
              </div>
              <div style={{ padding: "16px 18px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ color: "#8885a8", fontSize: 12, marginBottom: 6, fontStyle: "italic" }}>"{prompt}"</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                  <div style={{ fontSize: 13, color: "#c4b8ff" }}>{use}</div>
                  <div style={{ padding: "3px 10px", borderRadius: 999, background: `${color}18`, border: `1px solid ${color}30`, color, fontSize: 12, fontWeight: 700 }}>{result}</div>
                </div>
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

      {/* ── Why This Feels Different ── */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "110px 24px 0", position: "relative", zIndex: 1 }}>
        <SectionHead
          label="Why MIDILLI"
          title="Why this feels different"
          sub="Most tools make you work to get a result. MIDILLI starts with the result."
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20, marginTop: 52 }}>
          {[
            {
              icon: "✦",
              title: "No prompt engineering.",
              desc: "Just describe it. Plain English, any language, any level of detail. If you can text it, you can create it.",
              color: "#a78bff",
            },
            {
              icon: "⚡",
              title: "Works on your first try.",
              desc: "No trial and error. No Discord. No setup. You type, you get a result. That's the whole flow.",
              color: "#38d9f5",
            },
            {
              icon: "↓",
              title: "Ready-to-use outputs.",
              desc: "No fixing needed. Download and use directly — as a thumbnail, ad, product image, or pitch visual.",
              color: "#4cebb8",
            },
            {
              icon: "∞",
              title: "Instant iterations.",
              desc: "Don't like it? Hit generate again. Different result in 8 seconds. Change anything, instantly.",
              color: "#e84fbc",
            },
          ].map(({ icon, title, desc, color }) => (
            <div key={title} className="card-hover" style={{ padding: 28, borderRadius: 22, background: "rgba(15,15,26,0.85)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(12px)" }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: `${color}18`, border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 18, color }}>{icon}</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 17, marginBottom: 10 }}>{title}</div>
              <div style={{ color: "#8885a8", lineHeight: 1.75, fontSize: 14 }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Comparison ── */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "110px 24px 0", position: "relative", zIndex: 1 }}>
        <SectionHead
          label="vs The Alternatives"
          title="Every other tool makes you pay with time."
          sub="We don't. Here's the honest comparison."
        />

        <div style={{ marginTop: 52, borderRadius: 24, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="compare-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", background: "rgba(15,15,26,0.95)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ padding: "16px 20px", color: "#8885a8", fontSize: 13, fontWeight: 600 }}></div>
            {["Hire designer", "Midjourney", "MIDILLI"].map((h, i) => (
              <div key={h} style={{ padding: "16px 20px", textAlign: "center", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, color: i === 2 ? "#a78bff" : "#8885a8", borderLeft: "1px solid rgba(255,255,255,0.06)", background: i === 2 ? "rgba(124,92,252,0.06)" : "transparent" }}>{h}</div>
            ))}
          </div>
          {[
            { label: "Time to first result", vals: ["2–5 days", "~10 min setup", "8 seconds"] },
            { label: "Skill required", vals: ["Write a brief", "Learn prompts + Discord", "Plain language"] },
            { label: "Cost to start", vals: ["$200–$500", "$30/month", "Free"] },
            { label: "Works in browser", vals: ["Email back-and-forth", "Needs Discord app", "Yes. Right now."] },
            { label: "Revisions", vals: ["Extra cost", "1 credit each try", "Instant, unlimited"] },
            { label: "Commercial rights", vals: ["Extra fee", "Paid tiers only", "Included on Pro"] },
          ].map(({ label, vals }, rowI) => (
            <div key={label} className="compare-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", borderBottom: rowI < 5 ? "1px solid rgba(255,255,255,0.05)" : "none", background: rowI % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent" }}>
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
          title="See yourself in here"
          sub="Whatever you create, MIDILLI handles it. In seconds."
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 14, marginTop: 48 }}>
          {[
            { label: "YouTube thumbnails that get clicks", time: "8 sec", color: "#e84fbc", icon: "▶" },
            { label: "Product images that sell", time: "8 sec", color: "#38d9f5", icon: "◈" },
            { label: "7 days of social content in minutes", time: "3 min", color: "#a78bff", icon: "⬡" },
            { label: "Slides that actually impress", time: "8 sec", color: "#4cebb8", icon: "✦" },
            { label: "App store screenshots that convert", time: "30 sec", color: "#fbbf24", icon: "⊞" },
            { label: "Blog covers that stop the scroll", time: "8 sec", color: "#fc5c5c", icon: "✎" },
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

      {/* ── Mid CTA ── */}
      <section style={{ maxWidth: 700, margin: "0 auto", padding: "110px 24px 0", position: "relative", zIndex: 1, textAlign: "center" }}>
        <div style={{ padding: "52px 48px", borderRadius: 28, background: "rgba(124,92,252,0.07)", border: "1px solid rgba(124,92,252,0.2)", backdropFilter: "blur(12px)" }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(24px,3.5vw,38px)", fontWeight: 800, letterSpacing: -1, marginBottom: 16 }}>
            You are one idea away<br />
            <span style={{ background: "linear-gradient(135deg,#a78bff,#e84fbc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>from a real visual.</span>
          </div>
          <div style={{ color: "#8885a8", marginBottom: 32, fontSize: 15, lineHeight: 1.7 }}>
            No credit card. Instant result. Then decide.
          </div>
          <a href="#generate" className="btn-primary" style={{ fontSize: 16, padding: "18px 40px" }}>
            Create Your First Image — Free
          </a>
        </div>
      </section>

      {/* ── Objections / FAQ ── */}
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "110px 24px 0", position: "relative", zIndex: 1 }}>
        <SectionHead
          label="Objections"
          title="The questions you're actually thinking"
          sub="No fluff. Straight answers. No corporate language."
        />
        <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { q: "Why is this better than Midjourney?", a: "Midjourney requires Discord, prompt engineering, and a paid plan just to start. MIDILLI works in your browser, in plain language, for free. You'll get a result in 8 seconds — no setup, no queue, no learning curve." },
            { q: "Is this actually free?", a: "Yes. 20 credits, no card, no catch. You can generate 20 images before we ever ask for a dollar. Most users create something they love within the first 3." },
            { q: "What if the result isn't good enough?", a: "Hit generate again. Different result, same 8 seconds, one credit. Most people find exactly what they want within 2–3 tries. And if not — your credits don't expire." },
            { q: "Do I need to know how to write prompts?", a: "No. If you can send a text message, you can use MIDILLI. 'A cozy coffee shop in autumn' works perfectly. No technical jargon needed." },
            { q: "Can I use this for business?", a: "Yes. Commercial rights are included on all paid plans. You own what you create — sell it, publish it, use it in ads. No watermarks on paid plans." },
            { q: "How is this different from Canva or Figma?", a: "Canva and Figma are editors — you still have to design. MIDILLI generates the visual from scratch. You start with a finished result, not a blank canvas." },
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

      {/* ── Gallery ── */}
      <section id="gallery" style={{ maxWidth: 1100, margin: "0 auto", padding: "110px 24px 0", position: "relative", zIndex: 1 }}>
        <SectionHead label="Community" title="Made with MIDILLI" sub="Real outputs from real creators. Every image was generated in under 10 seconds." />
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
        <SectionHead
          label="Pricing"
          title="Free to start. Always."
          sub="20 credits on us. No credit card. No commitment. Pay only when you are ready to scale."
        />

        {/* Value anchors */}
        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 28, flexWrap: "wrap" }}>
          {[
            { text: "~$0.04 per image on Pro", icon: "💡" },
            { text: "Cheaper than one stock photo", icon: "💸" },
            { text: "Commercial rights included", icon: "✅" },
          ].map(({ text, icon }) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 999, background: "rgba(124,92,252,0.08)", border: "1px solid rgba(124,92,252,0.2)", fontSize: 13, color: "#c4b8ff" }}>
              <span>{icon}</span> {text}
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 18, marginTop: 32 }}>
          <PricingCard
            title="Free"
            price="$0"
            credits="20 / mo"
            features={["Basic models", "Public gallery", "Personal use"]}
            cta={<Link href="/signup" className="btn-secondary" style={{ display: "block", textAlign: "center" }}>Start Free — No Card</Link>}
          />
          <PricingCard
            title="Pro"
            price="$19"
            credits="500 / mo"
            featured
            features={["Private gallery", "Priority queue", "Commercial rights included", "~$0.04 per image"]}
            cta={
              <button
                className="btn-primary"
                style={{ width: "100%", padding: "13px 24px" }}
                onClick={() => showToast("Pro checkout sonraki adimda baglanabilir.")}
              >
                Go Pro — Start Creating
              </button>
            }
          />
          <PricingCard
            title="Ultra"
            price="$49"
            credits="2000 / mo"
            features={["4K exports", "API access", "Instant queue", "Priority support"]}
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

        <div style={{ textAlign: "center", marginTop: 20, color: "#8885a8", fontSize: 13 }}>
          Run out of credits? Upgrade instantly. No waiting, no back-and-forth.
        </div>
      </section>

      {/* ── Credits ── */}
      <section id="credits" style={{ maxWidth: 980, margin: "0 auto", padding: "110px 24px 90px", position: "relative", zIndex: 1 }}>
        <SectionHead label="Credit Store" title="Buy Credits" sub="One-time packs. No subscription. Instant delivery." />
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
            <div style={{ color: "#8885a8", marginTop: 6, fontSize: 14 }}>One-time purchase. Instant delivery. Never expires.</div>
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
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px 140px", position: "relative", zIndex: 1, textAlign: "center" }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(32px,5vw,64px)", fontWeight: 800, letterSpacing: -2, lineHeight: 1.05, marginBottom: 24 }}>
          Stop thinking.
          <br />
          <span style={{ background: "linear-gradient(135deg,#a78bff 0%,#e84fbc 50%,#38d9f5 100%)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "shimmer 4s linear infinite" }}>
            Generate something.
          </span>
        </div>
        <div style={{ color: "#8885a8", fontSize: 16, marginBottom: 40, lineHeight: 1.8 }}>
          One idea. 10 seconds. A real visual. Then decide.
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
          <Link href="/signup" className="btn-primary" style={{ fontSize: 16, padding: "18px 40px" }}>
            Create Your First Image — Free
          </Link>
          <Link href="/gallery" className="btn-secondary" style={{ fontSize: 16, padding: "18px 36px" }}>
            See Real Results First →
          </Link>
        </div>
        <div style={{ marginTop: 20, color: "#8885a8", fontSize: 13 }}>
          No card. No commitment. No learning curve.
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        textAlign: "center",
        padding: "32px 24px 40px",
        color: "#8885a8",
        fontSize: 13,
        position: "relative",
        zIndex: 1,
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}>
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: 18,
          marginBottom: 12,
          color: "#a78bff",
        }}>
          MIDILLI
        </div>
        © 2026 MIDILLI. All rights reserved.
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

function inputStyle(extra: React.CSSProperties = {}): React.CSSProperties {
  return {
    width: "100%",
    background: "rgba(22,22,42,0.6)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 16,
    padding: "14px 18px",
    color: "#f0eeff",
    fontSize: 15,
    fontFamily: "'DM Sans', Arial, sans-serif",
    boxSizing: "border-box",
    ...extra,
  };
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
        fontFamily: "'Syne', sans-serif",
        fontSize: 44,
        fontWeight: 800,
        marginTop: 10,
        background: featured ? "linear-gradient(135deg,#a78bff,#e84fbc)" : "none",
        WebkitBackgroundClip: featured ? "text" : "unset",
        WebkitTextFillColor: featured ? "transparent" : "inherit",
      }}>
        {price}
      </div>
      <div style={{ color: "#8885a8", fontSize: 13, marginTop: 4 }}>{credits} credits</div>
      <ul style={{ listStyle: "none", padding: 0, margin: "20px 0", display: "flex", flexDirection: "column", gap: 10 }}>
        {features.map((f) => (
          <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#c4b8ff" }}>
            <span style={{ color: "#4cebb8", fontSize: 16 }}>✓</span> {f}
          </li>
        ))}
      </ul>
      {cta}
    </div>
  );
}
