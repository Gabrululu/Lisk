// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./VaultBase.sol";

contract VaultManager is VaultBase {

    // Deposit ETH
    function deposit() public payable {
        require(msg.value > 0, "Must deposit more than 0 ETH");

        balances[msg.sender] = balances[msg.sender].add(msg.value);
        emit Deposited(msg.sender, msg.value, block.timestamp);
    }

    // Withdraw ETH
    function withdraw(uint _amount) public {
        require(_amount > 0, "Withdraw amount must be greater than 0");
        require(balances[msg.sender] >= _amount, "Insufficient balance");

        balances[msg.sender] = balances[msg.sender].sub(_amount);
        payable(msg.sender).transfer(_amount);

        emit Withdrawn(msg.sender, _amount, block.timestamp);
    }

    // Fallback to reject ETH sent directly
    receive() external payable {
        revert("Direct ETH transfers not allowed. Use deposit()");
    }
}
