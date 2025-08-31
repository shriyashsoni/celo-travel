import * as fcl from "@onflow/fcl"
import { CONTRACT_CONFIG } from "../contracts/contract-config"

const network = process.env.NEXT_PUBLIC_FLOW_NETWORK || "testnet"
const isMainnet = network === "mainnet"

const config = isMainnet ? CONTRACT_CONFIG.flowCadence.mainnet : CONTRACT_CONFIG.flowCadence.testnet

fcl.config({
  "accessNode.api": config.accessNode,
  "discovery.wallet": process.env.NEXT_PUBLIC_FLOW_WALLET_DISCOVERY || "https://fcl-discovery.onflow.org/testnet/authn",
  "0xFlowTravelInsurance": config.contractAddress,
  "flow.network": network,
})

export { fcl }

export const FLOW_CONFIG = {
  network,
  isMainnet,
  contractAddress: config.contractAddress,
  contractName: config.contractName,
  accessNode: config.accessNode,
}
