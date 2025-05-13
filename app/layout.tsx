import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import Script from "next/script"
import { Analytics } from "@/components/Analytics"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Preload critical assets */}
        <link rel="preload" as="video" href="/videos/hero-background.mp4" />
        <link rel="preload" as="image" href="/images/hero-fallback.jpg" />

        {/* Schema.org markup for mobile applications */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MobileApplication",
              name: "Hot Mobile Games",
              operatingSystem: "iOS, ANDROID",
              applicationCategory: "GameApplication",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                ratingCount: "24653",
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <Suspense>{children}</Suspense>
        <Analytics />

        {/* Google Optimize for A/B testing */}
        <Script
          id="google-optimize"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(a,s,y,n,c,h,i,d,e){
                s.className+=' '+y;
                h.start=1*new Date;
                h.end=i=function(){s.className=s.className.replace(RegExp(' ?'+y),'')};
                (a[n]=a[n]||[]).hide=h;
                setTimeout(function(){i();h.end=null},c);
                h.timeout=c;
              })(window,document.documentElement,'async-hide','dataLayer',4000,
              {'OPT-XXXXXXX':true});
            `,
          }}
        />
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
