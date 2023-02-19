// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "openzeppelin-contracts-08/access/Ownable.sol";
import "openzeppelin-contracts-08/token/ERC20/ERC20.sol";
import "./contract.sol";

contract Detective is IDetectionBot {
    address public constant cryptoVaultAddress =
        0xB6351eA8b3d83ab563b4d1Fb7818eC231205AF68;

    function handleTransaction(address user, bytes calldata) external {
        if (tx.origin != cryptoVaultAddress) {
            IForta(msg.sender).raiseAlert(user);
        }
    }
}
