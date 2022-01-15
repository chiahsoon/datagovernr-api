// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract DataGovernR {
    mapping(string => address) private timestamps;

    constructor() {}

    function add(string memory hash) public {
        timestamps[hash] = msg.sender;
        console.log("Added timestamp hash '%s': '%s", hash, msg.sender);
    }

    function verify(string memory hash) public view returns (bool) {
        return timestamps[hash] != address(0);
    }
}
