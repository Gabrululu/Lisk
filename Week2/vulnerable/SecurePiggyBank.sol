// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SecurePiggyBank {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    function deposit() public payable {}

    function withdraw() public onlyOwner {
        uint balance = address(this).balance;
        require(balance > 0, "Nothing to withdraw");

        (bool success, ) = payable(owner).call{value: balance}("");
        require(success, "Transfer failed");
    }
}

