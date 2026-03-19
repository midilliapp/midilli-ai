"use client";

import { useState, useRef } from "react";
import Link from "next/link";

const MODELS = [
  { id: "fal-ai/flux/schnell",    name: "Flux Schnell",  speed: "~3s",  tier: "free" },
  { id: "fal-ai/flux/dev",        name: "Flux Dev",      speed: "~8s",  tier: "free" },
  { id: "fal-ai/flux-pro/v1.1",   name: "Flux Pro",      speed: "~10s", tier: "pro"  },
  { id: "fal-ai/flux-2-pro",      name: "Flux 2 Pro",    speed: "~15s", tier: "pro"  },
  { id: "fal-ai/kolors",          name: "Kolors",        speed: "~10s", tier: "free" },
  { id: "fal-ai/aura-flow",       name: "AuraFlow",      speed: "~12s", tier: "free" },
  { id: "fal-ai/recraft-v3",      name: "Recraft v3",    speed: "~10s", tier: "pro"  },
  { id: "fal-ai/ideogram/v2",     name: "Ideogram v2",   speed: "~12s", tier: "pro"  },
  { id: "fal-ai/imagen4/preview", name: "Imagen 4",      speed: "~10s", tier: "pro"  },
  { id: "fal-ai/gpt-image-1",     name: "GPT-Image-1",   speed: "~20s", tier: "pro"  },
] as const;

type ModelId = typeof MODELS[number]["id"];

const ASPECT_RATIOS = [
  { value: "1:1",  label: "1:1",   desc: "Square",     w: 18, h: 18 },
  { value: "4:3",  label: "4:3",   desc: "Standard",   w: 24, h: 18 },
  { value: "3:4",  label: "3:4",   desc: "Portrait",   w: 18, h: 24 },
  { value: "16:9", label: "16:9",  desc: "Widescreen", w: 28, h: 16 },
  { value: "9:16", label: "9:16",  desc: "Vertical",   w: 14, h: 25 },
  { value: "21:9", label: "21:9",  desc: "Cinematic",  w: 32, h: 14 },
  { value: "2:3",  label: "2:3",   desc: "Photo",      w: 14, h: 21 },
  { value: "3:2",  label: "3:2",   desc: "Landscape",  w: 24, h: 16 },
];

const SUGGESTIONS = [
  "Cinematic mountain landscape at golden hour",
  "Cyberpunk city at night, neon rain",
  "Product photo, luxury perfume bottle",
  "YouTube thumbnail, tech video, bold",
  "A Nike-style ad with a robot",
  "Fashion editorial, minimal white background",
];

// Color themes per tab
const THEME = {
  image: {
    bg:         "#07071a",
    bgDeep:     "#04041200",
    navBg:      "rgba(7,7,26,0.95)",
    panelBg:    "#07071a",
    rightBg:    "radial-gradient(ellipse at center, rgba(124,92,252,0.07) 0%, transparent 70%)",
    border:     "rgba(255,255,255,0.06)",
    accent:     "#a855f7",
    accentRgb:  "124,92,252",
    accentGlow: "rgba(124,92,252,0.5)",
    tabActive:  "rgba(124,92,252,0.3)",
    btnGrad:    "linear-gradient(135deg, #7c3aed, #a855f7, #e84fbf)",
    btnGlow:    "rgba(124,92,252,0.5)",
    labelColor: "#8885a8",
    gridColor:  "rgba(255,255,255,0.03)",
    emptyIcon:  "✦",
    scrollThumb:"rgba(124,92,252,0.4)",
    logoGrad:   "linear-gradient(135deg, #a78bfa, #e84fbf)",
  },
  video: {
    bg:         "#020e1a",
    bgDeep:     "#020e1a",
    navBg:      "rgba(2,14,26,0.97)",
    panelBg:    "#031525",
    rightBg:    "radial-gradient(ellipse at 50% 40%, rgba(0,180,220,0.08) 0%, rgba(6,182,212,0.04) 40%, transparent 70%)",
    border:     "rgba(0,212,255,0.1)",
    accent:     "#00d4ff",
    accentRgb:  "0,212,255",
    accentGlow: "rgba(0,212,255,0.4)",
    tabActive:  "rgba(0,180,220,0.25)",
    btnGrad:    "linear-gradient(135deg, #0369a1, #0ea5e9, #00d4ff)",
    btnGlow:    "rgba(0,212,255,0.45)",
    labelColor: "#38a3c4",
    gridColor:  "rgba(0,212,255,0.04)",
    emptyIcon:  "▶",
    scrollThumb:"rgba(0,212,255,0.3)",
    logoGrad:   "linear-gradient(135deg, #38bdf8, #00d4ff)",
  },
};

export default function CreateClient() {
  const [tab, setTab] = useState<"image" | "video">("image");
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState<ModelId>("fal-ai/flux/schnell");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [loading, setLoading] = useState(false);
  const [imageResult, setImageResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [credits] = useState(20);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [motionPrompt, setMotionPrompt] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const T = THEME[tab];

  const generateImage = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setImageResult(null);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), model: selectedModel, aspect_ratio: aspectRatio }),
      });
      const data = await res.json();
      if (data.url) setImageResult(data.url);
      else setError(data.error ?? "Generation failed.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async (url: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = "midilli-generated.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, "_blank");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setUploadedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setUploadedPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setUploadedPreview(null);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: T.bg,
      color: "white",
      fontFamily: "'Inter', -apple-system, sans-serif",
      transition: "background 0.5s ease",
    }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .scrollable::-webkit-scrollbar { width: 5px; }
        .scrollable::-webkit-scrollbar-track { background: transparent; }
        .scrollable::-webkit-scrollbar-thumb { border-radius: 3px; }

        .model-chip {
          padding: 7px 14px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          color: #6b7280;
          transition: all 0.15s;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .ratio-btn {
          padding: 6px 10px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: #6b7280;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          min-width: 52px;
        }

        .generate-btn {
          width: 100%;
          padding: 16px;
          border-radius: 14px;
          border: none;
          color: white;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.02em;
          position: relative;
          overflow: hidden;
        }
        .generate-btn:hover:not(:disabled) { transform: translateY(-2px); }
        .generate-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .suggestion-pill {
          padding: 6px 14px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          color: #6b7280;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
        }

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
        @keyframes videoFloat { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
        @keyframes scanLine {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(400%); opacity: 0; }
        }
        @keyframes pulseRing {
          0% { transform: scale(0.95); opacity: 0.7; }
          50% { transform: scale(1.05); opacity: 0.3; }
          100% { transform: scale(0.95); opacity: 0.7; }
        }
        @keyframes tabSwitch {
          from { opacity: 0; transform: translateX(12px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @media (max-width: 768px) {
          .create-layout { flex-direction: column !important; }
          .left-panel { width: 100% !important; border-right: none !important; }
          .right-panel { min-height: 420px !important; }
        }
      `}</style>

      {/* ── TOP NAV ── */}
      <nav style={{
        height: 60,
        borderBottom: `1px solid ${T.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        background: T.navBg,
        backdropFilter: "blur(16px)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        transition: "background 0.5s, border-color 0.5s",
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            fontSize: 18,
            fontWeight: 900,
            letterSpacing: "-0.03em",
            background: T.logoGrad,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            transition: "all 0.5s",
          }}>MIDILLI</span>
          <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 14 }}>/</span>
          <span style={{
            color: T.accent,
            fontSize: 13,
            fontWeight: 600,
            opacity: 0.8,
            transition: "color 0.5s",
          }}>Studio</span>
        </Link>

        {/* Tab switcher */}
        <div style={{
          display: "flex",
          gap: 3,
          background: "rgba(255,255,255,0.04)",
          borderRadius: 12,
          padding: 3,
          border: `1px solid ${T.border}`,
          transition: "border-color 0.5s",
        }}>
          <button
            onClick={() => setTab("image")}
            style={{
              padding: "7px 20px",
              borderRadius: 9,
              border: "none",
              background: tab === "image" ? "rgba(124,92,252,0.3)" : "transparent",
              color: tab === "image" ? "white" : "#6b7280",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            ✦ Text to Image
          </button>
          <button
            onClick={() => setTab("video")}
            style={{
              padding: "7px 20px",
              borderRadius: 9,
              border: "none",
              background: tab === "video" ? "rgba(0,180,220,0.25)" : "transparent",
              color: tab === "video" ? "#00d4ff" : "#6b7280",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            ▶ Image to Video
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{
            color: T.accent,
            fontSize: 13,
            fontWeight: 600,
            transition: "color 0.5s",
          }}>
            {credits} credits
          </span>
          <Link href="/" style={{
            padding: "7px 16px",
            borderRadius: 999,
            border: `1px solid ${T.border}`,
            color: "#6b7280",
            fontSize: 13,
            textDecoration: "none",
            transition: "all 0.3s",
          }}>
            ← Home
          </Link>
        </div>
      </nav>

      {/* ── MAIN LAYOUT ── */}
      <div className="create-layout" style={{ display: "flex", height: "calc(100vh - 60px)" }}>

        {/* LEFT PANEL */}
        <div
          className="left-panel scrollable"
          style={{
            width: 390,
            flexShrink: 0,
            borderRight: `1px solid ${T.border}`,
            overflowY: "auto",
            padding: 24,
            display: "flex",
            flexDirection: "column",
            gap: 24,
            background: T.panelBg,
            transition: "background 0.5s, border-color 0.5s",
          }}
        >

          {tab === "image" ? (
            <div style={{ animation: "tabSwitch 0.3s ease" }}>

              {/* Prompt */}
              <div style={{ marginBottom: 22 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#8885a8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10, display: "block" }}>
                  Prompt
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey) void generateImage(); }}
                  placeholder="Describe what you want to create..."
                  rows={4}
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    padding: 14,
                    color: "white",
                    fontSize: 14,
                    resize: "none",
                    outline: "none",
                    lineHeight: 1.6,
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "rgba(124,92,252,0.5)"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                />
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                  {SUGGESTIONS.map((s) => (
                    <button key={s} className="suggestion-pill"
                      onClick={() => setPrompt(s)}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(124,92,252,0.3)"; e.currentTarget.style.color = "#c4b8ff"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#6b7280"; }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Model */}
              <div style={{ marginBottom: 22 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#8885a8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10, display: "block" }}>
                  Model
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {MODELS.map((m) => (
                    <button
                      key={m.id}
                      className={`model-chip ${selectedModel === m.id ? "active" : ""}`}
                      onClick={() => setSelectedModel(m.id)}
                      style={{
                        background: selectedModel === m.id ? "rgba(124,92,252,0.25)" : "rgba(255,255,255,0.05)",
                        borderColor: selectedModel === m.id ? "rgba(124,92,252,0.6)" : "rgba(255,255,255,0.1)",
                        color: selectedModel === m.id ? "white" : "#6b7280",
                      }}
                    >
                      {m.name}
                      <span style={{ fontSize: 10, opacity: 0.6 }}>{m.speed}</span>
                      {m.tier === "pro" && (
                        <span style={{ fontSize: 9, background: "rgba(232,79,188,0.25)", color: "#e84fbf", border: "1px solid rgba(232,79,188,0.4)", borderRadius: 4, padding: "1px 5px" }}>PRO</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Aspect Ratio */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#8885a8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10, display: "block" }}>
                  Aspect Ratio
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {ASPECT_RATIOS.map((r) => (
                    <button
                      key={r.value}
                      className="ratio-btn"
                      onClick={() => setAspectRatio(r.value)}
                      style={{
                        background: aspectRatio === r.value ? "rgba(124,92,252,0.2)" : "rgba(255,255,255,0.04)",
                        borderColor: aspectRatio === r.value ? "rgba(124,92,252,0.6)" : "rgba(255,255,255,0.1)",
                        color: aspectRatio === r.value ? "white" : "#6b7280",
                      }}
                    >
                      <div style={{
                        width: r.w, height: r.h,
                        border: `2px solid ${aspectRatio === r.value ? "#a78bfa" : "rgba(255,255,255,0.2)"}`,
                        borderRadius: 3,
                        background: aspectRatio === r.value ? "rgba(124,92,252,0.3)" : "rgba(255,255,255,0.05)",
                        transition: "all 0.15s",
                        flexShrink: 0,
                      }} />
                      <span>{r.label}</span>
                      <span style={{ fontSize: 9, opacity: 0.5, fontWeight: 400 }}>{r.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate */}
              <button
                className="generate-btn"
                onClick={() => void generateImage()}
                disabled={loading || !prompt.trim()}
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #a855f7, #e84fbf)",
                  boxShadow: loading || !prompt.trim() ? "none" : "0 4px 24px rgba(124,92,252,0.4)",
                }}
              >
                {loading ? "Generating..." : "✦ Generate Image"}
              </button>
              <div style={{ color: "#4a4a6a", fontSize: 12, textAlign: "center", marginTop: 10 }}>
                Balance: <strong style={{ color: "#38d9f5" }}>{credits}</strong> credits · ⌘+Enter to generate
              </div>
            </div>

          ) : (
            /* ── VIDEO TAB ── */
            <div style={{ animation: "tabSwitch 0.3s ease" }}>

              {/* Section header */}
              <div style={{
                marginBottom: 24,
                padding: "16px 18px",
                borderRadius: 14,
                background: "linear-gradient(135deg, rgba(0,100,150,0.3), rgba(0,180,220,0.12))",
                border: "1px solid rgba(0,212,255,0.2)",
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#00d4ff", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
                  ▶ VIDEO STUDIO
                </div>
                <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.5 }}>
                  Transform your images into cinematic video clips with AI motion.
                </div>
              </div>

              {/* Upload */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#38a3c4", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10, display: "block" }}>
                  Source Image
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: `2px dashed ${uploadedFile ? "rgba(0,212,255,0.5)" : "rgba(0,212,255,0.2)"}`,
                    borderRadius: 14,
                    padding: "32px 20px",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.25s",
                    background: uploadedFile ? "rgba(0,180,220,0.08)" : "rgba(0,212,255,0.03)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(0,212,255,0.6)"; e.currentTarget.style.background = "rgba(0,212,255,0.07)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = uploadedFile ? "rgba(0,212,255,0.5)" : "rgba(0,212,255,0.2)"; e.currentTarget.style.background = uploadedFile ? "rgba(0,180,220,0.08)" : "rgba(0,212,255,0.03)"; }}
                >
                  {uploadedFile && uploadedPreview ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={uploadedPreview} alt="preview" style={{ width: "100%", maxHeight: 140, objectFit: "cover", borderRadius: 8, marginBottom: 10 }} />
                      <div style={{ color: "#00d4ff", fontSize: 12, fontWeight: 600 }}>{uploadedFile.name}</div>
                      <div style={{ color: "#38a3c4", fontSize: 11, marginTop: 4 }}>Click to change</div>
                    </>
                  ) : (
                    <>
                      <div style={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        background: "rgba(0,212,255,0.1)",
                        border: "1px solid rgba(0,212,255,0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 12px",
                        fontSize: 20,
                      }}>
                        ↑
                      </div>
                      <div style={{ color: "white", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Upload source image</div>
                      <div style={{ color: "#38a3c4", fontSize: 12 }}>PNG, JPG, WEBP · Max 10MB</div>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </div>

              {/* Motion Prompt */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#38a3c4", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10, display: "block" }}>
                  Motion Prompt <span style={{ color: "#2a5a6a", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span>
                </label>
                <textarea
                  value={motionPrompt}
                  onChange={(e) => setMotionPrompt(e.target.value)}
                  placeholder="Camera slowly zooms in, cinematic motion, subtle parallax..."
                  rows={3}
                  style={{
                    width: "100%",
                    background: "rgba(0,212,255,0.04)",
                    border: "1px solid rgba(0,212,255,0.15)",
                    borderRadius: 12,
                    padding: 14,
                    color: "white",
                    fontSize: 14,
                    resize: "none",
                    outline: "none",
                    lineHeight: 1.6,
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "rgba(0,212,255,0.5)"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(0,212,255,0.15)"}
                />
              </div>

              {/* Motion style chips */}
              <div style={{ marginBottom: 22 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#38a3c4", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10, display: "block" }}>
                  Motion Style
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {["Slow zoom in", "Pan left", "Dolly shot", "Parallax", "Orbit", "Handheld"].map((style) => (
                    <button
                      key={style}
                      onClick={() => setMotionPrompt(style.toLowerCase() + " camera motion, cinematic")}
                      style={{
                        padding: "6px 13px",
                        borderRadius: 999,
                        border: "1px solid rgba(0,212,255,0.2)",
                        background: motionPrompt.includes(style.toLowerCase()) ? "rgba(0,212,255,0.15)" : "rgba(0,212,255,0.04)",
                        color: motionPrompt.includes(style.toLowerCase()) ? "#00d4ff" : "#38a3c4",
                        fontSize: 12,
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,212,255,0.12)"; e.currentTarget.style.color = "#00d4ff"; }}
                      onMouseLeave={(e) => {
                        const active = motionPrompt.includes(style.toLowerCase());
                        e.currentTarget.style.background = active ? "rgba(0,212,255,0.15)" : "rgba(0,212,255,0.04)";
                        e.currentTarget.style.color = active ? "#00d4ff" : "#38a3c4";
                      }}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Video Button */}
              <button
                className="generate-btn"
                disabled={!uploadedFile}
                onClick={() => alert("Video generation is coming soon! We'll notify you when it's ready.")}
                style={{
                  background: uploadedFile
                    ? "linear-gradient(135deg, #0369a1, #0ea5e9, #00d4ff)"
                    : "rgba(0,212,255,0.1)",
                  boxShadow: uploadedFile ? "0 4px 28px rgba(0,212,255,0.3)" : "none",
                  border: uploadedFile ? "none" : "1px solid rgba(0,212,255,0.2)",
                  color: uploadedFile ? "white" : "#38a3c4",
                }}
              >
                ▶ Generate Video
              </button>

              {/* Coming soon notice */}
              <div style={{
                marginTop: 14,
                padding: "14px 16px",
                borderRadius: 12,
                background: "linear-gradient(135deg, rgba(3,105,161,0.15), rgba(0,212,255,0.08))",
                border: "1px solid rgba(0,212,255,0.15)",
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
              }}>
                <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>🚀</span>
                <div>
                  <div style={{ color: "#00d4ff", fontSize: 12, fontWeight: 600, marginBottom: 3 }}>Coming Soon</div>
                  <div style={{ color: "#38a3c4", fontSize: 12, lineHeight: 1.6 }}>
                    Video generation is in development. Upload your image now and be the first to try it.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT PANEL — Output ── */}
        <div
          className="right-panel"
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: T.rightBg,
            position: "relative",
            overflow: "hidden",
            transition: "background 0.5s",
          }}
        >
          {/* Background grid */}
          <div style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(${T.gridColor} 1px, transparent 1px), linear-gradient(90deg, ${T.gridColor} 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
            pointerEvents: "none",
            transition: "background-image 0.5s",
          }} />

          {/* Video tab: animated decorative elements */}
          {tab === "video" && (
            <>
              {/* Outer glow ring */}
              <div style={{
                position: "absolute",
                width: 400,
                height: 400,
                borderRadius: "50%",
                border: "1px solid rgba(0,212,255,0.07)",
                animation: "pulseRing 4s ease-in-out infinite",
                pointerEvents: "none",
              }} />
              <div style={{
                position: "absolute",
                width: 280,
                height: 280,
                borderRadius: "50%",
                border: "1px solid rgba(0,212,255,0.1)",
                animation: "pulseRing 4s ease-in-out infinite 1s",
                pointerEvents: "none",
              }} />
              {/* Corner accents */}
              {[
                { top: 24, left: 24 },
                { top: 24, right: 24 },
                { bottom: 24, left: 24 },
                { bottom: 24, right: 24 },
              ].map((pos, i) => (
                <div key={i} style={{
                  position: "absolute",
                  ...pos,
                  width: 32,
                  height: 32,
                  border: "2px solid rgba(0,212,255,0.2)",
                  borderRadius: 4,
                  pointerEvents: "none",
                }} />
              ))}
            </>
          )}

          {/* IMAGE TAB: Loading */}
          {tab === "image" && loading && (
            <div style={{ textAlign: "center", zIndex: 1 }}>
              <div style={{
                width: 64, height: 64,
                borderRadius: "50%",
                border: "3px solid rgba(124,92,252,0.2)",
                borderTopColor: "#a855f7",
                animation: "spin 0.8s linear infinite",
                margin: "0 auto 24px",
              }} />
              <div style={{ color: "white", fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Creating your image...</div>
              <div style={{ color: "#8885a8", fontSize: 13 }}>
                {MODELS.find(m => m.id === selectedModel)?.name} · {MODELS.find(m => m.id === selectedModel)?.speed}
              </div>
            </div>
          )}

          {/* IMAGE TAB: Empty state */}
          {tab === "image" && !loading && !imageResult && !error && (
            <div style={{ textAlign: "center", zIndex: 1, padding: 40 }}>
              <div style={{ fontSize: 56, marginBottom: 16, opacity: 0.1 }}>✦</div>
              <div style={{ color: "#4a4a6a", fontSize: 15, fontWeight: 500 }}>Your creation will appear here</div>
              <div style={{ color: "#2a2a4a", fontSize: 13, marginTop: 8 }}>Write a prompt and click Generate</div>
            </div>
          )}

          {/* VIDEO TAB: Empty / preview state */}
          {tab === "video" && (
            <div style={{ textAlign: "center", zIndex: 1, padding: 40, animation: "tabSwitch 0.4s ease" }}>
              <div style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(0,212,255,0.15) 0%, rgba(0,100,150,0.08) 60%, transparent 100%)",
                border: "1px solid rgba(0,212,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
                animation: "videoFloat 4s ease-in-out infinite",
                position: "relative",
              }}>
                <span style={{ fontSize: 40, opacity: 0.6 }}>▶</span>
                {/* Scan line effect */}
                <div style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  overflow: "hidden",
                  pointerEvents: "none",
                }}>
                  <div style={{
                    width: "100%",
                    height: "2px",
                    background: "linear-gradient(90deg, transparent, rgba(0,212,255,0.6), transparent)",
                    animation: "scanLine 3s ease-in-out infinite",
                  }} />
                </div>
              </div>
              <div style={{ color: "#38a3c4", fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
                Video Studio
              </div>
              <div style={{ color: "#1a4a5a", fontSize: 13, maxWidth: 260, margin: "0 auto", lineHeight: 1.6 }}>
                Upload an image on the left to bring it to life with AI motion
              </div>
              {/* Film strip decoration */}
              <div style={{ display: "flex", gap: 4, justifyContent: "center", marginTop: 28, opacity: 0.3 }}>
                {[...Array(7)].map((_, i) => (
                  <div key={i} style={{
                    width: 28,
                    height: 20,
                    borderRadius: 3,
                    background: "rgba(0,212,255,0.15)",
                    border: "1px solid rgba(0,212,255,0.3)",
                  }} />
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {tab === "image" && error && !loading && (
            <div style={{
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.25)",
              borderRadius: 16,
              padding: "24px 32px",
              textAlign: "center",
              zIndex: 1,
              maxWidth: 400,
            }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>⚠️</div>
              <div style={{ color: "#fca5a5", fontSize: 14, lineHeight: 1.6 }}>{error}</div>
              <button
                onClick={() => void generateImage()}
                style={{ marginTop: 16, padding: "8px 20px", borderRadius: 999, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "white", fontSize: 13, cursor: "pointer" }}
              >
                Try Again
              </button>
            </div>
          )}

          {/* Image result */}
          {tab === "image" && imageResult && !loading && (
            <div style={{ zIndex: 1, animation: "fadeIn 0.4s ease", maxWidth: "90%", maxHeight: "90%" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageResult}
                alt="Generated"
                style={{
                  maxWidth: "100%",
                  maxHeight: "calc(100vh - 180px)",
                  borderRadius: 16,
                  boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
                  display: "block",
                }}
              />
              <div style={{ display: "flex", gap: 10, marginTop: 16, justifyContent: "center" }}>
                <button
                  onClick={() => void downloadImage(imageResult)}
                  style={{ padding: "10px 22px", borderRadius: 999, background: "linear-gradient(135deg, #7c3aed, #a855f7)", border: "none", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                >
                  ↓ Download
                </button>
                <button
                  onClick={() => void generateImage()}
                  style={{ padding: "10px 22px", borderRadius: 999, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#c4b8ff", fontSize: 13, cursor: "pointer" }}
                >
                  ↻ Regenerate
                </button>
                <button
                  onClick={() => { setImageResult(null); setPrompt(""); }}
                  style={{ padding: "10px 22px", borderRadius: 999, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "#6b7280", fontSize: 13, cursor: "pointer" }}
                >
                  + New
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
