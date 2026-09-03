import { Wallet } from "ethers";

const wallet = Wallet.createRandom();
console.log(`Address: ${wallet.address}`);
console.log(`Private key: ${wallet.privateKey}`);
console.log("Fund this address with BOT, then set PRIVATE_KEY locally before deploying.");