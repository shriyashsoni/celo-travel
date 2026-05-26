import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.CELOSCAN_API_KEY || "A7PZRDK4NTCBJP99CI5KUVVG84UQVCMT2Z";
const CONTRACT_ADDRESS = "0x7274e874ca62410a93bd8bf61c69d8045e399c02";

async function main() {
  const url = `https://api.celoscan.io/api?module=contract&action=getabi&address=${CONTRACT_ADDRESS}&apikey=${API_KEY}`;
  
  console.log("Fetching ABI from Celoscan...");
  const res = await fetch(url);
  const data = await res.json();
  
  if (data.status === "1") {
    const abi = JSON.parse(data.result);
    console.log("--- CONTRACT ABI FUNCTIONS ---");
    abi.forEach(item => {
      if (item.type === "function") {
        const inputs = item.inputs.map(i => `${i.type} ${i.name}`).join(", ");
        console.log(`${item.stateMutability} function ${item.name}(${inputs})`);
      }
    });
  } else {
    console.error("Failed to fetch ABI:", data.result);
  }
}

main();
