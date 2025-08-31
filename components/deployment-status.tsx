"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Copy, CheckCircle, AlertCircle, Clock } from "lucide-react"
import { getDeploymentStatus } from "@/lib/deployment/config"

export function DeploymentStatus() {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedAddress(label)
    setTimeout(() => setCopiedAddress(null), 2000)
  }

  const deployments = getDeploymentStatus()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {deployments.map((deployment) => (
        <Card key={deployment.id} className="relative">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{deployment.network}</CardTitle>
              <Badge
                variant={deployment.status === "deployed" ? "default" : "secondary"}
                className={deployment.status === "deployed" ? "bg-green-500" : ""}
              >
                {deployment.status === "deployed" ? (
                  <CheckCircle className="w-3 h-3 mr-1" />
                ) : (
                  <AlertCircle className="w-3 h-3 mr-1" />
                )}
                {deployment.status}
              </Badge>
            </div>
            <CardDescription>{deployment.contractName}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {deployment.address ? (
              <>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-muted px-2 py-1 rounded flex-1 truncate">{deployment.address}</code>
                  <Button size="sm" variant="ghost" onClick={() => copyToClipboard(deployment.address!, deployment.id)}>
                    {copiedAddress === deployment.id ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                {deployment.timestamp && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    Deployed: {new Date(deployment.timestamp).toLocaleDateString()}
                  </div>
                )}

                {deployment.transactionHash && (
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-muted px-2 py-1 rounded flex-1 truncate">
                      Tx: {deployment.transactionHash.slice(0, 10)}...{deployment.transactionHash.slice(-8)}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(deployment.transactionHash!, `${deployment.id}-tx`)}
                    >
                      {copiedAddress === `${deployment.id}-tx` ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                )}

                {deployment.explorerUrl && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => window.open(`${deployment.explorerUrl}/address/${deployment.address}`, "_blank")}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on Explorer
                  </Button>
                )}
              </>
            ) : (
              <div className="text-sm text-muted-foreground">Contract not deployed yet</div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
