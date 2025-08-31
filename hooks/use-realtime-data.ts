"use client"

import { useEffect, useState, useCallback } from "react"
import { subscribeToTable, type RealtimeSubscription } from "@/lib/supabase/realtime"

export function useRealtimeTable<T = any>(tableName: string, initialData: T[] = []) {
  const [data, setData] = useState<T[]>(initialData)
  const [isConnected, setIsConnected] = useState(false)

  const handleRealtimeUpdate = useCallback(
    (payload: {
      eventType: "INSERT" | "UPDATE" | "DELETE"
      new: T | null
      old: T | null
    }) => {
      console.log(`[v0] Realtime update for ${tableName}:`, payload.eventType, payload.new)

      setData((currentData) => {
        switch (payload.eventType) {
          case "INSERT":
            if (payload.new) {
              return [...currentData, payload.new]
            }
            return currentData

          case "UPDATE":
            if (payload.new) {
              return currentData.map((item) => ((item as any).id === (payload.new as any).id ? payload.new : item))
            }
            return currentData

          case "DELETE":
            if (payload.old) {
              return currentData.filter((item) => (item as any).id !== (payload.old as any).id)
            }
            return currentData

          default:
            return currentData
        }
      })
    },
    [tableName],
  )

  useEffect(() => {
    console.log(`[v0] Setting up realtime subscription for ${tableName}`)
    setIsConnected(true)

    const subscription: RealtimeSubscription = subscribeToTable(tableName, handleRealtimeUpdate)

    return () => {
      console.log(`[v0] Cleaning up realtime subscription for ${tableName}`)
      subscription.unsubscribe()
      setIsConnected(false)
    }
  }, [tableName, handleRealtimeUpdate])

  return { data, setData, isConnected }
}

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
