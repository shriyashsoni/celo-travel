// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PolicyNFT is ERC721Enumerable, Ownable {
    uint256 private _nextTokenId;

    struct Policy {
        string flightId; // e.g., "AA123-20260525"
        uint8 tier;      // 1: 2h delay, 2: 4h delay, 3: cancelled
        uint256 expiry;  // timestamp of flight arrival + buffer
        bool isClaimed;
    }

    mapping(uint256 => Policy) public policies;
    
    // Address of InsurancePool that is authorized to mint policies
    address public minter;

    event PolicyMinted(uint256 indexed tokenId, address indexed policyholder, string flightId, uint8 tier, uint256 expiry);
    event PolicyClaimed(uint256 indexed tokenId);

    constructor() ERC721("TravelShield Policy", "TSP") Ownable(msg.sender) {}

    function setMinter(address _minter) external onlyOwner {
        minter = _minter;
    }

    modifier onlyMinter() {
        require(msg.sender == minter, "Not authorized to mint");
        _;
    }

    function mintPolicy(
        address to,
        string calldata flightId,
        uint8 tier,
        uint256 expiry
    ) external onlyMinter returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        
        policies[tokenId] = Policy({
            flightId: flightId,
            tier: tier,
            expiry: expiry,
            isClaimed: false
        });

        _mint(to, tokenId);
        
        emit PolicyMinted(tokenId, to, flightId, tier, expiry);
        return tokenId;
    }

    function markAsClaimed(uint256 tokenId) external onlyMinter {
        ownerOf(tokenId); // Reverts if token does not exist
        require(!policies[tokenId].isClaimed, "Policy already claimed");
        
        policies[tokenId].isClaimed = true;
        
        emit PolicyClaimed(tokenId);
    }
    
    function getPolicy(uint256 tokenId) external view returns (Policy memory) {
        ownerOf(tokenId); // Reverts if token does not exist
        return policies[tokenId];
    }
}
