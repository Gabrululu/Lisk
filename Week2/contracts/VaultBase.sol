// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./SafeMath.sol";

abstract contract VaultBase {
    using SafeMath for uint;

    mapping(address => uint) internal balances;

    event Deposited(address indexed user, uint amount, uint timestamp);
    event Withdrawn(address indexed user, uint amount, uint timestamp);

    function getBalance(address _user) public view returns (uint) {
        return balances[_user];
    }
}
