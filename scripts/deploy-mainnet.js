import { ethers } from "ethers";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.mainnet" });
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.BOT_CHAIN_RPC || "https://rpc.botchain.ai");
  const network = await provider.getNetwork();
  if (Number(network.chainId) !== 677) throw new Error(`Expected Bot Chain (677), got ${network.chainId}`);
  if (!process.env.PRIVATE_KEY) throw new Error("PRIVATE_KEY is required for deployment");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  console.log("Starting full deployment to Bot Chain...");
  console.log("Deploying contracts with the account:", wallet.address);

  const cusdAddress = process.env.BOT_CHAIN_TOKEN_ADDRESS;
  if (!cusdAddress) throw new Error("BOT_CHAIN_TOKEN_ADDRESS is required; use deploy-all.js to deploy MockERC20 for testing");
  console.log("Using Bot Chain USD token at:", cusdAddress);

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

  // 3. Deploy InsurancePool
  console.log("Deploying InsurancePool...");
  const poolArtifact = readArtifact("InsurancePool");
  const PoolFactory = new ethers.ContractFactory(poolArtifact.abi, poolArtifact.bytecode, wallet);
  const insurancePool = await PoolFactory.deploy(cusdAddress, policyNFTAddress, wallet.address);
  await insurancePool.waitForDeployment();
  const insurancePoolAddress = await insurancePool.getAddress();
  console.log("InsurancePool deployed to:", insurancePoolAddress);

  // 4. Set minter on PolicyNFT
  console.log("Setting InsurancePool as the minter for PolicyNFT...");
  const setMinterTx = await policyNFT.setMinter(insurancePoolAddress);
  await setMinterTx.wait();
  console.log("Minter set successfully!");

  console.log("\n=================================");
  console.log("Mainnet Deployment Complete!");
  console.log("cUSD (Mainnet):", cusdAddress);
  console.log("PolicyNFT:", policyNFTAddress);
  console.log("AgentRegistry:", agentRegistryAddress);
  console.log("InsurancePool:", insurancePoolAddress);
  console.log("=================================\n");

  updateFrontendFiles(cusdAddress, policyNFTAddress, agentRegistryAddress, insurancePoolAddress);
}

function updateFrontendFiles(cusdAddress, policyNFTAddress, agentRegistryAddress, insurancePoolAddress) {
  const envPath = path.join(__dirname, "../.env.mainnet");
  if (fs.existsSync(envPath)) {
    let envData = fs.readFileSync(envPath, "utf8");
    envData = envData.replace(/NEXT_PUBLIC_POLICY_NFT_ADDRESS=.*/, `NEXT_PUBLIC_POLICY_NFT_ADDRESS=${policyNFTAddress}`);
    envData = envData.replace(/NEXT_PUBLIC_AGENT_REGISTRY_ADDRESS=.*/, `NEXT_PUBLIC_AGENT_REGISTRY_ADDRESS=${agentRegistryAddress}`);
    envData = envData.replace(/NEXT_PUBLIC_INSURANCE_POOL_ADDRESS=.*/, `NEXT_PUBLIC_INSURANCE_POOL_ADDRESS=${insurancePoolAddress}`);
    fs.writeFileSync(envPath, envData);
    console.log(".env.mainnet updated!");
  }

  const pagePath = path.join(__dirname, "../app/buy-policy/page.tsx");
  if (fs.existsSync(pagePath)) {
    let pageData = fs.readFileSync(pagePath, "utf8");
    pageData = pageData.replace(/const CUSD_ADDRESS = "0x[a-fA-F0-9]{40}";/, `const CUSD_ADDRESS = "${cusdAddress}";`);
    fs.writeFileSync(pagePath, pageData);
  }

  const adminPath = path.join(__dirname, "../app/admin/page.tsx");
  if (fs.existsSync(adminPath)) {
    let adminData = fs.readFileSync(adminPath, "utf8");
    adminData = adminData.replace(/const CUSD_SEPOLIA_ADDRESS = "0x[a-fA-F0-9]{40}";/, `const CUSD_SEPOLIA_ADDRESS = "${cusdAddress}";`);
    fs.writeFileSync(adminPath, adminData);
  }
}

main().catch(console.error);
