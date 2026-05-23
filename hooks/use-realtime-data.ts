"use client"
import { useEffect, useState } from "react"

export function useRealtimeStats() {
  const [stats, setStats] = useState({
    totalPolicies: 0,
    activeClaims: 0,
    totalLiquidity: 0,
    oracleStatus: "healthy" as "healthy" | "warning" | "error",
  })

  useEffect(() => {
    // Mock real-time stats updates
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        totalPolicies: prev.totalPolicies + Math.floor(Math.random() * 3),
        activeClaims: Math.max(0, prev.activeClaims + Math.floor(Math.random() * 5) - 2),
        totalLiquidity: prev.totalLiquidity + Math.floor(Math.random() * 10000),
      }))
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return stats
}
