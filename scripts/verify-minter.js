import { ethers } from "ethers";

async function main() {
  const provider = new ethers.JsonRpcProvider("https://forno.celo-sepolia.celo-testnet.org");
  const abi = ["function minter() external view returns (address)"];
  const policyNFT = new ethers.Contract("0x48Bd564c86e379D08D5b536c766b65b966548Ab1", abi, provider);
  const minter = await policyNFT.minter();
  console.log("PolicyNFT Minter is:", minter);
  console.log("Expected Pool is:", "0x78bf048E450Ec94cB055C8ab180CA27c912e975e");
}

main();
