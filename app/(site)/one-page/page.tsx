import type { Metadata } from "next";
import { OnePageTest } from "@/components/one-page/one-page-test";

export const metadata: Metadata = {
  title: "The One-Page Test",
  description:
    "Could you show your whole financial life on one page? Seven questions, two minutes, no sign-up. Get your page and a checklist.",
  alternates: { canonical: "/one-page" },
  openGraph: {
    title: "The One-Page Test",
    description: "Seven questions, two minutes, no sign-up. See what's on your page and what isn't.",
    url: "/one-page",
  },
};

export default function OnePage() {
  return <OnePageTest />;
}
