"use client"

import { Bell, Settings, User, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAccount } from "wagmi"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useEffect, useState } from "react"

export function DashboardHeader() {
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-green-500 flex items-center justify-center">
              <span className="text-black font-bold text-sm">TS</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">TravelShield</h1>
          </div>
          <Badge variant="secondary" className="text-xs">
            Insurance Analytics
          </Badge>
        </div>

        <div className="flex items-center space-x-4">
          {isConnected ? (
            <>
              <ConnectButton showBalance={false} chainStatus="none" accountStatus="avatar" />
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">3</Badge>
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <ConnectButton />
          )}
        </div>
      </div>
    </header>
  )
}
