import { ethers } from "ethers";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.deploy" });
dotenv.config({ path: ".env.local" });
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const rpcUrl = process.env.BOT_CHAIN_RPC || "https://rpc.botchain.ai";
  if (!process.env.PRIVATE_KEY) throw new Error("PRIVATE_KEY is required for deployment");
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const network = await provider.getNetwork();
  if (Number(network.chainId) !== 677) throw new Error(`Expected Bot Chain (677), got ${network.chainId}`);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  console.log("Starting full deployment to Bot Chain...");
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
  console.log("Mock BOT USD deployed to:", cusdAddress);

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
  const envPath = path.join(__dirname, "../.env.local");
  let envData = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
  const values = {
    NEXT_PUBLIC_BOT_CHAIN_RPC: "https://rpc.botchain.ai",
    NEXT_PUBLIC_BOT_CHAIN_EXPLORER: "https://scan.botchain.ai",
    NEXT_PUBLIC_CUSD_ADDRESS: cusdAddress,
    NEXT_PUBLIC_POLICY_NFT_ADDRESS: policyNFTAddress,
    NEXT_PUBLIC_AGENT_REGISTRY_ADDRESS: agentRegistryAddress,
    NEXT_PUBLIC_INSURANCE_POOL_ADDRESS: insurancePoolAddress,
  };
  for (const [key, value] of Object.entries(values)) {
    const line = `${key}=${value}`;
    const pattern = new RegExp(`^${key}=.*$`, "m");
    envData = pattern.test(envData) ? envData.replace(pattern, line) : `${envData}${envData.endsWith("\n") || !envData ? "" : "\n"}${line}\n`;
  }
  fs.writeFileSync(envPath, envData);
  console.log(".env.local updated with Bot Chain deployment addresses!");

  const pagePath = path.join(__dirname, "../app/buy-policy/page.tsx");
  if (fs.existsSync(pagePath)) {
    let pageData = fs.readFileSync(pagePath, "utf8");
    pageData = pageData.replace(/const CUSD_ADDRESS = "0x[a-fA-F0-9]{40}";/, `const CUSD_ADDRESS = "${cusdAddress}";`);
    fs.writeFileSync(pagePath, pageData);
    console.log("app/buy-policy/page.tsx updated with new cUSD address!");
  }

  const adminPath = path.join(__dirname, "../app/admin/page.tsx");
  if (fs.existsSync(adminPath)) {
    let adminData = fs.readFileSync(adminPath, "utf8");
    adminData = adminData.replace(/const CUSD_SEPOLIA_ADDRESS = "0x[a-fA-F0-9]{40}";/, `const CUSD_SEPOLIA_ADDRESS = "${cusdAddress}";`);
    fs.writeFileSync(adminPath, adminData);
    console.log("app/admin/page.tsx updated with new cUSD address!");
  }
}

main().catch(console.error);
