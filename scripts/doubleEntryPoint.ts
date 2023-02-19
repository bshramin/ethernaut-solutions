import { ethers } from "hardhat";

async function doubleEntryPoint() {
  const FortaAddress = "0xa12fFA0B9f159BB4C54bce579611927Addc51610";
  const myAddress = "0x90F79bf6EB2c4f870365E785982E1f101E93b906";

  const Forta = await ethers.getContractFactory("Forta");
  const forta = await Forta.attach(FortaAddress);
  console.log(`Forta attached to ${FortaAddress}`);


  const Detective = await ethers.getContractFactory("Detective");
  const detective = await Detective.deploy();
  await detective.deployed();
  console.log(`Detective deployed at ${detective.address}`);
  
  const mySigner = await ethers.getSigner(myAddress);
  console.log(`Got my signer.`);
  await forta.connect(mySigner).setDetectionBot(detective.address);
  console.log(`Detection bot set in Forta.`);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
doubleEntryPoint().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
