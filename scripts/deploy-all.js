import { ethers } from "ethers";
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.CELO_ALFAJORES_RPC); // 11142220 Celo Sepolia
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  console.log("Starting full deployment to Celo Sepolia...");
  console.log("Deploying contracts with the account:", wallet.address);

  const readArtifact = (contractName) => {
    const p = path.join(__dirname, `../artifacts/contracts/${contractName}.sol/${contractName}.json`);
    return JSON.parse(fs.readFileSync(p, "utf8"));
  };

  // 1. Deploy Mock cUSD
  console.log("Deploying MockERC20 (Test cUSD)...");
  const mockArtifact = readArtifact("MockERC20");
  const MockFactory = new ethers.ContractFactory(mockArtifact.abi, mockArtifact.bytecode, wallet);
  const cusd = await MockFactory.deploy("Test cUSD", "tcUSD");
  await cusd.waitForDeployment();
  const cusdAddress = await cusd.getAddress();
  console.log("Mock cUSD deployed to:", cusdAddress);

  console.log("Minting 10,000 tcUSD to deployer...");
  const mintTx = await cusd.mint(wallet.address, ethers.parseUnits("10000", 18));
  await mintTx.wait();
  console.log("Minting complete!");

  // 2. Deploy PolicyNFT
  console.log("Deploying PolicyNFT...");
  const policyArtifact = readArtifact("PolicyNFT");
  const PolicyNFTFactory = new ethers.ContractFactory(policyArtifact.abi, policyArtifact.bytecode, wallet);
  const policyNFT = await PolicyNFTFactory.deploy();
  await policyNFT.waitForDeployment();
  const policyNFTAddress = await policyNFT.getAddress();
  console.log("PolicyNFT deployed to:", policyNFTAddress);

  // 3. Deploy AgentRegistry
  console.log("Deploying AgentRegistry...");
  const registryArtifact = readArtifact("AgentRegistry");
  const RegistryFactory = new ethers.ContractFactory(registryArtifact.abi, registryArtifact.bytecode, wallet);
  const agentRegistry = await RegistryFactory.deploy();
  await agentRegistry.waitForDeployment();
  const agentRegistryAddress = await agentRegistry.getAddress();
  console.log("AgentRegistry deployed to:", agentRegistryAddress);

  // 4. Deploy InsurancePool
  console.log("Deploying InsurancePool...");
  const poolArtifact = readArtifact("InsurancePool");
  const PoolFactory = new ethers.ContractFactory(poolArtifact.abi, poolArtifact.bytecode, wallet);
  const insurancePool = await PoolFactory.deploy(cusdAddress, policyNFTAddress, wallet.address);
  await insurancePool.waitForDeployment();
  const insurancePoolAddress = await insurancePool.getAddress();
  console.log("InsurancePool deployed to:", insurancePoolAddress);

  // 5. Set minter on PolicyNFT
  console.log("Setting InsurancePool as the minter for PolicyNFT...");
  const setMinterTx = await policyNFT.setMinter(insurancePoolAddress);
  await setMinterTx.wait();
  console.log("Minter set successfully!");

  console.log("\n=================================");
  console.log("Deployment Complete!");
  console.log("Mock cUSD:", cusdAddress);
  console.log("PolicyNFT:", policyNFTAddress);
  console.log("AgentRegistry:", agentRegistryAddress);
  console.log("InsurancePool:", insurancePoolAddress);
  console.log("=================================\n");

  updateFrontendFiles(cusdAddress, policyNFTAddress, agentRegistryAddress, insurancePoolAddress);
}

function updateFrontendFiles(cusdAddress, policyNFTAddress, agentRegistryAddress, insurancePoolAddress) {
  const envPath = path.join(__dirname, "../.env");
  if (fs.existsSync(envPath)) {
    let envData = fs.readFileSync(envPath, "utf8");
    envData = envData.replace(/NEXT_PUBLIC_POLICY_NFT_ADDRESS=.*/, `NEXT_PUBLIC_POLICY_NFT_ADDRESS=${policyNFTAddress}`);
    envData = envData.replace(/NEXT_PUBLIC_AGENT_REGISTRY_ADDRESS=.*/, `NEXT_PUBLIC_AGENT_REGISTRY_ADDRESS=${agentRegistryAddress}`);
    envData = envData.replace(/NEXT_PUBLIC_INSURANCE_POOL_ADDRESS=.*/, `NEXT_PUBLIC_INSURANCE_POOL_ADDRESS=${insurancePoolAddress}`);
    fs.writeFileSync(envPath, envData);
    console.log(".env updated!");
  }

  const pagePath = path.join(__dirname, "../app/buy-policy/page.tsx");
  if (fs.existsSync(pagePath)) {
    let pageData = fs.readFileSync(pagePath, "utf8");
    pageData = pageData.replace(/const CUSD_ADDRESS = "0x[a-fA-F0-9]{40}";/, `const CUSD_ADDRESS = "${cusdAddress}";`);
    fs.writeFileSync(pagePath, pageData);
    console.log("app/buy-policy/page.tsx updated with new cUSD address!");
  }
}

main().catch(console.error);
