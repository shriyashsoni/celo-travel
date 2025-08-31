"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Plus, Edit, Eye, Filter, Download } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

interface Policy {
  id: string
  policyNumber: string
  holderName: string
  holderEmail: string
  destination: string
  startDate: string
  endDate: string
  coverageAmount: number
  premium: number
  status: "active" | "expired" | "claimed" | "cancelled"
  createdAt: string
  nftTokenId?: string
  poolId: string
}

export default function PoliciesManagementPage() {
  const [policies, setPolicies] = useState<Policy[]>([])
  const [filteredPolicies, setFilteredPolicies] = useState<Policy[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  // Mock data - replace with real API calls
  useEffect(() => {
    const mockPolicies: Policy[] = [
      {
        id: "1",
        policyNumber: "FT-2024-001",
        holderName: "John Doe",
        holderEmail: "john@example.com",
        destination: "Paris, France",
        startDate: "2024-03-15",
        endDate: "2024-03-22",
        coverageAmount: 50000,
        premium: 150,
        status: "active",
        createdAt: "2024-03-01",
        nftTokenId: "NFT-001",
        poolId: "pool-1",
      },
      {
        id: "2",
        policyNumber: "FT-2024-002",
        holderName: "Jane Smith",
        holderEmail: "jane@example.com",
        destination: "Tokyo, Japan",
        startDate: "2024-04-01",
        endDate: "2024-04-10",
        coverageAmount: 75000,
        premium: 225,
        status: "claimed",
        createdAt: "2024-03-10",
        nftTokenId: "NFT-002",
        poolId: "pool-1",
      },
      {
        id: "3",
        policyNumber: "FT-2024-003",
        holderName: "Bob Johnson",
        holderEmail: "bob@example.com",
        destination: "London, UK",
        startDate: "2024-02-20",
        endDate: "2024-02-27",
        coverageAmount: 40000,
        premium: 120,
        status: "expired",
        createdAt: "2024-02-15",
        nftTokenId: "NFT-003",
        poolId: "pool-2",
      },
    ]
    setPolicies(mockPolicies)
    setFilteredPolicies(mockPolicies)
  }, [])

  // Filter policies based on search and status
  useEffect(() => {
    let filtered = policies

    if (searchTerm) {
      filtered = filtered.filter(
        (policy) =>
          policy.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          policy.holderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          policy.holderEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          policy.destination.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((policy) => policy.status === statusFilter)
    }

    setFilteredPolicies(filtered)
  }, [policies, searchTerm, statusFilter])

  const getStatusBadge = (status: Policy["status"]) => {
    const variants = {
      active: "bg-green-100 text-green-800",
      expired: "bg-gray-100 text-gray-800",
      claimed: "bg-blue-100 text-blue-800",
      cancelled: "bg-red-100 text-red-800",
    }
    return <Badge className={variants[status]}>{status.toUpperCase()}</Badge>
  }

  const handleViewPolicy = (policy: Policy) => {
    setSelectedPolicy(policy)
    setIsViewDialogOpen(true)
  }

  const exportPolicies = () => {
    // Mock export functionality
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Policy Number,Holder Name,Email,Destination,Start Date,End Date,Coverage,Premium,Status\n" +
      filteredPolicies
        .map(
          (p) =>
            `${p.policyNumber},${p.holderName},${p.holderEmail},${p.destination},${p.startDate},${p.endDate},${p.coverageAmount},${p.premium},${p.status}`,
        )
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "policies.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Policy Management</h1>
              <p className="text-muted-foreground">Manage and monitor all travel insurance policies</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={exportPolicies} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Policy
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Policy</DialogTitle>
                    <DialogDescription>Create a new travel insurance policy for a customer</DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="holderName">Policy Holder Name</Label>
                      <Input id="holderName" placeholder="Enter full name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="holderEmail">Email Address</Label>
                      <Input id="holderEmail" type="email" placeholder="Enter email" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="destination">Destination</Label>
                      <Input id="destination" placeholder="Enter destination" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="coverageAmount">Coverage Amount ($)</Label>
                      <Input id="coverageAmount" type="number" placeholder="50000" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input id="startDate" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input id="endDate" type="date" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsCreateDialogOpen(false)}>Create Policy</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Policy Overview</CardTitle>
              <CardDescription>
                Total policies: {policies.length} | Active: {policies.filter((p) => p.status === "active").length} |
                Claims: {policies.filter((p) => p.status === "claimed").length}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search policies..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="claimed">Claimed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Policy Number</TableHead>
                      <TableHead>Holder</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Coverage</TableHead>
                      <TableHead>Premium</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPolicies.map((policy) => (
                      <TableRow key={policy.id}>
                        <TableCell className="font-medium">{policy.policyNumber}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{policy.holderName}</div>
                            <div className="text-sm text-muted-foreground">{policy.holderEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell>{policy.destination}</TableCell>
                        <TableCell>${policy.coverageAmount.toLocaleString()}</TableCell>
                        <TableCell>${policy.premium}</TableCell>
                        <TableCell>{getStatusBadge(policy.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleViewPolicy(policy)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Policy Details Dialog */}
          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Policy Details</DialogTitle>
                <DialogDescription>Complete information for policy {selectedPolicy?.policyNumber}</DialogDescription>
              </DialogHeader>
              {selectedPolicy && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Policy Number</Label>
                      <p className="text-sm text-muted-foreground">{selectedPolicy.policyNumber}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">NFT Token ID</Label>
                      <p className="text-sm text-muted-foreground">{selectedPolicy.nftTokenId || "Not minted"}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Policy Holder</Label>
                      <p className="text-sm text-muted-foreground">{selectedPolicy.holderName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Email</Label>
                      <p className="text-sm text-muted-foreground">{selectedPolicy.holderEmail}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Destination</Label>
                      <p className="text-sm text-muted-foreground">{selectedPolicy.destination}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Pool ID</Label>
                      <p className="text-sm text-muted-foreground">{selectedPolicy.poolId}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Travel Period</Label>
                      <p className="text-sm text-muted-foreground">
                        {selectedPolicy.startDate} to {selectedPolicy.endDate}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Status</Label>
                      <div className="mt-1">{getStatusBadge(selectedPolicy.status)}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Coverage Amount</Label>
                      <p className="text-sm text-muted-foreground">${selectedPolicy.coverageAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Premium Paid</Label>
                      <p className="text-sm text-muted-foreground">${selectedPolicy.premium}</p>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  )
}
