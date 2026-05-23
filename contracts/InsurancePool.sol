// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./PolicyNFT.sol";

contract InsurancePool is Ownable {
    IERC20 public cUSD;
    PolicyNFT public policyNFT;
    
    address public agentWallet; // ERC-8004 agent wallet
    
    // Payout Tiers
    uint256 public constant TIER_1_PAYOUT = 5 * 10**18;  // $5 cUSD
    uint256 public constant TIER_2_PAYOUT = 15 * 10**18; // $15 cUSD
    uint256 public constant TIER_3_PAYOUT = 30 * 10**18; // $30 cUSD
    
    // Premium Tiers
    uint256 public constant TIER_1_PREMIUM = 0.5 * 10**18; // $0.50 cUSD
    uint256 public constant TIER_2_PREMIUM = 1.5 * 10**18; // $1.50 cUSD
    uint256 public constant TIER_3_PREMIUM = 3.0 * 10**18; // $3.00 cUSD

    event PremiumPaid(address indexed policyholder, uint256 amount, uint8 tier, uint256 tokenId);
    event ClaimSettled(uint256 indexed tokenId, string flightId, uint256 amount, address recipient);
    event FundsDeposited(address indexed sender, uint256 amount);
    event FundsWithdrawn(address indexed owner, uint256 amount);

    modifier onlyAgent() {
        require(msg.sender == agentWallet, "Only agent can call this");
        _;
    }

    // Default cUSD on Celo Mainnet: 0x765DE816845861e75A25fCA122bb6898B8B1282a
    constructor(
        address _cUSD, 
        address _policyNFT, 
        address _agentWallet
    ) Ownable(msg.sender) {
        cUSD = IERC20(_cUSD);
        policyNFT = PolicyNFT(_policyNFT);
        agentWallet = _agentWallet;
    }

    function setAgentWallet(address _agentWallet) external onlyOwner {
        agentWallet = _agentWallet;
    }

    // Allows the contract owner or liquidity providers to fund the insurance pool
    function depositFunds(uint256 amount) external {
        require(cUSD.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        emit FundsDeposited(msg.sender, amount);
    }
    
    // Allows the owner to withdraw excess funds from the pool
    function withdrawFunds(uint256 amount) external onlyOwner {
        require(cUSD.transfer(owner(), amount), "Transfer failed");
        emit FundsWithdrawn(owner(), amount);
    }

    // User calls this to purchase a policy
    // Requires the user to have approved the cUSD transfer first
    function buyPolicy(string calldata flightId, uint8 tier, uint256 expiry) external {
        require(tier >= 1 && tier <= 3, "Invalid tier");
        require(expiry > block.timestamp, "Expiry must be in future");
        
        uint256 premiumAmount;
        if (tier == 1) premiumAmount = TIER_1_PREMIUM;
        else if (tier == 2) premiumAmount = TIER_2_PREMIUM;
        else if (tier == 3) premiumAmount = TIER_3_PREMIUM;

        // Collect premium in cUSD
        require(cUSD.transferFrom(msg.sender, address(this), premiumAmount), "Premium payment failed");
        
        // Mint the policy NFT to the buyer
        uint256 tokenId = policyNFT.mintPolicy(msg.sender, flightId, tier, expiry);
        
        emit PremiumPaid(msg.sender, premiumAmount, tier, tokenId);
    }

    // Autonomous AI agent calls this when flight condition is met
    function payout(uint256 tokenId) external onlyAgent {
        PolicyNFT.Policy memory policy = policyNFT.getPolicy(tokenId);
        
        require(!policy.isClaimed, "Policy already claimed");
        require(block.timestamp <= policy.expiry, "Policy expired");
        
        address policyholder = policyNFT.ownerOf(tokenId);
        
        uint256 payoutAmount;
        if (policy.tier == 1) payoutAmount = TIER_1_PAYOUT;
        else if (policy.tier == 2) payoutAmount = TIER_2_PAYOUT;
        else if (policy.tier == 3) payoutAmount = TIER_3_PAYOUT;

        require(cUSD.balanceOf(address(this)) >= payoutAmount, "Insufficient pool funds");
        
        // Mark policy as claimed via the NFT contract
        policyNFT.markAsClaimed(tokenId);
        
        // Transfer payout in cUSD to policyholder
        require(cUSD.transfer(policyholder, payoutAmount), "Payout failed");
        
        emit ClaimSettled(tokenId, policy.flightId, payoutAmount, policyholder);
    }
}
