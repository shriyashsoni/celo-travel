// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AgentRegistry
 * @dev Mock implementation for hackathon to register the ERC-8004 agent.
 * This ensures the agent gets logged onchain and can be indexed by 8004scan.
 */
contract AgentRegistry {
    event AgentRegistered(address indexed agentWallet, string agentId, address indexed owner);

    struct Agent {
        string agentId;
        address owner;
        bool isRegistered;
    }

    // Maps agent wallet address to Agent details
    mapping(address => Agent) public agents;

    /**
     * @dev Registers an ERC-8004 agent wallet
     * @param agentWallet The address of the autonomous agent
     * @param agentId The Self Agent ID (e.g. from app.ai.self.xyz)
     */
    function registerAgent(address agentWallet, string calldata agentId) external {
        require(!agents[agentWallet].isRegistered, "Agent already registered");
        
        agents[agentWallet] = Agent({
            agentId: agentId,
            owner: msg.sender,
            isRegistered: true
        });

        emit AgentRegistered(agentWallet, agentId, msg.sender);
    }
}
