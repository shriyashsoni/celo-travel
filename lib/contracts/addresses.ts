// Contract addresses for different networks
export const CONTRACT_ADDRESSES = {
  flowEvm: {
    testnet: process.env.NEXT_PUBLIC_FLOW_EVM_TESTNET_CONTRACT || "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    mainnet: process.env.NEXT_PUBLIC_FLOW_EVM_MAINNET_CONTRACT || "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  },
  flowCadence: {
    testnet: process.env.NEXT_PUBLIC_FLOW_CADENCE_TESTNET_CONTRACT || "0x045a1763c93006ca",
    mainnet: process.env.NEXT_PUBLIC_FLOW_CADENCE_MAINNET_CONTRACT || "0x1d7e57aa55817448",
  },
} as const

export const NETWORK_CONFIG = {
  flowEvm: {
    testnet: {
      name: "Flow EVM Testnet",
      rpc: "https://testnet.evm.nodes.onflow.org",
      chainId: 545,
      blockExplorer: "https://evm-testnet.flowscan.org",
    },
    mainnet: {
      name: "Flow EVM Mainnet",
      rpc: "https://mainnet.evm.nodes.onflow.org",
      chainId: 747,
      blockExplorer: "https://evm.flowscan.org",
    },
  },
  flowCadence: {
    testnet: {
      name: "Flow Testnet",
      accessNode: "https://rest-testnet.onflow.org",
      blockExplorer: "https://testnet.flowscan.org",
    },
    mainnet: {
      name: "Flow Mainnet",
      accessNode: "https://rest-mainnet.onflow.org",
      blockExplorer: "https://flowscan.org",
    },
  },
} as const

export function getContractAddress(network: "flowEvm" | "flowCadence", env: "testnet" | "mainnet") {
  return CONTRACT_ADDRESSES[network][env]
}

export function getNetworkConfig(network: "flowEvm" | "flowCadence", env: "testnet" | "mainnet") {
  return NETWORK_CONFIG[network][env]
}
