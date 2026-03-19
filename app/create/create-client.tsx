"use client";

import { useState, useRef, useEffect } from "react";
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
  { value: "1:1",  label: "1:1",   w: 16, h: 16 },
  { value: "4:3",  label: "4:3",   w: 20, h: 15 },
  { value: "3:4",  label: "3:4",   w: 15, h: 20 },
  { value: "16:9", label: "16:9",  w: 22, h: 12 },
  { value: "9:16", label: "9:16",  w: 12, h: 22 },
  { value: "21:9", label: "21:9",  w: 26, h: 11 },
  { value: "2:3",  label: "2:3",   w: 13, h: 19 },
  { value: "3:2",  label: "3:2",   w: 20, h: 13 },
];

const VIDEO_MODELS = [
  { id: "kling",   name: "Kling 1.6",    badge: "TOP"  },
  { id: "runway",  name: "Runway Gen-3", badge: "PRO"  },
  { id: "luma",    name: "Luma Dream",   badge: ""     },
  { id: "animate", name: "AnimateDiff",  badge: "FREE" },
];

const DURATIONS = ["3s", "5s", "10s", "15s"];
const RESOLUTIONS = ["720p", "1080p", "4K"];

const EXAMPLE_PROMPTS = [
  "Cinematic mountain landscape at golden hour",
  "Cyberpunk city at night, neon rain",
  "Product photo, luxury perfume bottle",
  "YouTube thumbnail, tech video, bold",
  "A Nike-style ad with a robot",
  "Fashion editorial, minimal white background",
  "Futuristic spaceship interior, dramatic lighting",
  "Watercolor painting of a Japanese garden",
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

  // Video states
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [motionPrompt, setMotionPrompt] = useState("");
  const [videoDuration, setVideoDuration] = useState("5s");
  const [videoResolution, setVideoResolution] = useState("1080p");
  const [selectedVideoModel, setSelectedVideoModel] = useState("kling");

  // Popup states
  const [openPopup, setOpenPopup] = useState<"model" | "ratio" | "duration" | "resolution" | "videoModel" | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Close popup on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setOpenPopup(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const generateImage = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setImageResult(null);
    setError(null);
    setOpenPopup(null);
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
    } catch { window.open(url, "_blank"); }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setUploadedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setUploadedPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else setUploadedPreview(null);
  };

  const currentModelName = MODELS.find(m => m.id === selectedModel)?.name ?? "Model";
  const currentVideoModelName = VIDEO_MODELS.find(m => m.id === selectedVideoModel)?.name ?? "Model";

  return (
    <div style={{ height: "100vh", background: "#0a0a0f", color: "white", fontFamily: "'Inter', -apple-system, sans-serif", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        textarea:focus { outline: none; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(168,85,247,0.3); border-radius: 2px; }

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes scanLine { 0% { top: -4px; opacity: 0; } 10%,90% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
        @keyframes pulseRing { 0%,100% { transform: scale(1); opacity: 0.5; } 50% { transform: scale(1.06); opacity: 0.2; } }

        .chip-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 6px 12px; border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.06);
          color: #d1d5db; font-size: 12px; font-weight: 600;
          cursor: pointer; transition: all 0.15s; white-space: nowrap;
          font-family: inherit;
        }
        .chip-btn:hover { background: rgba(168,85,247,0.15); border-color: rgba(168,85,247,0.4); color: #e2d9ff; }
        .chip-btn.active { background: rgba(168,85,247,0.2); border-color: rgba(168,85,247,0.55); color: #e2d9ff; }

        .popup-menu {
          position: absolute; bottom: calc(100% + 10px);
          background: #16162a; border: 1px solid rgba(168,85,247,0.25);
          border-radius: 14px; padding: 8px;
          box-shadow: 0 -8px 40px rgba(0,0,0,0.6);
          animation: fadeUp 0.15s ease;
          z-index: 200; min-width: 180px;
        }

        .popup-item {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 12px; border-radius: 9px;
          cursor: pointer; transition: background 0.1s;
          font-size: 13px; color: #9ca3af; border: none;
          background: transparent; width: 100%; text-align: left;
          font-family: inherit;
        }
        .popup-item:hover { background: rgba(168,85,247,0.12); color: #e2d9ff; }
        .popup-item.selected { background: rgba(168,85,247,0.2); color: white; }

        .generate-btn-main {
          width: 42px; height: 42px; border-radius: 50%;
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          border: none; cursor: pointer; display: flex;
          align-items: center; justify-content: center;
          font-size: 20px; font-weight: 700; color: white;
          transition: all 0.2s; flex-shrink: 0;
          box-shadow: 0 4px 20px rgba(124,92,252,0.5);
        }
        .generate-btn-main:hover:not(:disabled) { transform: scale(1.08); box-shadow: 0 6px 28px rgba(124,92,252,0.7); }
        .generate-btn-main:disabled { opacity: 0.4; cursor: not-allowed; }
      `}</style>

      {/* ── TOP NAV ── */}
      <nav style={{ height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0, background: "rgba(10,10,15,0.95)", backdropFilter: "blur(12px)" }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 16, fontWeight: 900, letterSpacing: "-0.03em", color: tab === "video" ? "#38bdf8" : "#c4b8ff" }}>MIDILLI</span>
          <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}>/</span>
          <span style={{ color: tab === "video" ? "#00d4ff" : "#a78bfa", fontSize: 12, fontWeight: 600 }}>Studio</span>
        </Link>

        {/* Tab */}
        <div style={{ display: "flex", gap: 2, background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: 3 }}>
          {[
            { key: "image", label: "✦ Image" },
            { key: "video", label: "▶ Video" },
          ].map((t) => (
            <button key={t.key} onClick={() => setTab(t.key as "image" | "video")}
              style={{ padding: "6px 16px", borderRadius: 7, border: "none", background: tab === t.key ? (t.key === "video" ? "rgba(0,180,220,0.25)" : "rgba(124,92,252,0.3)") : "transparent", color: tab === t.key ? (t.key === "video" ? "#00d4ff" : "white") : "#6b7280", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
            >{t.label}</button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 12, color: tab === "video" ? "#38bdf8" : "#a78bfa", fontWeight: 600 }}>{credits} credits</span>
          <Link href="/" style={{ padding: "5px 14px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.1)", color: "#6b7280", fontSize: 12, textDecoration: "none" }}>← Home</Link>
        </div>
      </nav>

      {/* ── MAIN CANVAS ── */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>

        {/* Background grid */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: tab === "video" ? "linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)" : "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none", transition: "background-image 0.5s" }} />

        {/* Radial glow */}
        <div style={{ position: "absolute", inset: 0, background: tab === "video" ? "radial-gradient(ellipse at 50% 40%, rgba(0,180,220,0.06) 0%, transparent 65%)" : "radial-gradient(ellipse at 50% 40%, rgba(124,92,252,0.06) 0%, transparent 65%)", pointerEvents: "none", transition: "background 0.5s" }} />

        {/* IMAGE TAB content */}
        {tab === "image" && (
          <>
            {/* Loading */}
            {loading && (
              <div style={{ textAlign: "center", zIndex: 1 }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", border: "3px solid rgba(124,92,252,0.2)", borderTopColor: "#a855f7", animation: "spin 0.8s linear infinite", margin: "0 auto 20px" }} />
                <div style={{ color: "#e2d9ff", fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Creating your image...</div>
                <div style={{ color: "#6b5a8a", fontSize: 13 }}>{MODELS.find(m => m.id === selectedModel)?.name} · {MODELS.find(m => m.id === selectedModel)?.speed}</div>
              </div>
            )}

            {/* Empty state */}
            {!loading && !imageResult && !error && (
              <div style={{ textAlign: "center", zIndex: 1, userSelect: "none" }}>
                <div style={{ fontSize: 80, marginBottom: 20, opacity: 0.07, lineHeight: 1 }}>✦</div>
                <div style={{ color: "#3a3a5a", fontSize: 15, fontWeight: 500, marginBottom: 8 }}>Your creation will appear here</div>
                <div style={{ color: "#2a2a3a", fontSize: 13 }}>Type a prompt below and hit generate</div>
                {/* Example cards */}
                <div style={{ display: "flex", gap: 12, marginTop: 40, justifyContent: "center", flexWrap: "wrap", maxWidth: 700, padding: "0 20px" }}>
                  {EXAMPLE_PROMPTS.slice(0, 4).map((p) => (
                    <button key={p} onClick={() => setPrompt(p)}
                      style={{ padding: "8px 16px", borderRadius: 999, border: "1px solid rgba(124,92,252,0.2)", background: "rgba(124,92,252,0.06)", color: "#6b5a8a", fontSize: 12, cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(124,92,252,0.14)"; e.currentTarget.style.color = "#c4b8ff"; e.currentTarget.style.borderColor = "rgba(168,85,247,0.4)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(124,92,252,0.06)"; e.currentTarget.style.color = "#6b5a8a"; e.currentTarget.style.borderColor = "rgba(124,92,252,0.2)"; }}
                    >{p}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Error */}
            {error && !loading && (
              <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 16, padding: "24px 32px", textAlign: "center", zIndex: 1, maxWidth: 400 }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>⚠️</div>
                <div style={{ color: "#fca5a5", fontSize: 14, lineHeight: 1.6 }}>{error}</div>
                <button onClick={() => void generateImage()} style={{ marginTop: 14, padding: "8px 20px", borderRadius: 999, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "white", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Try Again</button>
              </div>
            )}

            {/* Result */}
            {imageResult && !loading && (
              <div style={{ zIndex: 1, animation: "fadeIn 0.4s ease", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, maxHeight: "calc(100vh - 180px)", padding: "20px 20px 0" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageResult} alt="Generated" style={{ maxWidth: "100%", maxHeight: "calc(100vh - 260px)", borderRadius: 16, boxShadow: "0 24px 80px rgba(0,0,0,0.7)", display: "block", objectFit: "contain" }} />
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => void downloadImage(imageResult)} style={{ padding: "9px 20px", borderRadius: 999, background: "linear-gradient(135deg, #7c3aed, #a855f7)", border: "none", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>↓ Download</button>
                  <button onClick={() => void generateImage()} style={{ padding: "9px 20px", borderRadius: 999, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "#c4b8ff", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>↻ Regenerate</button>
                  <button onClick={() => { setImageResult(null); setPrompt(""); setError(null); }} style={{ padding: "9px 20px", borderRadius: 999, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#6b7280", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>+ New</button>
                </div>
              </div>
            )}
          </>
        )}

        {/* VIDEO TAB content */}
        {tab === "video" && (
          <div style={{ textAlign: "center", zIndex: 1, padding: 40 }}>
            {/* Upload area */}
            {!uploadedPreview ? (
              <>
                <div style={{ width: 100, height: 100, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,212,255,0.12), transparent)", border: "1px solid rgba(0,212,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", animation: "float 4s ease-in-out infinite", cursor: "pointer", position: "relative", overflow: "hidden" }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <span style={{ fontSize: 36, opacity: 0.5 }}>▶</span>
                  <div style={{ position: "absolute", width: "100%", height: 2, background: "linear-gradient(90deg, transparent, rgba(0,212,255,0.7), transparent)", animation: "scanLine 3s ease-in-out infinite" }} />
                </div>
                <div style={{ color: "#38a3c4", fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Video Studio</div>
                <div style={{ color: "#1a4a5a", fontSize: 13, marginBottom: 24 }}>Upload an image to bring it to life with AI motion</div>
                <button onClick={() => fileInputRef.current?.click()}
                  style={{ padding: "10px 24px", borderRadius: 999, background: "rgba(0,212,255,0.12)", border: "1px solid rgba(0,212,255,0.3)", color: "#00d4ff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  ↑ Upload Image
                </button>
                <div style={{ display: "flex", gap: 8, marginTop: 28, justifyContent: "center", opacity: 0.25 }}>
                  {[...Array(7)].map((_, i) => (
                    <div key={i} style={{ width: 28, height: 20, borderRadius: 3, background: "rgba(0,212,255,0.15)", border: "1px solid rgba(0,212,255,0.3)" }} />
                  ))}
                </div>
              </>
            ) : (
              <div style={{ position: "relative", display: "inline-block" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={uploadedPreview} alt="Source" style={{ maxWidth: "min(500px, 80vw)", maxHeight: "50vh", borderRadius: 16, boxShadow: "0 24px 60px rgba(0,0,0,0.6)", border: "1px solid rgba(0,212,255,0.2)" }} />
                <button onClick={() => { setUploadedFile(null); setUploadedPreview(null); }} style={{ position: "absolute", top: 10, right: 10, width: 28, height: 28, borderRadius: "50%", background: "rgba(0,0,0,0.7)", border: "1px solid rgba(255,255,255,0.2)", color: "white", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>×</button>
                <div style={{ marginTop: 16, color: "#38a3c4", fontSize: 13 }}>Ready to animate · Add a motion prompt below</div>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
          </div>
        )}
      </div>

      {/* ── BOTTOM BAR ── */}
      <div ref={popupRef} style={{ flexShrink: 0, padding: "12px 20px 16px", background: "rgba(10,10,15,0.98)", borderTop: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(20px)", position: "relative" }}>

        {/* Popups */}
        {openPopup === "model" && (
          <div className="popup-menu" style={{ left: 0, width: 260 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#6b5a8a", letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 12px 8px" }}>Select Model</div>
            {MODELS.map((m) => (
              <button key={m.id} className={`popup-item ${selectedModel === m.id ? "selected" : ""}`}
                onClick={() => { setSelectedModel(m.id); setOpenPopup(null); }}
              >
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: selectedModel === m.id ? "#a855f7" : "rgba(255,255,255,0.15)", boxShadow: selectedModel === m.id ? "0 0 8px rgba(168,85,247,0.8)" : "none", flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{m.name}</span>
                <span style={{ fontSize: 11, color: "#3a3a5a" }}>{m.speed}</span>
                {m.tier === "pro" && <span style={{ fontSize: 9, padding: "2px 5px", borderRadius: 4, background: "rgba(232,79,188,0.15)", color: "#f472b6", border: "1px solid rgba(232,79,188,0.3)" }}>PRO</span>}
              </button>
            ))}
          </div>
        )}

        {openPopup === "ratio" && (
          <div className="popup-menu" style={{ left: 0, width: 300 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#6b5a8a", letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 12px 8px" }}>Aspect Ratio</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, padding: "4px" }}>
              {ASPECT_RATIOS.map((r) => {
                const active = aspectRatio === r.value;
                return (
                  <button key={r.value} onClick={() => { setAspectRatio(r.value); setOpenPopup(null); }}
                    style={{ padding: "10px 4px 8px", borderRadius: 9, border: `1px solid ${active ? "rgba(168,85,247,0.55)" : "rgba(255,255,255,0.07)"}`, background: active ? "rgba(124,92,252,0.2)" : "rgba(255,255,255,0.03)", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, transition: "all 0.15s", fontFamily: "inherit" }}
                    onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = "rgba(124,92,252,0.08)"; e.currentTarget.style.borderColor = "rgba(168,85,247,0.3)"; } }}
                    onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; } }}
                  >
                    <div style={{ width: r.w, height: r.h, border: `1.5px solid ${active ? "#c084fc" : "rgba(255,255,255,0.2)"}`, borderRadius: 2, background: active ? "rgba(124,92,252,0.4)" : "rgba(255,255,255,0.05)", flexShrink: 0 }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: active ? "#f0ecff" : "#6b7280" }}>{r.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {openPopup === "videoModel" && (
          <div className="popup-menu" style={{ left: 0, width: 220 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#1a4a5a", letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 12px 8px" }}>Video Model</div>
            {VIDEO_MODELS.map((m) => (
              <button key={m.id} className={`popup-item ${selectedVideoModel === m.id ? "selected" : ""}`}
                style={{ color: selectedVideoModel === m.id ? "#00d4ff" : "#38a3c4" }}
                onClick={() => { setSelectedVideoModel(m.id); setOpenPopup(null); }}
              >
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: selectedVideoModel === m.id ? "#00d4ff" : "rgba(0,212,255,0.2)", boxShadow: selectedVideoModel === m.id ? "0 0 8px rgba(0,212,255,0.8)" : "none", flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{m.name}</span>
                {m.badge && <span style={{ fontSize: 9, padding: "2px 5px", borderRadius: 4, background: m.badge === "FREE" ? "rgba(34,197,94,0.15)" : m.badge === "TOP" ? "rgba(251,191,36,0.15)" : "rgba(232,79,188,0.15)", color: m.badge === "FREE" ? "#4ade80" : m.badge === "TOP" ? "#fbbf24" : "#f472b6", border: `1px solid ${m.badge === "FREE" ? "rgba(34,197,94,0.3)" : m.badge === "TOP" ? "rgba(251,191,36,0.3)" : "rgba(232,79,188,0.3)"}` }}>{m.badge}</span>}
              </button>
            ))}
          </div>
        )}

        {openPopup === "duration" && (
          <div className="popup-menu" style={{ left: 200, width: 180 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#1a4a5a", letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 12px 8px" }}>Duration</div>
            {DURATIONS.map((d) => (
              <button key={d} className={`popup-item ${videoDuration === d ? "selected" : ""}`}
                style={{ color: videoDuration === d ? "#00d4ff" : "#38a3c4" }}
                onClick={() => { setVideoDuration(d); setOpenPopup(null); }}
              >
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: videoDuration === d ? "#00d4ff" : "rgba(0,212,255,0.2)", flexShrink: 0 }} />
                {d} seconds
              </button>
            ))}
          </div>
        )}

        {openPopup === "resolution" && (
          <div className="popup-menu" style={{ left: 330, width: 160 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#1a4a5a", letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 12px 8px" }}>Resolution</div>
            {RESOLUTIONS.map((r) => (
              <button key={r} className={`popup-item ${videoResolution === r ? "selected" : ""}`}
                style={{ color: videoResolution === r ? "#00d4ff" : "#38a3c4" }}
                onClick={() => { setVideoResolution(r); setOpenPopup(null); }}
              >
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: videoResolution === r ? "#00d4ff" : "rgba(0,212,255,0.2)", flexShrink: 0 }} />
                {r}
              </button>
            ))}
          </div>
        )}

        {/* Input row */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "10px 12px 10px 16px", marginBottom: 10 }}>
          <textarea
            value={tab === "image" ? prompt : motionPrompt}
            onChange={(e) => tab === "image" ? setPrompt(e.target.value) : setMotionPrompt(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && tab === "image") { e.preventDefault(); void generateImage(); } }}
            placeholder={tab === "image" ? "Describe an image and press Enter..." : "Describe the motion (optional)..."}
            rows={1}
            style={{ flex: 1, background: "transparent", border: "none", color: "#f0ecff", fontSize: 14, resize: "none", outline: "none", lineHeight: 1.5, fontFamily: "inherit", padding: 0 }}
          />
          <button
            className="generate-btn-main"
            onClick={() => tab === "image" ? void generateImage() : alert("Video coming soon!")}
            disabled={loading || (tab === "image" && !prompt.trim())}
            style={{ background: tab === "video" ? "linear-gradient(135deg, #0369a1, #0ea5e9)" : undefined, boxShadow: tab === "video" ? "0 4px 20px rgba(0,180,220,0.5)" : undefined }}
          >
            {loading ? <span style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "white", display: "inline-block", animation: "spin 0.7s linear infinite" }} /> : "+"}
          </button>
        </div>

        {/* Chip bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          {tab === "image" ? (
            <>
              <button className={`chip-btn ${openPopup === "model" ? "active" : ""}`} onClick={() => setOpenPopup(openPopup === "model" ? null : "model")}>
                <span style={{ fontSize: 11 }}>⚡</span> {currentModelName} <span style={{ opacity: 0.5, fontSize: 10 }}>▾</span>
              </button>
              <button className={`chip-btn ${openPopup === "ratio" ? "active" : ""}`} onClick={() => setOpenPopup(openPopup === "ratio" ? null : "ratio")}>
                <span style={{ fontSize: 11 }}>⊞</span> {aspectRatio} <span style={{ opacity: 0.5, fontSize: 10 }}>▾</span>
              </button>
              <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.1)", margin: "0 2px" }} />
              <button className="chip-btn" onClick={() => { const r = EXAMPLE_PROMPTS[Math.floor(Math.random() * EXAMPLE_PROMPTS.length)]; setPrompt(r); }}>
                🎲 Random
              </button>
              <button className="chip-btn" onClick={() => { setPrompt(""); setImageResult(null); setError(null); }}>
                🗑 Clear
              </button>
            </>
          ) : (
            <>
              <button className={`chip-btn ${openPopup === "videoModel" ? "active" : ""}`} style={{ borderColor: "rgba(0,212,255,0.25)", color: "#38a3c4" }} onClick={() => setOpenPopup(openPopup === "videoModel" ? null : "videoModel")}>
                <span style={{ fontSize: 11 }}>🎬</span> {currentVideoModelName} <span style={{ opacity: 0.5, fontSize: 10 }}>▾</span>
              </button>
              <button className={`chip-btn ${openPopup === "duration" ? "active" : ""}`} style={{ borderColor: "rgba(0,212,255,0.25)", color: "#38a3c4" }} onClick={() => setOpenPopup(openPopup === "duration" ? null : "duration")}>
                <span style={{ fontSize: 11 }}>⏱</span> {videoDuration} <span style={{ opacity: 0.5, fontSize: 10 }}>▾</span>
              </button>
              <button className={`chip-btn ${openPopup === "resolution" ? "active" : ""}`} style={{ borderColor: "rgba(0,212,255,0.25)", color: "#38a3c4" }} onClick={() => setOpenPopup(openPopup === "resolution" ? null : "resolution")}>
                <span style={{ fontSize: 11 }}>📺</span> {videoResolution} <span style={{ opacity: 0.5, fontSize: 10 }}>▾</span>
              </button>
              <div style={{ width: 1, height: 18, background: "rgba(0,212,255,0.15)", margin: "0 2px" }} />
              {!uploadedFile && (
                <button className="chip-btn" style={{ borderColor: "rgba(0,212,255,0.3)", color: "#38a3c4" }} onClick={() => fileInputRef.current?.click()}>
                  ↑ Upload Image
                </button>
              )}
            </>
          )}

          <span style={{ marginLeft: "auto", fontSize: 11, color: "#2a2a3a" }}>Enter ↵ to generate</span>
        </div>
      </div>
    </div>
  );
}
