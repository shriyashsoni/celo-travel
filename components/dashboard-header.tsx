"use client"

import { Bell, Settings, User, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useFlowWallet } from "@/components/flow-wallet-provider"

export function DashboardHeader() {
  const { user, logIn, logOut, isLoading } = useFlowWallet()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">FT</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">FlowTravel</h1>
          </div>
          <Badge variant="secondary" className="text-xs">
            Insurance Analytics
          </Badge>
        </div>

        <div className="flex items-center space-x-4">
          {user?.loggedIn ? (
            <>
              <div className="flex items-center space-x-2 text-sm">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-muted-foreground">
                  {user.addr?.slice(0, 6)}...{user.addr?.slice(-4)}
                </span>
              </div>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">3</Badge>
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={logOut}>
                <User className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button onClick={logIn} disabled={isLoading} size="sm">
              <Wallet className="h-4 w-4 mr-2" />
              {isLoading ? "Loading..." : "Connect Wallet"}
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
