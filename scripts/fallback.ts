import { ethers } from "hardhat";

const CONTRACT_ADDRESS = "0x3B02fF1e626Ed7a8fd6eC5299e2C54e1421B626B";
const PLAYER_ADDRESS = "0x90F79bf6EB2c4f870365E785982E1f101E93b906";

async function main() {
  const signer = await ethers.getSigner(PLAYER_ADDRESS);
  const contract = await ethers.getContractAt("Fallback", CONTRACT_ADDRESS, signer);

  const owner = await contract.owner();

  console.log(owner)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
