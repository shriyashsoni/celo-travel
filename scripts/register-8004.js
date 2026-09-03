import { ethers } from "ethers";
import dotenv from "dotenv";
import path from "path";

// Load from .env.mainnet explicitly to use the correct funded mainnet private key
dotenv.config({ path: path.resolve(process.cwd(), ".env.mainnet") });

async function main() {
  const REGISTRY_ADDRESS = "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432";
  const AGENT_METADATA_URI = "https://celo-travel.vercel.app/agent.json";
  const RPC_URL = process.env.BOT_CHAIN_RPC || "https://rpc.botchain.ai";
  const PRIVATE_KEY = process.env.PRIVATE_KEY;

  if (!PRIVATE_KEY) {
    console.error("PRIVATE_KEY is missing from .env.mainnet");
    process.exit(1);
  }

  console.log("Connecting to Celo Mainnet IdentityRegistry via RPC:", RPC_URL);
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  console.log("Using signer address:", wallet.address);

  // Correct ABI for ERC-8004 IdentityRegistry registration with a single agentURI parameter
  const abi = [
    "function register(string memory agentURI) external returns (uint256)"
  ];

  const registry = new ethers.Contract(REGISTRY_ADDRESS, abi, wallet);

  try {
    console.log(`Registering Agent on ERC-8004 registry with Metadata URI: ${AGENT_METADATA_URI}...`);
    const tx = await registry.register(AGENT_METADATA_URI, {
      gasLimit: 300000
    });
    console.log("Transaction sent! Hash:", tx.hash);
    
    console.log("Waiting for confirmation...");
    const receipt = await tx.wait();
    console.log("Registration confirmed! Block:", receipt.blockNumber);
    console.log("Successfully registered on ERC-8004 Celo Mainnet!");
  } catch (error) {
    console.error("Failed to register on ERC-8004 contract:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
