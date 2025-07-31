# 🔒 SecurePiggyBank - Smart Contract Audit & Attack Simulation

Este proyecto consiste en analizar, identificar y mitigar vulnerabilidades de seguridad en un contrato inteligente simple llamado `VulnerablePiggyBank`. También se incluye un contrato atacante para simular un ataque real y una versión segura del contrato.

---

## ⚠️ Contrato original vulnerable

```solidity
contract VulnerablePiggyBank {
    address public owner;
    constructor() { owner = msg.sender }
    function deposit() public payable {}
    function withdraw() public { 
        payable(msg.sender).transfer(address(this).balance); 
    }
    function attack() public { }
}

❗ Vulnerabilidades detectadas:
- withdraw() no verifica que al momento de llamar sea el owner.
- Cualquiera puede vaciar los fondos del contrato.
- No se usan validaciones adicionales con require() o revert().
- attack() está disponible para explotación futura.