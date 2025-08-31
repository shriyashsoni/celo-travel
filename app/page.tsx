import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { PolicyOverview } from "@/components/policy-overview"
import { PoolPerformance } from "@/components/pool-performance"
import { ClaimsAnalytics } from "@/components/claims-analytics"
import { OracleMonitoring } from "@/components/oracle-monitoring"
import { RecentActivity } from "@/components/recent-activity"
import { FlowWalletProvider } from "@/components/flow-wallet-provider"

export default function DashboardPage() {
  return (
    <FlowWalletProvider>
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="flex">
          <DashboardSidebar />
          <main className="flex-1 p-6 space-y-6">
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 p-8 text-white">
              <div className="relative z-10">
                <h1 className="text-3xl font-bold mb-2">FlowTravel Insurance Dashboard</h1>
                <p className="text-blue-100 text-lg">
                  Comprehensive travel protection powered by blockchain technology
                </p>
              </div>
              <div className="absolute right-0 top-0 h-full w-1/3 opacity-20">
                <img src="/travel-insurance-illustration-with-airplane-and-gl.png" alt="Travel Insurance" className="h-full w-full object-cover" />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <PolicyOverview />
              </div>
              <div>
                <PoolPerformance />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ClaimsAnalytics />
              <OracleMonitoring />
            </div>

            <RecentActivity />
          </main>
        </div>
      </div>
    </FlowWalletProvider>
  )
}
