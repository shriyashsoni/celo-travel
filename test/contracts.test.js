import { expect } from "chai";
import hre from "hardhat";
import { parseUnits } from "ethers";

describe("TravelShield Contracts", function () {
  let cUSD, policyNFT, pool, agentRegistry;
  let owner, user, agentWallet;

  beforeEach(async function () {
    [owner, user, agentWallet] = await hre.ethers.getSigners();

    // Deploy Mock cUSD
    const MockERC20 = await hre.ethers.getContractFactory("MockERC20");
    cUSD = await MockERC20.deploy("Celo Dollar", "cUSD");

    // Deploy PolicyNFT
    const PolicyNFT = await hre.ethers.getContractFactory("PolicyNFT");
    policyNFT = await PolicyNFT.deploy();

    // Deploy InsurancePool
    const InsurancePool = await hre.ethers.getContractFactory("InsurancePool");
    pool = await InsurancePool.deploy(await cUSD.getAddress(), await policyNFT.getAddress(), agentWallet.address);

    // Deploy AgentRegistry
    const AgentRegistry = await hre.ethers.getContractFactory("AgentRegistry");
    agentRegistry = await AgentRegistry.deploy();

    // Set minter in PolicyNFT
    await policyNFT.setMinter(await pool.getAddress());

    // Mint cUSD to user
    await cUSD.mint(user.address, parseUnits("100", 18));
    // Mint cUSD to pool for payouts
    await cUSD.mint(await pool.getAddress(), parseUnits("1000", 18));
  });

  it("Should successfully buy a policy", async function () {
    // Approve cUSD
    const premium = parseUnits("0.5", 18);
    await cUSD.connect(user).approve(await pool.getAddress(), premium);

    const expiry = Math.floor(Date.now() / 1000) + 86400; // 24 hours from now

    // Buy Policy
    await expect(pool.connect(user).buyPolicy("AA123", 1, expiry))
      .to.emit(pool, "PremiumPaid")
      .withArgs(user.address, premium, 1, 0);

    const policy = await policyNFT.getPolicy(0);
    expect(policy.flightId).to.equal("AA123");
    expect(policy.tier).to.equal(1);
    expect(policy.isClaimed).to.be.false;
  });

  it("Should fail to buy policy without approval", async function () {
    const expiry = Math.floor(Date.now() / 1000) + 86400;
    
    // Using custom error or revert string from openzeppelin ERC20
    await expect(
      pool.connect(user).buyPolicy("AA123", 1, expiry)
    ).to.be.revertedWithCustomError(cUSD, "ERC20InsufficientAllowance");
  });

  it("Should correctly payout a claim", async function () {
    const premium = parseUnits("0.5", 18);
    await cUSD.connect(user).approve(await pool.getAddress(), premium);
    const expiry = Math.floor(Date.now() / 1000) + 86400;
    await pool.connect(user).buyPolicy("AA123", 1, expiry);

    const payout = parseUnits("5", 18);
    
    await expect(pool.connect(agentWallet).payout(0))
      .to.emit(pool, "ClaimSettled")
      .withArgs(0, "AA123", payout, user.address);

    const policy = await policyNFT.getPolicy(0);
    expect(policy.isClaimed).to.be.true;
  });
});
