// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract FlowTravelInsuranceEVM is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct Policy {
        uint256 id;
        address holder;
        string destination;
        uint256 coverageAmount;
        uint256 premium;
        uint256 startDate;
        uint256 endDate;
        bool isActive;
    }

    struct Claim {
        uint256 id;
        uint256 policyId;
        address claimant;
        uint256 amount;
        string reason;
        bool isApproved;
        bool isPaid;
        uint256 timestamp;
    }

    mapping(uint256 => Policy) public policies;
    mapping(uint256 => Claim) public claims;
    mapping(address => uint256[]) public userPolicies;
    
    uint256 public totalPoolBalance;
    uint256 public totalClaims;
    uint256 public totalPolicies;
    
    Counters.Counter private _claimIds;

    event PolicyCreated(uint256 indexed policyId, address indexed holder, uint256 premium);
    event ClaimSubmitted(uint256 indexed claimId, uint256 indexed policyId, uint256 amount);
    event ClaimApproved(uint256 indexed claimId, uint256 amount);
    event PayoutExecuted(uint256 indexed claimId, address recipient, uint256 amount);

    constructor() ERC721("FlowTravel Policy NFT", "FTPNFT") {}

    function createPolicy(
        string memory destination,
        uint256 coverageAmount,
        uint256 startDate,
        uint256 endDate
    ) external payable {
        require(msg.value > 0, "Premium must be greater than 0");
        require(startDate < endDate, "Invalid date range");
        
        _tokenIds.increment();
        uint256 newPolicyId = _tokenIds.current();
        
        policies[newPolicyId] = Policy({
            id: newPolicyId,
            holder: msg.sender,
            destination: destination,
            coverageAmount: coverageAmount,
            premium: msg.value,
            startDate: startDate,
            endDate: endDate,
            isActive: true
        });
        
        userPolicies[msg.sender].push(newPolicyId);
        totalPoolBalance += msg.value;
        totalPolicies++;
        
        _mint(msg.sender, newPolicyId);
        
        emit PolicyCreated(newPolicyId, msg.sender, msg.value);
    }

    function submitClaim(
        uint256 policyId,
        uint256 amount,
        string memory reason
    ) external {
        require(ownerOf(policyId) == msg.sender, "Not policy owner");
        require(policies[policyId].isActive, "Policy not active");
        require(amount <= policies[policyId].coverageAmount, "Amount exceeds coverage");
        
        _claimIds.increment();
        uint256 newClaimId = _claimIds.current();
        
        claims[newClaimId] = Claim({
            id: newClaimId,
            policyId: policyId,
            claimant: msg.sender,
            amount: amount,
            reason: reason,
            isApproved: false,
            isPaid: false,
            timestamp: block.timestamp
        });
        
        totalClaims++;
        
        emit ClaimSubmitted(newClaimId, policyId, amount);
    }

    function approveClaim(uint256 claimId) external onlyOwner {
        require(claims[claimId].id != 0, "Claim does not exist");
        require(!claims[claimId].isApproved, "Claim already approved");
        
        claims[claimId].isApproved = true;
        
        emit ClaimApproved(claimId, claims[claimId].amount);
    }

    function executePayout(uint256 claimId) external onlyOwner {
        require(claims[claimId].isApproved, "Claim not approved");
        require(!claims[claimId].isPaid, "Claim already paid");
        require(totalPoolBalance >= claims[claimId].amount, "Insufficient pool balance");
        
        claims[claimId].isPaid = true;
        totalPoolBalance -= claims[claimId].amount;
        
        payable(claims[claimId].claimant).transfer(claims[claimId].amount);
        
        emit PayoutExecuted(claimId, claims[claimId].claimant, claims[claimId].amount);
    }

    function getUserPolicies(address user) external view returns (uint256[] memory) {
        return userPolicies[user];
    }

    function getPoolStats() external view returns (uint256, uint256, uint256) {
        return (totalPoolBalance, totalClaims, totalPolicies);
    }
}
