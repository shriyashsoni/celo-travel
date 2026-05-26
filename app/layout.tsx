import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Providers } from "@/components/Providers"
import { Suspense } from "react"
import { Toaster } from "sonner"
import Navbar from "@/components/Navbar"
import "./globals.css"

export const metadata: Metadata = {
  title: "TravelShield | Parametric Flight Insurance on Celo",
  description: "AI-powered, automated flight delay insurance paid out in cUSD on the Celo network.",
  generator: "v0.app",
  other: {
    "talentapp:project_verification": "06381889a1b3e6a4059ad49cac477515542c87cc3e2be4fd6031427dc08d78ff00bddacbd0187e52cd1b72db92776d401308be9d3529e421df1a66b2c2030935"
  }
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
        <Toaster theme="dark" position="top-right" />
        <Analytics />
      </body>
    </html>
  )
}
