// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract RecoveryHack {
    function getTheAddress(bytes memory addr) public view {
        console.log("The Address is: ", address(bytes20(keccak256(addr))));
    }
}
