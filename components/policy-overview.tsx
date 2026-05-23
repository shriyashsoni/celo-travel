"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plane, Users, DollarSign, Clock } from "lucide-react"
import { useEffect, useState } from "react"

interface PolicyStats {
  activePolicies: number
  totalCoverage: number
  claimsProcessed: number
  successRate: number
}

function Shield({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  )
}

export function PolicyOverview({ realPolicies = 0, realClaims = 0 }: { realPolicies?: number, realClaims?: number }) {
  const [stats, setStats] = useState<PolicyStats>({
    activePolicies: realPolicies > 0 ? realPolicies : 0,
    totalCoverage: realPolicies > 0 ? realPolicies * 500 : 0,
    claimsProcessed: realClaims > 0 ? realClaims : 0,
    successRate: realPolicies > 0 ? 100 : 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setStats({
      activePolicies: realPolicies,
      totalCoverage: realPolicies * 500,
      claimsProcessed: realClaims,
      successRate: realPolicies > 0 ? 100 : 0,
    })
    const loadingTimer = setTimeout(() => {
      setLoading(false)
    }, 500)

    return () => clearTimeout(loadingTimer)
  }, [])

  const policyStats = [
    {
      title: "Active Policies",
      value: loading ? "..." : stats.activePolicies.toLocaleString(),
      change: "+12.5%",
      icon: Shield,
      color: "text-chart-3",
    },
    {
      title: "Total Coverage",
      value: loading ? "..." : `$${(stats.totalCoverage / 1000).toFixed(1)}K`,
      change: "+8.2%",
      icon: DollarSign,
      color: "text-chart-1",
    },
    {
      title: "Claims Processed",
      value: loading ? "..." : stats.claimsProcessed.toString(),
      change: "+5.1%",
      icon: Clock,
      color: "text-chart-4",
    },
    {
      title: "Success Rate",
      value: loading ? "..." : `${stats.successRate.toFixed(1)}%`,
      change: "+2.1%",
      icon: Users,
      color: "text-chart-3",
    },
  ]

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
        <img src="/travel-insurance-shield-icon.png" alt="Insurance Shield" className="w-full h-full object-contain" />
      </div>

      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Plane className="h-5 w-5 text-primary" />
          </div>
          Policy Overview
        </CardTitle>
        <CardDescription>Real-time analytics for FlowTravel insurance policies</CardDescription>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {policyStats.map((stat) => (
            <div key={stat.title} className="flex flex-col justify-between space-y-4 p-5 rounded-2xl bg-black/40 border border-white/10 hover:bg-white/5 transition-colors">
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-xl bg-white/10 ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <Badge variant="secondary" className="text-xs bg-white/10 text-white hover:bg-white/20 border-0">
                  {stat.change}
                </Badge>
              </div>
              <div>
                <p className="text-3xl font-heading italic text-white">{stat.value}</p>
                <p className="text-sm font-light text-white/50 mt-1">{stat.title}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Coverage Distribution</h4>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Flight Delay Coverage</span>
                  <span className="text-muted-foreground">78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <Plane className="h-4 w-4 text-red-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Cancellation Coverage</span>
                  <span className="text-muted-foreground">65%</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Baggage Protection</span>
                  <span className="text-muted-foreground">42%</span>
                </div>
                <Progress value={42} className="h-2" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
