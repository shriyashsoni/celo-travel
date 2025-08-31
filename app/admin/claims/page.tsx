"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  DollarSign,
  Calendar,
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

interface Claim {
  id: string
  claimNumber: string
  policyNumber: string
  holderName: string
  holderEmail: string
  incidentType: string
  incidentDate: string
  claimAmount: number
  status: "pending" | "investigating" | "approved" | "rejected" | "paid"
  priority: "low" | "medium" | "high" | "urgent"
  submittedAt: string
  description: string
  documents: string[]
  assignedTo?: string
  estimatedPayout?: number
  actualPayout?: number
  oracleVerified: boolean
}

interface ClaimStats {
  total: number
  pending: number
  approved: number
  rejected: number
  totalPayout: number
  averageProcessingTime: number
}

export default function ClaimsManagementPage() {
  const [claims, setClaims] = useState<Claim[]>([])
  const [filteredClaims, setFilteredClaims] = useState<Claim[]>([])
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [stats, setStats] = useState<ClaimStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    totalPayout: 0,
    averageProcessingTime: 0,
  })

  // Mock data
  useEffect(() => {
    const mockClaims: Claim[] = [
      {
        id: "1",
        claimNumber: "CLM-2024-001",
        policyNumber: "FT-2024-001",
        holderName: "John Doe",
        holderEmail: "john@example.com",
        incidentType: "Flight Cancellation",
        incidentDate: "2024-03-16",
        claimAmount: 1500,
        status: "investigating",
        priority: "medium",
        submittedAt: "2024-03-17",
        description: "Flight was cancelled due to weather conditions, missed connecting flight and hotel booking.",
        documents: ["flight_confirmation.pdf", "hotel_booking.pdf", "weather_report.pdf"],
        assignedTo: "Sarah Johnson",
        estimatedPayout: 1200,
        oracleVerified: true,
      },
      {
        id: "2",
        claimNumber: "CLM-2024-002",
        policyNumber: "FT-2024-002",
        holderName: "Jane Smith",
        holderEmail: "jane@example.com",
        incidentType: "Medical Emergency",
        incidentDate: "2024-04-03",
        claimAmount: 8500,
        status: "approved",
        priority: "high",
        submittedAt: "2024-04-04",
        description: "Emergency medical treatment required during travel in Tokyo.",
        documents: ["medical_report.pdf", "hospital_bill.pdf", "prescription.pdf"],
        assignedTo: "Mike Chen",
        estimatedPayout: 7800,
        actualPayout: 7800,
        oracleVerified: true,
      },
      {
        id: "3",
        claimNumber: "CLM-2024-003",
        policyNumber: "FT-2024-003",
        holderName: "Bob Johnson",
        holderEmail: "bob@example.com",
        incidentType: "Baggage Loss",
        incidentDate: "2024-02-25",
        claimAmount: 2200,
        status: "pending",
        priority: "low",
        submittedAt: "2024-02-26",
        description: "Checked baggage was lost during connecting flight in London.",
        documents: ["baggage_receipt.pdf", "airline_report.pdf"],
        oracleVerified: false,
      },
      {
        id: "4",
        claimNumber: "CLM-2024-004",
        policyNumber: "FT-2024-004",
        holderName: "Alice Brown",
        holderEmail: "alice@example.com",
        incidentType: "Trip Interruption",
        incidentDate: "2024-03-20",
        claimAmount: 3500,
        status: "rejected",
        priority: "medium",
        submittedAt: "2024-03-21",
        description: "Trip interrupted due to family emergency, requesting refund for unused portion.",
        documents: ["death_certificate.pdf", "travel_receipts.pdf"],
        assignedTo: "David Wilson",
        oracleVerified: true,
      },
    ]
    setClaims(mockClaims)
    setFilteredClaims(mockClaims)

    // Calculate stats
    const newStats: ClaimStats = {
      total: mockClaims.length,
      pending: mockClaims.filter((c) => c.status === "pending").length,
      approved: mockClaims.filter((c) => c.status === "approved").length,
      rejected: mockClaims.filter((c) => c.status === "rejected").length,
      totalPayout: mockClaims.reduce((sum, c) => sum + (c.actualPayout || 0), 0),
      averageProcessingTime: 3.2,
    }
    setStats(newStats)
  }, [])

  // Filter claims
  useEffect(() => {
    let filtered = claims

    if (searchTerm) {
      filtered = filtered.filter(
        (claim) =>
          claim.claimNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          claim.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          claim.holderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          claim.incidentType.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((claim) => claim.status === statusFilter)
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter((claim) => claim.priority === priorityFilter)
    }

    setFilteredClaims(filtered)
  }, [claims, searchTerm, statusFilter, priorityFilter])

  const getStatusBadge = (status: Claim["status"]) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800",
      investigating: "bg-blue-100 text-blue-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      paid: "bg-purple-100 text-purple-800",
    }
    return <Badge className={variants[status]}>{status.toUpperCase()}</Badge>
  }

  const getPriorityBadge = (priority: Claim["priority"]) => {
    const variants = {
      low: "bg-gray-100 text-gray-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-orange-100 text-orange-800",
      urgent: "bg-red-100 text-red-800",
    }
    return <Badge className={variants[priority]}>{priority.toUpperCase()}</Badge>
  }

  const handleViewClaim = (claim: Claim) => {
    setSelectedClaim(claim)
    setIsViewDialogOpen(true)
  }

  const handleStatusUpdate = (claimId: string, newStatus: Claim["status"]) => {
    setClaims((prev) => prev.map((claim) => (claim.id === claimId ? { ...claim, status: newStatus } : claim)))
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Claims Management</h1>
              <p className="text-muted-foreground">Process and manage insurance claims efficiently</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pending}</div>
                <p className="text-xs text-muted-foreground">Requires attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Payouts</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.totalPayout.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Processing</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageProcessingTime} days</div>
                <p className="text-xs text-muted-foreground">-0.5 days from last month</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Claims Overview</CardTitle>
              <CardDescription>Manage and process insurance claims</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search claims..."
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
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="investigating">Investigating</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-48">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Claim #</TableHead>
                      <TableHead>Policy Holder</TableHead>
                      <TableHead>Incident Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Oracle</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClaims.map((claim) => (
                      <TableRow key={claim.id}>
                        <TableCell className="font-medium">{claim.claimNumber}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{claim.holderName}</div>
                            <div className="text-sm text-muted-foreground">{claim.policyNumber}</div>
                          </div>
                        </TableCell>
                        <TableCell>{claim.incidentType}</TableCell>
                        <TableCell>${claim.claimAmount.toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(claim.status)}</TableCell>
                        <TableCell>{getPriorityBadge(claim.priority)}</TableCell>
                        <TableCell>
                          {claim.oracleVerified ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleViewClaim(claim)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            {claim.status === "pending" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleStatusUpdate(claim.id, "approved")}
                                >
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleStatusUpdate(claim.id, "rejected")}
                                >
                                  <XCircle className="w-4 h-4 text-red-600" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Claim Details Dialog */}
          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Claim Details - {selectedClaim?.claimNumber}</DialogTitle>
                <DialogDescription>Complete claim information and processing details</DialogDescription>
              </DialogHeader>
              {selectedClaim && (
                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                    <TabsTrigger value="actions">Actions</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium">Claim Information</Label>
                          <div className="mt-2 space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Claim Number:</span>
                              <span className="text-sm font-medium">{selectedClaim.claimNumber}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Policy Number:</span>
                              <span className="text-sm font-medium">{selectedClaim.policyNumber}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Incident Date:</span>
                              <span className="text-sm font-medium">{selectedClaim.incidentDate}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Submitted:</span>
                              <span className="text-sm font-medium">{selectedClaim.submittedAt}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Policy Holder</Label>
                          <div className="mt-2 space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Name:</span>
                              <span className="text-sm font-medium">{selectedClaim.holderName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Email:</span>
                              <span className="text-sm font-medium">{selectedClaim.holderEmail}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium">Claim Status</Label>
                          <div className="mt-2 space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Status:</span>
                              {getStatusBadge(selectedClaim.status)}
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Priority:</span>
                              {getPriorityBadge(selectedClaim.priority)}
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Oracle Verified:</span>
                              <span className="text-sm font-medium">{selectedClaim.oracleVerified ? "Yes" : "No"}</span>
                            </div>
                            {selectedClaim.assignedTo && (
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Assigned To:</span>
                                <span className="text-sm font-medium">{selectedClaim.assignedTo}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Financial Details</Label>
                          <div className="mt-2 space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Claimed Amount:</span>
                              <span className="text-sm font-medium">${selectedClaim.claimAmount.toLocaleString()}</span>
                            </div>
                            {selectedClaim.estimatedPayout && (
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Estimated Payout:</span>
                                <span className="text-sm font-medium">
                                  ${selectedClaim.estimatedPayout.toLocaleString()}
                                </span>
                              </div>
                            )}
                            {selectedClaim.actualPayout && (
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Actual Payout:</span>
                                <span className="text-sm font-medium">
                                  ${selectedClaim.actualPayout.toLocaleString()}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Incident Description</Label>
                      <p className="mt-2 text-sm text-muted-foreground">{selectedClaim.description}</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="documents" className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Submitted Documents</Label>
                      <div className="mt-2 space-y-2">
                        {selectedClaim.documents.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm">{doc}</span>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="timeline" className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm font-medium">Claim Submitted</p>
                          <p className="text-xs text-muted-foreground">{selectedClaim.submittedAt}</p>
                        </div>
                      </div>
                      {selectedClaim.oracleVerified && (
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                          <div>
                            <p className="text-sm font-medium">Oracle Verification Complete</p>
                            <p className="text-xs text-muted-foreground">Automated verification passed</p>
                          </div>
                        </div>
                      )}
                      {selectedClaim.assignedTo && (
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></div>
                          <div>
                            <p className="text-sm font-medium">Assigned for Review</p>
                            <p className="text-xs text-muted-foreground">Assigned to {selectedClaim.assignedTo}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="actions" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Update Status</Label>
                        <Select
                          value={selectedClaim.status}
                          onValueChange={(value) => handleStatusUpdate(selectedClaim.id, value as Claim["status"])}
                        >
                          <SelectTrigger className="w-full mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="investigating">Investigating</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Add Note</Label>
                        <Textarea placeholder="Add processing notes..." className="mt-2" />
                      </div>

                      <div className="flex gap-2">
                        <Button>Save Changes</Button>
                        <Button variant="outline">Request Oracle Verification</Button>
                        <Button variant="outline">Generate Report</Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  )
}
