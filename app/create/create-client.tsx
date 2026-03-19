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
  { value: "1:1",  label: "1:1",  icon: "■" },
  { value: "16:9", label: "16:9", icon: "▬" },
  { value: "9:16", label: "9:16", icon: "▮" },
];

const SUGGESTIONS = [
  "Cinematic mountain landscape at golden hour",
  "Cyberpunk city at night, neon rain",
  "Product photo, luxury perfume bottle",
  "YouTube thumbnail, tech video, bold",
  "A Nike-style ad with a robot",
  "Fashion editorial, minimal white background",
];

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
  const [motionPrompt, setMotionPrompt] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      if (data.url) {
        setImageResult(data.url);
      } else {
        setError(data.error ?? "Generation failed.");
      }
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

  return (
    <div style={{
      minHeight: "100vh",
      background: "#07071a",
      color: "white",
      fontFamily: "'Inter', -apple-system, sans-serif",
    }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(124,92,252,0.4); border-radius: 3px; }

        .model-chip {
          padding: 7px 14px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          color: #8885a8;
          transition: all 0.15s;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .model-chip:hover { background: rgba(124,92,252,0.2); border-color: rgba(124,92,252,0.4); color: white; }
        .model-chip.active { background: rgba(124,92,252,0.25); border-color: rgba(124,92,252,0.6); color: white; }

        .ratio-btn {
          padding: 8px 16px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: #8885a8;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
        }
        .ratio-btn:hover { background: rgba(124,92,252,0.15); border-color: rgba(124,92,252,0.4); color: white; }
        .ratio-btn.active { background: rgba(124,92,252,0.2); border-color: rgba(124,92,252,0.6); color: white; }

        .generate-btn {
          width: 100%;
          padding: 16px;
          border-radius: 14px;
          border: none;
          background: linear-gradient(135deg, #7c3aed, #a855f7, #e84fbf);
          color: white;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.02em;
        }
        .generate-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(124,92,252,0.5); }
        .generate-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .suggestion-pill {
          padding: 6px 14px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: #8885a8;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .suggestion-pill:hover { background: rgba(124,92,252,0.15); border-color: rgba(124,92,252,0.3); color: #c4b8ff; }

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }

        @media (max-width: 768px) {
          .create-layout { flex-direction: column !important; }
          .left-panel { width: 100% !important; border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.06) !important; }
          .right-panel { min-height: 400px !important; }
        }
      `}</style>

      {/* Top Nav */}
      <nav style={{
        height: "60px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        background: "rgba(7,7,26,0.95)",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            fontSize: "18px",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            background: "linear-gradient(135deg, #a78bfa, #e84fbf)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>MIDILLI</span>
          <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 14 }}>/</span>
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>Studio</span>
        </Link>

        {/* Tab switcher */}
        <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "4px" }}>
          {[
            { key: "image", label: "✦ Text to Image" },
            { key: "video", label: "▶ Image to Video" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as "image" | "video")}
              style={{
                padding: "7px 18px",
                borderRadius: 9,
                border: "none",
                background: tab === t.key ? "rgba(124,92,252,0.3)" : "transparent",
                color: tab === t.key ? "white" : "#8885a8",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: "#38d9f5", fontSize: 13, fontWeight: 600 }}>
            {credits} credits
          </span>
          <Link href="/" style={{
            padding: "7px 16px",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#8885a8",
            fontSize: 13,
            textDecoration: "none",
            transition: "all 0.15s",
          }}>
            ← Home
          </Link>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="create-layout" style={{ display: "flex", height: "calc(100vh - 60px)" }}>

        {/* LEFT PANEL — Controls */}
        <div className="left-panel" style={{
          width: "380px",
          flexShrink: 0,
          borderRight: "1px solid rgba(255,255,255,0.06)",
          overflowY: "auto",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}>

          {tab === "image" ? (
            <>
              {/* Prompt */}
              <div>
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
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    padding: "14px",
                    color: "white",
                    fontSize: "14px",
                    resize: "none",
                    outline: "none",
                    lineHeight: 1.6,
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "rgba(124,92,252,0.5)"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                />
                {/* Suggestions */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                  {SUGGESTIONS.map((s) => (
                    <button key={s} className="suggestion-pill" onClick={() => setPrompt(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Model */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#8885a8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10, display: "block" }}>
                  Model
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {MODELS.map((m) => (
                    <button
                      key={m.id}
                      className={`model-chip ${selectedModel === m.id ? "active" : ""}`}
                      onClick={() => setSelectedModel(m.id)}
                    >
                      {m.name}
                      <span style={{ fontSize: 10, opacity: 0.6 }}>{m.speed}</span>
                      {m.tier === "pro" && (
                        <span style={{ fontSize: 9, background: "rgba(232,79,188,0.3)", color: "#e84fbf", border: "1px solid rgba(232,79,188,0.4)", borderRadius: 4, padding: "1px 5px" }}>PRO</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Aspect Ratio */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#8885a8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10, display: "block" }}>
                  Aspect Ratio
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  {ASPECT_RATIOS.map((r) => (
                    <button
                      key={r.value}
                      className={`ratio-btn ${aspectRatio === r.value ? "active" : ""}`}
                      onClick={() => setAspectRatio(r.value)}
                    >
                      <span style={{ fontSize: 18 }}>{r.icon}</span>
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                className="generate-btn"
                onClick={() => void generateImage()}
                disabled={loading || !prompt.trim()}
              >
                {loading ? "Generating..." : "✦ Generate Image"}
              </button>

              <div style={{ color: "#8885a8", fontSize: 12, textAlign: "center" }}>
                Balance: <strong style={{ color: "#38d9f5" }}>{credits}</strong> credits · ⌘+Enter to generate
              </div>
            </>
          ) : (
            /* VIDEO TAB */
            <>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#8885a8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10, display: "block" }}>
                  Source Image
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: "2px dashed rgba(255,255,255,0.12)",
                    borderRadius: 14,
                    padding: "40px 20px",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    background: uploadedFile ? "rgba(124,92,252,0.08)" : "rgba(255,255,255,0.02)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(124,92,252,0.4)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
                >
                  {uploadedFile ? (
                    <>
                      <div style={{ fontSize: 28, marginBottom: 8 }}>✅</div>
                      <div style={{ color: "#a78bfa", fontSize: 13, fontWeight: 600 }}>{uploadedFile.name}</div>
                      <div style={{ color: "#8885a8", fontSize: 11, marginTop: 4 }}>Click to change</div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: 36, marginBottom: 10, opacity: 0.4 }}>↑</div>
                      <div style={{ color: "white", fontSize: 14, fontWeight: 600 }}>Upload source image</div>
                      <div style={{ color: "#8885a8", fontSize: 12, marginTop: 4 }}>PNG, JPG, WEBP</div>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => setUploadedFile(e.target.files?.[0] ?? null)}
                />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#8885a8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10, display: "block" }}>
                  Motion Prompt (optional)
                </label>
                <textarea
                  value={motionPrompt}
                  onChange={(e) => setMotionPrompt(e.target.value)}
                  placeholder="Camera slowly zooms in, cinematic motion..."
                  rows={3}
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    padding: 14,
                    color: "white",
                    fontSize: 14,
                    resize: "none",
                    outline: "none",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "rgba(56,217,245,0.5)"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                />
              </div>

              <button
                className="generate-btn"
                style={{ background: "linear-gradient(135deg, #0d4a7a, #38d9f5)" }}
                disabled={!uploadedFile}
                onClick={() => alert("Video generation coming soon!")}
              >
                ▶ Generate Video
              </button>

              <div style={{
                background: "rgba(56,217,245,0.06)",
                border: "1px solid rgba(56,217,245,0.15)",
                borderRadius: 12,
                padding: "14px 16px",
                fontSize: 12,
                color: "#38d9f5",
                lineHeight: 1.6,
              }}>
                🚀 Video generation is coming soon. Upload your image and we'll notify you when it's ready.
              </div>
            </>
          )}
        </div>

        {/* RIGHT PANEL — Output */}
        <div className="right-panel" style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(ellipse at center, rgba(124,92,252,0.05) 0%, transparent 70%)",
          position: "relative",
          overflow: "hidden",
        }}>

          {/* Background grid */}
          <div style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            pointerEvents: "none",
          }} />

          {loading && (
            <div style={{ textAlign: "center", zIndex: 1 }}>
              <div style={{
                width: 64,
                height: 64,
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

          {!loading && !imageResult && !error && (
            <div style={{ textAlign: "center", zIndex: 1, padding: 40 }}>
              <div style={{ fontSize: 64, marginBottom: 16, opacity: 0.15 }}>✦</div>
              <div style={{ color: "#8885a8", fontSize: 16, fontWeight: 500 }}>
                Your creation will appear here
              </div>
              <div style={{ color: "#4a4a6a", fontSize: 13, marginTop: 8 }}>
                Write a prompt and click Generate
              </div>
            </div>
          )}

          {error && !loading && (
            <div style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
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
                style={{ marginTop: 16, padding: "8px 20px", borderRadius: 999, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "white", fontSize: 13, cursor: "pointer" }}
              >
                Try Again
              </button>
            </div>
          )}

          {imageResult && !loading && (
            <div style={{ zIndex: 1, animation: "fadeIn 0.4s ease", maxWidth: "90%", maxHeight: "90%" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageResult}
                alt="Generated"
                style={{
                  maxWidth: "100%",
                  maxHeight: "calc(100vh - 160px)",
                  borderRadius: 16,
                  boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
                  display: "block",
                }}
              />
              <div style={{ display: "flex", gap: 10, marginTop: 16, justifyContent: "center" }}>
                <button
                  onClick={() => void downloadImage(imageResult)}
                  style={{
                    padding: "10px 22px",
                    borderRadius: 999,
                    background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                    border: "none",
                    color: "white",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  ↓ Download
                </button>
                <button
                  onClick={() => void generateImage()}
                  style={{
                    padding: "10px 22px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "#c4b8ff",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  ↻ Regenerate
                </button>
                <button
                  onClick={() => { setImageResult(null); setPrompt(""); }}
                  style={{
                    padding: "10px 22px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#8885a8",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
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
