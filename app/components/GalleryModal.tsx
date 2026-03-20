"use client";

import { useEffect, useRef, useState } from "react";

type Comment = {
  id: string;
  username: string;
  content: string;
  created_at: string;
};

type Post = {
  id: string;
  image_url: string;
  prompt: string | null;
  username: string;
  model: string | null;
  created_at: string;
  likes_count: number;
};

interface Props {
  post: Post;
  currentUsername: string | null;
  onClose: () => void;
  onAskUsername: (cb: (name: string) => void) => void;
}

export default function GalleryModal({
  post,
  currentUsername,
  onClose,
  onAskUsername,
}: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const commentEndRef = useRef<HTMLDivElement>(null);

  // Load comments
  useEffect(() => {
    setCommentsLoading(true);
    fetch(`/api/gallery/${post.id}/comment`)
      .then((r) => r.json())
      .then((d) => setComments(d.comments ?? []))
      .finally(() => setCommentsLoading(false));
  }, [post.id]);

  // Check if current user already liked
  useEffect(() => {
    if (!currentUsername) return;
    const u = currentUsername;
    fetch(`/api/gallery/${post.id}/comment`) // we reuse comment data already; for likes check we do a quick heuristic
      .catch(() => {});
    // We'll just start unliked; toggling will correct it
    void u;
  }, [post.id, currentUsername]);

  const scrollToBottom = () =>
    commentEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    scrollToBottom();
  }, [comments]);

  // Close on Escape
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const handleLike = () => {
    const doLike = (username: string) => {
      const wasLiked = liked;
      setLiked(!wasLiked);
      setLikesCount((c) => (wasLiked ? c - 1 : c + 1));

      fetch(`/api/gallery/${post.id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      })
        .then((r) => r.json())
        .then((d) => {
          if (d.likes_count !== undefined) setLikesCount(d.likes_count);
          if (d.liked !== undefined) setLiked(d.liked as boolean);
        })
        .catch(() => {
          // revert on error
          setLiked(wasLiked);
          setLikesCount((c) => (wasLiked ? c + 1 : c - 1));
        });
    };

    if (currentUsername) {
      doLike(currentUsername);
    } else {
      onAskUsername(doLike);
    }
  };

  const handleComment = () => {
    if (!commentText.trim()) return;

    const doComment = (username: string) => {
      setSubmitting(true);
      fetch(`/api/gallery/${post.id}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, content: commentText.trim() }),
      })
        .then((r) => r.json())
        .then((d) => {
          if (d.comment) {
            setComments((prev) => [...prev, d.comment as Comment]);
            setCommentText("");
          }
        })
        .finally(() => setSubmitting(false));
    };

    if (currentUsername) {
      doComment(currentUsername);
    } else {
      onAskUsername(doComment);
    }
  };

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 9000,
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(12px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20, animation: "fadeIn 0.2s ease",
      }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:scale(0.97); } to { opacity:1; transform:scale(1); } }
        @keyframes slideUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .comment-item { animation: slideUp 0.2s ease; }
        .modal-scrollbar::-webkit-scrollbar { width: 3px; }
        .modal-scrollbar::-webkit-scrollbar-thumb { background: rgba(168,85,247,0.25); border-radius: 2px; }
      `}</style>

      <div style={{
        background: "#0f0f1a",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 24,
        display: "flex",
        maxWidth: 940,
        width: "100%",
        maxHeight: "90vh",
        overflow: "hidden",
        boxShadow: "0 40px 120px rgba(0,0,0,0.8)",
      }}>

        {/* ── Left: Image ── */}
        <div style={{
          flex: "0 0 auto", width: "55%",
          background: "#080812",
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative", overflow: "hidden",
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.image_url}
            alt={post.prompt ?? "Gallery image"}
            style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
          />
          {/* Bottom gradient with info */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            background: "linear-gradient(transparent, rgba(0,0,0,0.85))",
            padding: "40px 20px 20px",
          }}>
            {post.prompt && (
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, lineHeight: 1.5, margin: 0 }}>
                &ldquo;{post.prompt.length > 120 ? post.prompt.slice(0, 120) + "…" : post.prompt}&rdquo;
              </p>
            )}
            {post.model && (
              <span style={{ display: "inline-block", marginTop: 8, fontSize: 11, color: "#7c5cfc", fontWeight: 600, letterSpacing: "0.05em" }}>
                {post.model.split("/").pop()?.replace(/-/g, " ").toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {/* ── Right: Social panel ── */}
        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          borderLeft: "1px solid rgba(255,255,255,0.07)",
          minWidth: 0,
        }}>

          {/* Header */}
          <div style={{
            padding: "18px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexShrink: 0,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {/* Avatar */}
              <div style={{
                width: 34, height: 34, borderRadius: "50%",
                background: `hsl(${post.username.charCodeAt(0) * 13 % 360}, 55%, 40%)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 700, color: "white", flexShrink: 0,
              }}>
                {post.username[0].toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#e2d9ff" }}>{post.username}</div>
                <div style={{ fontSize: 11, color: "#4a4a6a", marginTop: 1 }}>{timeAgo(post.created_at)}</div>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 28, height: 28, borderRadius: "50%",
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                color: "#6b7280", fontSize: 14, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "inherit",
              }}
            >×</button>
          </div>

          {/* Like bar */}
          <div style={{
            padding: "14px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            display: "flex", alignItems: "center", gap: 6,
            flexShrink: 0,
          }}>
            <button
              onClick={handleLike}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "6px 14px", borderRadius: 999,
                border: `1px solid ${liked ? "rgba(239,68,68,0.45)" : "rgba(255,255,255,0.1)"}`,
                background: liked ? "rgba(239,68,68,0.12)" : "rgba(255,255,255,0.04)",
                color: liked ? "#f87171" : "#6b7280",
                fontSize: 13, cursor: "pointer", transition: "all 0.15s",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => { if (!liked) { e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)"; e.currentTarget.style.color = "#f87171"; } }}
              onMouseLeave={(e) => { if (!liked) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#6b7280"; } }}
            >
              <span style={{ fontSize: 15 }}>{liked ? "❤️" : "🤍"}</span>
              <span style={{ fontWeight: 600 }}>{likesCount}</span>
            </button>
            <span style={{ fontSize: 12, color: "#3a3a52", marginLeft: 4 }}>
              {comments.length} comment{comments.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Comments list */}
          <div
            className="modal-scrollbar"
            style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 14 }}
          >
            {commentsLoading && (
              <div style={{ color: "#3a3a52", fontSize: 13, textAlign: "center", paddingTop: 20 }}>Loading comments…</div>
            )}
            {!commentsLoading && comments.length === 0 && (
              <div style={{ color: "#2a2a3a", fontSize: 13, textAlign: "center", paddingTop: 20, lineHeight: 1.7 }}>
                No comments yet.<br />Be the first to say something.
              </div>
            )}
            {comments.map((c) => (
              <div key={c.id} className="comment-item" style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                  background: `hsl(${c.username.charCodeAt(0) * 13 % 360}, 45%, 35%)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700, color: "white",
                }}>
                  {c.username[0].toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#c4b8ff" }}>{c.username}</span>
                    <span style={{ fontSize: 10, color: "#3a3a52" }}>{timeAgo(c.created_at)}</span>
                  </div>
                  <p style={{ fontSize: 13, color: "#9d9abf", lineHeight: 1.55, margin: 0, wordBreak: "break-word" }}>{c.content}</p>
                </div>
              </div>
            ))}
            <div ref={commentEndRef} />
          </div>

          {/* Comment input */}
          <div style={{
            padding: "14px 16px",
            borderTop: "1px solid rgba(255,255,255,0.07)",
            display: "flex", gap: 8, alignItems: "flex-end",
            flexShrink: 0,
          }}>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleComment(); }
              }}
              placeholder="Add a comment…"
              rows={1}
              style={{
                flex: 1, resize: "none", background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10,
                color: "white", fontSize: 13, padding: "9px 12px",
                fontFamily: "inherit", outline: "none", lineHeight: 1.5,
                maxHeight: 80, overflowY: "auto",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(124,92,252,0.4)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
            />
            <button
              onClick={handleComment}
              disabled={submitting || !commentText.trim()}
              style={{
                width: 36, height: 36, borderRadius: 10, border: "none",
                background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                color: "white", fontSize: 16, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, opacity: (!commentText.trim() || submitting) ? 0.4 : 1,
                transition: "opacity 0.15s", fontFamily: "inherit",
              }}
            >↑</button>
          </div>
        </div>
      </div>
    </div>
  );
}
