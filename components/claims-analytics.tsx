import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileCheck, Clock, AlertTriangle, CheckCircle } from "lucide-react"

const claimsData = [
  {
    type: "Flight Delays",
    count: 45,
    amount: "$67.5K",
    status: "processed",
    icon: Clock,
  },
  {
    type: "Cancellations",
    count: 23,
    amount: "$34.2K",
    status: "processed",
    icon: CheckCircle,
  },
  {
    type: "Pending Review",
    count: 8,
    amount: "$12.1K",
    status: "pending",
    icon: AlertTriangle,
  },
  {
    type: "Rejected",
    count: 3,
    amount: "$4.8K",
    status: "rejected",
    icon: FileCheck,
  },
]

export function ClaimsAnalytics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCheck className="h-5 w-5 text-primary" />
          Claims Analytics
        </CardTitle>
        <CardDescription>Claims processing status and payout analytics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {claimsData.map((claim) => (
            <div key={claim.type} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <claim.icon
                  className={`h-4 w-4 ${
                    claim.status === "processed"
                      ? "text-chart-3"
                      : claim.status === "pending"
                        ? "text-chart-4"
                        : "text-chart-2"
                  }`}
                />
                <div>
                  <p className="font-medium">{claim.type}</p>
                  <p className="text-sm text-muted-foreground">{claim.count} claims</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{claim.amount}</p>
                <Badge
                  variant={
                    claim.status === "processed" ? "default" : claim.status === "pending" ? "secondary" : "destructive"
                  }
                  className="text-xs"
                >
                  {claim.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="text-center p-3 rounded-lg bg-chart-3/10">
            <p className="text-2xl font-bold text-chart-3">94.2%</p>
            <p className="text-xs text-muted-foreground">Success Rate</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-chart-4/10">
            <p className="text-2xl font-bold text-chart-4">2.3h</p>
            <p className="text-xs text-muted-foreground">Avg Processing</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
