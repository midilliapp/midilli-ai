import type { Metadata } from "next";

import AuthView from "@/app/auth/auth-view";

export const metadata: Metadata = {
  title: "Log In",
  description: "Access your Midilli AI account securely.",
};

type LoginPageProps = {
  searchParams?: Promise<{
    confirmed?: string;
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = searchParams ? await searchParams : undefined;

  return (
    <AuthView
      mode="login"
      confirmed={params?.confirmed === "1"}
      nextPath={params?.next || "/dashboard"}
    />
  );
}
