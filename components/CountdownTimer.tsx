"use client"

import { useState, useEffect } from "react"
import { useInView } from "react-intersection-observer"
import { Clock, Gift, ChevronDown } from "lucide-react"

interface CountdownTimerProps {
  endTime: Date
}

export default function CountdownTimer({ endTime }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = endTime.getTime() - new Date().getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      } else {
        // Timer expired
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [endTime])

  // Track timer view
  useEffect(() => {
    if (inView && typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", "view_countdown", {
        event_category: "engagement",
        event_label: "countdown_timer",
        days_remaining: timeLeft.days,
      })
    }
  }, [inView, timeLeft.days])

  // Scroll to games section
  const scrollToGames = () => {
    const gamesSection = document.getElementById("games-section")
    if (gamesSection) {
      gamesSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section ref={ref} className="relative py-0 bg-mc-dirt text-white" data-test="countdown-section">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-mc-grass via-mc-grass-dark to-mc-grass"></div>

      <div className="container mx-auto px-4 py-4 sm:py-5 relative z-10">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center mb-3 sm:mb-0">
            <div className="bg-mc-stone bg-opacity-20 backdrop-blur-sm p-2 rounded-none border border-black mr-3">
              <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-mc-grass" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold minecraft-text">Limited Time Bonus</h2>
              <p className="text-sm text-mc-grass minecraft-text">Download now for 500 free diamonds!</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <Clock className="w-5 h-5 text-mc-grass hidden sm:block" />
            <div className="flex space-x-1 sm:space-x-2">
              <TimeUnit value={timeLeft.days} label="D" />
              <TimeUnit value={timeLeft.hours} label="H" />
              <TimeUnit value={timeLeft.minutes} label="M" />
              <TimeUnit value={timeLeft.seconds} label="S" />
            </div>
          </div>
        </div>

        <div
          className="absolute bottom-1 left-1/2 transform -translate-x-1/2 cursor-pointer text-white opacity-70 hover:opacity-100 transition-opacity"
          onClick={scrollToGames}
        >
          <ChevronDown className="w-5 h-5" />
        </div>
      </div>
    </section>
  )
}

// Time unit component for cleaner code
function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-mc-stone bg-opacity-20 backdrop-blur-sm rounded-none p-1 sm:p-2 min-w-[40px] sm:min-w-[50px] text-center border border-black">
      <div className="text-lg sm:text-xl font-bold leading-tight minecraft-text">{value}</div>
      <div className="text-xs text-mc-grass minecraft-text">{label}</div>
    </div>
  )
}
