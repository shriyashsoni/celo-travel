"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, TrendingDown, DollarSign, Users, Shield, AlertTriangle, Plus, Settings } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

interface Pool {
  id: string
  name: string
  totalLiquidity: number
  availableLiquidity: number
  activePolicies: number
  totalClaims: number
  riskLevel: "low" | "medium" | "high"
  apy: number
  status: "active" | "paused" | "closed"
  createdAt: string
  region: string
}

interface PoolPerformance {
  month: string
  liquidity: number
  claims: number
  policies: number
  revenue: number
}

export default function PoolsManagementPage() {
  const [pools, setPools] = useState<Pool[]>([])
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null)
  const [performanceData, setPerformanceData] = useState<PoolPerformance[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  // Mock data
  useEffect(() => {
    const mockPools: Pool[] = [
      {
        id: "pool-1",
        name: "Global Travel Pool",
        totalLiquidity: 2500000,
        availableLiquidity: 1800000,
        activePolicies: 1250,
        totalClaims: 45,
        riskLevel: "medium",
        apy: 8.5,
        status: "active",
        createdAt: "2024-01-15",
        region: "Global",
      },
      {
        id: "pool-2",
        name: "Europe Premium Pool",
        totalLiquidity: 1200000,
        availableLiquidity: 950000,
        activePolicies: 680,
        totalClaims: 12,
        riskLevel: "low",
        apy: 6.2,
        status: "active",
        createdAt: "2024-02-01",
        region: "Europe",
      },
      {
        id: "pool-3",
        name: "Adventure Sports Pool",
        totalLiquidity: 800000,
        availableLiquidity: 450000,
        activePolicies: 320,
        totalClaims: 28,
        riskLevel: "high",
        apy: 12.8,
        status: "active",
        createdAt: "2024-01-20",
        region: "Global",
      },
    ]
    setPools(mockPools)
    setSelectedPool(mockPools[0])

    const mockPerformance: PoolPerformance[] = [
      { month: "Jan", liquidity: 2200000, claims: 35000, policies: 1100, revenue: 125000 },
      { month: "Feb", liquidity: 2350000, claims: 42000, policies: 1180, revenue: 138000 },
      { month: "Mar", liquidity: 2500000, claims: 38000, policies: 1250, revenue: 145000 },
      { month: "Apr", liquidity: 2650000, claims: 45000, policies: 1320, revenue: 152000 },
      { month: "May", liquidity: 2800000, claims: 41000, policies: 1400, revenue: 165000 },
      { month: "Jun", liquidity: 2950000, claims: 48000, policies: 1480, revenue: 178000 },
    ]
    setPerformanceData(mockPerformance)
  }, [])

  const getRiskBadge = (risk: Pool["riskLevel"]) => {
    const variants = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-red-100 text-red-800",
    }
    return <Badge className={variants[risk]}>{risk.toUpperCase()}</Badge>
  }

  const getStatusBadge = (status: Pool["status"]) => {
    const variants = {
      active: "bg-green-100 text-green-800",
      paused: "bg-yellow-100 text-yellow-800",
      closed: "bg-red-100 text-red-800",
    }
    return <Badge className={variants[status]}>{status.toUpperCase()}</Badge>
  }

  const utilizationRate = selectedPool
    ? ((selectedPool.totalLiquidity - selectedPool.availableLiquidity) / selectedPool.totalLiquidity) * 100
    : 0

  const pieData = [
    { name: "Available", value: selectedPool?.availableLiquidity || 0, color: "#84cc16" },
    {
      name: "Utilized",
      value: (selectedPool?.totalLiquidity || 0) - (selectedPool?.availableLiquidity || 0),
      color: "#15803d",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Pool Management</h1>
              <p className="text-muted-foreground">Monitor and manage insurance liquidity pools</p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Pool
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Pool</DialogTitle>
                  <DialogDescription>Set up a new insurance liquidity pool</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="poolName">Pool Name</Label>
                    <Input id="poolName" placeholder="Enter pool name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="region">Region</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="global">Global</SelectItem>
                        <SelectItem value="europe">Europe</SelectItem>
                        <SelectItem value="asia">Asia</SelectItem>
                        <SelectItem value="americas">Americas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="initialLiquidity">Initial Liquidity ($)</Label>
                    <Input id="initialLiquidity" type="number" placeholder="1000000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="riskLevel">Risk Level</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select risk level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low Risk</SelectItem>
                        <SelectItem value="medium">Medium Risk</SelectItem>
                        <SelectItem value="high">High Risk</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsCreateDialogOpen(false)}>Create Pool</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Pool Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Liquidity</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${pools.reduce((sum, pool) => sum + pool.totalLiquidity, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline w-3 h-3 mr-1" />
                  +12.5% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Policies</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {pools.reduce((sum, pool) => sum + pool.activePolicies, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline w-3 h-3 mr-1" />
                  +8.2% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pools.reduce((sum, pool) => sum + pool.totalClaims, 0)}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingDown className="inline w-3 h-3 mr-1" />
                  -3.1% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average APY</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(pools.reduce((sum, pool) => sum + pool.apy, 0) / pools.length).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline w-3 h-3 mr-1" />
                  +0.5% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pool List */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Insurance Pools</CardTitle>
                <CardDescription>Select a pool to view details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pools.map((pool) => (
                  <div
                    key={pool.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedPool?.id === pool.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedPool(pool)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{pool.name}</h3>
                      {getStatusBadge(pool.status)}
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Liquidity:</span>
                        <span>${pool.totalLiquidity.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>APY:</span>
                        <span>{pool.apy}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Risk:</span>
                        {getRiskBadge(pool.riskLevel)}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Pool Details */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>{selectedPool?.name} Details</CardTitle>
                <CardDescription>Comprehensive pool information and metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Total Liquidity</Label>
                        <p className="text-2xl font-bold">${selectedPool?.totalLiquidity.toLocaleString()}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Available Liquidity</Label>
                        <p className="text-2xl font-bold">${selectedPool?.availableLiquidity.toLocaleString()}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Utilization Rate</Label>
                        <div className="space-y-2">
                          <Progress value={utilizationRate} className="w-full" />
                          <p className="text-sm text-muted-foreground">{utilizationRate.toFixed(1)}% utilized</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Active Policies</Label>
                        <p className="text-2xl font-bold">{selectedPool?.activePolicies}</p>
                      </div>
                    </div>

                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>

                  <TabsContent value="performance" className="space-y-4">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={performanceData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="liquidity" stroke="#15803d" strokeWidth={2} />
                          <Line type="monotone" dataKey="revenue" stroke="#84cc16" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>

                  <TabsContent value="settings" className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Pool Status</h3>
                          <p className="text-sm text-muted-foreground">Control pool operations</p>
                        </div>
                        <Button variant="outline">
                          <Settings className="w-4 h-4 mr-2" />
                          Manage
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Risk Parameters</h3>
                          <p className="text-sm text-muted-foreground">Adjust risk assessment settings</p>
                        </div>
                        <Button variant="outline">Configure</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Liquidity Management</h3>
                          <p className="text-sm text-muted-foreground">Add or remove liquidity</p>
                        </div>
                        <Button variant="outline">Manage</Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
