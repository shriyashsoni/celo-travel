"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, Droplets, Shield, Zap } from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface PoolData {
  totalValue: number
  availableLiquidity: number
  reservedPayouts: number
  yieldGenerated: number
}

export function PoolPerformance() {
  const [poolData, setPoolData] = useState<PoolData>({
    totalValue: 0,
    availableLiquidity: 0,
    reservedPayouts: 0,
    yieldGenerated: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPoolData() {
      const supabase = createClient()

      try {
        const { data: poolInfo } = await supabase.from("insurance_pools").select("*").single()

        if (poolInfo) {
          const totalValue = Number.parseFloat(poolInfo.current_balance_onchain || "0")
          const reservedPayouts = Number.parseFloat(poolInfo.reserved_payouts || "0")
          const availableLiquidity = totalValue - reservedPayouts
          const yieldGenerated = Number.parseFloat(poolInfo.yield_earned || "0")

          setPoolData({
            totalValue,
            availableLiquidity,
            reservedPayouts,
            yieldGenerated,
          })
        }
      } catch (error) {
        console.error("[v0] Error fetching pool data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPoolData()
  }, [])

  const poolMetrics = [
    {
      label: "Total Pool Value",
      value: loading ? "..." : `$${(poolData.totalValue / 1000).toFixed(1)}K`,
      change: "+5.2%",
      trend: "up" as const,
      icon: DollarSign,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "Available Liquidity",
      value: loading ? "..." : `$${(poolData.availableLiquidity / 1000).toFixed(1)}K`,
      change: "+2.1%",
      trend: "up" as const,
      icon: Droplets,
      color: "text-cyan-600",
      bgColor: "bg-cyan-100",
    },
    {
      label: "Reserved Payouts",
      value: loading ? "..." : `$${(poolData.reservedPayouts / 1000).toFixed(1)}K`,
      change: "+12.3%",
      trend: "up" as const,
      icon: Shield,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      label: "Yield Generated",
      value: loading ? "..." : `$${(poolData.yieldGenerated / 1000).toFixed(1)}K`,
      change: "+8.7%",
      trend: "up" as const,
      icon: Zap,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ]

  const liquidityRatio =
    poolData.totalValue > 0 ? ((poolData.availableLiquidity / poolData.totalValue) * 100).toFixed(1) : "0.0"

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 opacity-5">
        <img src="/placeholder.svg?key=pool1" alt="Pool Performance" className="w-full h-full object-contain" />
      </div>

      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <DollarSign className="h-5 w-5 text-primary" />
          </div>
          Pool Performance
        </CardTitle>
        <CardDescription>Insurance pool metrics and liquidity status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 relative z-10">
        {poolMetrics.map((metric) => (
          <div
            key={metric.label}
            className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${metric.bgColor} rounded-lg flex items-center justify-center`}>
                <metric.icon className={`h-5 w-5 ${metric.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <p className="text-lg font-semibold">{metric.value}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {metric.trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-chart-3" />
              ) : (
                <TrendingDown className="h-4 w-4 text-chart-2" />
              )}
              <Badge variant={metric.trend === "up" ? "default" : "destructive"} className="text-xs">
                {metric.change}
              </Badge>
            </div>
          </div>
        ))}

        <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-3 w-3 rounded-full bg-chart-3 animate-pulse shadow-sm"></div>
            <span className="text-sm font-medium">
              Pool Health:{" "}
              <span
                className={`font-semibold ${
                  Number.parseFloat(liquidityRatio) > 60
                    ? "text-green-600"
                    : Number.parseFloat(liquidityRatio) > 40
                      ? "text-yellow-600"
                      : "text-red-600"
                }`}
              >
                {Number.parseFloat(liquidityRatio) > 60
                  ? "Excellent"
                  : Number.parseFloat(liquidityRatio) > 40
                    ? "Good"
                    : "Caution"}
              </span>
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Liquidity ratio: {liquidityRatio}%</span>
            <span>Risk coverage: 94.2%</span>
          </div>
          <div className="mt-3 w-full bg-muted rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-500"
              style={{ width: `${liquidityRatio}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
