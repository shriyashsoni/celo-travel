export const CONTRACT_CONFIG = {
  flowEvm: {
    testnet: {
      rpcUrl: "https://testnet.evm.nodes.onflow.org",
      chainId: 545,
      contractAddress:
        process.env.NEXT_PUBLIC_FLOW_EVM_TESTNET_CONTRACT || "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      explorerUrl: "https://evm-testnet.flowscan.org",
      networkName: "Flow EVM Testnet",
    },
    mainnet: {
      rpcUrl: "https://mainnet.evm.nodes.onflow.org",
      chainId: 747,
      contractAddress:
        process.env.NEXT_PUBLIC_FLOW_EVM_MAINNET_CONTRACT || "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
      explorerUrl: "https://evm.flowscan.org",
      networkName: "Flow EVM Mainnet",
    },
  },
  flowCadence: {
    emulator: {
      accessNode: "http://127.0.0.1:8888",
      contractAddress: "0xf8d6e0586b0a20c7",
      contractName: "FlowTravelInsurance",
      networkName: "Flow Emulator",
    },
    testnet: {
      accessNode: "https://rest-testnet.onflow.org",
      contractAddress: process.env.NEXT_PUBLIC_FLOW_CADENCE_TESTNET_CONTRACT || "0x045a1763c93006ca",
      contractName: "FlowTravelInsurance",
      networkName: "Flow Testnet",
    },
    mainnet: {
      accessNode: "https://rest-mainnet.onflow.org",
      contractAddress: process.env.NEXT_PUBLIC_FLOW_CADENCE_MAINNET_CONTRACT || "0x1d7e57aa55817448",
      contractName: "FlowTravelInsurance",
      networkName: "Flow Mainnet",
    },
  },
}

export const getContractConfig = (
  network: "evm-testnet" | "evm-mainnet" | "cadence-emulator" | "cadence-testnet" | "cadence-mainnet",
) => {
  switch (network) {
    case "evm-testnet":
      return CONTRACT_CONFIG.flowEvm.testnet
    case "evm-mainnet":
      return CONTRACT_CONFIG.flowEvm.mainnet
    case "cadence-emulator":
      return CONTRACT_CONFIG.flowCadence.emulator
    case "cadence-testnet":
      return CONTRACT_CONFIG.flowCadence.testnet
    case "cadence-mainnet":
      return CONTRACT_CONFIG.flowCadence.mainnet
    default:
      return CONTRACT_CONFIG.flowEvm.testnet
  }
}

export const getCurrentNetwork = (): string => {
  return process.env.NEXT_PUBLIC_FLOW_NETWORK || "testnet"
}

export const isMainnet = (): boolean => {
  return getCurrentNetwork() === "mainnet"
}

export const getActiveContractConfig = () => {
  const network = getCurrentNetwork()
  const isEvm = process.env.NEXT_PUBLIC_FLOW_CONTRACT_TYPE === "evm"

  if (isEvm) {
    return isMainnet() ? CONTRACT_CONFIG.flowEvm.mainnet : CONTRACT_CONFIG.flowEvm.testnet
  } else {
    return isMainnet() ? CONTRACT_CONFIG.flowCadence.mainnet : CONTRACT_CONFIG.flowCadence.testnet
  }
}
