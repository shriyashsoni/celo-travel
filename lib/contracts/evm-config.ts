import { createPublicClient, createWalletClient, http, custom } from "viem"
import { CONTRACT_CONFIG } from "./contract-config"

const network = process.env.NEXT_PUBLIC_FLOW_NETWORK || "testnet"
const isMainnet = network === "mainnet"

const config = isMainnet ? CONTRACT_CONFIG.flowEvm.mainnet : CONTRACT_CONFIG.flowEvm.testnet

export const publicClient = createPublicClient({
  transport: http(config.rpcUrl),
  chain: {
    id: config.chainId,
    name: config.networkName,
    network: network,
    nativeCurrency: {
      decimals: 18,
      name: "Flow",
      symbol: "FLOW",
    },
    rpcUrls: {
      default: {
        http: [config.rpcUrl],
      },
      public: {
        http: [config.rpcUrl],
      },
    },
    blockExplorers: {
      default: { name: "FlowScan", url: config.explorerUrl },
    },
  },
})

export const createWalletClientForEvm = () => {
  if (typeof window !== "undefined" && window.ethereum) {
    return createWalletClient({
      transport: custom(window.ethereum),
      chain: publicClient.chain,
    })
  }
  return null
}

export const EVM_CONFIG = {
  network,
  isMainnet,
  contractAddress: config.contractAddress as `0x${string}`,
  chainId: config.chainId,
  explorerUrl: config.explorerUrl,
  rpcUrl: config.rpcUrl,
}
