const { ethers } = require("hardhat")

async function main() {
  console.log("🚀 Deploying FlowTravel Insurance EVM Contract...")

  const FlowTravelInsurance = await ethers.getContractFactory("FlowTravelInsuranceEVM")
  const contract = await FlowTravelInsurance.deploy()

  await contract.deployed()

  console.log("✅ FlowTravel Insurance EVM deployed to:", contract.address)
  console.log("🔗 Transaction hash:", contract.deployTransaction.hash)

  // Save deployment info
  const deploymentInfo = {
    network: "Flow EVM",
    contractName: "FlowTravelInsuranceEVM",
    address: contract.address,
    transactionHash: contract.deployTransaction.hash,
    timestamp: new Date().toISOString(),
  }

  console.log("📋 Deployment Info:", JSON.stringify(deploymentInfo, null, 2))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error)
    process.exit(1)
  })
