"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import Link from "next/link"

export default function Hero() {
  const [connectionSpeed, setConnectionSpeed] = useState<string>("4g")
  const videoRef = useRef<HTMLVideoElement>(null)
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  // Detect connection speed
  useEffect(() => {
    if ("connection" in navigator && (navigator as any).connection) {
      const connection = (navigator as any).connection
      setConnectionSpeed(connection.effectiveType)
    }
  }, [])

  // Track hero view
  useEffect(() => {
    if (inView) {
      // Fire GA4 event when hero is in view
      if (typeof window !== "undefined" && (window as any).gtag) {
        ;(window as any).gtag("event", "view_hero", {
          event_category: "engagement",
          event_label: "hero_section",
        })
      }
    }
  }, [inView])

  // Track CTA clicks
  const handleCtaClick = (platform: string) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", "click", {
        event_category: "cta",
        event_label: `hero_${platform.toLowerCase()}`,
        game_id: "all",
      })
    }
  }

  // Add this function after the handleCtaClick function
  const scrollToGames = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const gamesSection = document.getElementById("games-section")
    if (gamesSection) {
      gamesSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section ref={ref} className="hero-section-small relative" data-test="hero-section">
      {/* Enhanced background with Minecraft pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-mc-grass via-mc-dirt to-mc-stone z-0"></div>

      {/* Minecraft pattern overlay */}
      <div className="absolute inset-0 z-0 opacity-20 minecraft-grid-overlay"></div>

      {/* Animated particles effect */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-none bg-white opacity-20"
            style={{
              width: `${Math.random() * 8 + 3}px`,
              height: `${Math.random() * 8 + 3}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Dark overlay */}
      <div className="hero-overlay z-2 opacity-60"></div>

      {/* Hero content */}
      <div className="hero-content z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center px-4 sm:px-6 max-w-4xl mx-auto"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3 leading-tight minecraft-text-shadow"
          >
            Download the Best Minecraft Mods Today!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base sm:text-lg text-white mb-4 sm:mb-6 max-w-2xl mx-auto minecraft-text"
          >
            Experience amazing gameplay, exciting mods, and exclusive content
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-row gap-3 justify-center"
          >
            <Link
              href="#games-section"
              onClick={(e) => {
                handleCtaClick("Android")
                scrollToGames(e)
              }}
              data-test="cta-hero-android"
              className="bg-mc-grass hover:bg-mc-grass-dark text-white font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-none text-sm sm:text-base transition-all duration-300 flex items-center justify-center shadow-lg border-2 border-black minecraft-button"
            >
              Android Edition
            </Link>
            <Link
              href="#games-section"
              onClick={(e) => {
                handleCtaClick("Apple")
                scrollToGames(e)
              }}
              data-test="cta-hero-apple"
              className="bg-mc-stone hover:bg-mc-stone-dark text-white font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-none text-sm sm:text-base transition-all duration-300 flex items-center justify-center shadow-lg border-2 border-black minecraft-button"
            >
              Apple Edition
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
