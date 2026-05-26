import { ethers } from "ethers";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.mainnet") });

async function main() {
  const txHash = "0x78a26ca5cce3fa40433ae32f4e4bbffcbe4ec32838f9514426b51cbf226a86c3";
  const RPC_URL = process.env.CELO_MAINNET_RPC || "https://forno.celo.org";

  console.log("Connecting to Celo Mainnet via RPC:", RPC_URL);
  const provider = new ethers.JsonRpcProvider(RPC_URL);

  const receipt = await provider.getTransactionReceipt(txHash);
  if (!receipt) {
    console.error("Transaction receipt not found.");
    return;
  }

  console.log("Transaction confirmed in block:", receipt.blockNumber);
  console.log("Logs emitted:", receipt.logs.length);

  // Parse transfer event logs
  // ERC-721 Transfer event signature: Transfer(address indexed from, address indexed to, uint256 indexed tokenId)
  const transferTopic = ethers.id("Transfer(address,address,uint256)");
  
  receipt.logs.forEach((log, index) => {
    console.log(`Log #${index} Topics:`, log.topics);
    if (log.topics[0] === transferTopic) {
      const from = ethers.getAddress(ethers.zeroPadValue(log.topics[1], 20));
      const to = ethers.getAddress(ethers.zeroPadValue(log.topics[2], 20));
      const tokenId = ethers.toBigInt(log.topics[3]).toString();
      console.log(`--- FOUND ERC-721 TRANSFER EVENT ---`);
      console.log(`From: ${from}`);
      console.log(`To: ${to}`);
      console.log(`Token ID (Agent ID): ${tokenId}`);
    }
  });
}

main();
