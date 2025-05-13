"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { motion, AnimatePresence, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"
import Image from "next/image"
import { Search, X, Smartphone, Apple } from "lucide-react"

// Sample games data with Minecraft Prop Hunt Mod first
const games = [
  {
    id: "minecraft-prophunt",
    name: "Minecraft Prop Hunt Mod",
    teaser:
      "Hide as blocks and items while your friends try to find you! This exciting mod brings the classic Prop Hunt gameplay to Minecraft with endless hiding possibilities.",
    coverArt: "https://cdn-0001.qstv.on.epicgames.com/jYXEyriYmvubeUbagB/image/landscape_comp.jpeg",
    rating: 4.7,
    category: "Multiplayer",
    downloadLink: "https://installchecker.com/cl/i/2ljrpw",
  },
  {
    id: "minecraft-mod",
    name: "Minecraft 200 Mods",
    teaser:
      "Transform your Minecraft experience with 200+ mods including new creatures, weapons, armor, vehicles, and dragons. Explore an entirely new gaming dimension!",
    coverArt: "/images/minecraft-mod.jpg",
    rating: 4.8,
    category: "Adventure",
    downloadLink: "https://installchecker.com/cl/i/2ljrpw",
  },
  {
    id: "retro-bowl",
    name: "Retro Bowl Mod",
    teaser:
      "The perfect game for the armchair quarterback to finally prove a point. Presented in a glorious retro style, the game has simple roster management.",
    coverArt:
      "https://www.apple.com/newsroom/images/2024/08/apple-arcade-launches-three-new-games-in-september-including-nfl-retro-bowl-25/article/Apple-Arcade-hero_big.jpg.large.jpg",
    rating: 4.9,
    category: "Sports",
    downloadLink: "https://installchecker.com/cl/i/2ljrpw",
  },
]

export default function GameCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredGames, setFilteredGames] = useState(games)
  const [isSearching, setIsSearching] = useState(false)
  const [hasFocus, setHasFocus] = useState(false)
  const [showSwipeHint, setShowSwipeHint] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkMobile()

    // Add resize listener
    window.addEventListener("resize", checkMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Hide swipe hint after 5 seconds
  useEffect(() => {
    if (showSwipeHint) {
      const timer = setTimeout(() => {
        setShowSwipeHint(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [showSwipeHint])

  // Animate when in view
  useEffect(() => {
    if (inView) {
      controls.start("visible")

      // Track carousel view
      if (typeof window !== "undefined" && (window as any).gtag) {
        ;(window as any).gtag("event", "view_carousel", {
          event_category: "engagement",
          event_label: "game_carousel",
        })
      }
    }
  }, [controls, inView])

  // Handle search with debounce
  useEffect(() => {
    setIsSearching(true)

    const timer = setTimeout(() => {
      if (!searchTerm.trim()) {
        setFilteredGames(games)
      } else {
        const filtered = games.filter(
          (game) =>
            game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            game.teaser.toLowerCase().includes(searchTerm.toLowerCase()) ||
            game.category.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        setFilteredGames(filtered)
      }
      setIsSearching(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Update scroll position and navigation state
  useEffect(() => {
    const handleScroll = () => {
      if (carouselRef.current) {
        const position = carouselRef.current.scrollLeft
        const maxScroll = carouselRef.current.scrollWidth - carouselRef.current.clientWidth

        setScrollPosition(position)
        setCanScrollLeft(position > 10)
        setCanScrollRight(position < maxScroll - 10)
      }
    }

    const carouselElement = carouselRef.current
    if (carouselElement) {
      carouselElement.addEventListener('scroll', handleScroll)
      // Initial check
      handleScroll()

      return () => {
        carouselElement.removeEventListener('scroll', handleScroll)
      }
    }
  }, [filteredGames])

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)
  }

  // Clear search
  const clearSearch = () => {
    setSearchTerm("")
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }

  // Track game clicks
  const handleGameClick = (gameId: string, gameName: string, downloadLink: string) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", "game_click", {
        event_category: "cta",
        event_label: gameName,
        game_id: gameId,
      })
    }

    // Open the download link
    window.open(downloadLink, "_blank")
  }

  // Handle image load
  const handleImageLoad = (gameId: string) => {
    setLoadedImages((prev) => new Set(prev).add(gameId))
  }

  // Handle carousel navigation
  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = isMobile ? carouselRef.current.clientWidth * 0.8 : carouselRef.current.clientWidth * 0.5
      const newPosition = direction === 'left' 
        ? Math.max(0, scrollPosition - scrollAmount)
        : scrollPosition + scrollAmount
      
      carouselRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      })

      setShowSwipeHint(false)
    }
  }

  return (
    <section
      ref={ref}
      id="games-section"
      className="py-6 sm:py-8 relative minecraft-section"
      data-test="game-carousel-section"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-mc-dirt via-mc-dirt-dark to-mc-stone opacity-90 z-0"></div>

      {/* Minecraft-style grid overlay */}
      <div className="absolute inset-0 z-0 minecraft-grid-overlay"></div>

      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center text-white minecraft-text-shadow">
          Featured Mods
        </h2>

        {/* Search Bar */}
        <div className={`relative max-w-md mx-auto mb-6 transition-all duration-300 ${hasFocus ? "scale-105" : ""}`}>
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setHasFocus(true)}
            onBlur={() => setHasFocus(false)}
            placeholder="Search mods..."
            className="w-full bg-mc-stone-light bg-opacity-90 backdrop-blur-sm border border-mc-dirt rounded-none py-2 px-4 pl-10 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-mc-grass focus:border-transparent shadow-md minecraft-input"
            aria-label="Search games"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className={`h-4 w-4 ${isSearching ? "text-mc-grass animate-pulse" : "text-mc-grass"}`} />
          </div>
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {isSearching ? (
            <motion.div
              key="searching"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center py-8"
            >
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 border-4 border-mc-grass border-t-transparent rounded-full animate-spin mb-2"></div>
                <p className="text-white text-sm minecraft-text">Searching...</p>
              </div>
            </motion.div>
          ) : filteredGames.length > 0 ? (
            <div className="carousel-container relative">
              {/* Scrollable Content Indicator */}
              {filteredGames.length > 1 && (
                <div className="scroll-indicator-container">
                  <div className="scroll-indicator"></div>
                </div>
              )}

              {/* Swipe hint for mobile */}
              {showSwipeHint && isMobile && (
                <div className="swipe-hint">
                  <div className="swipe-icon"></div>
                  <p>Swipe to see more</p>
                </div>
              )}

              {/* Carousel */}
              <div ref={carouselRef} className="games-carousel" onTouchStart={() => setShowSwipeHint(false)}>
                {filteredGames.map((game, index) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.05,
                    }}
                    className="game-card"
                  >
                    <div className="minecraft-card bg-mc-stone-light rounded-none border-2 border-mc-stone-dark overflow-hidden h-full flex flex-col w-full">
                      <div className="relative h-48 w-full">
                        {/* Show skeleton while image loads */}
                        {!loadedImages.has(game.id) && (
                          <div className="absolute inset-0 bg-mc-stone animate-pulse"></div>
                        )}
                        <Image
                          src={game.coverArt || "/placeholder.svg"}
                          alt={game.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                          onLoad={() => handleImageLoad(game.id)}
                          loading="lazy"
                        />

                        {/* Platform availability sign */}
                        <div className="absolute top-0 right-0 bg-black bg-opacity-70 p-1 m-2 border-2 border-mc-stone-dark minecraft-platform-badge">
                          <div className="flex items-center space-x-1">
                            <Smartphone className="h-4 w-4 text-mc-grass" />
                            <span className="text-white text-xs minecraft-text">+</span>
                            <Apple className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      </div>
                      <div className="p-3 flex-grow flex flex-col bg-mc-stone-light">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-bold text-sm sm:text-base minecraft-text">{game.name}</h3>
                          <div className="minecraft-platform-sign px-2 py-0.5 bg-mc-wood border border-mc-wood-dark">
                            <span className="text-white text-xs minecraft-text">iOS & Android</span>
                          </div>
                        </div>
                        <p className="text-gray-700 text-xs sm:text-sm mb-2 line-clamp-2">{game.teaser}</p>
                        <button
                          onClick={() => handleGameClick(game.id, game.name, game.downloadLink)}
                          data-test={`cta-game-${game.id}`}
                          className="mt-auto w-full bg-mc-grass hover:bg-mc-grass-dark text-white font-bold py-2 px-3 rounded-none text-xs sm:text-sm transition-colors duration-300 minecraft-button"
                        >
                          Install
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-mc-stone-light bg-opacity-90 rounded-none border-2 border-mc-stone-dark p-4 text-center shadow-md max-w-md mx-auto minecraft-card"
            >
              <svg
                className="w-10 h-10 text-mc-grass mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <h3 className="text-lg font-bold mb-1 minecraft-text">No mods found</h3>
              <p className="text-gray-600 mb-3 text-sm">We couldn't find any mods matching "{searchTerm}"</p>
              <button
                onClick={clearSearch}
                className="bg-mc-grass hover:bg-mc-grass-dark text-white font-bold py-2 px-4 rounded-none text-sm transition-colors duration-300 minecraft-button"
              >
                Show all mods
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
