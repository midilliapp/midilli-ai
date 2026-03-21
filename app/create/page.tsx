import type { Metadata } from "next";
import CreateClient from "./create-client";

export const metadata: Metadata = {
  title: "Create",
  description: "Generate stunning AI images and videos with MIDILLI. 10+ models, instant results.",
};

export default function CreatePage() {
  return <CreateClient />;
}
