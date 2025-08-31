#!/bin/bash

echo "🚀 Deploying FlowTravel Insurance Cadence Contract..."

# Start emulator in background if not running
if ! pgrep -f "flow emulator" > /dev/null; then
    echo "📡 Starting Flow emulator..."
    flow emulator start &
    sleep 5
fi

# Deploy contract
echo "📦 Deploying contract to emulator..."
flow deploy --network emulator

if [ $? -eq 0 ]; then
    echo "✅ FlowTravel Insurance Cadence deployed successfully!"
    echo "🔗 Contract Address: 0xf8d6e0586b0a20c7"
    
    # Create deployment manifest
    cat > deployment-manifest.json << EOF
{
  "flowEvm": {
    "network": "Flow EVM Testnet",
    "contract": "FlowTravelInsuranceEVM",
    "address": "DEPLOY_EVM_FIRST"
  },
  "flowCadence": {
    "network": "Flow Emulator",
    "contract": "FlowTravelInsurance", 
    "address": "0xf8d6e0586b0a20c7",
    "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  }
}
EOF
    
    echo "📋 Deployment manifest created: deployment-manifest.json"
else
    echo "❌ Cadence deployment failed!"
    exit 1
fi
