"use client"

import { BarChart3, Shield, Activity, Database, FileText, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

const sidebarItems = [
  { icon: BarChart3, label: "Overview", href: "/" },
  { icon: Shield, label: "Policies", href: "/admin/policies" },
  { icon: Database, label: "Pool Management", href: "/admin/pools" },
  { icon: Activity, label: "Claims", href: "/admin/claims" },
  { icon: TrendingUp, label: "Oracle Status", href: "/admin/oracles" },
  { icon: FileText, label: "Reports", href: "/admin/reports" },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r bg-card h-[calc(100vh-4rem)]">
      <nav className="p-4 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.label} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn("w-full justify-start", isActive && "bg-primary text-primary-foreground")}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
