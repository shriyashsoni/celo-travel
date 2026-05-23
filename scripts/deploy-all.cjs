const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Starting full deployment to Celo Sepolia...");
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // 1. Deploy Mock cUSD
  console.log("Deploying MockERC20 (Test cUSD)...");
  const MockERC20 = await ethers.getContractFactory("MockERC20");
  const cusd = await MockERC20.deploy("Test cUSD", "tcUSD");
  await cusd.waitForDeployment();
  const cusdAddress = await cusd.getAddress();
  console.log("Mock cUSD deployed to:", cusdAddress);

  // Mint 10,000 tcUSD to the deployer so they have plenty of balance for testing
  console.log("Minting 10,000 tcUSD to deployer...");
  const mintTx = await cusd.mint(deployer.address, ethers.parseUnits("10000", 18));
  await mintTx.wait();
  console.log("Minting complete!");

  // 2. Deploy PolicyNFT
  console.log("Deploying PolicyNFT...");
  const PolicyNFT = await ethers.getContractFactory("PolicyNFT");
  const policyNFT = await PolicyNFT.deploy();
  await policyNFT.waitForDeployment();
  const policyNFTAddress = await policyNFT.getAddress();
  console.log("PolicyNFT deployed to:", policyNFTAddress);

  // 3. Deploy AgentRegistry
  console.log("Deploying AgentRegistry...");
  const AgentRegistry = await ethers.getContractFactory("AgentRegistry");
  const agentRegistry = await AgentRegistry.deploy();
  await agentRegistry.waitForDeployment();
  const agentRegistryAddress = await agentRegistry.getAddress();
  console.log("AgentRegistry deployed to:", agentRegistryAddress);

  // 4. Deploy InsurancePool
  console.log("Deploying InsurancePool...");
  const agentWallet = deployer.address; 
  const InsurancePool = await ethers.getContractFactory("InsurancePool");
  const insurancePool = await InsurancePool.deploy(cusdAddress, policyNFTAddress, agentWallet);
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

  // Automatically update the frontend files
  updateFrontendFiles(cusdAddress, policyNFTAddress, agentRegistryAddress, insurancePoolAddress);
}

function updateFrontendFiles(cusdAddress, policyNFTAddress, agentRegistryAddress, insurancePoolAddress) {
  // Update .env
  const envPath = path.join(__dirname, "../.env");
  if (fs.existsSync(envPath)) {
    let envData = fs.readFileSync(envPath, "utf8");
    envData = envData.replace(/NEXT_PUBLIC_POLICY_NFT_ADDRESS=.*/, `NEXT_PUBLIC_POLICY_NFT_ADDRESS=${policyNFTAddress}`);
    envData = envData.replace(/NEXT_PUBLIC_AGENT_REGISTRY_ADDRESS=.*/, `NEXT_PUBLIC_AGENT_REGISTRY_ADDRESS=${agentRegistryAddress}`);
    envData = envData.replace(/NEXT_PUBLIC_INSURANCE_POOL_ADDRESS=.*/, `NEXT_PUBLIC_INSURANCE_POOL_ADDRESS=${insurancePoolAddress}`);
    
    // Add cUSD address if it doesn't exist, or replace it
    if (envData.includes("NEXT_PUBLIC_CUSD_ADDRESS")) {
      envData = envData.replace(/NEXT_PUBLIC_CUSD_ADDRESS=.*/, `NEXT_PUBLIC_CUSD_ADDRESS=${cusdAddress}`);
    } else {
      envData += `\nNEXT_PUBLIC_CUSD_ADDRESS=${cusdAddress}\n`;
    }
    
    fs.writeFileSync(envPath, envData);
    console.log(".env updated!");
  }

  // Update app/buy-policy/page.tsx
  const pagePath = path.join(__dirname, "../app/buy-policy/page.tsx");
  if (fs.existsSync(pagePath)) {
    let pageData = fs.readFileSync(pagePath, "utf8");
    // Find the const CUSD_ADDRESS line and replace it
    pageData = pageData.replace(/const CUSD_ADDRESS = "0x[a-fA-F0-9]{40}";/, `const CUSD_ADDRESS = "${cusdAddress}";`);
    fs.writeFileSync(pagePath, pageData);
    console.log("app/buy-policy/page.tsx updated with new cUSD address!");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
