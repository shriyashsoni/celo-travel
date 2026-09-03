import { ethers } from "ethers";
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config({ path: ".env.local" });
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const required = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required in .env.local`);
  return value;
};

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.BOT_CHAIN_RPC || "https://rpc.botchain.ai");
  const network = await provider.getNetwork();
  if (Number(network.chainId) !== 677) throw new Error(`Expected Bot Chain (677), got ${network.chainId}`);
  const wallet = new ethers.Wallet(required("PRIVATE_KEY"), provider);
  const tokenAddress = required("NEXT_PUBLIC_CUSD_ADDRESS");
  const policyAddress = required("NEXT_PUBLIC_POLICY_NFT_ADDRESS");
  const registryAddress = required("NEXT_PUBLIC_AGENT_REGISTRY_ADDRESS");
  const readArtifact = (name) => JSON.parse(fs.readFileSync(path.join(__dirname, `../artifacts/contracts/${name}.sol/${name}.json`), "utf8"));

  console.log("Resuming TravelShield deployment on Bot Chain with:", wallet.address);
  const artifact = readArtifact("InsurancePool");
  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
  const pool = await factory.deploy(tokenAddress, policyAddress, wallet.address);
  await pool.waitForDeployment();
  const poolAddress = await pool.getAddress();
  console.log("InsurancePool deployed to:", poolAddress);

  const policy = new ethers.Contract(policyAddress, readArtifact("PolicyNFT").abi, wallet);
  const tx = await policy.setMinter(poolAddress);
  await tx.wait();
  console.log("PolicyNFT minter configured:", tx.hash);

  const envPath = path.join(__dirname, "../.env.local");
  let env = fs.readFileSync(envPath, "utf8");
  const line = `NEXT_PUBLIC_INSURANCE_POOL_ADDRESS=${poolAddress}`;
  env = /^NEXT_PUBLIC_INSURANCE_POOL_ADDRESS=.*$/m.test(env)
    ? env.replace(/^NEXT_PUBLIC_INSURANCE_POOL_ADDRESS=.*$/m, line)
    : `${env}${env.endsWith("\n") ? "" : "\n"}${line}\n`;
  fs.writeFileSync(envPath, env);
  console.log(".env.local updated.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});