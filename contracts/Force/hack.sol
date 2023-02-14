// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SelfDestructingContract {
    function collect() public payable returns (uint256) {
        return address(this).balance;
    }

    function selfDestroy() public {
        address payable addr = payable(
            0x6309F03AfB2C9791cc8D86Ec4881557AA322f441
        );
        selfdestruct(addr);
    }
}
