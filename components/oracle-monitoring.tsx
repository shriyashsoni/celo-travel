import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Wifi, AlertCircle, CheckCircle2 } from "lucide-react"

const oracleStatus = [
  {
    name: "FlightAware API",
    status: "active",
    uptime: "99.8%",
    lastUpdate: "2 min ago",
    requests: "1,247",
  },
  {
    name: "Aviationstack",
    status: "active",
    uptime: "99.2%",
    lastUpdate: "1 min ago",
    requests: "892",
  },
  {
    name: "Weather Oracle",
    status: "warning",
    uptime: "97.1%",
    lastUpdate: "15 min ago",
    requests: "456",
  },
  {
    name: "Airport Status",
    status: "active",
    uptime: "99.9%",
    lastUpdate: "30 sec ago",
    requests: "2,103",
  },
]

export function OracleMonitoring() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Oracle Monitoring
        </CardTitle>
        <CardDescription>Real-time status of data oracles and API connections</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {oracleStatus.map((oracle) => (
            <div key={oracle.name} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                {oracle.status === "active" ? (
                  <CheckCircle2 className="h-4 w-4 text-chart-3" />
                ) : oracle.status === "warning" ? (
                  <AlertCircle className="h-4 w-4 text-chart-4" />
                ) : (
                  <Wifi className="h-4 w-4 text-chart-2" />
                )}
                <div>
                  <p className="font-medium">{oracle.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {oracle.requests} requests • {oracle.lastUpdate}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge
                  variant={
                    oracle.status === "active" ? "default" : oracle.status === "warning" ? "secondary" : "destructive"
                  }
                  className="text-xs mb-1"
                >
                  {oracle.status}
                </Badge>
                <p className="text-xs text-muted-foreground">{oracle.uptime} uptime</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-lg bg-chart-3/10 border border-chart-3/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-chart-3 animate-pulse"></div>
            <span className="text-sm font-medium">All Systems Operational</span>
          </div>
          <p className="text-xs text-muted-foreground">
            4 oracles active • 99.2% avg uptime • 4,698 total requests today
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
