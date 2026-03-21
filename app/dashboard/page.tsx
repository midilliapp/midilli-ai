import type { Metadata } from "next";

import DashboardClient from "./dashboard-client";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your Midilli AI account and session.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardPage() {
  return <DashboardClient />;
}
