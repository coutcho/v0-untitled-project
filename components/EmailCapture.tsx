"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"

export default function EmailCapture() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const [isSticky, setIsSticky] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const lastScrollY = useRef(0)
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  // Handle scroll for sticky behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > 300) {
        setIsSticky(true)

        // Hide when scrolling down, show when scrolling up
        if (currentScrollY > lastScrollY.current) {
          setIsHidden(true)
        } else {
          setIsHidden(false)
        }
      } else {
        setIsSticky(false)
        setIsHidden(false)
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Animate when in view
  useEffect(() => {
    if (inView) {
      controls.start("visible")

      // Track email section view
      if (typeof window !== "undefined" && (window as any).gtag) {
        ;(window as any).gtag("event", "view_email_capture", {
          event_category: "engagement",
          event_label: "email_capture_section",
        })
      }
    }
  }, [controls, inView])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate email
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      // Track form submission
      if (typeof window !== "undefined" && (window as any).gtag) {
        ;(window as any).gtag("event", "email_signup", {
          event_category: "conversion",
          event_label: "email_capture",
          email_domain: email.split("@")[1],
        })
      }

      // In a real app, you would send this to your API
      // await fetch('/api/subscribe', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email }),
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsSuccess(true)
      setEmail("")
    } catch (err) {
      setError("Something went wrong. Please try again.")
      console.error("Subscription error:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      ref={ref}
      className={`py-10 bg-purple-700 text-white ${isSticky ? "email-capture-sticky" : ""} ${isHidden ? "hidden" : ""}`}
      data-test="email-capture-section"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
          }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Get free in-game currency when you sign up!</h2>
          <p className="mb-6">Join our community and receive exclusive rewards, game updates, and special offers.</p>

          {isSuccess ? (
            <div className="bg-green-600 text-white p-4 rounded-lg mb-4">
              Thanks for signing up! Check your email for your free in-game currency.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-grow px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                data-test="email-input"
                aria-label="Email address"
                disabled={isSubmitting}
              />
              <button
                type="submit"
                className={`px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold rounded-lg transition-colors duration-300 ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
                disabled={isSubmitting}
                data-test="email-submit"
              >
                {isSubmitting ? "Signing Up..." : "Sign Up"}
              </button>
            </form>
          )}

          {error && <p className="mt-2 text-red-300">{error}</p>}

          <p className="mt-4 text-sm opacity-80">
            By signing up, you agree to our{" "}
            <a href="#terms" className="underline">
              Terms & Conditions
            </a>{" "}
            and{" "}
            <a href="#privacy" className="underline">
              Privacy Policy
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
