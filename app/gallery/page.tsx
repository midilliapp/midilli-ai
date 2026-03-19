import type { Metadata } from "next";
import GalleryClient from "./gallery-client";

export const metadata: Metadata = {
  title: "Gallery — Midilli AI",
  description: "Explore AI-generated images and videos from the Midilli AI community.",
};

export default function GalleryPage() {
  return <GalleryClient />;
}
