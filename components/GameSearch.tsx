"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search } from "lucide-react"

interface GameSearchProps {
  onSearch: (searchTerm: string) => void
}

export default function GameSearch({ onSearch }: GameSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    onSearch(value)

    // Track search event if not empty
    if (value.trim() && typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", "search_input", {
        event_category: "engagement",
        event_label: "game_search_input",
        search_term: value,
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchTerm)

    // Track search event
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", "search", {
        event_category: "engagement",
        event_label: "game_search",
        search_term: searchTerm,
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto mb-8"
    >
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search games..."
          className="w-full bg-white bg-opacity-90 backdrop-blur-sm border border-purple-300 rounded-full py-3 px-5 pl-12 pr-10 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-md"
          aria-label="Search games"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-purple-500" />
        </div>
        {searchTerm && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm("")
              onSearch("")
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </form>
    </motion.div>
  )
}
