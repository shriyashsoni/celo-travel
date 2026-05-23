import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Providers } from "@/components/Providers"
import { Suspense } from "react"
import Navbar from "@/components/Navbar"
import "./globals.css"

export const metadata: Metadata = {
  title: "TravelShield | Parametric Flight Insurance on Celo",
  description: "AI-powered, automated flight delay insurance paid out in cUSD on the Celo network.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-body text-foreground antialiased bg-black overflow-x-hidden">
        <Suspense fallback={<div>Loading...</div>}>
          <Providers>
            <Navbar />
            {children}
          </Providers>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
