"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

const galleryItems = [
  ["🌙", "Purple nebula", "@cosmic_art", "linear-gradient(135deg,#1a0a2e,#3d1173,#7c5cfc)"],
  ["🏙️", "Cyberpunk city", "@neon_dreams", "linear-gradient(135deg,#0a1a2e,#0d4a7a,#38d9f5)"],
  ["🦋", "Bioluminescent", "@nature_ai", "linear-gradient(135deg,#0d2010,#1a6b2e,#4cebb8)"],
  ["🔥", "Dragon", "@fantasy_world", "linear-gradient(135deg,#2e0a0a,#7a1a1a,#fc5c5c)"],
];

const packs = [
  { credits: 100, price: 5, label: "Starter" },
  { credits: 300, price: 12, label: "Popular" },
  { credits: 700, price: 22, label: "Value" },
  { credits: 2000, price: 50, label: "Power Pack" },
];

export default function HomePage() {
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
      showToast("Kredi bitti. Aşağıdan paket seçebilirsin.");
      return;
    }

    setCredits((current) => current - 1);
    setLoading(true);

    window.setTimeout(() => {
      setImageResult(
        ["🌌", "🏙️", "🦋", "🤖"][Math.floor(Math.random() * 4)]
      );
      setLoading(false);
      showToast("Demo görsel üretildi. İstersen gerçek API'yi de bağlarım.");
    }, 1100);
  };

  const generateVideo = () => {
    if (!uploadedFile) {
      showToast("Önce bir görsel yüklemelisin.");
      return;
    }

    if (credits < 10) {
      showToast("Video için 10 kredi gerekiyor.");
      return;
    }

    setCredits((current) => current - 10);
    showToast("Video demo akışı hazır. Sonraki adımda gerçek backend bağlanabilir.");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        color: "#f0eeff",
        background:
          "radial-gradient(circle at top left, rgba(124,92,252,0.18), transparent 30%), radial-gradient(circle at top right, rgba(56,217,245,0.14), transparent 26%), #080810",
        fontFamily: "'DM Sans', Arial, sans-serif",
      }}
    >
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;700&display=swap");
        html {
          scroll-behavior: smooth;
        }
      `}</style>

      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(8,8,16,0.82)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 24 }}>
          <span style={{ color: "#7c5cfc" }}>Midilli</span>{" "}
          <span style={{ color: "#38d9f5" }}>AI</span>
        </div>
        <nav style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
          <a href="#generate">Generate</a>
          <a href="#gallery">Gallery</a>
          <a href="#pricing">Pricing</a>
          {userName ? (
            <>
              <Link
                href="/dashboard"
                style={{
                  padding: "10px 16px",
                  borderRadius: 999,
                  color: "#f0eeff",
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.04)",
                }}
              >
                {userName}
              </Link>
              <button onClick={handleLogout} style={secondaryButton}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link
                href="/signup"
                style={{
                  padding: "10px 18px",
                  borderRadius: 999,
                  color: "white",
                  background: "linear-gradient(135deg,#7c5cfc,#e84fbc)",
                }}
              >
                Get Started
              </Link>
            </>
          )}
        </nav>
      </header>

      <section style={{ padding: "96px 24px 72px", textAlign: "center" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div
            style={{
              display: "inline-flex",
              gap: 10,
              padding: "8px 16px",
              borderRadius: 999,
              fontSize: 13,
              marginBottom: 28,
              color: "#c4b8ff",
              border: "1px solid rgba(124,92,252,0.3)",
              background: "rgba(124,92,252,0.12)",
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: 999, background: "#38d9f5", marginTop: 4 }} />
            AI image and video studio
          </div>

          <h1
            style={{
              margin: 0,
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(48px, 8vw, 96px)",
              lineHeight: 0.96,
              letterSpacing: -2,
            }}
          >
            Imagine.
            <br />
            <span
              style={{
                background: "linear-gradient(135deg,#a78bff 0%,#e84fbc 50%,#38d9f5 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Create. Share.
            </span>
          </h1>

          <p style={{ maxWidth: 700, margin: "24px auto 0", color: "#8885a8", lineHeight: 1.8 }}>
            Attığın landing page ruhunu mevcut Next.js ve Supabase auth yapısına
            taşıdım. Artık ana sayfa daha premium görünüyor ve login/signup
            akışıyla doğal şekilde bağlanıyor.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", marginTop: 34 }}>
            <a
              href="#generate"
              style={{
                padding: "16px 30px",
                borderRadius: 999,
                color: "white",
                fontWeight: 700,
                fontFamily: "'Syne', sans-serif",
                background: "linear-gradient(135deg,#7c5cfc,#e84fbc)",
              }}
            >
              Start Generating
            </a>
            <Link
              href="/dashboard"
              style={{
                padding: "16px 30px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              Open Dashboard
            </Link>
          </div>
        </div>
      </section>

      <section id="generate" style={{ padding: "20px 24px 0" }}>
        <div
          style={{
            maxWidth: 980,
            margin: "0 auto",
            borderRadius: 28,
            padding: 24,
            background: "#0f0f1a",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 40px 100px rgba(0,0,0,0.35)",
          }}
        >
          <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
            <button onClick={() => setTab("image")} style={tabButton(tab === "image")}>Text to Image</button>
            <button onClick={() => setTab("video")} style={tabButton(tab === "video")}>Image to Video</button>
          </div>

          {tab === "image" ? (
            <>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the image you want to generate..."
                style={inputStyle({ minHeight: 120, resize: "vertical" })}
              />

              <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginTop: 20 }}>
                <div style={{ color: "#8885a8" }}>
                  Balance: <strong style={{ color: "#38d9f5" }}>{credits}</strong> credits
                </div>
                <button onClick={generateImage} style={primaryButton}>
                  {loading ? "Generating..." : "Generate Image"}
                </button>
              </div>

              {(loading || imageResult) && (
                <div
                  style={{
                    marginTop: 28,
                    minHeight: 280,
                    borderRadius: 22,
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "linear-gradient(135deg,#16162a,#11111d)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: 14,
                  }}
                >
                  {loading ? (
                    <>
                      <div style={{ fontSize: 34 }}>🎨</div>
                      <div style={{ color: "#8885a8" }}>Generating preview...</div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: 82 }}>{imageResult}</div>
                      <div style={{ color: "#8885a8" }}>{prompt}</div>
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
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => setUploadedFile(e.target.files?.[0]?.name || "")}
                />
                {uploadedFile ? `Selected: ${uploadedFile}` : "Upload source image"}
              </label>
              <textarea
                value={motionPrompt}
                onChange={(e) => setMotionPrompt(e.target.value)}
                placeholder="Camera slowly zooms in, cinematic motion..."
                style={{ ...inputStyle({ minHeight: 100, resize: "vertical" }), marginTop: 16 }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginTop: 20 }}>
                <div style={{ color: "#8885a8" }}>
                  Balance: <strong style={{ color: "#38d9f5" }}>{credits}</strong> credits
                </div>
                <button onClick={generateVideo} style={primaryButton}>
                  Generate Video
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      <section id="gallery" style={{ maxWidth: 1100, margin: "0 auto", padding: "110px 24px 0" }}>
        <SectionHead label="Community" title="User Gallery" sub="Original sitedeki galeri hissini koruyup daha temiz bir grid'e taşıdım." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16, marginTop: 42 }}>
          {galleryItems.map(([emoji, label, user, bg]) => (
            <div key={label} style={{ borderRadius: 18, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ minHeight: 260, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 10, background: bg as string }}>
                <div style={{ fontSize: 58 }}>{emoji}</div>
                <div>{label}</div>
              </div>
              <div style={{ padding: 16, background: "#0f0f1a" }}>
                <div style={{ color: "#8885a8", fontSize: 13 }}>{user}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" style={{ maxWidth: 1100, margin: "0 auto", padding: "110px 24px 0" }}>
        <SectionHead label="Pricing" title="Plans for Everyone" sub="Üyelik katmanlarını landing page içine yerleştirip auth CTA'larıyla bağladım." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 18, marginTop: 42 }}>
          <PricingCard title="Free" price="$0" credits="20 / mo" features={["Basic models", "Public gallery", "Starter workflow"]} cta={<Link href="/signup" style={secondaryButton}>Get Started</Link>} />
          <PricingCard title="Pro" price="$19" credits="500 / mo" featured features={["Private gallery", "Priority queue", "Commercial usage"]} cta={<button style={primaryButton} onClick={() => showToast("Pro checkout sonraki adımda bağlanabilir.")}>Go Pro</button>} />
          <PricingCard title="Ultra" price="$49" credits="2000 / mo" features={["4K exports", "API-ready", "Instant queue"]} cta={<button style={secondaryButton} onClick={() => showToast("Ultra plan akışı hazır.")}>Go Ultra</button>} />
        </div>
      </section>

      <section id="credits" style={{ maxWidth: 980, margin: "0 auto", padding: "110px 24px 90px" }}>
        <SectionHead label="Credit Store" title="Buy Credits" sub="One-time credit paketlerini korudum ve demo bakiye akışı ekledim." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginTop: 42 }}>
          {packs.map((pack) => (
            <button
              key={pack.credits}
              onClick={() => setSelectedPack(pack)}
              style={{
                padding: 22,
                borderRadius: 20,
                border: selectedPack.credits === pack.credits ? "1px solid rgba(124,92,252,0.6)" : "1px solid rgba(255,255,255,0.08)",
                background: selectedPack.credits === pack.credits ? "rgba(124,92,252,0.12)" : "#0f0f1a",
                color: "#f0eeff",
              }}
            >
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800 }}>{pack.credits}</div>
              <div style={{ color: "#8885a8", marginTop: 6 }}>{pack.label}</div>
              <div style={{ marginTop: 12, fontWeight: 700 }}>${pack.price}</div>
            </button>
          ))}
        </div>

        <div
          style={{
            marginTop: 24,
            padding: 26,
            borderRadius: 24,
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
            background: "#0f0f1a",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22 }}>
              {selectedPack.credits} Credit Pack
            </div>
            <div style={{ color: "#8885a8", marginTop: 6 }}>One-time purchase · Instant delivery</div>
          </div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 36, fontWeight: 800 }}>${selectedPack.price}</div>
          <button
            onClick={() => {
              setCredits((current) => current + selectedPack.credits);
              showToast(`${selectedPack.credits} demo kredi eklendi.`);
            }}
            style={primaryButton}
          >
            Buy Now
          </button>
        </div>
      </section>

      <footer style={{ textAlign: "center", padding: "0 24px 40px", color: "#8885a8" }}>
        © 2026 Midilli AI. All rights reserved.
      </footer>

      {toast && (
        <div
          style={{
            position: "fixed",
            right: 24,
            bottom: 24,
            padding: "14px 18px",
            borderRadius: 16,
            color: "white",
            background: "rgba(15,15,26,0.96)",
            border: "1px solid rgba(124,92,252,0.32)",
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
      <div style={{ textAlign: "center", color: "#7c5cfc", letterSpacing: 3, textTransform: "uppercase", fontSize: 12, fontWeight: 700 }}>
        {label}
      </div>
      <h2 style={{ margin: "14px 0 0", textAlign: "center", fontFamily: "'Syne', sans-serif", fontSize: "clamp(34px,4vw,56px)" }}>
        {title}
      </h2>
      <p style={{ maxWidth: 680, margin: "16px auto 0", textAlign: "center", color: "#8885a8", lineHeight: 1.8 }}>
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
      style={{
        padding: 28,
        borderRadius: 24,
        background: featured ? "linear-gradient(135deg, rgba(124,92,252,0.12), rgba(232,79,188,0.06))" : "#0f0f1a",
        border: featured ? "1px solid rgba(124,92,252,0.45)" : "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div style={{ color: "#8885a8", fontFamily: "'Syne', sans-serif", textTransform: "uppercase", letterSpacing: 1.5, fontSize: 13 }}>{title}</div>
      <div style={{ marginTop: 12, fontFamily: "'Syne', sans-serif", fontSize: 52, fontWeight: 800 }}>{price}</div>
      <div style={{ marginTop: 12, color: "#38d9f5" }}>{credits}</div>
      <ul style={{ margin: "22px 0", paddingLeft: 18, color: "#8885a8", lineHeight: 1.9 }}>
        {features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
      {cta}
    </div>
  );
}

const primaryButton: React.CSSProperties = {
  border: "none",
  borderRadius: 999,
  padding: "14px 24px",
  color: "white",
  fontWeight: 700,
  fontFamily: "'Syne', sans-serif",
  background: "linear-gradient(135deg,#7c5cfc,#e84fbc)",
};

const secondaryButton: React.CSSProperties = {
  display: "inline-block",
  borderRadius: 999,
  padding: "14px 24px",
  color: "#f0eeff",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
};

const inputStyle = (extra: React.CSSProperties): React.CSSProperties => ({
  width: "100%",
  padding: "16px 18px",
  color: "#f0eeff",
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "#16162a",
  ...extra,
});

const tabButton = (active: boolean): React.CSSProperties => ({
  border: active ? "1px solid rgba(124,92,252,0.4)" : "1px solid transparent",
  borderRadius: 999,
  padding: "12px 18px",
  color: active ? "white" : "#8885a8",
  background: active ? "rgba(124,92,252,0.18)" : "rgba(255,255,255,0.04)",
});
