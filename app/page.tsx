import Hero from "@/components/Hero"
import GameCarousel from "@/components/GameCarousel"
import SocialProof from "@/components/SocialProof"
import FeaturesGrid from "@/components/FeaturesGrid"
import CountdownTimer from "@/components/CountdownTimer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Download the Hottest Mobile Games Today!",
  description:
    "Get access to the most exciting mobile games with stunning graphics, no ads, daily rewards, and PvP tournaments.",
  openGraph: {
    title: "Download the Hottest Mobile Games Today!",
    description:
      "Get access to the most exciting mobile games with stunning graphics, no ads, daily rewards, and PvP tournaments.",
    images: ["/images/og-image.jpg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Download the Hottest Mobile Games Today!",
    description:
      "Get access to the most exciting mobile games with stunning graphics, no ads, daily rewards, and PvP tournaments.",
    images: ["/images/og-image.jpg"],
  },
}

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Hero />
      {/* Countdown Timer - Now placed right after Hero */}
      <CountdownTimer endTime={new Date(Date.now() + 86400000 * 3)} /> {/* 3 days from now */}
      {/* Game Showcase Carousel */}
      <GameCarousel />
      {/* Social Proof */}
      <SocialProof />
      {/* Features Grid */}
      <FeaturesGrid />
    </main>
  )
}
