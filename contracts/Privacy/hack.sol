// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./contract.sol";

contract PrivacyHack {
    function getValue() public pure returns (bytes16) {
        bytes32 data = 0xa9a481118e413d183997e4863418b991244f61f6deedb1d1eb58b62c61a168c6;
        return bytes16(data);
    }
}
