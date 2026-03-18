import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Choose how you want to continue into Midilli AI.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthPage() {
  return (
    <main className="auth-shell auth-shell-single">
      <section className="auth-panel auth-panel-wide">
        <div className="auth-card auth-center-card">
          <span className="auth-eyebrow">Authentication</span>
          <h1 className="auth-center-title">Continue to Midilli AI</h1>
          <p className="auth-center-copy">
            Choose the path that fits where you are in the flow.
          </p>
          <div className="auth-center-actions">
            <Link href="/login" className="auth-submit auth-submit-link">
              Log in
            </Link>
            <Link href="/signup" className="auth-secondary-link">
              Create account
            </Link>
          </div>
          <Link href="/" className="auth-back-link auth-back-link-centered">
            Back to home
          </Link>
        </div>
      </section>
    </main>
  );
}
