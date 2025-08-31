"use client"

import { Label } from "@/components/ui/label"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Download, FileText, TrendingUp, TrendingDown, DollarSign, Users, Shield, Activity } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { RealtimeIndicator } from "@/components/realtime-indicator"
import { useRealtimeStats } from "@/hooks/use-realtime-data"

interface ReportData {
  period: string
  policies: number
  claims: number
  revenue: number
  payouts: number
  profit: number
}

interface RegionalData {
  region: string
  policies: number
  claims: number
  revenue: number
  color: string
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData[]>([])
  const [regionalData, setRegionalData] = useState<RegionalData[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState("monthly")
  const [selectedMetric, setSelectedMetric] = useState("revenue")
  const realtimeStats = useRealtimeStats()

  useEffect(() => {
    // Mock report data
    const mockReportData: ReportData[] = [
      { period: "Jan 2024", policies: 1200, claims: 45, revenue: 180000, payouts: 85000, profit: 95000 },
      { period: "Feb 2024", policies: 1350, claims: 52, revenue: 202500, payouts: 98000, profit: 104500 },
      { period: "Mar 2024", policies: 1480, claims: 38, revenue: 222000, payouts: 76000, profit: 146000 },
      { period: "Apr 2024", policies: 1620, claims: 61, revenue: 243000, payouts: 122000, profit: 121000 },
      { period: "May 2024", policies: 1750, claims: 44, revenue: 262500, payouts: 88000, profit: 174500 },
      { period: "Jun 2024", policies: 1890, claims: 57, revenue: 283500, payouts: 114000, profit: 169500 },
    ]
    setReportData(mockReportData)

    const mockRegionalData: RegionalData[] = [
      { region: "North America", policies: 3200, claims: 125, revenue: 480000, color: "#15803d" },
      { region: "Europe", policies: 2800, claims: 98, revenue: 420000, color: "#84cc16" },
      { region: "Asia Pacific", policies: 2100, claims: 76, revenue: 315000, color: "#f59e0b" },
      { region: "Latin America", policies: 1200, claims: 45, revenue: 180000, color: "#dc2626" },
      { region: "Other", policies: 800, claims: 32, revenue: 120000, color: "#6b7280" },
    ]
    setRegionalData(mockRegionalData)
  }, [])

  const totalRevenue = reportData.reduce((sum, item) => sum + item.revenue, 0)
  const totalPolicies = reportData.reduce((sum, item) => sum + item.policies, 0)
  const totalClaims = reportData.reduce((sum, item) => sum + item.claims, 0)
  const totalPayouts = reportData.reduce((sum, item) => sum + item.payouts, 0)

  const exportReport = (format: "csv" | "pdf") => {
    if (format === "csv") {
      const csvContent =
        "data:text/csv;charset=utf-8," +
        "Period,Policies,Claims,Revenue,Payouts,Profit\n" +
        reportData.map((r) => `${r.period},${r.policies},${r.claims},${r.revenue},${r.payouts},${r.profit}`).join("\n")

      const encodedUri = encodeURI(csvContent)
      const link = document.createElement("a")
      link.setAttribute("href", encodedUri)
      link.setAttribute("download", "flowtravel_report.csv")
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Analytics & Reports</h1>
              <p className="text-muted-foreground">Comprehensive business intelligence and reporting</p>
            </div>
            <div className="flex items-center gap-4">
              <RealtimeIndicator isConnected={true} lastUpdate={new Date().toISOString()} />
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => exportReport("csv")}>
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
                <Button variant="outline" onClick={() => exportReport("pdf")}>
                  <FileText className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </div>
          </div>

          {/* Real-time Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline w-3 h-3 mr-1" />
                  +12.5% from last period
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
                  {(totalPolicies + realtimeStats.totalPolicies).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline w-3 h-3 mr-1" />
                  +8.2% from last period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Claims Processed</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(totalClaims + realtimeStats.activeClaims).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingDown className="inline w-3 h-3 mr-1" />
                  -3.1% from last period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pool Liquidity</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${(4500000 + realtimeStats.totalLiquidity).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline w-3 h-3 mr-1" />
                  +15.3% from last period
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Performance Charts */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Key metrics over time with real-time updates</CardDescription>
                <div className="flex gap-2">
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="revenue">Revenue</SelectItem>
                      <SelectItem value="policies">Policies</SelectItem>
                      <SelectItem value="claims">Claims</SelectItem>
                      <SelectItem value="profit">Profit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="line" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="line">Line Chart</TabsTrigger>
                    <TabsTrigger value="bar">Bar Chart</TabsTrigger>
                  </TabsList>

                  <TabsContent value="line" className="space-y-4">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={reportData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="period" />
                          <YAxis />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey={selectedMetric}
                            stroke="#15803d"
                            strokeWidth={2}
                            name={selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>

                  <TabsContent value="bar" className="space-y-4">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={reportData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="period" />
                          <YAxis />
                          <Tooltip />
                          <Bar
                            dataKey={selectedMetric}
                            fill="#15803d"
                            name={selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Regional Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Regional Distribution</CardTitle>
                <CardDescription>Policy distribution by region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={regionalData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="policies"
                      >
                        {regionalData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  {regionalData.map((region) => (
                    <div key={region.region} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: region.color }} />
                        <span>{region.region}</span>
                      </div>
                      <span className="font-medium">{region.policies.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Analytics</CardTitle>
              <CardDescription>Comprehensive business metrics and KPIs</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="financial" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="financial">Financial</TabsTrigger>
                  <TabsTrigger value="operational">Operational</TabsTrigger>
                  <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
                  <TabsTrigger value="customer">Customer</TabsTrigger>
                </TabsList>

                <TabsContent value="financial" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Revenue Growth</Label>
                      <div className="text-2xl font-bold text-green-600">+12.5%</div>
                      <p className="text-xs text-muted-foreground">Month over month</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Profit Margin</Label>
                      <div className="text-2xl font-bold">68.2%</div>
                      <p className="text-xs text-muted-foreground">Above industry average</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Claims Ratio</Label>
                      <div className="text-2xl font-bold text-yellow-600">32.1%</div>
                      <p className="text-xs text-muted-foreground">Within target range</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="operational" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Processing Time</Label>
                      <div className="text-2xl font-bold">2.3 days</div>
                      <p className="text-xs text-muted-foreground">Average claim processing</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Automation Rate</Label>
                      <div className="text-2xl font-bold text-green-600">87%</div>
                      <p className="text-xs text-muted-foreground">Claims processed automatically</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Oracle Uptime</Label>
                      <div className="text-2xl font-bold text-green-600">99.8%</div>
                      <p className="text-xs text-muted-foreground">Last 30 days</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="risk" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Risk Score</Label>
                      <div className="text-2xl font-bold text-yellow-600">Medium</div>
                      <p className="text-xs text-muted-foreground">Overall portfolio risk</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Fraud Detection</Label>
                      <div className="text-2xl font-bold text-green-600">99.2%</div>
                      <p className="text-xs text-muted-foreground">Accuracy rate</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Pool Utilization</Label>
                      <div className="text-2xl font-bold">72%</div>
                      <p className="text-xs text-muted-foreground">Average across all pools</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="customer" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Customer Satisfaction</Label>
                      <div className="text-2xl font-bold text-green-600">4.7/5</div>
                      <p className="text-xs text-muted-foreground">Based on 1,234 reviews</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Retention Rate</Label>
                      <div className="text-2xl font-bold text-green-600">94%</div>
                      <p className="text-xs text-muted-foreground">Annual retention</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">NPS Score</Label>
                      <div className="text-2xl font-bold text-green-600">+68</div>
                      <p className="text-xs text-muted-foreground">Net Promoter Score</p>
                    </div>
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
