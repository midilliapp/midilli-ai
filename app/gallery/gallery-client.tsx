"use client";

import Link from "next/link";
import { useState } from "react";

type GalleryItem = {
  id: number;
  src: string;
  prompt: string;
  user: string;
  category: string;
  likes: number;
  height: "short" | "medium" | "tall";
};

const ALL_ITEMS: GalleryItem[] = [
  { id: 1,  src: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=600&q=80&auto=format&fit=crop", prompt: "Cosmic nebula explosion, deep purple and violet hues", user: "@cosmic_art", category: "Abstract", likes: 284, height: "tall" },
  { id: 2,  src: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=600&q=80&auto=format&fit=crop", prompt: "Deep space galaxy with glowing stars and nebula", user: "@space_dreams", category: "Sci-Fi", likes: 412, height: "medium" },
  { id: 3,  src: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&q=80&auto=format&fit=crop", prompt: "Vibrant gradient wave, abstract digital painting", user: "@gradient_studio", category: "Abstract", likes: 198, height: "short" },
  { id: 4,  src: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&q=80&auto=format&fit=crop", prompt: "Colorful abstract light burst, neon explosion", user: "@neon_burst", category: "Abstract", likes: 376, height: "medium" },
  { id: 5,  src: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&q=80&auto=format&fit=crop", prompt: "Earth from orbit, cinematic space photography", user: "@orbit_view", category: "Sci-Fi", likes: 521, height: "tall" },
  { id: 6,  src: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=600&q=80&auto=format&fit=crop", prompt: "Milky way galaxy spiral, ultra-detailed render", user: "@galaxy_art", category: "Sci-Fi", likes: 289, height: "medium" },
  { id: 7,  src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&auto=format&fit=crop", prompt: "Abstract fluid art with iridescent colors", user: "@fluid_dreams", category: "Abstract", likes: 167, height: "short" },
  { id: 8,  src: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&q=80&auto=format&fit=crop", prompt: "Neon-lit cyberpunk city at midnight, rain reflection", user: "@neon_city", category: "Sci-Fi", likes: 445, height: "tall" },
  { id: 9,  src: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=600&q=80&auto=format&fit=crop", prompt: "Dark stormy sky over mountain range, dramatic light", user: "@storm_render", category: "Nature", likes: 312, height: "medium" },
  { id: 10, src: "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=600&q=80&auto=format&fit=crop", prompt: "Psychedelic abstract portal, vivid colors swirling", user: "@psyche_studio", category: "Abstract", likes: 203, height: "short" },
  { id: 11, src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80&auto=format&fit=crop", prompt: "Majestic mountain peak at golden hour, epic landscape", user: "@epic_lands", category: "Nature", likes: 487, height: "tall" },
  { id: 12, src: "https://images.unsplash.com/photo-1501426026826-31c667bdf23d?w=600&q=80&auto=format&fit=crop", prompt: "Magical forest with glowing ethereal mist", user: "@forest_ai", category: "Fantasy", likes: 334, height: "medium" },
  { id: 13, src: "https://images.unsplash.com/photo-1523821741446-edb2b68bb7a0?w=600&q=80&auto=format&fit=crop", prompt: "Dark fantasy castle on a stormy cliff at dusk", user: "@dark_fantasy", category: "Fantasy", likes: 278, height: "short" },
  { id: 14, src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80&auto=format&fit=crop", prompt: "Starry night over snowy mountain pass, long exposure", user: "@night_sky", category: "Nature", likes: 392, height: "tall" },
  { id: 15, src: "https://images.unsplash.com/photo-1580502304784-8985b7eb7260?w=600&q=80&auto=format&fit=crop", prompt: "Alien planet surface with twin moons rising", user: "@alien_worlds", category: "Sci-Fi", likes: 256, height: "medium" },
  { id: 16, src: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=600&q=80&auto=format&fit=crop", prompt: "Fire dragon emerging from volcanic crater", user: "@dragon_forge", category: "Fantasy", likes: 418, height: "short" },
];

const CATEGORIES = ["All", "Abstract", "Sci-Fi", "Fantasy", "Nature"];

export default function GalleryClient() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());
  const [visibleCount, setVisibleCount] = useState(12);

  const filtered = ALL_ITEMS.filter((item) => {
    const matchCat = activeCategory === "All" || item.category === activeCategory;
    const matchSearch = item.prompt.toLowerCase().includes(search.toLowerCase()) ||
      item.user.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  }).slice(0, visibleCount);

  const toggleLike = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

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
          0%   { transform: translate(0,0) scale(1); }
          33%  { transform: translate(60px,-80px) scale(1.15); }
          66%  { transform: translate(-40px,40px) scale(0.9); }
          100% { transform: translate(0,0) scale(1); }
        }
        @keyframes blob2 {
          0%   { transform: translate(0,0) scale(1); }
          33%  { transform: translate(-70px,60px) scale(1.1); }
          66%  { transform: translate(50px,-50px) scale(0.95); }
          100% { transform: translate(0,0) scale(1); }
        }
        @keyframes fade-in { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes scale-in { from { opacity:0; transform:scale(0.92); } to { opacity:1; transform:scale(1); } }

        .gallery-item {
          break-inside: avoid;
          margin-bottom: 16px;
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.07);
          cursor: pointer;
          position: relative;
          animation: fade-in 0.5s ease both;
          background: #0f0f1a;
        }
        .gallery-item img {
          width: 100%;
          display: block;
          transition: transform 0.4s ease;
        }
        .gallery-item:hover img { transform: scale(1.04); }

        .gallery-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(8,8,16,0.92) 0%, rgba(8,8,16,0.3) 50%, transparent 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 16px;
        }
        .gallery-item:hover .gallery-overlay { opacity: 1; }

        .cat-btn {
          border-radius: 999px;
          padding: 9px 18px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .cat-btn:hover { border-color: rgba(124,92,252,0.4); }

        .like-btn {
          border: none;
          background: rgba(255,255,255,0.12);
          border-radius: 999px;
          padding: 6px 12px;
          color: white;
          font-size: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;
          transition: all 0.2s ease;
          backdrop-filter: blur(8px);
        }
        .like-btn:hover { background: rgba(232,79,188,0.3); transform: scale(1.05); }
        .like-btn.liked { background: rgba(232,79,188,0.35); }

        .load-more-btn {
          border: 1px solid rgba(124,92,252,0.4);
          border-radius: 999px;
          padding: 14px 36px;
          color: #f0eeff;
          font-size: 15px;
          font-weight: 600;
          font-family: 'Syne', sans-serif;
          background: rgba(124,92,252,0.1);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .load-more-btn:hover {
          background: rgba(124,92,252,0.2);
          border-color: rgba(124,92,252,0.7);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(124,92,252,0.3);
        }

        .lightbox-backdrop {
          position: fixed; inset: 0; z-index: 100;
          background: rgba(0,0,0,0.88);
          backdrop-filter: blur(12px);
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
          animation: fade-in 0.2s ease;
        }
        .lightbox-content {
          max-width: 900px; width: 100%;
          background: rgba(15,15,26,0.95);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 24px;
          overflow: hidden;
          animation: scale-in 0.25s ease;
          display: flex;
          flex-direction: column;
        }
        @media (min-width: 700px) {
          .lightbox-content { flex-direction: row; max-height: 90vh; }
          .lightbox-img-wrap { width: 60%; }
          .lightbox-info { width: 40%; }
        }
        .lightbox-img-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .lightbox-info { padding: 28px; display: flex; flex-direction: column; gap: 16px; overflow-y: auto; }

        .nav-link-g {
          color: #8885a8; text-decoration: none; font-size: 14px;
          transition: color 0.2s ease;
        }
        .nav-link-g:hover { color: white; }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #080810; }
        ::-webkit-scrollbar-thumb { background: rgba(124,92,252,0.4); border-radius: 3px; }

        @media (max-width: 640px) {
          .masonry { column-count: 1 !important; }
        }
        @media (min-width: 641px) and (max-width: 900px) {
          .masonry { column-count: 2 !important; }
        }
      `}</style>

      {/* Blobs */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", borderRadius: "50%", filter: "blur(80px)", width: 500, height: 500, top: -100, left: -100, background: "radial-gradient(circle, rgba(124,92,252,0.18) 0%, transparent 70%)", animation: "blob1 20s ease-in-out infinite" }} />
        <div style={{ position: "absolute", borderRadius: "50%", filter: "blur(80px)", width: 400, height: 400, bottom: 100, right: -100, background: "radial-gradient(circle, rgba(56,217,245,0.14) 0%, transparent 70%)", animation: "blob2 24s ease-in-out infinite" }} />
      </div>

      {/* Header */}
      <header style={{ position: "sticky", top: 0, zIndex: 20, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 32px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(8,8,16,0.8)", backdropFilter: "blur(20px)" }}>
        <Link href="/" style={{ textDecoration: "none", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20 }}>
          <span style={{ color: "#a78bff" }}>MIDILLI</span>
        </Link>
        <nav style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <Link href="/create" className="nav-link-g">Generate</Link>
          <Link href="/gallery" style={{ color: "white", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>Gallery</Link>
          <Link href="/#pricing" className="nav-link-g">Pricing</Link>
          <Link href="/create" style={{ padding: "10px 22px", borderRadius: 999, color: "white", fontWeight: 700, fontFamily: "'Syne', sans-serif", fontSize: 14, background: "linear-gradient(135deg,#7c5cfc,#e84fbc)", textDecoration: "none" }}>
            ✦ Create
          </Link>
        </nav>
      </header>

      {/* Page Header */}
      <div style={{ textAlign: "center", padding: "64px 24px 40px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "inline-flex", gap: 8, padding: "6px 16px", borderRadius: 999, fontSize: 12, marginBottom: 20, color: "#c4b8ff", border: "1px solid rgba(124,92,252,0.3)", background: "rgba(124,92,252,0.1)" }}>
          <span style={{ width: 7, height: 7, borderRadius: 999, background: "#38d9f5", marginTop: 3, boxShadow: "0 0 6px #38d9f5" }} />
          Community Gallery
        </div>
        <h1 style={{ margin: 0, fontFamily: "'Syne', sans-serif", fontSize: "clamp(36px,5vw,64px)", fontWeight: 800, letterSpacing: -2 }}>
          AI Creations
        </h1>
        <p style={{ maxWidth: 500, margin: "16px auto 0", color: "#8885a8", lineHeight: 1.8, fontSize: 15 }}>
          Explore stunning visuals generated by the Midilli AI community. Get inspired and create your own.
        </p>
      </div>

      {/* Filters */}
      <div style={{ position: "sticky", top: 57, zIndex: 10, background: "rgba(8,8,16,0.85)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "14px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          {/* Search */}
          <div style={{ position: "relative", flex: 1, minWidth: 200, maxWidth: 300 }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#8885a8", fontSize: 14 }}>⌕</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search prompts..."
              style={{ width: "100%", padding: "10px 14px 10px 36px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(15,15,26,0.9)", color: "#f0eeff", fontSize: 13, boxSizing: "border-box" }}
            />
          </div>

          {/* Categories */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setVisibleCount(12); }}
                className="cat-btn"
                style={{
                  color: activeCategory === cat ? "white" : "#8885a8",
                  background: activeCategory === cat ? "rgba(124,92,252,0.2)" : "rgba(15,15,26,0.8)",
                  borderColor: activeCategory === cat ? "rgba(124,92,252,0.5)" : "rgba(255,255,255,0.08)",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ marginLeft: "auto", color: "#8885a8", fontSize: 13 }}>
            {filtered.length} works
          </div>
        </div>
      </div>

      {/* Masonry Grid */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px", position: "relative", zIndex: 1 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#8885a8" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>⬡</div>
            <div style={{ fontSize: 16 }}>No results found</div>
          </div>
        ) : (
          <div className="masonry" style={{ columnCount: 3, columnGap: 16 }}>
            {filtered.map((item, i) => (
              <div
                key={item.id}
                className="gallery-item"
                onClick={() => setLightbox(item)}
                style={{ animationDelay: `${(i % 6) * 0.07}s` }}
              >
                <img
                  src={item.src}
                  alt={item.prompt}
                  style={{ height: item.height === "tall" ? 380 : item.height === "medium" ? 280 : 200 }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent) {
                      parent.style.background = "linear-gradient(135deg,#1a0a2e,#3d1173,#7c5cfc)";
                      parent.style.minHeight = item.height === "tall" ? "380px" : item.height === "medium" ? "280px" : "200px";
                    }
                  }}
                />
                <div className="gallery-overlay">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 8 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {item.prompt}
                      </div>
                      <div style={{ color: "#8885a8", fontSize: 12 }}>{item.user}</div>
                    </div>
                    <button
                      className={`like-btn ${likedIds.has(item.id) ? "liked" : ""}`}
                      onClick={(e) => toggleLike(item.id, e)}
                    >
                      {likedIds.has(item.id) ? "♥" : "♡"} {item.likes + (likedIds.has(item.id) ? 1 : 0)}
                    </button>
                  </div>
                </div>

                {/* Category badge */}
                <div style={{ position: "absolute", top: 12, left: 12, padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.1)", color: "#c4b8ff" }}>
                  {item.category}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {visibleCount < ALL_ITEMS.filter((i) => activeCategory === "All" || i.category === activeCategory).length && (
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <button className="load-more-btn" onClick={() => setVisibleCount((n) => n + 8)}>
              Load more
            </button>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="lightbox-backdrop" onClick={() => setLightbox(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-img-wrap">
              <img src={lightbox.src} alt={lightbox.prompt} />
            </div>
            <div className="lightbox-info">
              <button onClick={() => setLightbox(null)} style={{ alignSelf: "flex-end", background: "rgba(255,255,255,0.08)", border: "none", color: "white", width: 32, height: 32, borderRadius: 999, cursor: "pointer", fontSize: 16 }}>✕</button>

              <div>
                <div style={{ color: "#8885a8", fontSize: 12, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1.5 }}>Prompt</div>
                <div style={{ fontSize: 15, lineHeight: 1.7 }}>{lightbox.prompt}</div>
              </div>

              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ width: 36, height: 36, borderRadius: 999, background: "linear-gradient(135deg,#7c5cfc,#e84fbc)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>
                  {lightbox.user[1].toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{lightbox.user}</div>
                  <div style={{ color: "#8885a8", fontSize: 12 }}>Community creator</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1, padding: "12px 16px", borderRadius: 14, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", textAlign: "center" }}>
                  <div style={{ color: "#38d9f5", fontWeight: 700, fontSize: 18 }}>{lightbox.likes + (likedIds.has(lightbox.id) ? 1 : 0)}</div>
                  <div style={{ color: "#8885a8", fontSize: 12, marginTop: 2 }}>Likes</div>
                </div>
                <div style={{ flex: 1, padding: "12px 16px", borderRadius: 14, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", textAlign: "center" }}>
                  <div style={{ color: "#a78bff", fontWeight: 700, fontSize: 18 }}>{lightbox.category}</div>
                  <div style={{ color: "#8885a8", fontSize: 12, marginTop: 2 }}>Category</div>
                </div>
              </div>

              <button
                className={`like-btn ${likedIds.has(lightbox.id) ? "liked" : ""}`}
                onClick={(e) => toggleLike(lightbox.id, e)}
                style={{ justifyContent: "center", padding: "12px 0", fontSize: 14 }}
              >
                {likedIds.has(lightbox.id) ? "♥ Liked" : "♡ Like this"} · {lightbox.likes + (likedIds.has(lightbox.id) ? 1 : 0)}
              </button>

            <Link href="/create" style={{ display: "block", textAlign: "center", padding: "13px 0", borderRadius: 999, color: "white", fontWeight: 700, fontFamily: "'Syne', sans-serif", background: "linear-gradient(135deg,#7c5cfc,#e84fbc)", textDecoration: "none", fontSize: 14 }}>
                ✦ Create similar
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
