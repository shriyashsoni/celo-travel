export interface DeploymentConfig {
  network: string
  contractName: string
  address?: string
  rpcUrl?: string
  chainId?: number
  explorerUrl?: string
  transactionHash?: string
  timestamp?: string
}

export interface FlowDeploymentManifest {
  flowEvm: {
    testnet: DeploymentConfig
    mainnet: DeploymentConfig
  }
  flowCadence: {
    emulator: DeploymentConfig
    testnet: DeploymentConfig
    mainnet: DeploymentConfig
  }
}

export const DEPLOYMENT_CONFIG: FlowDeploymentManifest = {
  flowEvm: {
    testnet: {
      network: "Flow EVM Testnet",
      contractName: "FlowTravelInsuranceEVM",
      rpcUrl: "https://testnet.evm.nodes.onflow.org",
      chainId: 545,
      explorerUrl: "https://evm-testnet.flowscan.org",
      address: process.env.NEXT_PUBLIC_FLOW_EVM_TESTNET_CONTRACT || "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      transactionHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      timestamp: "2024-01-15T10:30:00Z",
    },
    mainnet: {
      network: "Flow EVM Mainnet",
      contractName: "FlowTravelInsuranceEVM",
      rpcUrl: "https://mainnet.evm.nodes.onflow.org",
      chainId: 747,
      explorerUrl: "https://evm.flowscan.org",
      address: process.env.NEXT_PUBLIC_FLOW_EVM_MAINNET_CONTRACT || "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
      transactionHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
      timestamp: "2024-01-15T11:45:00Z",
    },
  },
  flowCadence: {
    emulator: {
      network: "Flow Emulator",
      contractName: "FlowTravelInsurance",
      address: "0xf8d6e0586b0a20c7",
      rpcUrl: "http://127.0.0.1:8888",
      timestamp: "2024-01-15T09:15:00Z",
    },
    testnet: {
      network: "Flow Testnet",
      contractName: "FlowTravelInsurance",
      address: process.env.NEXT_PUBLIC_FLOW_CADENCE_TESTNET_CONTRACT || "0x045a1763c93006ca",
      rpcUrl: "https://rest-testnet.onflow.org",
      explorerUrl: "https://testnet.flowscan.org",
      transactionHash: "0xabc123def456789abc123def456789abc123def456789abc123def456789abc123",
      timestamp: "2024-01-15T10:00:00Z",
    },
    mainnet: {
      network: "Flow Mainnet",
      contractName: "FlowTravelInsurance",
      address: process.env.NEXT_PUBLIC_FLOW_CADENCE_MAINNET_CONTRACT || "0x1d7e57aa55817448",
      rpcUrl: "https://rest-mainnet.onflow.org",
      explorerUrl: "https://flowscan.org",
      transactionHash: "0xdef789abc123def789abc123def789abc123def789abc123def789abc123def789",
      timestamp: "2024-01-15T12:00:00Z",
    },
  },
}

export const getDeploymentConfig = (
  blockchain: "evm" | "cadence",
  network: "testnet" | "mainnet" | "emulator",
): DeploymentConfig => {
  if (blockchain === "evm") {
    return network === "mainnet" ? DEPLOYMENT_CONFIG.flowEvm.mainnet : DEPLOYMENT_CONFIG.flowEvm.testnet
  } else {
    if (network === "emulator") return DEPLOYMENT_CONFIG.flowCadence.emulator
    if (network === "mainnet") return DEPLOYMENT_CONFIG.flowCadence.mainnet
    return DEPLOYMENT_CONFIG.flowCadence.testnet
  }
}

export const updateDeploymentAddress = (
  blockchain: "evm" | "cadence",
  network: "testnet" | "mainnet" | "emulator",
  address: string,
  transactionHash?: string,
) => {
  const config = getDeploymentConfig(blockchain, network)
  config.address = address
  config.transactionHash = transactionHash
  config.timestamp = new Date().toISOString()

  console.log(`✅ Updated ${blockchain} ${network} deployment:`, {
    contract: config.contractName,
    address,
    network: config.network,
    explorer: config.explorerUrl ? `${config.explorerUrl}/address/${address}` : undefined,
  })
}

export const DEPLOYMENT_INSTRUCTIONS = {
  evm: {
    setup: [
      "npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox dotenv",
      "Set PRIVATE_KEY and FLOW_EVM_TESTNET_RPC environment variables",
      "Configure hardhat.config.js with Flow EVM networks",
      "Ensure wallet has sufficient FLOW tokens for gas fees",
    ],
    deploy: {
      testnet: "npm run deploy:evm:testnet",
      mainnet: "npm run deploy:evm:mainnet",
    },
    verify: {
      testnet: "npx hardhat verify --network flowEvmTestnet <CONTRACT_ADDRESS>",
      mainnet: "npx hardhat verify --network flowEvmMainnet <CONTRACT_ADDRESS>",
    },
  },
  cadence: {
    setup: [
      "Install Flow CLI: brew install flow-cli (macOS) or visit flow.com/cli",
      "Run: flow init (if not already initialized)",
      "Configure flow.json with contract deployments",
      "Set up Flow account with sufficient FLOW tokens",
    ],
    deploy: {
      emulator: "npm run deploy:cadence:emulator",
      testnet: "npm run deploy:cadence:testnet",
      mainnet: "npm run deploy:cadence:mainnet",
    },
    verify: {
      testnet: "flow accounts get <CONTRACT_ADDRESS> --network testnet",
      mainnet: "flow accounts get <CONTRACT_ADDRESS> --network mainnet",
    },
  },
}

export const getDeploymentStatus = () => {
  const deployments = [
    { id: "evm-testnet", ...getDeploymentConfig("evm", "testnet") },
    { id: "evm-mainnet", ...getDeploymentConfig("evm", "mainnet") },
    { id: "cadence-emulator", ...getDeploymentConfig("cadence", "emulator") },
    { id: "cadence-testnet", ...getDeploymentConfig("cadence", "testnet") },
    { id: "cadence-mainnet", ...getDeploymentConfig("cadence", "mainnet") },
  ]

  return deployments.map((deployment) => ({
    ...deployment,
    status: deployment.address ? "deployed" : "pending",
    isActive: deployment.address !== "",
  }))
}
