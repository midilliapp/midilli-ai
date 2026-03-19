"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Merhaba! 👋 MIDILLI AI destek asistanıyım. Size nasıl yardımcı olabilirim?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
        if (!open) setUnread((n) => n + 1);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.",
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Bağlantı hatası. Lütfen tekrar deneyin.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open chat support"
        style={{
          position: "fixed",
          bottom: "24px",
          left: "24px",
          zIndex: 9999,
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #7c3aed, #a855f7)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 24px rgba(168,85,247,0.5)",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            "0 6px 32px rgba(168,85,247,0.7)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            "0 4px 24px rgba(168,85,247,0.5)";
        }}
      >
        {open ? (
          /* X icon */
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          /* Chat bubble icon */
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
          </svg>
        )}

        {/* Unread badge */}
        {unread > 0 && !open && (
          <span
            style={{
              position: "absolute",
              top: "-4px",
              right: "-4px",
              background: "#ef4444",
              color: "white",
              borderRadius: "50%",
              width: "20px",
              height: "20px",
              fontSize: "11px",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {unread}
          </span>
        )}
      </button>

      {/* Chat Popup */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "92px",
            left: "24px",
            zIndex: 9998,
            width: "340px",
            maxWidth: "calc(100vw - 48px)",
            height: "480px",
            maxHeight: "calc(100vh - 120px)",
            background: "#0f0f1a",
            border: "1px solid rgba(168,85,247,0.3)",
            borderRadius: "16px",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            boxShadow: "0 8px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(168,85,247,0.1)",
            animation: "chatSlideUp 0.25s ease",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "linear-gradient(135deg, #1e0a3c, #2d1058)",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              borderBottom: "1px solid rgba(168,85,247,0.2)",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                flexShrink: 0,
              }}
            >
              ✦
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  color: "white",
                  fontWeight: "700",
                  fontSize: "14px",
                  letterSpacing: "0.02em",
                }}
              >
                MIDILLI Destek
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  marginTop: "1px",
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    background: "#22c55e",
                    borderRadius: "50%",
                    display: "inline-block",
                  }}
                />
                <span style={{ color: "#86efac", fontSize: "11px" }}>
                  Çevrimiçi · AI Destekli
                </span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "14px 12px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(168,85,247,0.3) transparent",
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "82%",
                    padding: "9px 13px",
                    borderRadius:
                      msg.role === "user"
                        ? "14px 14px 4px 14px"
                        : "14px 14px 14px 4px",
                    background:
                      msg.role === "user"
                        ? "linear-gradient(135deg, #7c3aed, #a855f7)"
                        : "rgba(255,255,255,0.07)",
                    color: "white",
                    fontSize: "13px",
                    lineHeight: "1.5",
                    border:
                      msg.role === "assistant"
                        ? "1px solid rgba(168,85,247,0.15)"
                        : "none",
                    wordBreak: "break-word",
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: "14px 14px 14px 4px",
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(168,85,247,0.15)",
                    display: "flex",
                    gap: "4px",
                    alignItems: "center",
                  }}
                >
                  {[0, 1, 2].map((dot) => (
                    <span
                      key={dot}
                      style={{
                        width: "6px",
                        height: "6px",
                        background: "#a855f7",
                        borderRadius: "50%",
                        display: "inline-block",
                        animation: `typingDot 1.2s infinite ${dot * 0.2}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: "10px 12px",
              borderTop: "1px solid rgba(168,85,247,0.15)",
              background: "rgba(0,0,0,0.3)",
              display: "flex",
              gap: "8px",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Mesajınızı yazın..."
              disabled={loading}
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(168,85,247,0.25)",
                borderRadius: "10px",
                padding: "9px 12px",
                color: "white",
                fontSize: "13px",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(168,85,247,0.6)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(168,85,247,0.25)";
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background:
                  loading || !input.trim()
                    ? "rgba(168,85,247,0.2)"
                    : "linear-gradient(135deg, #7c3aed, #a855f7)",
                border: "none",
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "background 0.2s",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes typingDot {
          0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
          30% { opacity: 1; transform: translateY(-3px); }
        }
      `}</style>
    </>
  );
}
