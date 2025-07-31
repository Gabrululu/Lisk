// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

library SafeMath {
    function add(uint a, uint b) internal pure returns (uint) {
        return a + b;
    }

    function sub(uint a, uint b) internal pure returns (uint) {
        require(b <= a, "SafeMath: subtraction overflow");
        return a - b;
    }
}
