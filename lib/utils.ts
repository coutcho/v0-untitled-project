import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Utility functions for the landing page

// Format number with commas
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

// Get device type
export function getDeviceType(): "mobile" | "tablet" | "desktop" {
  if (typeof window === "undefined") return "desktop"

  const width = window.innerWidth

  if (width < 640) return "mobile"
  if (width < 1024) return "tablet"
  return "desktop"
}

// Get connection speed
export function getConnectionSpeed(): string {
  if (typeof navigator === "undefined" || !("connection" in navigator)) {
    return "4g"
  }

  const connection = (navigator as any).connection
  return connection.effectiveType || "4g"
}

// Track event
export function trackEvent(eventName: string, eventData: Record<string, any> = {}): void {
  if (typeof window === "undefined" || !(window as any).gtag) return
  ;(window as any).gtag("event", eventName, {
    ...eventData,
    timestamp: new Date().toISOString(),
  })
}

// Track conversion
export function trackConversion(conversionType: string, value = 0): void {
  // Google Analytics
  if (typeof window !== "undefined" && (window as any).gtag) {
    ;(window as any).gtag("event", "conversion", {
      send_to: "GA-MEASUREMENT-ID/CONVERSION-LABEL",
      value: value,
      currency: "USD",
      transaction_id: Date.now().toString(),
    })
  }

  // Facebook Pixel
  if (typeof window !== "undefined" && (window as any).fbq) {
    ;(window as any).fbq("track", "Lead", {
      value: value,
      currency: "USD",
      content_name: conversionType,
    })
  }

  // Generic CPA Pixel
  if (typeof window !== "undefined" && (window as any).cpa_track) {
    ;(window as any).cpa_track("conversion", {
      type: conversionType,
      value: value,
    })
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
