import { ethers } from "ethers";
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.BOT_CHAIN_RPC || "https://rpc.botchain.ai");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  console.log("Deploying contracts with the account:", wallet.address);

  // Helper to read artifacts
  const readArtifact = (contractName) => {
    const p = path.join(__dirname, `../artifacts/contracts/${contractName}.sol/${contractName}.json`);
    return JSON.parse(fs.readFileSync(p, "utf8"));
  };

  // 1. Deploy PolicyNFT
  console.log("Deploying PolicyNFT...");
  const policyArtifact = readArtifact("PolicyNFT");
  const PolicyNFTFactory = new ethers.ContractFactory(policyArtifact.abi, policyArtifact.bytecode, wallet);
  const policyNFT = await PolicyNFTFactory.deploy();
  await policyNFT.waitForDeployment();
  const policyNFTAddress = await policyNFT.getAddress();
  console.log("PolicyNFT deployed to:", policyNFTAddress);

  // 2. Deploy AgentRegistry
  console.log("Deploying AgentRegistry...");
  const registryArtifact = readArtifact("AgentRegistry");
  const RegistryFactory = new ethers.ContractFactory(registryArtifact.abi, registryArtifact.bytecode, wallet);
  const agentRegistry = await RegistryFactory.deploy();
  await agentRegistry.waitForDeployment();
  const agentRegistryAddress = await agentRegistry.getAddress();
  console.log("AgentRegistry deployed to:", agentRegistryAddress);

  // cUSD address on Celo Sepolia Testnet
  const cUSD_SEPOLIA = "0x954cBA141f21760751E3065ACC250c38fb9f5e61";
  const agentWallet = wallet.address; 

  // 3. Deploy InsurancePool
  console.log("Deploying InsurancePool...");
  const poolArtifact = readArtifact("InsurancePool");
  const PoolFactory = new ethers.ContractFactory(poolArtifact.abi, poolArtifact.bytecode, wallet);
  const insurancePool = await PoolFactory.deploy(cUSD_SEPOLIA, policyNFTAddress, agentWallet);
  await insurancePool.waitForDeployment();
  const insurancePoolAddress = await insurancePool.getAddress();
  console.log("InsurancePool deployed to:", insurancePoolAddress);

  // 4. Grant InsurancePool minting rights on PolicyNFT
  console.log("Setting InsurancePool as the minter for PolicyNFT...");
  const tx = await policyNFT.setMinter(insurancePoolAddress);
  await tx.wait();
  console.log("Minter set successfully!");

  console.log("--- Deployment Complete ---");
  console.log("PolicyNFT:", policyNFTAddress);
  console.log("AgentRegistry:", agentRegistryAddress);
  console.log("InsurancePool:", insurancePoolAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
