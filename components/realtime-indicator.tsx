"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff } from "lucide-react"

interface RealtimeIndicatorProps {
  isConnected: boolean
  lastUpdate?: string
}

export function RealtimeIndicator({ isConnected, lastUpdate }: RealtimeIndicatorProps) {
  const [pulseCount, setPulseCount] = useState(0)

  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        setPulseCount((prev) => prev + 1)
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [isConnected])

  return (
    <div className="flex items-center gap-2">
      <Badge
        variant={isConnected ? "default" : "destructive"}
        className={`flex items-center gap-1 ${isConnected ? "animate-pulse" : ""}`}
      >
        {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
        {isConnected ? "Live" : "Offline"}
      </Badge>
      {lastUpdate && (
        <span className="text-xs text-muted-foreground">Updated: {new Date(lastUpdate).toLocaleTimeString()}</span>
      )}
    </div>
  )
}
