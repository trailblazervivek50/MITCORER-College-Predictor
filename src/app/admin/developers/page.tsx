import type { Metadata } from "next";
import DeveloperPageClient from "./DeveloperPageClient";

export const metadata: Metadata = {
  title: "Developer Team | MHT-CET & JEE Predictor",
  description: "Private developer information page for the MHT-CET & JEE Predictor tool.",
  robots: { index: false, follow: false },
};

/**
 * Admin Developer Page — /admin/developers
 *
 * Currently shows developer cards.
 */
export default function DevelopersPage() {
  return <DeveloperPageClient />;
}
