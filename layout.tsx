import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Midilli App",
  description: "Create faster with AI",
};

const globalStyles = `
  * {
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  html, body {
    margin: 0;
    padding: 0;
    min-height: 100%;
    font-family: Arial, Helvetica, sans-serif;
    background: #0a0a0f;
    color: #ffffff;
  }

  body {
    overflow-x: hidden;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    cursor: pointer;
  }

  .landing-page {
    position: relative;
    min-height: 100vh;
    overflow: hidden;
    background: #0a0a0f;
    color: #ffffff;
  }

  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding-left: 24px;
    padding-right: 24px;
  }

  .bg-glow {
    position: absolute;
    border-radius: 999px;
    filter: blur(120px);
    pointer-events: none;
  }

  .glow-1 {
    width: 320px;
    height: 320px;
    left: -120px;
    top: -80px;
    background: rgba(217, 70, 239, 0.25);
  }

  .glow-2 {
    width: 300px;
    height: 300px;
    right: -100px;
    top: 120px;
    background: rgba(34, 211, 238, 0.2);
  }

  .glow-3 {
    width: 360px;
    height: 360px;
    left: 20%;
    bottom: -120px;
    background: rgba(139, 92, 246, 0.2);
  }

  .navbar {
    position: relative;
    z-index: 10;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.04);
    backdrop-filter: blur(12px);
  }

  .navbar-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 16px;
    padding-bottom: 16px;
    gap: 20px;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .brand-logo {
    width: 40px;
    height: 40px;
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    background: linear-gradient(135deg, #d946ef, #8b5cf6, #22d3ee);
    box-shadow: 0 10px 30px rgba(217, 70, 239, 0.25);
  }

  .brand-title {
    font-size: 20px;
    font-weight: 700;
  }

  .brand-subtitle {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.55);
  }

  .nav-links {
    display: flex;
    gap: 32px;
  }

  .nav-links a {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.72);
  }

  .nav-actions {
    display: flex;
    gap: 12px;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    padding: 12px 20px;
    font-size: 14px;
    font-weight: 600;
    transition: 0.2s ease;
  }

  .btn-secondary {
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: rgba(255, 255, 255, 0.85);
    background: transparent;
  }

  .btn-primary-light {
    background: #ffffff;
    color: #000000;
  }

  .btn-gradient {
    background: linear-gradient(90deg, #d946ef, #8b5cf6, #22d3ee);
    color: #ffffff;
    box-shadow: 0 10px 35px rgba(217, 70, 239, 0.25);
  }

  .btn-glass {
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.88);
  }

  .hero {
    position: relative;
    z-index: 10;
  }

  .hero-grid {
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    align-items: center;
    gap: 56px;
    padding-top: 80px;
    padding-bottom: 100px;
  }

  .status-pill {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 10px 16px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.75);
    font-size: 14px;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: #4ade80;
  }

  .hero-title {
    margin: 24px 0 0;
    font-size: 72px;
    line-height: 1.05;
    letter-spacing: -0.03em;
    max-width: 700px;
  }

  .hero-gradient {
    display: block;
    background: linear-gradient(90deg, #e879f9, #c4b5fd, #67e8f9);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .hero-text {
    margin-top: 24px;
    max-width: 620px;
    font-size: 18px;
    line-height: 1.8;
    color: rgba(255, 255, 255, 0.68);
  }

  .hero-buttons {
    display: flex;
    gap: 16px;
    margin-top: 32px;
    flex-wrap: wrap;
  }

  .hero-tags {
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
    margin-top: 28px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.45);
  }

  .preview-card {
    position: relative;
    border-radius: 32px;
    padding: 16px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(18px);
    box-shadow: 0 25px 80px rgba(0, 0, 0, 0.35);
  }

  .preview-inner {
    border-radius: 28px;
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: #0f1117;
  }

  .preview-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 16px;
  }

  .preview-top h3 {
    margin: 6px 0 0;
    font-size: 24px;
  }

  .muted {
    color: rgba(255, 255, 255, 0.5);
    font-size: 14px;
    margin: 0;
  }

  .mini-badge {
    padding: 8px 12px;
    border-radius: 999px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.75);
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.05);
  }

  .prompt-box, .stat-box, .activity-box {
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    padding: 16px;
  }

  .prompt-box {
    background: linear-gradient(
      90deg,
      rgba(217, 70, 239, 0.18),
      rgba(139, 92, 246, 0.18),
      rgba(34, 211, 238, 0.18)
    );
  }

  .prompt-box p:last-child {
    margin-top: 10px;
    color: rgba(255, 255, 255, 0.92);
    line-height: 1.6;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-top: 16px;
  }

  .stat-box h4 {
    margin: 10px 0 0;
    font-size: 36px;
  }

  .activity-box {
    margin-top: 16px;
  }

  .activity-item {
    margin-top: 12px;
    padding: 12px 14px;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.78);
    font-size: 14px;
  }

  .floating-badge {
    position: absolute;
    left: -16px;
    bottom: -18px;
    padding: 12px 16px;
    border-radius: 18px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(16px);
  }

  .floating-badge strong {
    display: block;
    margin-top: 4px;
    font-size: 14px;
  }

  @media (max-width: 1024px) {
    .hero-grid {
      grid-template-columns: 1fr;
    }

    .nav-links {
      display: none;
    }

    .hero-title {
      font-size: 52px;
    }
  }

  @media (max-width: 640px) {
    .navbar-inner {
      flex-wrap: wrap;
    }

    .hero-grid {
      padding-top: 48px;
      padding-bottom: 72px;
    }

    .hero-title {
      font-size: 40px;
    }
  }
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>
        <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
        {children}
      </body>
    </html>
  );
}