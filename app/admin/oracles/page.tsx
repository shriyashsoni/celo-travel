"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts"
import {
  Search,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Database,
  Globe,
  Settings,
  RefreshCw,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

interface Oracle {
  id: string
  name: string
  type: "weather" | "flight" | "medical" | "currency" | "location"
  status: "active" | "inactive" | "error" | "maintenance"
  reliability: number
  lastUpdate: string
  responseTime: number
  requestsToday: number
  successRate: number
  endpoint: string
  region: string
  provider: string
}

interface OracleMetrics {
  timestamp: string
  responseTime: number
  successRate: number
  requests: number
  errors: number
}

interface OracleStats {
  totalOracles: number
  activeOracles: number
  averageReliability: number
  totalRequests: number
  averageResponseTime: number
  errorRate: number
}

export default function OracleMonitoringPage() {
  const [oracles, setOracles] = useState<Oracle[]>([])
  const [filteredOracles, setFilteredOracles] = useState<Oracle[]>([])
  const [selectedOracle, setSelectedOracle] = useState<Oracle | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [metricsData, setMetricsData] = useState<OracleMetrics[]>([])
  const [stats, setStats] = useState<OracleStats>({
    totalOracles: 0,
    activeOracles: 0,
    averageReliability: 0,
    totalRequests: 0,
    averageResponseTime: 0,
    errorRate: 0,
  })
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false)

  // Mock data
  useEffect(() => {
    const mockOracles: Oracle[] = [
      {
        id: "1",
        name: "WeatherAPI Global",
        type: "weather",
        status: "active",
        reliability: 99.2,
        lastUpdate: "2024-03-15T10:30:00Z",
        responseTime: 145,
        requestsToday: 2847,
        successRate: 99.8,
        endpoint: "https://api.weatherapi.com/v1",
        region: "Global",
        provider: "WeatherAPI",
      },
      {
        id: "2",
        name: "FlightAware API",
        type: "flight",
        status: "active",
        reliability: 97.8,
        lastUpdate: "2024-03-15T10:29:45Z",
        responseTime: 230,
        requestsToday: 1923,
        successRate: 98.5,
        endpoint: "https://aeroapi.flightaware.com/aeroapi",
        region: "Global",
        provider: "FlightAware",
      },
      {
        id: "3",
        name: "Medical Emergency Oracle",
        type: "medical",
        status: "active",
        reliability: 98.5,
        lastUpdate: "2024-03-15T10:28:12Z",
        responseTime: 180,
        requestsToday: 456,
        successRate: 99.1,
        endpoint: "https://api.medical-oracle.com/v2",
        region: "Global",
        provider: "MedOracle",
      },
      {
        id: "4",
        name: "Currency Exchange Oracle",
        type: "currency",
        status: "error",
        reliability: 85.2,
        lastUpdate: "2024-03-15T09:45:23Z",
        responseTime: 890,
        requestsToday: 1234,
        successRate: 87.3,
        endpoint: "https://api.exchangerate-api.com/v4",
        region: "Global",
        provider: "ExchangeRate-API",
      },
      {
        id: "5",
        name: "Location Verification Oracle",
        type: "location",
        status: "maintenance",
        reliability: 96.7,
        lastUpdate: "2024-03-15T08:15:00Z",
        responseTime: 320,
        requestsToday: 789,
        successRate: 95.8,
        endpoint: "https://api.locationiq.com/v1",
        region: "Global",
        provider: "LocationIQ",
      },
    ]
    setOracles(mockOracles)
    setFilteredOracles(mockOracles)
    setSelectedOracle(mockOracles[0])

    // Calculate stats
    const newStats: OracleStats = {
      totalOracles: mockOracles.length,
      activeOracles: mockOracles.filter((o) => o.status === "active").length,
      averageReliability: mockOracles.reduce((sum, o) => sum + o.reliability, 0) / mockOracles.length,
      totalRequests: mockOracles.reduce((sum, o) => sum + o.requestsToday, 0),
      averageResponseTime: mockOracles.reduce((sum, o) => sum + o.responseTime, 0) / mockOracles.length,
      errorRate: 100 - mockOracles.reduce((sum, o) => sum + o.successRate, 0) / mockOracles.length,
    }
    setStats(newStats)

    // Mock metrics data
    const mockMetrics: OracleMetrics[] = [
      { timestamp: "00:00", responseTime: 150, successRate: 99.5, requests: 120, errors: 1 },
      { timestamp: "04:00", responseTime: 145, successRate: 99.8, requests: 89, errors: 0 },
      { timestamp: "08:00", responseTime: 180, successRate: 98.9, requests: 245, errors: 3 },
      { timestamp: "12:00", responseTime: 165, successRate: 99.2, requests: 320, errors: 2 },
      { timestamp: "16:00", responseTime: 155, successRate: 99.6, requests: 280, errors: 1 },
      { timestamp: "20:00", responseTime: 140, successRate: 99.9, requests: 195, errors: 0 },
    ]
    setMetricsData(mockMetrics)
  }, [])

  // Filter oracles
  useEffect(() => {
    let filtered = oracles

    if (searchTerm) {
      filtered = filtered.filter(
        (oracle) =>
          oracle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          oracle.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
          oracle.type.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((oracle) => oracle.status === statusFilter)
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((oracle) => oracle.type === typeFilter)
    }

    setFilteredOracles(filtered)
  }, [oracles, searchTerm, statusFilter, typeFilter])

  const getStatusBadge = (status: Oracle["status"]) => {
    const variants = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      error: "bg-red-100 text-red-800",
      maintenance: "bg-yellow-100 text-yellow-800",
    }
    const icons = {
      active: <CheckCircle className="w-3 h-3 mr-1" />,
      inactive: <XCircle className="w-3 h-3 mr-1" />,
      error: <AlertTriangle className="w-3 h-3 mr-1" />,
      maintenance: <Clock className="w-3 h-3 mr-1" />,
    }
    return (
      <Badge className={`${variants[status]} flex items-center`}>
        {icons[status]}
        {status.toUpperCase()}
      </Badge>
    )
  }

  const getTypeIcon = (type: Oracle["type"]) => {
    const icons = {
      weather: <Globe className="w-4 h-4" />,
      flight: <Zap className="w-4 h-4" />,
      medical: <Activity className="w-4 h-4" />,
      currency: <Database className="w-4 h-4" />,
      location: <Globe className="w-4 h-4" />,
    }
    return icons[type]
  }

  const getReliabilityColor = (reliability: number) => {
    if (reliability >= 98) return "text-green-600"
    if (reliability >= 95) return "text-yellow-600"
    return "text-red-600"
  }

  const refreshOracle = (oracleId: string) => {
    // Mock refresh functionality
    setOracles((prev) =>
      prev.map((oracle) =>
        oracle.id === oracleId
          ? { ...oracle, lastUpdate: new Date().toISOString(), status: "active" as const }
          : oracle,
      ),
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Oracle Monitoring</h1>
              <p className="text-muted-foreground">Monitor and manage data oracle services</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh All
              </Button>
              <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Settings className="w-4 h-4 mr-2" />
                    Configure
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Oracle Configuration</DialogTitle>
                    <DialogDescription>Configure oracle settings and thresholds</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reliabilityThreshold">Reliability Threshold (%)</Label>
                      <Input id="reliabilityThreshold" type="number" defaultValue="95" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="responseTimeThreshold">Response Time Threshold (ms)</Label>
                      <Input id="responseTimeThreshold" type="number" defaultValue="500" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="alertEmail">Alert Email</Label>
                      <Input id="alertEmail" type="email" placeholder="admin@flowtravel.com" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setIsConfigDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsConfigDialogOpen(false)}>Save Configuration</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Oracles</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalOracles}</div>
                <p className="text-xs text-muted-foreground">{stats.activeOracles} active</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Reliability</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageReliability.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline w-3 h-3 mr-1" />
                  +0.3% from yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalRequests.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Today</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.round(stats.averageResponseTime)}ms</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingDown className="inline w-3 h-3 mr-1" />
                  -15ms from yesterday
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Oracle List */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Oracle Services</CardTitle>
                <CardDescription>Monitor all connected oracle services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search oracles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="weather">Weather</SelectItem>
                      <SelectItem value="flight">Flight</SelectItem>
                      <SelectItem value="medical">Medical</SelectItem>
                      <SelectItem value="currency">Currency</SelectItem>
                      <SelectItem value="location">Location</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Oracle</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Reliability</TableHead>
                        <TableHead>Response Time</TableHead>
                        <TableHead>Requests</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOracles.map((oracle) => (
                        <TableRow
                          key={oracle.id}
                          className={`cursor-pointer ${selectedOracle?.id === oracle.id ? "bg-muted/50" : ""}`}
                          onClick={() => setSelectedOracle(oracle)}
                        >
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              {getTypeIcon(oracle.type)}
                              <div>
                                <div className="font-medium">{oracle.name}</div>
                                <div className="text-sm text-muted-foreground">{oracle.provider}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(oracle.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span className={`font-medium ${getReliabilityColor(oracle.reliability)}`}>
                                {oracle.reliability}%
                              </span>
                              <Progress value={oracle.reliability} className="w-16 h-2" />
                            </div>
                          </TableCell>
                          <TableCell>{oracle.responseTime}ms</TableCell>
                          <TableCell>{oracle.requestsToday.toLocaleString()}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => refreshOracle(oracle.id)}>
                              <RefreshCw className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Oracle Details */}
            <Card>
              <CardHeader>
                <CardTitle>{selectedOracle?.name}</CardTitle>
                <CardDescription>Oracle service details and metrics</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedOracle && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Status</span>
                        {getStatusBadge(selectedOracle.status)}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Type</span>
                        <span className="text-sm font-medium capitalize">{selectedOracle.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Provider</span>
                        <span className="text-sm font-medium">{selectedOracle.provider}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Region</span>
                        <span className="text-sm font-medium">{selectedOracle.region}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Reliability</span>
                        <span className={`text-sm font-medium ${getReliabilityColor(selectedOracle.reliability)}`}>
                          {selectedOracle.reliability}%
                        </span>
                      </div>
                      <Progress value={selectedOracle.reliability} className="w-full" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Success Rate</span>
                        <span className="text-sm font-medium">{selectedOracle.successRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Response Time</span>
                        <span className="text-sm font-medium">{selectedOracle.responseTime}ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Requests Today</span>
                        <span className="text-sm font-medium">{selectedOracle.requestsToday.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-sm text-muted-foreground">Last Update</span>
                      <p className="text-sm font-medium">{new Date(selectedOracle.lastUpdate).toLocaleString()}</p>
                    </div>

                    <div className="space-y-2">
                      <span className="text-sm text-muted-foreground">Endpoint</span>
                      <p className="text-xs font-mono bg-muted p-2 rounded break-all">{selectedOracle.endpoint}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => refreshOracle(selectedOracle.id)}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4 mr-2" />
                        Configure
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Performance Charts */}
          <Card>
            <CardHeader>
              <CardTitle>Oracle Performance Metrics</CardTitle>
              <CardDescription>Real-time performance data for all oracle services</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="response-time" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="response-time">Response Time</TabsTrigger>
                  <TabsTrigger value="success-rate">Success Rate</TabsTrigger>
                  <TabsTrigger value="requests">Request Volume</TabsTrigger>
                </TabsList>

                <TabsContent value="response-time" className="space-y-4">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={metricsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timestamp" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="responseTime"
                          stroke="#15803d"
                          strokeWidth={2}
                          name="Response Time (ms)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                <TabsContent value="success-rate" className="space-y-4">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={metricsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timestamp" />
                        <YAxis domain={[95, 100]} />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="successRate"
                          stroke="#84cc16"
                          fill="#84cc16"
                          fillOpacity={0.3}
                          name="Success Rate (%)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                <TabsContent value="requests" className="space-y-4">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={metricsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timestamp" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="requests" stroke="#15803d" strokeWidth={2} name="Requests" />
                        <Line type="monotone" dataKey="errors" stroke="#dc2626" strokeWidth={2} name="Errors" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
