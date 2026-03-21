"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import AuthGateModal from "@/app/components/AuthGateModal";
import UpgradeModal from "@/app/components/UpgradeModal";

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
  { id: "kling",     name: "Kling 1.6",       badge: "TOP"  },
  { id: "kling_pro", name: "Kling 1.6 Pro",   badge: "PRO"  },
  { id: "luma",      name: "Luma Dream",       badge: ""     },
  { id: "minimax",   name: "MiniMax Video",    badge: "NEW"  },
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

type Session = {
  id: string;
  title: string;
  imageUrl: string;
  prompt: string;
  model: string;
  createdAt: number;
};

export default function CreateClient() {
  const [tab, setTab] = useState<"image" | "video">("image");
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState<ModelId>("fal-ai/flux/schnell");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [loading, setLoading] = useState(false);
  const [imageResult, setImageResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [showAuthGate, setShowAuthGate] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  // Video states
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [motionPrompt, setMotionPrompt] = useState("");
  const [videoDuration, setVideoDuration] = useState("5s");
  const [videoResolution, setVideoResolution] = useState("1080p");
  const [selectedVideoModel, setSelectedVideoModel] = useState("kling");
  const [videoResult, setVideoResult] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);

  // Share states
  const [shareLoading, setShareLoading] = useState(false);
  const [usernameModal, setUsernameModal] = useState<{ cb: (name: string) => void } | null>(null);
  const [usernameInput, setUsernameInput] = useState("");

  // Popup states
  const [openPopup, setOpenPopup] = useState<"model" | "ratio" | "duration" | "resolution" | "videoModel" | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [notifPerm, setNotifPerm] = useState<NotificationPermission>("default");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Notifications
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotifPerm(Notification.permission);
    }
  }, []);

  const requestNotifPermission = async () => {
    if (!("Notification" in window)) { showToast("Your browser doesn't support notifications."); return; }
    const perm = await Notification.requestPermission();
    setNotifPerm(perm);
    if (perm === "granted") showToast("Notifications enabled!");
    else if (perm === "denied") showToast("Notifications blocked. Enable in browser settings.");
  };

  const sendNotif = (title: string, body: string, icon?: string) => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission !== "granted") return;
    try {
      const n = new Notification(title, {
        body,
        icon: icon ?? "/favicon.ico",
        badge: "/favicon.ico",
        tag: "midilli-studio",
        requireInteraction: false,
      });
      n.onclick = () => { window.focus(); n.close(); };
      setTimeout(() => n.close(), 6000);
    } catch {}
  };

  // Sessions
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const [curtainDone, setCurtainDone] = useState(false);
  const [tabFlash, setTabFlash] = useState<"image" | "video" | null>(null);

  const switchTab = (newTab: "image" | "video") => {
    if (newTab === tab) return;
    setTabFlash(newTab);
    setTimeout(() => { setTab(newTab); setOpenPopup(null); }, 260);
    setTimeout(() => setTabFlash(null), 620);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Entry curtain: slide away after mount
  useEffect(() => {
    const t = setTimeout(() => setCurtainDone(true), 700);
    return () => clearTimeout(t);
  }, []);

  // Load session + credits
  useEffect(() => {
    const loadSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { setUserId(null); setCredits(null); return; }
      setUserId(session.user.id);
      // Fetch credits
      const { data } = await supabase
        .from("user_credits")
        .select("credits")
        .eq("user_id", session.user.id)
        .single();
      setCredits(data?.credits ?? 0);
    };
    void loadSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session?.user) { setUserId(null); setCredits(null); return; }
      setUserId(session.user.id);
      supabase.from("user_credits").select("credits").eq("user_id", session.user.id).single()
        .then(({ data }) => setCredits(data?.credits ?? 0));
    });
    return () => subscription.unsubscribe();
  }, []);

  // Load sessions from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("midilli_sessions");
      if (saved) setSessions(JSON.parse(saved) as Session[]);
    } catch {}
  }, []);

  const saveSessions = (updated: Session[]) => {
    setSessions(updated);
    try { localStorage.setItem("midilli_sessions", JSON.stringify(updated)); } catch {}
  };

  const newSession = () => {
    setPrompt("");
    setImageResult(null);
    setError(null);
    setActiveSessionId(null);
  };

  const loadSession = (s: Session) => {
    setPrompt(s.prompt);
    setImageResult(s.imageUrl);
    setError(null);
    setActiveSessionId(s.id);
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = sessions.filter(s => s.id !== id);
    saveSessions(updated);
    if (activeSessionId === id) newSession();
  };

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
    if (!userId) { setShowAuthGate(true); return; }
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
      if (data.url) {
        setImageResult(data.url);
        sendNotif("Image Ready", `"${prompt.trim().slice(0, 60)}" generated successfully.`);
        // Save session
        const session: Session = {
          id: Date.now().toString(),
          title: prompt.trim().slice(0, 40),
          imageUrl: data.url,
          prompt: prompt.trim(),
          model: selectedModel,
          createdAt: Date.now(),
        };
        const updated = [session, ...sessions].slice(0, 30);
        saveSessions(updated);
        setActiveSessionId(session.id);
      } else {
        setError(data.error ?? "Generation failed.");
        sendNotif("Generation Failed", data.error ?? "Image generation failed. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generateVideo = async () => {
    if (!userId) { setShowAuthGate(true); return; }
    if (!uploadedFile) { showToast("Please upload an image first."); return; }
    setVideoLoading(true);
    setVideoResult(null);
    setVideoError(null);
    setOpenPopup(null);
    try {
      const form = new FormData();
      form.append("image", uploadedFile);
      form.append("prompt", motionPrompt.trim());
      form.append("model", selectedVideoModel);
      form.append("duration", videoDuration.replace("s", ""));

      const res = await fetch("/api/generate-video", { method: "POST", body: form });
      const data = await res.json();

      if (data.url) {
        setVideoResult(data.url);
        const modelName = VIDEO_MODELS.find(m => m.id === selectedVideoModel)?.name ?? "Video";
        sendNotif("Video Ready", `Your ${modelName} video has been generated. Click to view.`);
      } else {
        setVideoError(data.error ?? "Video generation failed.");
        sendNotif("Video Failed", data.error ?? "Video generation failed. Please try again.");
      }
    } catch {
      setVideoError("Network error. Please try again.");
      sendNotif("Video Failed", "Network error during video generation.");
    } finally {
      setVideoLoading(false);
    }
  };

  const downloadVideo = async (url: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = "midilli-video.mp4";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch { window.open(url, "_blank"); }
  };

  const getOrAskUsername = (cb: (name: string) => void) => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("midilli_username") : null;
    if (stored) { cb(stored); return; }
    setUsernameInput("");
    setUsernameModal({ cb });
  };

  const confirmUsername = () => {
    const name = usernameInput.trim();
    if (!name) return;
    localStorage.setItem("midilli_username", name);
    const cb = usernameModal?.cb;
    setUsernameModal(null);
    if (cb) cb(name);
  };

  const shareImage = async (url: string) => {
    getOrAskUsername(async (username) => {
      setShareLoading(true);
      try {
        const res = await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image_url: url, prompt: prompt.trim(), username, model: selectedModel }),
        });
        const data = await res.json();
        if (data.post) showToast("Shared to community gallery!");
        else showToast(data.error ?? "Share failed.");
      } catch { showToast("Network error."); }
      finally { setShareLoading(false); }
    });
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

        @keyframes studioRevealCurtain {
          0%   { transform: translateY(0%); opacity: 1; }
          100% { transform: translateY(-100%); opacity: 1; }
        }
        @keyframes studioEnterNav {
          0%   { opacity: 0; transform: translateY(-12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes studioEnterBody {
          0%   { opacity: 0; transform: translateY(18px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes studioEnterBar {
          0%   { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .studio-nav-enter  { animation: studioEnterNav  0.5s cubic-bezier(0.22,1,0.36,1) 0.15s both; }
        .studio-body-enter { animation: studioEnterBody 0.6s cubic-bezier(0.22,1,0.36,1) 0.25s both; }
        .studio-bar-enter  { animation: studioEnterBar  0.5s cubic-bezier(0.22,1,0.36,1) 0.35s both; }

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

        @keyframes tabSweep {
          0%   { transform: translateX(-105%); }
          100% { transform: translateX(105%); }
        }
        @keyframes tabFlashBg {
          0%   { opacity: 0; }
          25%  { opacity: 1; }
          75%  { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes tabContentIn {
          0%   { opacity: 0; transform: scale(0.98) translateY(8px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .tab-content-enter { animation: tabContentIn 0.38s cubic-bezier(0.22,1,0.36,1) both; }

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

      {/* Entry curtain */}
      {!curtainDone && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9998,
          background: "#06060f",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          animation: "studioRevealCurtain 0.6s cubic-bezier(0.76, 0, 0.24, 1) 0.55s both",
          pointerEvents: "none",
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 34, fontWeight: 900, letterSpacing: "-0.04em", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <span style={{ background: "linear-gradient(135deg, #c4b8ff, #a78bff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>MIDILLI</span>
              <span style={{ color: "rgba(255,255,255,0.15)", fontWeight: 300, fontSize: 28 }}>/</span>
              <span style={{ color: "#a78bfa", fontSize: 20, fontWeight: 600 }}>Studio</span>
            </div>
            <div style={{ marginTop: 6, height: 1, background: "linear-gradient(90deg, transparent, rgba(167,139,250,0.4), transparent)" }} />
          </div>
        </div>
      )}

      {/* Top nav */}
      <nav className="studio-nav-enter" style={{ height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0, background: "rgba(10,10,15,0.95)", backdropFilter: "blur(12px)" }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 16, fontWeight: 900, letterSpacing: "-0.03em", color: tab === "video" ? "#38bdf8" : "#c4b8ff" }}>MIDILLI</span>
          <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}>/</span>
          <span style={{ color: tab === "video" ? "#00d4ff" : "#a78bfa", fontSize: 12, fontWeight: 600 }}>Studio</span>
        </Link>

        {/* Tab */}
        <div style={{ display: "flex", gap: 2, background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: 3 }}>
          {[
            { key: "image", label: "Image" },
            { key: "video", label: "Video" },
          ].map((t) => (
            <button key={t.key} onClick={() => switchTab(t.key as "image" | "video")}
              style={{ padding: "6px 16px", borderRadius: 7, border: "none", background: tab === t.key ? (t.key === "video" ? "rgba(0,180,220,0.25)" : "rgba(124,92,252,0.3)") : "transparent", color: tab === t.key ? (t.key === "video" ? "#00d4ff" : "white") : "#6b7280", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit" }}
            >{t.label}</button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {userId ? (
            <button
              onClick={() => setShowUpgrade(true)}
              title="Upgrade or buy credits"
              style={{ fontSize: 12, padding: "5px 12px", borderRadius: 999, border: `1px solid ${tab === "video" ? "rgba(0,212,255,0.25)" : "rgba(168,85,247,0.3)"}`, background: tab === "video" ? "rgba(0,212,255,0.08)" : "rgba(124,92,252,0.1)", color: tab === "video" ? "#38bdf8" : "#a78bfa", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, transition: "all 0.15s", display: "flex", alignItems: "center", gap: 5 }}
              onMouseEnter={(e) => { e.currentTarget.style.background = tab === "video" ? "rgba(0,212,255,0.15)" : "rgba(124,92,252,0.2)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = tab === "video" ? "rgba(0,212,255,0.08)" : "rgba(124,92,252,0.1)"; }}
            >
              Credits: {credits === null ? "..." : credits}
            </button>
          ) : (
            <button
              onClick={() => setShowAuthGate(true)}
              style={{ fontSize: 12, padding: "5px 12px", borderRadius: 999, border: "1px solid rgba(168,85,247,0.4)", background: "rgba(124,92,252,0.12)", color: "#c4b8ff", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}
            >Sign in</button>
          )}

          {/* Notification bell */}
          <button
            onClick={() => notifPerm === "granted" ? showToast("Notifications already enabled!") : void requestNotifPermission()}
            title={notifPerm === "granted" ? "Notifications enabled" : notifPerm === "denied" ? "Notifications blocked - enable in browser settings" : "Enable notifications"}
            style={{
              width: 32, height: 32, borderRadius: "50%", border: "none", cursor: "pointer",
              background: notifPerm === "granted" ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.06)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 15, transition: "all 0.2s", position: "relative",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = notifPerm === "granted" ? "rgba(34,197,94,0.25)" : "rgba(255,255,255,0.12)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = notifPerm === "granted" ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.06)"; }}
          >
            {notifPerm === "granted" ? "On" : notifPerm === "denied" ? "Off" : "Bell"}
            {/* green dot if granted */}
            {notifPerm === "granted" && (
              <span style={{ position: "absolute", top: 4, right: 4, width: 7, height: 7, borderRadius: "50%", background: "#4ade80", border: "1.5px solid #0a0a0f", boxShadow: "0 0 6px rgba(74,222,128,0.8)" }} />
            )}
          </button>

          <Link href="/" style={{ padding: "5px 14px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.1)", color: "#6b7280", fontSize: 12, textDecoration: "none" }}>&lt;- Home</Link>
        </div>
      </nav>

      {/* Body */}
      <div className="studio-body-enter" style={{ flex: 1, display: "flex", overflow: "hidden" }}>

      {/* Sessions sidebar */}
      <div style={{ width: 200, flexShrink: 0, background: "#0d0d18", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "14px 14px 8px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#6b5a8a", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Sessions</div>
          <button onClick={newSession}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 10, border: "1px solid rgba(168,85,247,0.3)", background: "rgba(124,92,252,0.1)", color: "#c4b8ff", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(124,92,252,0.2)"; e.currentTarget.style.borderColor = "rgba(168,85,247,0.5)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(124,92,252,0.1)"; e.currentTarget.style.borderColor = "rgba(168,85,247,0.3)"; }}
          >
            <span style={{ fontSize: 16, lineHeight: 1 }}>+</span>
            New Session
          </button>
        </div>

        {/* Session list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 8px" }}>
          {sessions.length === 0 && (
            <div style={{ textAlign: "center", padding: "32px 12px", color: "#3a3a5a", fontSize: 12, lineHeight: 1.6 }}>
              No sessions yet.<br />Generate your first image!
            </div>
          )}
          {sessions.map((s) => (
            <div key={s.id}
              onClick={() => loadSession(s)}
              style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 8px", borderRadius: 10, cursor: "pointer", transition: "all 0.15s", marginBottom: 2, border: `1px solid ${activeSessionId === s.id ? "rgba(168,85,247,0.4)" : "transparent"}`, background: activeSessionId === s.id ? "rgba(124,92,252,0.12)" : "transparent", position: "relative", group: "true" } as React.CSSProperties}
              onMouseEnter={(e) => {
                if (activeSessionId !== s.id) e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                const del = e.currentTarget.querySelector(".del-btn") as HTMLElement;
                if (del) del.style.opacity = "1";
              }}
              onMouseLeave={(e) => {
                if (activeSessionId !== s.id) e.currentTarget.style.background = "transparent";
                const del = e.currentTarget.querySelector(".del-btn") as HTMLElement;
                if (del) del.style.opacity = "0";
              }}
            >
              {/* Thumbnail */}
              <div style={{ width: 36, height: 36, borderRadius: 7, flexShrink: 0, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.imageUrl} alt={s.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              {/* Title */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: activeSessionId === s.id ? "#e2d9ff" : "#9ca3af", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.title}</div>
                <div style={{ fontSize: 10, color: "#3a3a5a", marginTop: 1 }}>{MODELS.find(m => m.id === s.model)?.name ?? "Model"}</div>
              </div>
              {/* Delete btn */}
              <button className="del-btn" onClick={(e) => deleteSession(s.id, e)}
                style={{ opacity: 0, position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", width: 20, height: 20, borderRadius: "50%", background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "opacity 0.15s", fontFamily: "inherit", flexShrink: 0 }}
              >x</button>
            </div>
          ))}
        </div>
      </div>

      {/* Main canvas */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>

        {/* Tab switch flash */}
        {tabFlash && (
          <>
            {/* Background tint */}
            <div style={{
              position: "absolute", inset: 0, zIndex: 40, pointerEvents: "none",
              background: tabFlash === "video"
                ? "radial-gradient(ellipse at 50% 50%, rgba(0,180,255,0.18) 0%, rgba(0,80,160,0.10) 55%, transparent 80%)"
                : "radial-gradient(ellipse at 50% 50%, rgba(124,92,252,0.18) 0%, rgba(80,0,160,0.10) 55%, transparent 80%)",
              animation: "tabFlashBg 0.62s ease forwards",
            }} />

            {/* Sweep beam */}
            <div style={{
              position: "absolute", inset: 0, zIndex: 41, pointerEvents: "none",
              overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: 0, bottom: 0,
                width: "55%",
                background: tabFlash === "video"
                  ? "linear-gradient(90deg, transparent 0%, rgba(0,212,255,0.12) 30%, rgba(0,180,255,0.28) 50%, rgba(0,212,255,0.12) 70%, transparent 100%)"
                  : "linear-gradient(90deg, transparent 0%, rgba(168,85,247,0.12) 30%, rgba(124,92,252,0.28) 50%, rgba(168,85,247,0.12) 70%, transparent 100%)",
                animation: "tabSweep 0.62s cubic-bezier(0.4,0,0.2,1) forwards",
              }} />
            </div>

            {/* Horizontal glow line - center */}
            <div style={{
              position: "absolute", left: 0, right: 0, top: "50%", height: 1,
              background: tabFlash === "video"
                ? "linear-gradient(90deg, transparent, rgba(0,212,255,0.6) 30%, rgba(56,189,248,0.9) 50%, rgba(0,212,255,0.6) 70%, transparent)"
                : "linear-gradient(90deg, transparent, rgba(168,85,247,0.6) 30%, rgba(192,132,252,0.9) 50%, rgba(168,85,247,0.6) 70%, transparent)",
              zIndex: 42, pointerEvents: "none",
              animation: "tabFlashBg 0.62s ease forwards",
              boxShadow: tabFlash === "video"
                ? "0 0 24px 4px rgba(0,212,255,0.35)"
                : "0 0 24px 4px rgba(168,85,247,0.35)",
            }} />
          </>
        )}

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
                <div style={{ color: "#6b5a8a", fontSize: 13 }}>{MODELS.find(m => m.id === selectedModel)?.name} - {MODELS.find(m => m.id === selectedModel)?.speed}</div>
              </div>
            )}

            {/* Empty state */}
            {!loading && !imageResult && !error && (
              <div style={{ textAlign: "center", zIndex: 1, userSelect: "none" }}>
                <div style={{ fontSize: 80, marginBottom: 20, opacity: 0.07, lineHeight: 1 }}>*</div>
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
                <div style={{ fontSize: 28, marginBottom: 12 }}>!</div>
                <div style={{ color: "#fca5a5", fontSize: 14, lineHeight: 1.6 }}>{error}</div>
                <button onClick={() => void generateImage()} style={{ marginTop: 14, padding: "8px 20px", borderRadius: 999, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "white", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Try Again</button>
              </div>
            )}

            {/* Result */}
            {imageResult && !loading && (
              <div style={{ zIndex: 1, animation: "fadeIn 0.4s ease", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, maxHeight: "calc(100vh - 180px)", padding: "20px 20px 0" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageResult} alt="Generated" style={{ maxWidth: "100%", maxHeight: "calc(100vh - 260px)", borderRadius: 16, boxShadow: "0 24px 80px rgba(0,0,0,0.7)", display: "block", objectFit: "contain" }} />
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                  <button onClick={() => void downloadImage(imageResult)} style={{ padding: "9px 20px", borderRadius: 999, background: "linear-gradient(135deg, #7c3aed, #a855f7)", border: "none", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Download</button>
                  <button
                    onClick={() => void shareImage(imageResult)}
                    disabled={shareLoading}
                    style={{ padding: "9px 20px", borderRadius: 999, background: "rgba(124,92,252,0.15)", border: "1px solid rgba(168,85,247,0.4)", color: "#c4b8ff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", opacity: shareLoading ? 0.5 : 1, transition: "opacity 0.15s" }}
                  >{shareLoading ? "Sharing..." : "Share"}</button>
                  <button onClick={() => void generateImage()} style={{ padding: "9px 20px", borderRadius: 999, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "#c4b8ff", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Regenerate</button>
                  <button onClick={() => { setImageResult(null); setPrompt(""); setError(null); }} style={{ padding: "9px 20px", borderRadius: 999, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#6b7280", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>+ New</button>
                </div>
              </div>
            )}
          </>
        )}

        {/* VIDEO TAB content */}
        {tab === "video" && (
          <div className="tab-content-enter" style={{ textAlign: "center", zIndex: 1, padding: 40, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>

            {/* Video loading */}
            {videoLoading && (
              <div style={{ textAlign: "center" }}>
                <div style={{ position: "relative", width: 80, height: 80, margin: "0 auto 24px" }}>
                  <div style={{ width: 80, height: 80, borderRadius: "50%", border: "3px solid rgba(0,212,255,0.1)", borderTopColor: "#00d4ff", animation: "spin 0.9s linear infinite" }} />
                  <div style={{ position: "absolute", inset: 10, borderRadius: "50%", border: "2px solid rgba(0,212,255,0.08)", borderBottomColor: "#0ea5e9", animation: "spin 1.4s linear infinite reverse" }} />
                  <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>&gt;</span>
                </div>
                <div style={{ color: "#38bdf8", fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Generating your video...</div>
                <div style={{ color: "#1e4a5a", fontSize: 13, marginBottom: 6 }}>{VIDEO_MODELS.find(m => m.id === selectedVideoModel)?.name} - This may take 1-2 minutes</div>
                <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 20 }}>
                  {[0.3, 0.6, 1, 0.6, 0.3].map((o, i) => (
                    <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#00d4ff", opacity: o, animation: `pulseRing ${1 + i * 0.15}s ease-in-out infinite` }} />
                  ))}
                </div>
              </div>
            )}

            {/* Video error */}
            {videoError && !videoLoading && (
              <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 16, padding: "24px 32px", textAlign: "center", maxWidth: 420 }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>!</div>
                <div style={{ color: "#fca5a5", fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>{videoError}</div>
                <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                  <button onClick={() => void generateVideo()} style={{ padding: "8px 20px", borderRadius: 999, background: "rgba(0,212,255,0.12)", border: "1px solid rgba(0,212,255,0.3)", color: "#00d4ff", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Try Again</button>
                  <button onClick={() => { setVideoError(null); setUploadedFile(null); setUploadedPreview(null); }} style={{ padding: "8px 20px", borderRadius: 999, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#6b7280", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Start Over</button>
                </div>
              </div>
            )}

            {/* VIDEO RESULT */}
            {videoResult && !videoLoading && (
              <div style={{ animation: "fadeIn 0.4s ease", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, maxHeight: "calc(100vh - 180px)", padding: "0 20px" }}>
                <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.7)", border: "1px solid rgba(0,212,255,0.2)" }}>
                  <video
                    src={videoResult}
                    controls
                    autoPlay
                    loop
                    style={{ maxWidth: "min(640px, 80vw)", maxHeight: "calc(100vh - 260px)", display: "block", background: "#000" }}
                  />
                  {/* Cyan corner accent */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, #00d4ff, transparent)", opacity: 0.6 }} />
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => void downloadVideo(videoResult)} style={{ padding: "9px 20px", borderRadius: 999, background: "linear-gradient(135deg, #0369a1, #0ea5e9)", border: "none", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 16px rgba(0,180,220,0.4)" }}>Download Video</button>
                  <button onClick={() => void generateVideo()} style={{ padding: "9px 20px", borderRadius: 999, background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.3)", color: "#38bdf8", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Regenerate</button>
                  <button onClick={() => { setVideoResult(null); setVideoError(null); setUploadedFile(null); setUploadedPreview(null); setMotionPrompt(""); }} style={{ padding: "9px 20px", borderRadius: 999, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#6b7280", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>+ New</button>
                </div>
              </div>
            )}

            {/* Upload / idle state */}
            {!videoLoading && !videoResult && !videoError && (
              <>
                {!uploadedPreview ? (
                  <>
                    <div style={{ width: 100, height: 100, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,212,255,0.12), transparent)", border: "1px solid rgba(0,212,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", animation: "float 4s ease-in-out infinite", cursor: "pointer", position: "relative", overflow: "hidden" }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <span style={{ fontSize: 36, opacity: 0.5 }}>&gt;</span>
                      <div style={{ position: "absolute", width: "100%", height: 2, background: "linear-gradient(90deg, transparent, rgba(0,212,255,0.7), transparent)", animation: "scanLine 3s ease-in-out infinite" }} />
                    </div>
                    <div style={{ color: "#38a3c4", fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Video Studio</div>
                    <div style={{ color: "#1a4a5a", fontSize: 13, marginBottom: 24 }}>Upload an image to bring it to life with AI motion</div>
                    <button onClick={() => fileInputRef.current?.click()}
                      style={{ padding: "10px 24px", borderRadius: 999, background: "rgba(0,212,255,0.12)", border: "1px solid rgba(0,212,255,0.3)", color: "#00d4ff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                      Upload Image
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
                    <button onClick={() => { setUploadedFile(null); setUploadedPreview(null); }} style={{ position: "absolute", top: 10, right: 10, width: 28, height: 28, borderRadius: "50%", background: "rgba(0,0,0,0.7)", border: "1px solid rgba(255,255,255,0.2)", color: "white", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>x</button>
                    <div style={{ marginTop: 16, color: "#38a3c4", fontSize: 13 }}>Ready to animate - Add a motion prompt below</div>
                  </div>
                )}
              </>
            )}

            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
          </div>
        )}
      </div>
      </div>{/* end body wrapper */}

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: 110, left: "50%", transform: "translateX(-50%)", background: "#1a1a2e", border: "1px solid rgba(0,212,255,0.4)", borderRadius: 12, padding: "12px 20px", color: "#e2f8ff", fontSize: 13, fontWeight: 500, zIndex: 9999, boxShadow: "0 8px 32px rgba(0,0,0,0.5)", animation: "fadeUp 0.2s ease", whiteSpace: "nowrap", pointerEvents: "none" }}>
          {toast}
        </div>
      )}

      {/* Bottom bar */}
      <div ref={popupRef} className="studio-bar-enter" style={{ flexShrink: 0, padding: "12px 20px 16px", background: "rgba(10,10,15,0.98)", borderTop: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(20px)", position: "relative" }}>

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
            onClick={() => tab === "image" ? void generateImage() : void generateVideo()}
            disabled={(tab === "image" && (loading || !prompt.trim())) || (tab === "video" && (videoLoading || !uploadedFile))}
            style={{ background: tab === "video" ? "linear-gradient(135deg, #0369a1, #0ea5e9)" : undefined, boxShadow: tab === "video" ? "0 4px 20px rgba(0,180,220,0.5)" : undefined }}
          >
            {(loading || videoLoading) ? <span style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "white", display: "inline-block", animation: "spin 0.7s linear infinite" }} /> : "+"}
          </button>
        </div>

        {/* Chip bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          {tab === "image" ? (
            <>
              <button className={`chip-btn ${openPopup === "model" ? "active" : ""}`} onClick={() => setOpenPopup(openPopup === "model" ? null : "model")}>
                <span style={{ fontSize: 11 }}>Model</span> {currentModelName} <span style={{ opacity: 0.5, fontSize: 10 }}>v</span>
              </button>
              <button className={`chip-btn ${openPopup === "ratio" ? "active" : ""}`} onClick={() => setOpenPopup(openPopup === "ratio" ? null : "ratio")}>
                <span style={{ fontSize: 11 }}>Ratio</span> {aspectRatio} <span style={{ opacity: 0.5, fontSize: 10 }}>v</span>
              </button>
              <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.1)", margin: "0 2px" }} />
              <button className="chip-btn" onClick={() => { const r = EXAMPLE_PROMPTS[Math.floor(Math.random() * EXAMPLE_PROMPTS.length)]; setPrompt(r); }}>
                Random
              </button>
              <button className="chip-btn" onClick={() => { setPrompt(""); setImageResult(null); setError(null); }}>
                Clear
              </button>
            </>
          ) : (
            <>
              <button className={`chip-btn ${openPopup === "videoModel" ? "active" : ""}`} style={{ borderColor: "rgba(0,212,255,0.25)", color: "#38a3c4" }} onClick={() => setOpenPopup(openPopup === "videoModel" ? null : "videoModel")}>
                <span style={{ fontSize: 11 }}>Video</span> {currentVideoModelName} <span style={{ opacity: 0.5, fontSize: 10 }}>v</span>
              </button>
              <button className={`chip-btn ${openPopup === "duration" ? "active" : ""}`} style={{ borderColor: "rgba(0,212,255,0.25)", color: "#38a3c4" }} onClick={() => setOpenPopup(openPopup === "duration" ? null : "duration")}>
                <span style={{ fontSize: 11 }}>Time</span> {videoDuration} <span style={{ opacity: 0.5, fontSize: 10 }}>v</span>
              </button>
              <button className={`chip-btn ${openPopup === "resolution" ? "active" : ""}`} style={{ borderColor: "rgba(0,212,255,0.25)", color: "#38a3c4" }} onClick={() => setOpenPopup(openPopup === "resolution" ? null : "resolution")}>
                <span style={{ fontSize: 11 }}>Res</span> {videoResolution} <span style={{ opacity: 0.5, fontSize: 10 }}>v</span>
              </button>
              <div style={{ width: 1, height: 18, background: "rgba(0,212,255,0.15)", margin: "0 2px" }} />
              {!uploadedFile && (
                <button className="chip-btn" style={{ borderColor: "rgba(0,212,255,0.3)", color: "#38a3c4" }} onClick={() => fileInputRef.current?.click()}>
                  Upload Image
                </button>
              )}
            </>
          )}

          <span style={{ marginLeft: "auto", fontSize: 11, color: "#2a2a3a" }}>Press Enter to generate</span>
        </div>
      </div>

      {/* Upgrade modal */}
      {showUpgrade && (
        <UpgradeModal onClose={() => setShowUpgrade(false)} onToast={showToast} />
      )}

      {/* Auth gate modal */}
      {showAuthGate && (
        <AuthGateModal
          onSuccess={() => {
            setShowAuthGate(false);
            // re-trigger generate after successful login
            setTimeout(() => {
              if (tab === "image" && prompt.trim()) void generateImage();
              if (tab === "video" && uploadedFile) void generateVideo();
            }, 300);
          }}
          onClose={() => setShowAuthGate(false)}
        />
      )}

      {/* Username modal */}
      {usernameModal && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setUsernameModal(null); }}
          style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
        >
          <div style={{ background: "#13131f", border: "1px solid rgba(168,85,247,0.3)", borderRadius: 20, padding: "32px 28px", width: "100%", maxWidth: 360, boxShadow: "0 24px 80px rgba(0,0,0,0.7)" }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>*</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 700, color: "#e2d9ff", marginBottom: 6 }}>Choose a display name</div>
              <p style={{ fontSize: 13, color: "#6b6b8a", lineHeight: 1.6 }}>This will appear on your shared images and comments.</p>
            </div>
            <input
              autoFocus
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") confirmUsername(); if (e.key === "Escape") setUsernameModal(null); }}
              placeholder="e.g. creative_fox"
              maxLength={30}
              style={{ width: "100%", padding: "11px 14px", borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(168,85,247,0.3)", color: "white", fontSize: 14, outline: "none", fontFamily: "inherit", marginBottom: 14 }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(168,85,247,0.6)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(168,85,247,0.3)"; }}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setUsernameModal(null)}
                style={{ flex: 1, padding: "11px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#6b7280", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}
              >Cancel</button>
              <button
                onClick={confirmUsername}
                disabled={!usernameInput.trim()}
                style={{ flex: 2, padding: "11px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #7c3aed, #a855f7)", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", opacity: usernameInput.trim() ? 1 : 0.4, transition: "opacity 0.15s" }}
              >Continue</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
