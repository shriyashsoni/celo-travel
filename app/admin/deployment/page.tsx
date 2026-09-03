import { DeploymentStatus } from "@/components/deployment-status"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DEPLOYMENT_INSTRUCTIONS } from "@/lib/deployment/config"

export default function DeploymentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Smart Contract Deployment</h1>
        <p className="text-muted-foreground">Manage and monitor TravelShield smart contract deployments on BOT Chain</p>
      </div>

      <DeploymentStatus />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              BOT Chain Deployment
              <Badge variant="outline">Solidity</Badge>
            </CardTitle>
            <CardDescription>Deploy to BOT Chain using Hardhat</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Setup Requirements:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {DEPLOYMENT_INSTRUCTIONS.evm.setup.map((step, i) => (
                  <li key={i}>• {step}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Deploy Commands:</h4>
              <div className="space-y-2">
                <code className="block text-xs bg-muted p-2 rounded">{DEPLOYMENT_INSTRUCTIONS.evm.deploy.testnet}</code>
                <code className="block text-xs bg-muted p-2 rounded">{DEPLOYMENT_INSTRUCTIONS.evm.deploy.mainnet}</code>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Legacy Cadence Deployment
              <Badge variant="outline">Cadence</Badge>
            </CardTitle>
            <CardDescription>Deploy to Flow networks using Flow CLI</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Setup Requirements:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {DEPLOYMENT_INSTRUCTIONS.cadence.setup.map((step, i) => (
                  <li key={i}>• {step}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Deploy Commands:</h4>
              <div className="space-y-2">
                <code className="block text-xs bg-muted p-2 rounded">
                  {DEPLOYMENT_INSTRUCTIONS.cadence.deploy.emulator}
                </code>
                <code className="block text-xs bg-muted p-2 rounded">
                  {DEPLOYMENT_INSTRUCTIONS.cadence.deploy.testnet}
                </code>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
