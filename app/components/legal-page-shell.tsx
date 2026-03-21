import Link from "next/link";
import type { ReactNode } from "react";

type LegalPageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  lastUpdated: string;
  children: ReactNode;
};

export function LegalPageShell({
  eyebrow,
  title,
  description,
  lastUpdated,
  children,
}: LegalPageShellProps) {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(124,92,252,0.18), transparent 26%), radial-gradient(circle at top right, rgba(56,217,245,0.1), transparent 24%), linear-gradient(180deg, #0a0a12 0%, #080810 100%)",
        color: "#f0eeff",
        fontFamily: "'DM Sans', Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 24px 90px" }}>
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            paddingBottom: 18,
            position: "sticky",
            top: 0,
            zIndex: 10,
            backdropFilter: "blur(16px)",
            background: "rgba(8,8,16,0.72)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            paddingTop: 14,
          }}
        >
          <Link
            href="/"
            style={{
              color: "#a78bff",
              textDecoration: "none",
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: 22,
              letterSpacing: "-0.03em",
            }}
          >
            MIDILLI
          </Link>
          <nav style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[
              { href: "/price", label: "Pricing" },
              { href: "/terms", label: "Terms" },
              { href: "/privacy", label: "Privacy" },
              { href: "/refund", label: "Refunds" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  textDecoration: "none",
                  color: "#c4b8ff",
                  fontSize: 13,
                  padding: "9px 13px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.035)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        <section
          style={{
            marginTop: 20,
            padding: "38px 34px 34px",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 32,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.28)",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              padding: "8px 14px",
              borderRadius: 999,
              background: "rgba(124,92,252,0.12)",
              border: "1px solid rgba(124,92,252,0.24)",
              color: "#cdc2ff",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {eyebrow}
          </div>
          <h1
            style={{
              margin: "18px 0 0",
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(34px, 6vw, 64px)",
              lineHeight: 1,
              letterSpacing: "-0.04em",
              maxWidth: 900,
            }}
          >
            {title}
          </h1>
          <p
            style={{
              margin: "18px 0 0",
              maxWidth: 760,
              color: "#b7b4c9",
              lineHeight: 1.8,
              fontSize: 16,
            }}
          >
            {description}
          </p>
          <p style={{ margin: "18px 0 0", color: "#7e7a96", fontSize: 13 }}>
            Last updated: {lastUpdated}
          </p>
        </section>

        <div style={{ maxWidth: 980, paddingTop: 28 }}>{children}</div>

        <footer
          style={{
            marginTop: 28,
            paddingTop: 18,
            borderTop: "1px solid rgba(255,255,255,0.06)",
            color: "#7e7a96",
            fontSize: 13,
          }}
        >
          Midilli AI legal and billing pages for customer transparency and payment verification.
        </footer>
      </div>
    </main>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      style={{
        marginTop: 18,
        padding: 24,
        borderRadius: 24,
        background: "rgba(15,15,26,0.78)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(14px)",
      }}
    >
      <h2
        style={{
          margin: 0,
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(22px, 3vw, 32px)",
          letterSpacing: "-0.03em",
        }}
      >
        {title}
      </h2>
      <div style={{ marginTop: 14, color: "#cbc8d8", lineHeight: 1.8, fontSize: 15 }}>
        {children}
      </div>
    </section>
  );
}

export function LegalList({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: "12px 0 0", paddingLeft: 18 }}>
      {items.map((item) => (
        <li key={item} style={{ marginTop: 8 }}>
          {item}
        </li>
      ))}
    </ul>
  );
}

export function LegalCardGrid({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 14,
        marginTop: 18,
      }}
    >
      {children}
    </div>
  );
}

export function LegalCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        padding: 18,
        borderRadius: 20,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700,
          fontSize: 18,
          marginBottom: 8,
        }}
      >
        {title}
      </div>
      <div style={{ color: "#cbc8d8", lineHeight: 1.7, fontSize: 14 }}>{children}</div>
    </div>
  );
}
