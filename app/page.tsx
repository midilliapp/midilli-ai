import type { Metadata } from "next";

import HomePageClient from "./home-page-client";

export const metadata: Metadata = {
  title: "AI Image and Video Studio",
  description:
    "Create visuals, preview motion prompts, and onboard users with a polished Midilli AI experience.",
};

export default function HomePage() {
  return <HomePageClient />;
}
