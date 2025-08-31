import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { FlowWalletProvider } from "@/components/flow-wallet-provider"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "FlowTravel Insurance",
  description: "Decentralized Travel Insurance on Flow Blockchain",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <FlowWalletProvider>{children}</FlowWalletProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
