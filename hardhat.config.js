import "@nomicfoundation/hardhat-ethers";
import * as dotenv from "dotenv";
dotenv.config();

/** @type import('hardhat/config').HardhatUserConfig */
export default {
  solidity: {
    version: "0.8.24",
    settings: {
      evmVersion: "cancun",
    },
  },
  networks: {
    botchain: {
      type: "http",
      url: process.env.BOT_CHAIN_RPC || "https://rpc.botchain.ai",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 677,
    },
  },
  etherscan: {
    apiKey: {
      botchain: process.env.BOTSCAN_API_KEY || "",
    },
    customChains: [
      {
        network: "botchain",
        chainId: 677,
        urls: {
          apiURL: process.env.BOT_CHAIN_EXPLORER_API || "https://scan.botchain.ai/api",
          browserURL: process.env.BOT_CHAIN_EXPLORER || "https://scan.botchain.ai",
        },
      },
    ],
  },
};
