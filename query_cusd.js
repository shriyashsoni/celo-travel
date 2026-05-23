const { ethers } = require("ethers");
const rpcAlfajores = "https://alfajores-forno.celo-testnet.org";
const rpcSepolia = "https://forno.celo-sepolia.celo-testnet.org";

const poolAbi = ["function cUSD() view returns (address)"];
const poolAddress = "0x59575D99d6691d109651C5bF357d78851dF90edB";

async function check(rpc, name) {
    try {
        const provider = new ethers.JsonRpcProvider(rpc);
        const contract = new ethers.Contract(poolAddress, poolAbi, provider);
        const cusd = await contract.cUSD();
        console.log(`[${name}] cUSD address:`, cusd);
    } catch (e) {
        console.log(`[${name}] Error:`, e.message);
    }
}

async function main() {
    await check(rpcAlfajores, "Alfajores");
    await check(rpcSepolia, "Sepolia");
}
main();
