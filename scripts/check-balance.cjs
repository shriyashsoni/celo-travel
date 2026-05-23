const { ethers } = require("ethers");

async function checkBalance() {
  const provider = new ethers.JsonRpcProvider("https://forno.celo-sepolia.celo-testnet.org");
  const privateKey = "193f4145e83a831f9af0cc57796c50dd31412ad1342b7bf1ab879673ee6f32b7";
  const wallet = new ethers.Wallet(privateKey, provider);
  
  console.log("Wallet address:", wallet.address);
  
  const celoBalance = await provider.getBalance(wallet.address);
  console.log("CELO Balance:", ethers.formatEther(celoBalance));
  
  const cusdAbi = [
    "function balanceOf(address owner) view returns (uint256)",
    "function allowance(address owner, address spender) view returns (uint256)"
  ];
  const cusdAddress = "0x954cBA141f21760751E3065ACC250c38fb9f5e61"; // Sepolia cUSD
  const cusdContract = new ethers.Contract(cusdAddress, cusdAbi, provider);
  
  const cusdBalance = await cusdContract.balanceOf(wallet.address);
  console.log("cUSD Balance:", ethers.formatUnits(cusdBalance, 18));
  
  const poolAddress = "0x78bf048E450Ec94cB055C8ab180CA27c912e975e";
  const allowance = await cusdContract.allowance(wallet.address, poolAddress);
  console.log("cUSD Allowance for Pool:", ethers.formatUnits(allowance, 18));
}

checkBalance().catch(console.error);
