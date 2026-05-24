import { ethers } from "ethers";
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.CELO_ALFAJORES_RPC);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const CUSD_ADDRESS = "0x666a2c9a052203F53B2576a984bCC0BFa539417F";
  const POOL_ADDRESS = "0x89FDD0Ad4bd2B2c48ECB39A6f636Af000F56Abe6";

  console.log("Simulating user activity on Celo Sepolia with deployer wallet:", wallet.address);

  const erc20Abi = [
    "function approve(address spender, uint256 amount) returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)"
  ];
  const cusd = new ethers.Contract(CUSD_ADDRESS, erc20Abi, wallet);

  const poolAbi = [
    "function buyPolicy(string calldata flightId, uint8 tier, uint256 expiry) external"
  ];
  const pool = new ethers.Contract(POOL_ADDRESS, poolAbi, wallet);

  console.log("1. Approving cUSD for InsurancePool...");
  const approveTx = await cusd.approve(POOL_ADDRESS, ethers.parseUnits("100", 18));
  await approveTx.wait();
  console.log("Approved! Tx:", approveTx.hash);

  console.log("2. Buying Policy (Tier 2, Flight: AI777)...");
  const expiry = Math.floor(Date.now() / 1000) + 86400 * 2; // 48 hours from now
  const buyTx = await pool.buyPolicy("AI777", 2, expiry);
  await buyTx.wait();
  console.log("Policy Minted! Tx:", buyTx.hash);

  console.log("Simulation complete! The dashboard will now show these transactions.");
}

main().catch(console.error);
