require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    flowEvmTestnet: {
      url: process.env.FLOW_EVM_TESTNET_RPC || "https://testnet.evm.nodes.onflow.org",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 545,
    },
    flowEvmMainnet: {
      url: process.env.FLOW_EVM_MAINNET_RPC || "https://mainnet.evm.nodes.onflow.org",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 747,
    },
  },
  etherscan: {
    apiKey: {
      flowEvmTestnet: "YOUR_API_KEY",
      flowEvmMainnet: "YOUR_API_KEY",
    },
    customChains: [
      {
        network: "flowEvmTestnet",
        chainId: 545,
        urls: {
          apiURL: "https://evm-testnet.flowscan.org/api",
          browserURL: "https://evm-testnet.flowscan.org",
        },
      },
      {
        network: "flowEvmMainnet",
        chainId: 747,
        urls: {
          apiURL: "https://evm.flowscan.org/api",
          browserURL: "https://evm.flowscan.org",
        },
      },
    ],
  },
}
