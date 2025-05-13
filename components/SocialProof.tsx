"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

// Sample testimonials - in a real app, these would come from an API or CMS
const testimonials = [
  {
    id: 1,
    text: "This is the best collection of mobile games I've ever played!",
    name: "Sarah K.",
    avatar: "/images/avatar1.jpg",
  },
  {
    id: 2,
    text: "I'm addicted to Space Commander. The graphics are incredible!",
    name: "Mike T.",
    avatar: "/images/avatar2.jpg",
  },
  {
    id: 3,
    text: "These games are perfect for my daily commute. So much fun!",
    name: "Jessica L.",
    avatar: "/images/avatar3.jpg",
  },
]

export default function SocialProof() {
  const [playerCount, setPlayerCount] = useState(2345)
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  // Simulate real-time player count updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPlayerCount((prev) => prev + Math.floor(Math.random() * 5) + 1)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Track section view
  useEffect(() => {
    if (inView && typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", "view_social_proof", {
        event_category: "engagement",
        event_label: "social_proof_section",
      })
    }
  }, [inView])

  return (
    <section ref={ref} className="py-12 sm:py-16 bg-gray-50" data-test="social-proof-section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-full inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 shadow-lg mb-6 sm:mb-8"
          >
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full mr-2 sm:mr-3 animate-pulse-slow"></div>
            <span className="font-bold text-base sm:text-xl">
              {playerCount.toLocaleString()} players joined in last 24h
            </span>
          </motion.div>

          <div className="flex justify-center mb-6 sm:mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.svg
                key={star}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: star * 0.1 }}
                className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 mx-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </motion.svg>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-xl sm:text-2xl font-bold"
          >
            4.8 out of 5 stars from over 24,000 reviews
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="bg-white p-4 sm:p-6 rounded-xl shadow-md"
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden mr-3 sm:mr-4 bg-gray-200">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div>
                  <p className="font-bold">{testimonial.name}</p>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700">"{testimonial.text}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
