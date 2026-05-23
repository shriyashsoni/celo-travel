import { ethers } from "hardhat";

async function main() {
  const [owner, user, agentWallet] = await ethers.getSigners();
  console.log("Starting tests...");

  // Deploy Mock cUSD
  const MockERC20 = await ethers.getContractFactory("MockERC20");
  const cUSD = await MockERC20.deploy("Celo Dollar", "cUSD");
  await cUSD.waitForDeployment();
  console.log("Mock cUSD deployed at:", await cUSD.getAddress());

  // Deploy PolicyNFT
  const PolicyNFT = await ethers.getContractFactory("PolicyNFT");
  const policyNFT = await PolicyNFT.deploy();
  await policyNFT.waitForDeployment();
  console.log("PolicyNFT deployed at:", await policyNFT.getAddress());

  // Deploy InsurancePool
  const InsurancePool = await ethers.getContractFactory("InsurancePool");
  const pool = await InsurancePool.deploy(await cUSD.getAddress(), await policyNFT.getAddress(), agentWallet.address);
  await pool.waitForDeployment();
  console.log("InsurancePool deployed at:", await pool.getAddress());

  // Set minter in PolicyNFT
  await policyNFT.setMinter(await pool.getAddress());
  console.log("Minter set in PolicyNFT");

  // Mint cUSD to user
  await cUSD.mint(user.address, ethers.parseUnits("100", 18));
  await cUSD.mint(await pool.getAddress(), ethers.parseUnits("1000", 18));
  console.log("Mock cUSD minted");

  // Test 1: Buy Policy
  console.log("Test 1: Buying Policy...");
  const premium = ethers.parseUnits("0.5", 18);
  await cUSD.connect(user).approve(await pool.getAddress(), premium);
  
  const expiry = Math.floor(Date.now() / 1000) + 86400; // 24 hours from now
  const tx1 = await pool.connect(user).buyPolicy("AA123", 1, expiry);
  await tx1.wait();
  
  const policy = await policyNFT.getPolicy(0);
  if (policy.flightId === "AA123" && policy.tier === 1n && policy.isClaimed === false) {
    console.log("✅ Test 1 Passed: Policy bought successfully");
  } else {
    console.error("❌ Test 1 Failed: Policy data incorrect", policy);
  }

  // Test 2: Payout
  console.log("Test 2: Payout...");
  const tx2 = await pool.connect(agentWallet).payout(0);
  await tx2.wait();

  const policyAfter = await policyNFT.getPolicy(0);
  if (policyAfter.isClaimed === true) {
    console.log("✅ Test 2 Passed: Payout successful");
  } else {
    console.error("❌ Test 2 Failed: Policy not marked as claimed");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
