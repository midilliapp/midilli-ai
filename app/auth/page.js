"use client";

export default function AuthPage() {
  const goLogin = () => {
    window.location.assign("/login");
  };

  const goSignup = () => {
    window.location.assign("/signup");
  };

  const goHome = () => {
    window.location.assign("/");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#020617",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "24px",
          padding: "32px",
          textAlign: "center",
          backdropFilter: "blur(14px)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
          position: "relative",
          zIndex: 9999,
          pointerEvents: "auto",
        }}
      >
        <h1
          style={{
            margin: "0 0 12px",
            fontSize: "34px",
            color: "white",
            fontFamily: "Arial, Helvetica, sans-serif",
          }}
        >
          Auth Center
        </h1>

        <p
          style={{
            margin: "0 0 28px",
            color: "rgba(255,255,255,0.68)",
            lineHeight: 1.6,
            fontFamily: "Arial, Helvetica, sans-serif",
          }}
        >
          Continue with login or create a new account.
        </p>

        <div
          style={{
            display: "flex",
            gap: "14px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={goLogin}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "999px",
              padding: "14px 22px",
              fontWeight: 700,
              color: "white",
              border: "none",
              cursor: "pointer",
              background: "linear-gradient(90deg, #d946ef, #8b5cf6, #22d3ee)",
              position: "relative",
              zIndex: 10000,
              pointerEvents: "auto",
            }}
          >
            Log in
          </button>

          <button
            type="button"
            onClick={goSignup}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "999px",
              padding: "14px 22px",
              fontWeight: 700,
              color: "white",
              border: "1px solid rgba(255,255,255,0.12)",
              cursor: "pointer",
              background: "rgba(255,255,255,0.05)",
              position: "relative",
              zIndex: 10000,
              pointerEvents: "auto",
            }}
          >
            Create account
          </button>
        </div>

        <div style={{ marginTop: "18px" }}>
          <button
            type="button"
            onClick={goHome}
            style={{
              color: "rgba(255,255,255,0.55)",
              fontSize: "14px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              position: "relative",
              zIndex: 10000,
              pointerEvents: "auto",
            }}
          >
            ← Back to home
          </button>
        </div>
      </div>
    </main>
  );
}