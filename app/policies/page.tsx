"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, FileText } from "lucide-react"
import { useFlowWallet } from "@/components/flow-wallet-provider"
import { createClient } from "@/lib/supabase/client"

interface Policy {
  policy_id: string
  policy_number: string
  premium_amount: number
  coverage_amount: number
  flight_info: {
    airline: string
    flightNumber: string
    departureDate: string
    departureAirport: string
    arrivalAirport: string
  }
  status: string
  valid_from: string
  valid_until: string
  created_at: string
}

export default function PoliciesPage() {
  const { user, logIn } = useFlowWallet()
  const [policies, setPolicies] = useState<Policy[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.loggedIn) {
      fetchPolicies()
    }
  }, [user])

  const fetchPolicies = async () => {
    const supabase = createClient()
    try {
      const { data, error } = await supabase
        .from("policies")
        .select("*")
        .eq("user_id", user.addr)
        .order("created_at", { ascending: false })

      if (error) throw error
      setPolicies(data || [])
    } catch (error) {
      console.error("[v0] Error fetching policies:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "expired":
        return "secondary"
      case "claimed":
        return "destructive"
      case "paid":
        return "default"
      default:
        return "secondary"
    }
  }

  if (!user?.loggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>Connect your Flow wallet to view your policies</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={logIn} className="w-full">
              Connect Flow Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">My Policies</h1>
            <p className="text-muted-foreground">Manage your travel insurance policies</p>
          </div>
          <Button onClick={() => (window.location.href = "/buy-policy")}>Purchase New Policy</Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p>Loading policies...</p>
          </div>
        ) : policies.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No policies found</h3>
              <p className="text-muted-foreground mb-4">You haven't purchased any travel insurance policies yet.</p>
              <Button onClick={() => (window.location.href = "/buy-policy")}>Purchase Your First Policy</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {policies.map((policy) => (
              <Card key={policy.policy_id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{policy.policy_number}</CardTitle>
                    <Badge variant={getStatusColor(policy.status)}>{policy.status}</Badge>
                  </div>
                  <CardDescription>
                    {policy.flight_info.airline} {policy.flight_info.flightNumber}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {policy.flight_info.departureAirport} → {policy.flight_info.arrivalAirport}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(policy.flight_info.departureDate).toLocaleDateString()}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Coverage:</span>
                    <span className="font-semibold">${policy.coverage_amount}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Premium:</span>
                    <span>${policy.premium_amount}</span>
                  </div>

                  <div className="pt-2 border-t">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Valid until:</span>
                      <span>{new Date(policy.valid_until).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
