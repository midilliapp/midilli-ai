"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import LiquidMetalHero from "@/components/ui/liquid-metal-hero";
import { ZoomParallax } from "@/components/ui/zoom-parallax";
import { supabase } from "@/lib/supabase";
import AuthGateModal from "./components/AuthGateModal";
import ChatWidget from "./components/ChatWidget";
import GalleryModal from "./components/GalleryModal";

type GalleryPost = {
  id: string;
  image_url: string;
  prompt: string | null;
  username: string;
  model: string | null;
  created_at: string;
  likes_count: number;
};


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

const communityFallbackPosts: GalleryPost[] = [
  {
    id: "fallback-1",
    image_url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&q=85&auto=format&fit=crop",
    prompt: "Neon-lit cyberpunk city at midnight with rain reflections",
    username: "midilli_lab",
    model: "flux-pro",
    created_at: new Date().toISOString(),
    likes_count: 128,
  },
  {
    id: "fallback-2",
    image_url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=85&auto=format&fit=crop",
    prompt: "Chrome fashion robot product campaign in a dark editorial studio",
    username: "studio_vanta",
    model: "recraft-v3",
    created_at: new Date().toISOString(),
    likes_count: 94,
  },
  {
    id: "fallback-3",
    image_url: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=1200&q=85&auto=format&fit=crop",
    prompt: "Cinematic nebula burst with deep space texture and glowing light",
    username: "cosmicframe",
    model: "gpt-image-1",
    created_at: new Date().toISOString(),
    likes_count: 141,
  },
  {
    id: "fallback-4",
    image_url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1200&q=85&auto=format&fit=crop",
    prompt: "Abstract color blast for a performance marketing ad",
    username: "adforge",
    model: "ideogram-v2",
    created_at: new Date().toISOString(),
    likes_count: 76,
  },
  {
    id: "fallback-5",
    image_url: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&q=85&auto=format&fit=crop",
    prompt: "Minimal luxury fashion editorial with clean lighting",
    username: "moodboarder",
    model: "flux-dev",
    created_at: new Date().toISOString(),
    likes_count: 88,
  },
  {
    id: "fallback-6",
    image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=85&auto=format&fit=crop",
    prompt: "Epic alpine scene for a cinematic travel campaign",
    username: "summitvision",
    model: "kolors",
    created_at: new Date().toISOString(),
    likes_count: 61,
  },
  {
    id: "fallback-7",
    image_url: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=1200&q=85&auto=format&fit=crop",
    prompt: "Liquid neon abstract frame for a product launch visual",
    username: "spectrum",
    model: "aura-flow",
    created_at: new Date().toISOString(),
    likes_count: 53,
  },
];

export default function HomePageClient() {
  const router = useRouter();
  const [transitioning, setTransitioning] = useState(false);
  const [credits, setCredits] = useState(20);
  const [toast, setToast] = useState("");
  const [selectedPack, setSelectedPack] = useState(packs[0]);
  const [userName, setUserName] = useState("");
  const [demoIndex, setDemoIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [showDemoOutput, setShowDemoOutput] = useState(true);
  const [typingDone, setTypingDone] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [showAuthGate, setShowAuthGate] = useState(false);

  // Community gallery
  const [galleryPosts, setGalleryPosts] = useState<GalleryPost[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [galleryModalPost, setGalleryModalPost] = useState<GalleryPost | null>(null);

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

  // Load community gallery posts
  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((d) => { if (d.posts) setGalleryPosts(d.posts as GalleryPost[]); })
      .finally(() => setGalleryLoading(false));
  }, []);

  const demoExamples = [
    {
      prompt: "Cyberpunk city at night, neon rain, cinematic",
      src: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=900&q=85&auto=format&fit=crop",
      use: "YouTube Thumbnail - 120K views",
      tag: "Sci-Fi / Cinematic",
    },
    {
      prompt: "Futuristic product ad, chrome robot, dark studio",
      src: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=900&q=85&auto=format&fit=crop",
      use: "Product Ad - Used in paid campaign",
      tag: "AI Product Ad",
    },
    {
      prompt: "Luxury fashion editorial, minimal white background",
      src: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=900&q=85&auto=format&fit=crop",
      use: "Instagram Campaign - 4.1% CTR",
      tag: "Fashion Editorial",
    },
  ];

  useEffect(() => {
    let charIndex = 0;
    const currentPrompt = demoExamples[demoIndex].prompt;
    setTypedText("");
    setTypingDone(false);

    // Small delay before typing starts - image already visible
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

  const openAuthGate = () => {
    setShowAuthGate(true);
  };

  const getAuthHeaders = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      openAuthGate();
      return null;
    }

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    };
  };

  const handleGalleryLike = async (post: GalleryPost) => {
    if (!userName) {
      openAuthGate();
      return;
    }

    setGalleryPosts((prev) =>
      prev.map((p) =>
        p.id === post.id ? { ...p, likes_count: p.likes_count + 1 } : p
      )
    );

    const headers = await getAuthHeaders();
    if (!headers) {
      setGalleryPosts((prev) =>
        prev.map((p) =>
          p.id === post.id ? { ...p, likes_count: Math.max(0, p.likes_count - 1) } : p
        )
      );
      return;
    }

    try {
      const response = await fetch(`/api/gallery/${post.id}/like`, {
        method: "POST",
        headers,
      });
      const data = (await response.json()) as { likes_count?: number; error?: string };
      if (!response.ok) throw new Error(data.error ?? "Like failed");

      if (data.likes_count !== undefined) {
        setGalleryPosts((prev) =>
          prev.map((p) =>
            p.id === post.id ? { ...p, likes_count: data.likes_count as number } : p
          )
        );
      }
    } catch {
      setGalleryPosts((prev) =>
        prev.map((p) =>
          p.id === post.id ? { ...p, likes_count: Math.max(0, p.likes_count - 1) } : p
        )
      );
      showToast("Please sign in to like community posts.");
    }
  };

  const goToStudioAction = () => {
    setTransitioning(true);
    setTimeout(() => router.push("/create"), 920);
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

  const communityParallaxImages = (galleryPosts.length > 0 ? galleryPosts : communityFallbackPosts)
    .slice(0, 7)
    .map((post) => ({
      src: post.image_url,
      alt: post.prompt ?? `${post.username} community creation`,
    }));

  const featuredCommunityPosts = (galleryPosts.length > 0 ? galleryPosts : communityFallbackPosts).slice(0, 6);

  return (
    <main
      style={{
        minHeight: "100vh",
        color: "#f0eeff",
        background: "transparent",
        fontFamily: "'DM Sans', Arial, sans-serif",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;700&display=swap");

        @keyframes curtainUp {
          0%   { transform: translateY(100%); }
          100% { transform: translateY(0%); }
        }
        @keyframes curtainLogo {
          0%   { opacity: 0; transform: scale(0.92) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes curtainSlash {
          0%   { width: 0; opacity: 0; }
          100% { width: 48px; opacity: 1; }
        }
        @keyframes curtainSub {
          0%   { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes curtainDots {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
          40%            { transform: scale(1); opacity: 1; }
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
        ::-webkit-scrollbar-track { background: #110d18; }
        ::-webkit-scrollbar-thumb { background: rgba(124,92,252,0.4); border-radius: 3px; }

        textarea:focus, input:focus {
          outline: none;
          border-color: rgba(124,92,252,0.5) !important;
          box-shadow: 0 0 0 3px rgba(124,92,252,0.15);
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

        /* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Image Showcase Slider ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */
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

      {/* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Page Transition Overlay ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */}
      {transitioning && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "#06060f",
          animation: "curtainUp 0.72s cubic-bezier(0.76, 0, 0.24, 1) forwards",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: 0, overflow: "hidden",
        }}>
          {/* Top edge glow line */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent 0%, #7c5cfc 30%, #e84fbc 70%, transparent 100%)", animation: "curtainLogo 0.4s ease 0.5s both" }} />

          {/* Logo */}
          <div style={{ animation: "curtainLogo 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.35s both", textAlign: "center" }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 38, fontWeight: 900, letterSpacing: "-0.04em", display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
              <span style={{ background: "linear-gradient(135deg, #c4b8ff, #a78bff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>MIDILLI</span>
              <span style={{ color: "rgba(255,255,255,0.15)", fontWeight: 300, fontSize: 32 }}>/</span>
              <span style={{ color: "#a78bfa", fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em" }}>Studio</span>
            </div>
            {/* Animated underline */}
            <div style={{ margin: "14px auto 0", height: 1, background: "linear-gradient(90deg, transparent, rgba(167,139,250,0.5), transparent)", animation: "curtainSlash 0.5s ease 0.65s both", overflow: "hidden" }} />
            {/* Sub text */}
            <div style={{ marginTop: 18, fontSize: 13, color: "#4a4a6a", letterSpacing: "0.06em", animation: "curtainSub 0.4s ease 0.7s both" }}>
              Entering creative studio
            </div>
          </div>

          {/* Loading dots */}
          <div style={{ display: "flex", gap: 7, marginTop: 40, animation: "curtainSub 0.4s ease 0.75s both" }}>
            {[0, 1, 2].map((i) => (
              <span key={i} style={{
                width: 5, height: 5, borderRadius: "50%",
                background: "#7c5cfc", display: "block",
                animation: `curtainDots 1.2s ease-in-out ${i * 0.18}s infinite`,
              }} />
            ))}
          </div>
        </div>
      )}

      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(circle at 14% 8%, rgba(255,120,214,0.22), transparent 22%), radial-gradient(circle at 82% 16%, rgba(103,232,249,0.08), transparent 22%), radial-gradient(circle at 48% 46%, rgba(168,85,247,0.08), transparent 28%)",
        }}
      />

      {/* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Header ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */}
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
                <a href="/create" className="nav-link">Generate</a>
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
      <LiquidMetalHero
        badge="No prompt skills needed"
        title={
          <>
            From idea
            <br />to image.
            <br />
            <span className="shimmer-text">10 seconds.</span>
          </>
        }
        subtitle="Describe what you want in plain language. MIDILLI turns it into a ready-to-use visual for ads, thumbnails, products, and pitch decks. No learning curve. No designer."
        primaryCtaLabel="Start Creating - Free"
        secondaryCtaLabel="See Plans ->"
        onPrimaryCtaClick={goToStudioAction}
        onSecondaryCtaClick={() => setShowPlansModal(true)}
        meta="20 free credits - No credit card - No tutorial"
        features={[
          "Ads and thumbnails in one sentence",
          "Instant visual direction without prompt engineering",
          "Ready for gallery, campaigns, and product launches",
        ]}
        stats={[
          { value: "~8s", label: "Avg. generation" },
          { value: "50K+", label: "Images created" },
          { value: "4.9/5", label: "User rating" },
        ]}
      />

      <section id="gallery" style={{ position: "relative", zIndex: 1, padding: "18px 0 72px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 16px", borderRadius: 999, background: "rgba(124,92,252,0.08)", border: "1px solid rgba(124,92,252,0.24)", color: "#cdbfff", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
            <span style={{ width: 7, height: 7, borderRadius: 999, background: "#38d9f5", boxShadow: "0 0 10px #38d9f5" }} />
            Community
          </div>
          <h2 style={{ margin: "18px 0 0", fontFamily: "'Syne', sans-serif", fontSize: "clamp(32px, 5vw, 58px)", fontWeight: 800, letterSpacing: -2 }}>
            Made with MIDILLI
          </h2>
          <p style={{ maxWidth: 620, margin: "16px auto 0", color: "#8885a8", fontSize: 15, lineHeight: 1.85 }}>
            Discover what other creators are building, open any image, and join the conversation. Like and comment are available for signed-in users so the gallery stays real and high quality.
          </p>
          <div style={{ marginTop: 16, color: userName ? "#4cebb8" : "#a78bff", fontSize: 12, letterSpacing: 0.6 }}>
            {userName ? "You are signed in. Like and comment on any community image." : "Sign in to like and comment on community creations."}
          </div>
        </div>

        <div style={{ marginTop: 32 }}>
          <ZoomParallax images={communityParallaxImages} />
        </div>

        <div style={{ maxWidth: 1140, margin: "-30vh auto 0", padding: "0 24px", position: "relative", zIndex: 2 }}>
          {galleryLoading && (
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 28 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#a78bff", opacity: 0.4, animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
              ))}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 18 }}>
            {featuredCommunityPosts.map((post) => (
              <div
                key={post.id}
                className="card-hover"
                style={{ borderRadius: 22, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(13,13,24,0.92)", boxShadow: "0 20px 70px rgba(0,0,0,0.35)" }}
              >
                <div onClick={() => setGalleryModalPost(post)} style={{ position: "relative", paddingBottom: "100%", cursor: "pointer", background: "#0a0a14" }}>
                  <img
                    src={post.image_url}
                    alt={post.prompt ?? "Community image"}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(transparent 45%, rgba(0,0,0,0.78) 100%)" }} />
                  <div style={{ position: "absolute", top: 12, right: 12, padding: "5px 10px", borderRadius: 999, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)", fontSize: 11, color: "rgba(255,255,255,0.72)" }}>
                    Open discussion
                  </div>
                  {post.prompt && (
                    <div style={{ position: "absolute", left: 14, right: 14, bottom: 14, color: "rgba(255,255,255,0.92)", fontSize: 12, lineHeight: 1.55 }}>
                      “{post.prompt.length > 88 ? `${post.prompt.slice(0, 88)}...` : post.prompt}”
                    </div>
                  )}
                </div>

                <div style={{ padding: "14px 16px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                      <div style={{ width: 30, height: 30, borderRadius: "50%", background: `hsl(${post.username.charCodeAt(0) * 13 % 360}, 50%, 38%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "white", flexShrink: 0 }}>
                        {post.username[0].toUpperCase()}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#d8cbff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{post.username}</div>
                        <div style={{ fontSize: 11, color: "#5e5b78" }}>{post.model ?? "midilli model"}</div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); void handleGalleryLike(post); }}
                      style={{ padding: "7px 12px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#b8b2d0", fontSize: 12, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}
                    >
                      Like {post.likes_count}
                    </button>
                  </div>
                  <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                    <button
                      onClick={() => setGalleryModalPost(post)}
                      style={{ flex: 1, padding: "10px 14px", borderRadius: 999, border: "1px solid rgba(124,92,252,0.25)", background: "rgba(124,92,252,0.08)", color: "#cdbfff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
                    >
                      Comment
                    </button>
                    <Link
                      href="/gallery"
                      style={{ flex: 1, padding: "10px 14px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "#f0eeff", fontSize: 12, fontWeight: 700, textAlign: "center", textDecoration: "none" }}
                    >
                      View more
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 32 }}>
            <Link href="/gallery" className="btn-secondary" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              Explore the full community gallery {"->"}
            </Link>
          </div>
        </div>
      </section>


      {/* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Visual Proof ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "110px 24px 0", position: "relative", zIndex: 1 }}>
        <SectionHead
          label="Real Results"
          title="Idea -> usable visual. Every time."
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
            See all community works {"->"}
          </Link>
        </div>
      </section>

      {/* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Why This Feels Different ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "110px 24px 0", position: "relative", zIndex: 1 }}>
        <SectionHead
          label="Why MIDILLI"
          title="Why this feels different"
          sub="Most tools make you work to get a result. MIDILLI starts with the result."
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20, marginTop: 52 }}>
          {[
            {
              icon: "*",
              title: "No prompt engineering.",
              desc: "Just describe it. Plain English, any language, any level of detail. If you can text it, you can create it.",
              color: "#a78bff",
            },
            {
              icon: "[]",
              title: "Works on your first try.",
              desc: "No trial and error. No Discord. No setup. You type, you get a result. That's the whole flow.",
              color: "#38d9f5",
            },
            {
              icon: "-",
              title: "Ready-to-use outputs.",
              desc: "No fixing needed. Download and use directly - as a thumbnail, ad, product image, or pitch visual.",
              color: "#4cebb8",
            },
            {
              icon: "oo",
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

      {/* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Comparison ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */}
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
            { label: "Time to first result", vals: ["2-5 days", "~10 min setup", "8 seconds"] },
            { label: "Skill required", vals: ["Write a brief", "Learn prompts + Discord", "Plain language"] },
            { label: "Cost to start", vals: ["$200-$500", "$30/month", "Free"] },
            { label: "Works in browser", vals: ["Email back-and-forth", "Needs Discord app", "Yes. Right now."] },
            { label: "Revisions", vals: ["Extra cost", "1 credit each try", "Instant, unlimited"] },
            { label: "Commercial rights", vals: ["Extra fee", "Paid tiers only", "Included on Pro"] },
          ].map(({ label, vals }, rowI) => (
            <div key={label} className="compare-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", borderBottom: rowI < 5 ? "1px solid rgba(255,255,255,0.05)" : "none", background: rowI % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent" }}>
              <div style={{ padding: "16px 20px", fontSize: 14, color: "#c4b8ff", fontWeight: 500 }}>{label}</div>
              {vals.map((v, i) => (
                <div key={v} style={{ padding: "16px 20px", textAlign: "center", fontSize: 13, borderLeft: "1px solid rgba(255,255,255,0.05)", background: i === 2 ? "rgba(124,92,252,0.04)" : "transparent", color: i === 2 ? "#4cebb8" : "#8885a8", fontWeight: i === 2 ? 600 : 400 }}>
                  {i === 2 ? "+ " : "- "}{v}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 28 }}>
          <a href="/create" className="btn-primary" style={{ fontSize: 15, padding: "15px 32px" }}>
            Try MIDILLI Free - No Card
          </a>
        </div>
      </section>

      {/* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Use Cases ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "110px 24px 0", position: "relative", zIndex: 1 }}>
        <SectionHead
          label="Use Cases"
          title="See yourself in here"
          sub="Whatever you create, MIDILLI handles it. In seconds."
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 14, marginTop: 48 }}>
          {[
            { label: "YouTube thumbnails that get clicks", time: "8 sec", color: "#e84fbc", icon: ">" },
            { label: "Product images that sell", time: "8 sec", color: "#38d9f5", icon: "*" },
            { label: "7 days of social content in minutes", time: "3 min", color: "#a78bff", icon: "[]" },
            { label: "Slides that actually impress", time: "8 sec", color: "#4cebb8", icon: "*" },
            { label: "App store screenshots that convert", time: "30 sec", color: "#fbbf24", icon: "#" },
            { label: "Blog covers that stop the scroll", time: "8 sec", color: "#fc5c5c", icon: "+" },
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

      {/* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Mid CTA ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */}
      <section style={{ maxWidth: 700, margin: "0 auto", padding: "110px 24px 0", position: "relative", zIndex: 1, textAlign: "center" }}>
        <div style={{ padding: "52px 48px", borderRadius: 28, background: "rgba(124,92,252,0.07)", border: "1px solid rgba(124,92,252,0.2)", backdropFilter: "blur(12px)" }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(24px,3.5vw,38px)", fontWeight: 800, letterSpacing: -1, marginBottom: 16 }}>
            You are one idea away<br />
            <span style={{ background: "linear-gradient(135deg,#a78bff,#e84fbc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>from a real visual.</span>
          </div>
          <div style={{ color: "#8885a8", marginBottom: 32, fontSize: 15, lineHeight: 1.7 }}>
            No credit card. Instant result. Then decide.
          </div>
          <button onClick={goToStudioAction} className="btn-primary" style={{ fontSize: 16, padding: "18px 40px", cursor: "pointer", fontFamily: "inherit", border: "none" }}>
            Start Creating - Free
          </button>
        </div>
      </section>

      {/* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Objections / FAQ ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */}
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "110px 24px 0", position: "relative", zIndex: 1 }}>
        <SectionHead
          label="Objections"
          title="The questions you're actually thinking"
          sub="No fluff. Straight answers. No corporate language."
        />
        <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { q: "Why is this better than Midjourney?", a: "Midjourney requires Discord, prompt engineering, and a paid plan just to start. MIDILLI works in your browser, in plain language, for free. You will get a result in 8 seconds - no setup, no queue, no learning curve." },
            { q: "Is this actually free?", a: "Yes. 20 credits, no card, no catch. You can generate 20 images before we ever ask for a dollar. Most users create something they love within the first 3." },
            { q: "What if the result is not good enough?", a: "Hit generate again. Different result, same 8 seconds, one credit. Most people find exactly what they want within 2-3 tries. And if not - your credits do not expire." },
            { q: "Do I need to know how to write prompts?", a: "No. If you can send a text message, you can use MIDILLI. 'A cozy coffee shop in autumn' works perfectly. No technical jargon needed." },
            { q: "Can I use this for business?", a: "Yes. Commercial rights are included on all paid plans. You own what you create - sell it, publish it, use it in ads. No watermarks on paid plans." },
            { q: "How is this different from Canva or Figma?", a: "Canva and Figma are editors - you still have to design. MIDILLI generates the visual from scratch. You start with a finished result, not a blank canvas." },
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

      {/* Gallery Modal */}
      {galleryModalPost && (
        <GalleryModal
          post={galleryModalPost}
          currentUsername={userName}
          onClose={() => setGalleryModalPost(null)}
          onRequireAuth={openAuthGate}
        />
      )}

      {showAuthGate && (
        <AuthGateModal
          nextPath="/"
          onClose={() => setShowAuthGate(false)}
          onSuccess={() => {
            setShowAuthGate(false);
            showToast("Signed in. You can now like and comment.");
          }}
        />
      )}

      {/* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Plans Modal ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */}
      {showPlansModal && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setShowPlansModal(false); }}
          style={{ position: "fixed", inset: 0, zIndex: 9990, background: "rgba(0,0,0,0.82)", backdropFilter: "blur(14px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px 16px", overflowY: "auto" }}
        >
          <style>{`
            @keyframes plansSlideUp {
              from { opacity: 0; transform: translateY(32px) scale(0.97); }
              to   { opacity: 1; transform: translateY(0)   scale(1);    }
            }
            @keyframes plansFadeIn { from { opacity:0; } to { opacity:1; } }
            .plans-modal-inner { animation: plansSlideUp 0.38s cubic-bezier(0.22,1,0.36,1) both; }
            .plans-backdrop    { animation: plansFadeIn  0.25s ease both; }

            .hp-plan-card {
              transition: transform 0.35s cubic-bezier(0.22,1,0.36,1),
                          border-color 0.4s ease, box-shadow 0.4s ease;
              overflow: hidden;
            }
            .hp-plan-card::before {
              content: '';
              position: absolute; inset: 0;
              border-radius: inherit;
              opacity: 0;
              pointer-events: none;
              transition: opacity 0.55s ease, transform 0.75s cubic-bezier(0.22,1,0.36,1);
              transform: translateY(55%);
            }
            .hp-plan-card:hover { transform: translateY(-3px) scale(1.012); }
            .hp-plan-card:hover::before { opacity: 1; transform: translateY(0%); }

            .hp-plan-free::before  { background: radial-gradient(ellipse 70% 45% at 50% 100%, rgba(110,110,170,0.14) 0%, transparent 70%); }
            .hp-plan-free:hover    { border-color: rgba(130,130,190,0.2) !important; box-shadow: 0 4px 20px -4px rgba(100,100,160,0.12); }

            .hp-plan-basic::before { background: radial-gradient(ellipse 70% 50% at 50% 100%, rgba(168,85,247,0.18) 0%, transparent 72%); }
            .hp-plan-basic:hover   { border-color: rgba(168,85,247,0.32) !important; box-shadow: 0 4px 24px -4px rgba(124,92,252,0.18); }

            .hp-plan-pro::before   { background: radial-gradient(ellipse 75% 55% at 50% 100%, rgba(192,100,255,0.32) 0%, rgba(168,85,247,0.10) 55%, transparent 75%); }
            .hp-plan-pro:hover     { border-color: rgba(192,132,252,0.6) !important; box-shadow: 0 20px 60px -8px rgba(108,72,252,0.35), 0 0 28px -2px rgba(168,85,247,0.35), inset 0 1px 0 rgba(255,255,255,0.10); }

            .hp-plan-ultra::before { background: radial-gradient(ellipse 68% 45% at 50% 100%, rgba(251,191,36,0.16) 0%, transparent 70%); }
            .hp-plan-ultra:hover   { border-color: rgba(251,191,36,0.28) !important; box-shadow: 0 4px 24px -4px rgba(180,130,20,0.15); }
          `}</style>

          <div className="plans-modal-inner" style={{ width: "100%", maxWidth: 1060, position: "relative" }}>
            {/* Close */}
            <button
              onClick={() => setShowPlansModal(false)}
              style={{ position: "absolute", top: -14, right: -14, zIndex: 10, width: 34, height: 34, borderRadius: "50%", background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.12)", color: "#9ca3af", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}
            >x</button>

            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#f0eeff", lineHeight: 1.1, marginBottom: 10 }}>
                One plan for every stage.
              </h2>
              <p style={{ fontSize: 15, color: "#6b6b8a" }}>Start free, no card needed. Upgrade when your work demands more.</p>
            </div>

            {/* 4 cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.08fr 1fr", gap: 12, alignItems: "end" }}>

              {/* FREE */}
              <div className="hp-plan-card hp-plan-free" style={{ padding: "28px 22px 26px", borderRadius: 18, background: "rgba(12,12,20,0.8)", border: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(12px)", display: "flex", flexDirection: "column", position: "relative" }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#3d3d55", marginBottom: 14, display: "block" }}>Free</span>
                <div style={{ display: "flex", alignItems: "baseline", gap: 2, marginBottom: 4 }}>
                  <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 38, fontWeight: 800, color: "#4a4a62", lineHeight: 1, letterSpacing: "-0.03em" }}>$0</span>
                </div>
                <p style={{ fontSize: 12, color: "#3a3a50", marginBottom: 18, marginTop: 4 }}>Try the experience.</p>
                <div style={{ width: "100%", height: 1, background: "rgba(255,255,255,0.04)", marginBottom: 18 }} />
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 auto", display: "flex", flexDirection: "column", gap: 10 }}>
                  {["10 generations to start", "2 AI models only", "Slow generation speed", "Watermarked exports", "Personal use only"].map((f) => (
                    <li key={f} style={{ display: "flex", gap: 8, fontSize: 12, color: "#4a4a62", lineHeight: 1.4 }}>
                      <span style={{ color: "#2e2e42", flexShrink: 0 }}>-</span>{f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" onClick={() => setShowPlansModal(false)} style={{ display: "block", textAlign: "center", marginTop: 22, padding: "10px", borderRadius: 9, border: "1px solid rgba(255,255,255,0.07)", background: "transparent", color: "#4a4a62", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
                  Start Free
                </Link>
              </div>

              {/* BASIC */}
              <div className="hp-plan-card hp-plan-basic" style={{ padding: "28px 22px 26px", borderRadius: 18, background: "rgba(15,15,26,0.85)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)", display: "flex", flexDirection: "column", position: "relative" }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b6b8a", marginBottom: 14, display: "block" }}>Basic</span>
                <div style={{ display: "flex", alignItems: "baseline", gap: 2, marginBottom: 4 }}>
                  <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 38, fontWeight: 800, color: "#c4b8ff", lineHeight: 1, letterSpacing: "-0.03em" }}>$9</span>
                  <span style={{ fontSize: 14, color: "#6b6b8a", fontWeight: 600 }}>.99</span>
                  <span style={{ fontSize: 12, color: "#4a4a62", marginLeft: 2 }}>/mo</span>
                </div>
                <p style={{ fontSize: 12, color: "#6b6b8a", marginBottom: 18, marginTop: 4 }}>For consistent creators.</p>
                <div style={{ width: "100%", height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 18 }} />
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 auto", display: "flex", flexDirection: "column", gap: 10 }}>
                  {["150 generations / month", "5 AI models unlocked", "Standard speed", "Watermark-free exports", "Session history", "Personal use license"].map((f) => (
                    <li key={f} style={{ display: "flex", gap: 8, fontSize: 12, color: "#9d9abf", lineHeight: 1.4 }}>
                      <span style={{ color: "#5a5a7a", flexShrink: 0 }}>-</span>{f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => { setShowPlansModal(false); showToast("Basic plan - coming soon."); }} style={{ marginTop: 22, padding: "10px", borderRadius: 9, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)", color: "#c4b8ff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  Get Basic
                </button>
              </div>

              {/* PRO */}
              <div className="hp-plan-card hp-plan-pro" style={{ padding: "36px 26px 32px", borderRadius: 20, background: "linear-gradient(155deg, rgba(118,80,255,0.2) 0%, rgba(148,70,245,0.14) 45%, rgba(220,70,175,0.09) 100%)", border: "1px solid rgba(148,85,247,0.5)", backdropFilter: "blur(20px)", display: "flex", flexDirection: "column", position: "relative", boxShadow: "0 28px 72px -8px rgba(108,72,252,0.4), inset 0 1px 0 rgba(255,255,255,0.08)" }}>
                <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", padding: "3px 12px", borderRadius: 999, background: "linear-gradient(135deg, #7c5cfc, #c026d3)", fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "white", whiteSpace: "nowrap", boxShadow: "0 4px 18px rgba(124,92,252,0.5)" }}>Best Value</div>
                <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 1, background: "linear-gradient(90deg, transparent, rgba(192,132,252,0.8), transparent)" }} />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#a78bff" }}>Pro</span>
                  <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 999, background: "rgba(124,92,252,0.18)", border: "1px solid rgba(168,85,247,0.3)", color: "#c4b8ff", fontWeight: 600 }}>Most Popular</span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 2, marginBottom: 4 }}>
                  <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 44, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.04em", background: "linear-gradient(135deg, #e0d7ff, #c084fc 60%, #f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>$19</span>
                  <span style={{ fontSize: 12, color: "#8885a8", marginLeft: 2 }}>/mo</span>
                </div>
                <p style={{ fontSize: 12, color: "#9d9abf", marginBottom: 18, marginTop: 4 }}>The complete creative setup.</p>
                <div style={{ width: "100%", height: 1, background: "linear-gradient(90deg, transparent, rgba(148,85,247,0.3), transparent)", marginBottom: 18 }} />
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 auto", display: "flex", flexDirection: "column", gap: 10 }}>
                  {[ ["600 generations / month", true], ["All 10 AI models", true], ["Image-to-video included", true], ["Priority queue - no wait", true], ["Commercial license", true], ["Private gallery", false], ["Email support", false] ].map(([f, h]) => (
                    <li key={f as string} style={{ display: "flex", gap: 8, fontSize: 12.5, color: h ? "#e0d7ff" : "#b8b0e0", lineHeight: 1.4, fontWeight: h ? 500 : 400 }}>
                      <span style={{ color: "#c084fc", flexShrink: 0 }}>*</span>{f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => { setShowPlansModal(false); showToast("Pro plan - coming soon."); }} style={{ marginTop: 24, padding: "13px", borderRadius: 11, border: "none", background: "linear-gradient(135deg, #7c3aed, #a855f7, #c026d3)", color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 28px rgba(124,92,252,0.5)" }}>
                  Get Pro
                </button>
                <p style={{ textAlign: "center", marginTop: 8, fontSize: 11, color: "#5a527a" }}>No contract - Cancel anytime</p>
              </div>

              {/* ULTRA */}
              <div className="hp-plan-card hp-plan-ultra" style={{ padding: "28px 22px 26px", borderRadius: 18, background: "linear-gradient(160deg, rgba(20,16,36,0.9), rgba(14,12,26,0.95))", border: "1px solid rgba(255,255,255,0.09)", backdropFilter: "blur(12px)", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -30, right: -30, width: 100, height: 100, borderRadius: "50%", background: "rgba(251,191,36,0.05)", pointerEvents: "none" }} />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#8b7a5a" }}>Ultra</span>
                  <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 999, background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.18)", color: "#a89060", fontWeight: 600 }}>POWER</span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 2, marginBottom: 4 }}>
                  <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 38, fontWeight: 800, color: "#d4c9a8", lineHeight: 1, letterSpacing: "-0.03em" }}>$49</span>
                  <span style={{ fontSize: 12, color: "#6b5a3a", marginLeft: 2 }}>/mo</span>
                </div>
                <p style={{ fontSize: 12, color: "#6b5a3a", marginBottom: 18, marginTop: 4 }}>For power users and teams.</p>
                <div style={{ width: "100%", height: 1, background: "rgba(251,191,36,0.08)", marginBottom: 18 }} />
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 auto", display: "flex", flexDirection: "column", gap: 10 }}>
                  {["2,000 generations / month", "Always-first queue", "4K video exports", "Full API access", "All models + early access", "Dedicated support"].map((f) => (
                    <li key={f} style={{ display: "flex", gap: 8, fontSize: 12, color: "#8b7a5a", lineHeight: 1.4 }}>
                      <span style={{ color: "#a89060", flexShrink: 0 }}>*</span>{f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => { setShowPlansModal(false); showToast("Ultra plan - coming soon."); }} style={{ marginTop: 22, padding: "10px", borderRadius: 9, border: "1px solid rgba(251,191,36,0.2)", background: "rgba(251,191,36,0.05)", color: "#a89060", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  Go Ultra
                </button>
              </div>
            </div>

            {/* Trust row */}
            <div style={{ display: "flex", justifyContent: "center", gap: 28, marginTop: 28, flexWrap: "wrap" }}>
              {["No contracts - cancel anytime", "All paid plans include commercial license", "Upgrade or downgrade instantly"].map((t) => (
                <span key={t} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "#3a3a52" }}>
                  <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#4a3a6a", display: "inline-block" }} />{t}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Credits */}
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

      {/* Final CTA */}
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
            Create Your First Image - Free
          </Link>
          <Link href="/gallery" className="btn-secondary" style={{ fontSize: 16, padding: "18px 36px" }}>
            See Real Results First {"->"}
          </Link>
        </div>
        <div style={{ marginTop: 20, color: "#8885a8", fontSize: 13 }}>
          No card. No commitment. No learning curve.
        </div>
      </section>

      {/* Footer */}
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
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 12,
          }}
        >
          {[
            { href: "/price", label: "Pricing" },
            { href: "/terms", label: "Terms" },
            { href: "/privacy", label: "Privacy" },
            { href: "/refund", label: "Refunds" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                color: "#c4b8ff",
                fontSize: 13,
                textDecoration: "none",
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
        Copyright 2026 MIDILLI. All rights reserved.
      </footer>

      {/* Toast */}
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
      <ChatWidget />
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



