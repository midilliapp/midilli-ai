import type { Metadata } from "next";

import AuthView from "@/app/auth/auth-view";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Sign up for Midilli AI and activate your workspace.",
};

type SignupPageProps = {
  searchParams?: Promise<{
    next?: string;
  }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = searchParams ? await searchParams : undefined;

  return <AuthView mode="signup" nextPath={params?.next || "/"} />;
}
