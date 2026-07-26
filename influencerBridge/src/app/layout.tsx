import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { ToastProvider } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: {
    default: "InfluencerBridge – Connect Brands & Influencers",
    template: "%s | InfluencerBridge",
  },
  description:
    "InfluencerBridge is the leading platform for location-based influencer discovery and brand campaign collaboration.",
  keywords: ["influencer marketing", "brand campaigns", "influencer discovery", "collaboration platform"],
  openGraph: {
    title: "InfluencerBridge",
    description: "Connect brands and influencers through location-based discovery.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <Navbar />
          <main>{children}</main>
        </ToastProvider>
      </body>
    </html>
  );
}
