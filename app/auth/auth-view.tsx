"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { supabase } from "@/lib/supabase";

type AuthMode = "login" | "signup";

type AuthViewProps = {
  mode: AuthMode;
  confirmed?: boolean;
  nextPath?: string;
};

type Notice = {
  tone: "neutral" | "success" | "error";
  text: string;
};

const modeCopy = {
  login: {
    title: "Welcome back",
    subtitle: "Sign in to continue building in Midilli AI.",
    submit: "Log in",
    loading: "Logging in...",
    altText: "New here?",
    altHref: "/signup",
    altCta: "Create an account",
    heroEyebrow: "Secure access",
    heroTitle: "A cleaner sign-in flow for returning creators.",
    heroBody:
      "Your sessions stay synced with Supabase while the interface handles confirmation states and redirect logic more gracefully.",
  },
  signup: {
    title: "Create your account",
    subtitle: "Set up your Midilli AI workspace in a minute.",
    submit: "Create account",
    loading: "Creating account...",
    altText: "Already have an account?",
    altHref: "/login",
    altCta: "Log in",
    heroEyebrow: "Fast onboarding",
    heroTitle: "A more professional first-run experience.",
    heroBody:
      "New users get clearer password guidance, confirmation messaging, and a smoother handoff back into the product.",
  },
} as const;

export default function AuthView({
  mode,
  confirmed = false,
  nextPath = "/",
}: AuthViewProps) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);

  const redirectTo = nextPath;
  const copy = modeCopy[mode];
  const confirmationNotice =
    mode === "login" && confirmed
      ? {
          tone: "success" as const,
          text: "Email dogrulandi. Simdi giris yapabilirsin.",
        }
      : null;

  useEffect(() => {
    const guardSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        router.replace(redirectTo);
      }
    };

    void guardSession();
  }, [redirectTo, router]);

  const passwordHint = useMemo(() => {
    if (!password) {
      return "En az 6 karakter kullan.";
    }

    if (password.length < 6) {
      return "Sifre en az 6 karakter olmali.";
    }

    if (mode === "signup" && confirmPassword && password !== confirmPassword) {
      return "Sifreler birbiriyle eslesmiyor.";
    }

    return "Sifre guclu gorunuyor.";
  }, [confirmPassword, mode, password]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setNotice(null);

    try {
      if (mode === "signup" && password !== confirmPassword) {
        setNotice({
          tone: "error",
          text: "Sifre ve sifre tekrari ayni olmali.",
        });
        setLoading(false);
        return;
      }

      if (mode === "signup") {
        const emailRedirectTo = `${window.location.origin}/login?confirmed=1`;
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo,
            data: {
              full_name: fullName.trim(),
            },
          },
        });

        if (error) {
          setNotice({
            tone: "error",
            text: error.message || "Kayit basarisiz.",
          });
          setLoading(false);
          return;
        }

        if (data.session) {
          router.replace(redirectTo);
          return;
        }

        setNotice({
          tone: "success",
          text: "Kayit tamamlandi. Lutfen email kutunu kontrol edip dogrulamayi bitir.",
        });
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setNotice({
          tone: "error",
          text: error.message || "Giris basarisiz.",
        });
        setLoading(false);
        return;
      }

      if (!data.session) {
        setNotice({
          tone: "error",
          text: "Session olusturulamadi. Lutfen tekrar deneyin.",
        });
        setLoading(false);
        return;
      }

      router.replace(redirectTo);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Istek atilamadi.";
      setNotice({
        tone: "error",
        text: message,
      });
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setNotice(null);
    setGoogleLoading(true);

    try {
      const redirectUrl = new URL("/auth/callback", window.location.origin);
      redirectUrl.searchParams.set("next", redirectTo);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl.toString(),
          queryParams: {
            access_type: "offline",
            prompt: "select_account",
          },
        },
      });

      if (error) {
        setNotice({
          tone: "error",
          text: error.message || "Google ile giris baslatilamadi.",
        });
        setGoogleLoading(false);
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Google auth istegi atilamadi.";

      setNotice({
        tone: "error",
        text: message,
      });
      setGoogleLoading(false);
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-hero">
        <div className="auth-hero-card">
          <span className="auth-eyebrow">{copy.heroEyebrow}</span>
          <h1>{copy.heroTitle}</h1>
          <p>{copy.heroBody}</p>
          <div className="auth-feature-list">
            <span>Supabase session sync</span>
            <span>Email confirmation ready</span>
            <span>Cleaner redirects</span>
          </div>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <Link href="/" className="auth-back-link">
            Back to home
          </Link>

          <div className="auth-header">
            <h2>{copy.title}</h2>
            <p>{copy.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={googleLoading || loading}
              className="auth-oauth-button"
            >
              <span className="auth-google-mark" aria-hidden="true">
                G
              </span>
              {googleLoading ? "Redirecting to Google..." : "Continue with Google"}
            </button>

            <div className="auth-divider" aria-hidden="true">
              <span>or continue with email</span>
            </div>

            {mode === "signup" && (
              <label className="auth-field">
                <span>Full name</span>
                <input
                  type="text"
                  placeholder="Your name"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  autoComplete="name"
                />
              </label>
            )}

            <label className="auth-field">
              <span>Email</span>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </label>

            <label className="auth-field">
              <span>Password</span>
              <div className="auth-password-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="auth-inline-button"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            {mode === "signup" && (
              <label className="auth-field">
                <span>Confirm password</span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                  required
                />
              </label>
            )}

            <p className={`auth-hint${passwordHint.includes("olmali") || passwordHint.includes("eslesmiyor") ? " is-error" : ""}`}>
              {passwordHint}
            </p>

            {(notice || confirmationNotice) && (
              <div className={`auth-notice is-${(notice || confirmationNotice)?.tone}`}>
                {(notice || confirmationNotice)?.text}
              </div>
            )}

            <button type="submit" disabled={loading} className="auth-submit">
              {loading ? copy.loading : copy.submit}
            </button>
          </form>

          <p className="auth-footer">
            {copy.altText} <Link href={copy.altHref}>{copy.altCta}</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
