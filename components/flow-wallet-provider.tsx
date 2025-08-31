"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

let fcl: any = null

// Configure FCL for Flow blockchain - only on client side
const configureFCL = async () => {
  if (typeof window !== "undefined" && !fcl) {
    fcl = await import("@onflow/fcl")
    fcl.config({
      "accessNode.api": "https://rest-testnet.onflow.org", // Testnet
      "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn", // Testnet wallet discovery
      "0xProfile": "0xba1132bc08f82fe2", // Profile contract address
      "0xFlowToken": "0x7e60df042a9c0868", // FlowToken contract address
    })
  }
}

interface FlowWalletContextType {
  user: any
  logIn: () => void
  logOut: () => void
  isLoading: boolean
}

const FlowWalletContext = createContext<FlowWalletContextType | undefined>(undefined)

export function FlowWalletProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeFCL = async () => {
      await configureFCL()
      if (fcl) {
        // Subscribe to authentication state changes
        const unsubscribe = fcl.currentUser.subscribe(setUser)
        setIsLoading(false)
        return unsubscribe
      }
      setIsLoading(false)
    }

    initializeFCL()
  }, [])

  const logIn = async () => {
    await configureFCL()
    if (fcl) {
      fcl.authenticate()
    }
  }

  const logOut = async () => {
    await configureFCL()
    if (fcl) {
      fcl.unauthenticate()
    }
  }

  return <FlowWalletContext.Provider value={{ user, logIn, logOut, isLoading }}>{children}</FlowWalletContext.Provider>
}

export function useFlowWallet() {
  const context = useContext(FlowWalletContext)
  if (context === undefined) {
    throw new Error("useFlowWallet must be used within a FlowWalletProvider")
  }
  return context
}
