"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plane, DollarSign, Shield } from "lucide-react"
import { useFlowWallet } from "@/components/flow-wallet-provider"
import { createClient } from "@/lib/supabase/client"

interface FlightInfo {
  airline: string
  flightNumber: string
  departureDate: string
  departureAirport: string
  arrivalAirport: string
}

interface PolicyOption {
  name: string
  coverage: number
  premium: number
  description: string
}

const policyOptions: PolicyOption[] = [
  {
    name: "Basic Protection",
    coverage: 100,
    premium: 5,
    description: "Covers delays ≥3 hours and cancellations",
  },
  {
    name: "Standard Coverage",
    coverage: 250,
    premium: 12,
    description: "Enhanced coverage with baggage protection",
  },
  {
    name: "Premium Shield",
    coverage: 500,
    premium: 25,
    description: "Maximum coverage with priority support",
  },
]

export default function BuyPolicyPage() {
  const { user, logIn, isLoading: walletLoading } = useFlowWallet()
  const [flightInfo, setFlightInfo] = useState<FlightInfo>({
    airline: "",
    flightNumber: "",
    departureDate: "",
    departureAirport: "",
    arrivalAirport: "",
  })
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyOption | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handlePurchase = async () => {
    if (!user?.loggedIn || !selectedPolicy) return

    setIsLoading(true)
    try {
      // Create policy record in database
      const supabase = createClient()
      const policyData = {
        user_id: user.addr,
        policy_number: `POL-${Date.now()}`,
        premium_amount: selectedPolicy.premium,
        coverage_amount: selectedPolicy.coverage,
        flight_info: flightInfo,
        trigger_conditions: {
          delay_threshold: 180,
          covers_cancellation: true,
          covers_baggage: selectedPolicy.name !== "Basic Protection",
        },
        valid_from: new Date().toISOString(),
        valid_until: new Date(flightInfo.departureDate + "T23:59:59Z").toISOString(),
        status: "active",
      }

      const { data: policy, error } = await supabase.from("policies").insert(policyData).select().single()

      if (error) throw error

      // TODO: Mint NFT on Flow blockchain
      // This would involve calling the FlowTravel smart contract
      console.log("[v0] Policy created:", policy)

      alert("Policy purchased successfully!")
    } catch (error) {
      console.error("[v0] Error purchasing policy:", error)
      alert("Error purchasing policy. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted || walletLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading wallet...</p>
        </div>
      </div>
    )
  }

  if (!user?.loggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>Connect your Flow wallet to purchase travel insurance</CardDescription>
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
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Purchase Travel Insurance</h1>
          <p className="text-muted-foreground">Protect your trip with blockchain-powered insurance</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Flight Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="h-5 w-5" />
                Flight Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="airline">Airline</Label>
                  <Input
                    id="airline"
                    placeholder="e.g., IndiGo"
                    value={flightInfo.airline}
                    onChange={(e) => setFlightInfo({ ...flightInfo, airline: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="flightNumber">Flight Number</Label>
                  <Input
                    id="flightNumber"
                    placeholder="e.g., 6E234"
                    value={flightInfo.flightNumber}
                    onChange={(e) => setFlightInfo({ ...flightInfo, flightNumber: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="departureDate">Departure Date</Label>
                <Input
                  id="departureDate"
                  type="date"
                  value={flightInfo.departureDate}
                  onChange={(e) => setFlightInfo({ ...flightInfo, departureDate: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="departure">From</Label>
                  <Input
                    id="departure"
                    placeholder="DEL"
                    value={flightInfo.departureAirport}
                    onChange={(e) => setFlightInfo({ ...flightInfo, departureAirport: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="arrival">To</Label>
                  <Input
                    id="arrival"
                    placeholder="BOM"
                    value={flightInfo.arrivalAirport}
                    onChange={(e) => setFlightInfo({ ...flightInfo, arrivalAirport: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Policy Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Coverage Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {policyOptions.map((option) => (
                <div
                  key={option.name}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedPolicy?.name === option.name
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedPolicy(option)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{option.name}</h3>
                    <Badge variant="secondary">${option.premium}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{option.description}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4" />
                    <span>Coverage: ${option.coverage}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Purchase Summary */}
        {selectedPolicy && (
          <Card>
            <CardHeader>
              <CardTitle>Purchase Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Flight:</span>
                  <span>
                    {flightInfo.airline} {flightInfo.flightNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Route:</span>
                  <span>
                    {flightInfo.departureAirport} → {flightInfo.arrivalAirport}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{flightInfo.departureDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Coverage:</span>
                  <span>${selectedPolicy.coverage}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Premium:</span>
                  <span>${selectedPolicy.premium}</span>
                </div>
              </div>

              <Button
                onClick={handlePurchase}
                disabled={isLoading || !flightInfo.flightNumber || !flightInfo.departureDate}
                className="w-full"
              >
                {isLoading ? "Processing..." : `Purchase Policy - $${selectedPolicy.premium}`}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
