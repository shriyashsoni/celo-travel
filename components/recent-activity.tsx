import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Plane, DollarSign, FileCheck, AlertTriangle } from "lucide-react"

const recentActivities = [
  {
    id: 1,
    type: "policy_purchased",
    description: "New policy purchased for flight AA1234",
    user: "0x1a2b...3c4d",
    amount: "$15.00",
    time: "2 min ago",
    icon: Plane,
    status: "success",
  },
  {
    id: 2,
    type: "claim_processed",
    description: "Claim processed for delayed flight UA567",
    user: "0x5e6f...7g8h",
    amount: "$150.00",
    time: "5 min ago",
    icon: DollarSign,
    status: "success",
  },
  {
    id: 3,
    type: "oracle_update",
    description: "Flight status updated by FlightAware oracle",
    user: "Oracle",
    amount: "",
    time: "8 min ago",
    icon: FileCheck,
    status: "info",
  },
  {
    id: 4,
    type: "policy_expired",
    description: "Policy expired for flight DL890",
    user: "0x9i0j...1k2l",
    amount: "",
    time: "12 min ago",
    icon: Clock,
    status: "neutral",
  },
  {
    id: 5,
    type: "claim_pending",
    description: "New claim submitted for cancelled flight BA456",
    user: "0x3m4n...5o6p",
    amount: "$200.00",
    time: "15 min ago",
    icon: AlertTriangle,
    status: "warning",
  },
]

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Recent Activity
        </CardTitle>
        <CardDescription>Latest transactions and system events</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg border">
              <activity.icon
                className={`h-4 w-4 ${
                  activity.status === "success"
                    ? "text-chart-3"
                    : activity.status === "warning"
                      ? "text-chart-4"
                      : activity.status === "info"
                        ? "text-primary"
                        : "text-muted-foreground"
                }`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{activity.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">{activity.user}</span>
                  {activity.amount && (
                    <>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs font-medium">{activity.amount}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="text-right">
                <Badge
                  variant={
                    activity.status === "success" ? "default" : activity.status === "warning" ? "secondary" : "outline"
                  }
                  className="text-xs mb-1"
                >
                  {activity.type.replace("_", " ")}
                </Badge>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
