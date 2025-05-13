"use client"

import { useEffect } from "react"
import Script from "next/script"

export function Analytics() {
  // Initialize analytics on mount
  useEffect(() => {
    // Initialize page view tracking
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", "page_view", {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname,
      })
    }

    // Track performance metrics
    if (typeof window !== "undefined" && "performance" in window) {
      // Use Performance API to track page load time
      window.addEventListener("load", () => {
        setTimeout(() => {
          const perfData = window.performance.timing
          const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart

          if (typeof (window as any).gtag !== "undefined") {
            ;(window as any).gtag("event", "performance", {
              event_category: "timing",
              event_label: "page_load",
              value: pageLoadTime,
            })
          }
        }, 0)
      })
    }
  }, [])

  return (
    <>
      {/* Google Analytics */}
      <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=GA-MEASUREMENT-ID`} />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA-MEASUREMENT-ID', {
              page_path: window.location.pathname,
              cookie_flags: 'SameSite=None;Secure'
            });
          `,
        }}
      />

      {/* Facebook Pixel */}
      <Script
        id="facebook-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', 'FACEBOOK-PIXEL-ID');
            fbq('track', 'PageView');
          `,
        }}
      />

      {/* Generic CPA Pixel */}
      <Script
        id="cpa-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // Replace with your CPA network's tracking code
            (function() {
              var script = document.createElement('script');
              script.async = true;
              script.src = 'https://tracking.cpanetwork.com/pixel.js?id=CPA-TRACKING-ID';
              document.head.appendChild(script);
            })();
          `,
        }}
      />
    </>
  )
}
