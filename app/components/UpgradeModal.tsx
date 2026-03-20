"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Props {
  onClose: () => void;
  onToast: (msg: string) => void;
}

const PLANS = [
  {
    id: "free", name: "Free", price: "$0", sub: "Try the experience.",
    color: "#3d3d55", priceColor: "#4a4a62",
    features: ["10 generations to start", "2 AI models", "Slow speed", "Watermarked exports"],
    cta: "Current", ctaStyle: "muted" as const,
  },
  {
    id: "basic", name: "Basic", price: "$9.99", sub: "For consistent creators.",
    color: "#6b6b8a", priceColor: "#c4b8ff",
    features: ["150 generations / month", "5 AI models", "Standard speed", "No watermark", "Personal license"],
    cta: "Get Basic", ctaStyle: "normal" as const,
  },
  {
    id: "pro", name: "Pro", price: "$19", sub: "The complete creative setup.",
    color: "#a78bff", priceColor: "gradient",
    badge: "Best Value",
    features: ["600 generations / month", "All 10 AI models", "Image-to-video", "Priority queue", "Commercial license", "Private gallery"],
    cta: "Get Pro", ctaStyle: "primary" as const,
  },
  {
    id: "ultra", name: "Ultra", price: "$49", sub: "For power users and teams.",
    color: "#8b7a5a", priceColor: "#d4c9a8",
    badge: "POWER",
    features: ["2,000 generations / month", "Always-first queue", "4K video exports", "Full API access", "Early model access", "Dedicated support"],
    cta: "Go Ultra", ctaStyle: "amber" as const,
  },
];

const PACKS = [
  { credits: 100,  price: 5,  label: "Starter",    popular: false },
  { credits: 300,  price: 12, label: "Popular",     popular: true  },
  { credits: 700,  price: 22, label: "Value",       popular: false },
  { credits: 2000, price: 50, label: "Power Pack",  popular: false },
];

export default function UpgradeModal({ onClose, onToast }: Props) {
  const [tab, setTab] = useState<"plans" | "credits">("plans");

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 9990,
        background: "rgba(0,0,0,0.88)", backdropFilter: "blur(16px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px 16px", overflowY: "auto",
      }}
    >
      <style>{`
        @keyframes upgradeIn {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        /* Rising light — pseudo-element per tier */
        .plan-card {
          transition: transform 0.35s cubic-bezier(0.22,1,0.36,1),
                      border-color 0.4s ease,
                      box-shadow 0.4s ease;
          overflow: hidden;
        }
        .plan-card::before {
          content: '';
          position: absolute; inset: 0;
          border-radius: inherit;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.55s ease, transform 0.75s cubic-bezier(0.22,1,0.36,1);
          transform: translateY(55%);
        }
        .plan-card:hover {
          transform: translateY(-3px) scale(1.012);
        }
        .plan-card:hover::before {
          opacity: 1;
          transform: translateY(0%);
        }

        /* Free — barely-there cool grey */
        .plan-card-free::before {
          background: radial-gradient(ellipse 70% 45% at 50% 100%, rgba(110,110,170,0.14) 0%, transparent 70%);
        }
        .plan-card-free:hover {
          border-color: rgba(130,130,190,0.2) !important;
          box-shadow: 0 4px 20px -4px rgba(100,100,160,0.12);
        }

        /* Basic — soft lavender */
        .plan-card-basic::before {
          background: radial-gradient(ellipse 70% 50% at 50% 100%, rgba(168,85,247,0.18) 0%, transparent 72%);
        }
        .plan-card-basic:hover {
          border-color: rgba(168,85,247,0.32) !important;
          box-shadow: 0 4px 24px -4px rgba(124,92,252,0.18);
        }

        /* Pro — vivid purple, strongest */
        .plan-card-pro::before {
          background: radial-gradient(ellipse 75% 55% at 50% 100%, rgba(192,100,255,0.32) 0%, rgba(168,85,247,0.10) 55%, transparent 75%);
        }
        .plan-card-pro:hover {
          border-color: rgba(192,132,252,0.6) !important;
          box-shadow: 0 20px 60px -8px rgba(108,72,252,0.35),
                      0 0 28px -2px rgba(168,85,247,0.35),
                      inset 0 1px 0 rgba(255,255,255,0.10);
        }

        /* Ultra — warm amber */
        .plan-card-ultra::before {
          background: radial-gradient(ellipse 68% 45% at 50% 100%, rgba(251,191,36,0.16) 0%, transparent 70%);
        }
        .plan-card-ultra:hover {
          border-color: rgba(251,191,36,0.28) !important;
          box-shadow: 0 4px 24px -4px rgba(180,130,20,0.15);
        }
        .upgrade-modal { animation: upgradeIn 0.36s cubic-bezier(0.22,1,0.36,1) both; }
        .upgrade-tab { padding: 7px 20px; border-radius: 8px; border: none; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s; font-family: inherit; }
        .upgrade-tab.active { background: rgba(168,85,247,0.22); color: #e2d9ff; }
        .upgrade-tab.inactive { background: transparent; color: #4a4a62; }
        .upgrade-tab.inactive:hover { color: #9ca3af; }
        .pack-card { border-radius: 14px; padding: 20px 18px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); cursor: pointer; transition: all 0.18s; display: flex; flex-direction: column; gap: 8px; position: relative; }
        .pack-card:hover { border-color: rgba(168,85,247,0.35); background: rgba(124,92,252,0.08); transform: translateY(-2px); box-shadow: 0 0 20px 3px rgba(124,92,252,0.18); }
        .pack-card.popular { border-color: rgba(168,85,247,0.45); background: rgba(124,92,252,0.1); }
      `}</style>

      <div className="upgrade-modal" style={{ width: "100%", maxWidth: 840, position: "relative" }}>

        {/* Close */}
        <button onClick={onClose} style={{ position: "absolute", top: -14, right: -14, zIndex: 10, width: 32, height: 32, borderRadius: "50%", background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", color: "#6b7280", fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>×</button>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, letterSpacing: "-0.03em", color: "#f0eeff", marginBottom: 6 }}>
            Upgrade MIDILLI
          </div>
          <p style={{ fontSize: 14, color: "#4a4a62" }}>Choose a plan or top up your credits anytime.</p>
        </div>

        {/* Tab switcher */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
          <div style={{ display: "flex", gap: 2, background: "rgba(255,255,255,0.04)", borderRadius: 11, padding: 3 }}>
            <button className={`upgrade-tab ${tab === "plans" ? "active" : "inactive"}`} onClick={() => setTab("plans")}>✦ Plans</button>
            <button className={`upgrade-tab ${tab === "credits" ? "active" : "inactive"}`} onClick={() => setTab("credits")}>⚡ Buy Credits</button>
          </div>
        </div>

        {/* ── PLANS TAB ── */}
        {tab === "plans" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.08fr 1fr", gap: 10 }}>
              {PLANS.map((plan) => (
                <div key={plan.id} className={`plan-card plan-card-${plan.id}`} style={{
                  padding: plan.id === "pro" ? "30px 22px 26px" : "24px 18px 22px",
                  borderRadius: 16,
                  background: plan.id === "pro"
                    ? "linear-gradient(155deg, rgba(118,80,255,0.18) 0%, rgba(148,70,245,0.12) 50%, rgba(220,70,175,0.08) 100%)"
                    : plan.id === "ultra"
                    ? "linear-gradient(160deg, rgba(20,16,36,0.9), rgba(14,12,26,0.95))"
                    : "rgba(12,12,22,0.7)",
                  border: plan.id === "pro" ? "1px solid rgba(148,85,247,0.48)" : plan.id === "ultra" ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.06)",
                  backdropFilter: "blur(12px)",
                  display: "flex", flexDirection: "column",
                  position: "relative",
                  boxShadow: plan.id === "pro" ? "0 20px 60px -8px rgba(108,72,252,0.35), inset 0 1px 0 rgba(255,255,255,0.08)" : "none",
                }}>
                  {/* Badge */}
                  {plan.badge && plan.id === "pro" && (
                    <div style={{ position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)", padding: "3px 11px", borderRadius: 999, background: "linear-gradient(135deg, #7c5cfc, #c026d3)", fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "white", whiteSpace: "nowrap", boxShadow: "0 3px 14px rgba(124,92,252,0.5)" }}>
                      {plan.badge}
                    </div>
                  )}
                  {plan.badge && plan.id === "ultra" && (
                    <div style={{ position: "absolute", top: 12, right: 12, padding: "2px 7px", borderRadius: 999, background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.18)", fontSize: 9, fontWeight: 700, color: "#a89060" }}>
                      {plan.badge}
                    </div>
                  )}
                  {/* Top glow — pro only */}
                  {plan.id === "pro" && <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 1, background: "linear-gradient(90deg, transparent, rgba(192,132,252,0.8), transparent)" }} />}

                  {/* Plan name */}
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: plan.color, marginBottom: 10, display: "block" }}>{plan.name}</span>

                  {/* Price */}
                  {plan.priceColor === "gradient" ? (
                    <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 34, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.04em", background: "linear-gradient(135deg, #e0d7ff, #c084fc 60%, #f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "block", marginBottom: 4 }}>{plan.price}<span style={{ fontSize: 11, WebkitTextFillColor: "#8885a8", background: "none", WebkitBackgroundClip: "unset" }}>/mo</span></span>
                  ) : (
                    <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 34, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em", color: plan.priceColor, display: "block", marginBottom: 4 }}>{plan.price}{plan.price !== "$0" && <span style={{ fontSize: 11, color: "#4a4a62", fontWeight: 400 }}>/mo</span>}</span>
                  )}

                  <p style={{ fontSize: 11, color: plan.id === "pro" ? "#9d9abf" : "#3a3a50", marginBottom: 14, lineHeight: 1.4 }}>{plan.sub}</p>

                  <div style={{ width: "100%", height: 1, background: plan.id === "pro" ? "linear-gradient(90deg,transparent,rgba(148,85,247,0.25),transparent)" : "rgba(255,255,255,0.04)", marginBottom: 14 }} />

                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 auto", display: "flex", flexDirection: "column", gap: 7 }}>
                    {plan.features.map((f) => (
                      <li key={f} style={{ display: "flex", gap: 7, fontSize: 11, color: plan.id === "pro" ? "#c4b8ff" : plan.id === "ultra" ? "#8b7a5a" : "#4a4a62", lineHeight: 1.4 }}>
                        <span style={{ color: plan.id === "pro" ? "#c084fc" : plan.id === "ultra" ? "#a89060" : "#2e2e42", flexShrink: 0, fontSize: 10 }}>✓</span>{f}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div style={{ marginTop: 16 }}>
                    {plan.ctaStyle === "muted" && (
                      <Link href="/create" onClick={onClose} style={{ display: "block", textAlign: "center", padding: "9px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)", color: "#2e2e42", fontSize: 11, fontWeight: 600, textDecoration: "none" }}>Current plan</Link>
                    )}
                    {plan.ctaStyle === "normal" && (
                      <button onClick={() => { onClose(); onToast("Basic plan — coming soon."); }} style={{ width: "100%", padding: "9px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#c4b8ff", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{plan.cta}</button>
                    )}
                    {plan.ctaStyle === "primary" && (
                      <button onClick={() => { onClose(); onToast("Pro plan — coming soon."); }} style={{ width: "100%", padding: "11px", borderRadius: 9, border: "none", background: "linear-gradient(135deg, #7c3aed, #a855f7, #c026d3)", color: "white", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 6px 20px rgba(124,92,252,0.45)" }}>{plan.cta}</button>
                    )}
                    {plan.ctaStyle === "amber" && (
                      <button onClick={() => { onClose(); onToast("Ultra plan — coming soon."); }} style={{ width: "100%", padding: "9px", borderRadius: 8, border: "1px solid rgba(251,191,36,0.18)", background: "rgba(251,191,36,0.04)", color: "#a89060", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{plan.cta}</button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Switch to credits */}
            <div style={{ textAlign: "center", marginTop: 20 }}>
              <button onClick={() => setTab("credits")} style={{ background: "none", border: "none", color: "#5a527a", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
                Just need more credits? <span style={{ color: "#a78bff", fontWeight: 600 }}>Buy a one-time pack ↓</span>
              </button>
            </div>
          </>
        )}

        {/* ── CREDITS TAB ── */}
        {tab === "credits" && (
          <>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <p style={{ fontSize: 13, color: "#5a5272" }}>One-time purchase. Credits never expire. No subscription.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, maxWidth: 700, margin: "0 auto" }}>
              {PACKS.map((pack) => (
                <button
                  key={pack.credits}
                  className={`pack-card ${pack.popular ? "popular" : ""}`}
                  onClick={() => { onClose(); onToast(`${pack.label} pack — payment coming soon.`); }}
                  style={{ cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}
                >
                  {/* Popular badge */}
                  {pack.popular && (
                    <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", padding: "3px 10px", borderRadius: 999, background: "linear-gradient(135deg, #7c5cfc, #a855f7)", fontSize: 9, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "white", whiteSpace: "nowrap", boxShadow: "0 3px 12px rgba(124,92,252,0.5)" }}>
                      Popular
                    </div>
                  )}

                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: pack.popular ? "#a78bff" : "#4a4a62", marginBottom: 8 }}>{pack.label}</div>

                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 800, letterSpacing: "-0.03em", color: pack.popular ? "#e2d9ff" : "#9d9abf", lineHeight: 1, marginBottom: 4 }}>
                    {pack.credits.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 11, color: "#4a4a62", marginBottom: 12 }}>credits</div>

                  <div style={{ marginTop: "auto", padding: "8px 0 0", borderTop: `1px solid ${pack.popular ? "rgba(168,85,247,0.2)" : "rgba(255,255,255,0.05)"}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 800, color: pack.popular ? "#c4b8ff" : "#6b7280" }}>${pack.price}</span>
                    <span style={{ fontSize: 10, color: "#3a3a52" }}>${(pack.price / pack.credits * 100).toFixed(1)}¢ / cr</span>
                  </div>
                </button>
              ))}
            </div>

            <p style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "#3a3a52" }}>
              Credits are added instantly after purchase · Never expire
            </p>

            {/* Switch to plans */}
            <div style={{ textAlign: "center", marginTop: 10 }}>
              <button onClick={() => setTab("plans")} style={{ background: "none", border: "none", color: "#5a527a", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
                Want unlimited generations? <span style={{ color: "#a78bff", fontWeight: 600 }}>See plans ↑</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
