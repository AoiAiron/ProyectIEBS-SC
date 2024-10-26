// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";

interface ICreatures {
    function creatures(uint256 tokenId) external view returns (
        string memory name,
        uint256 elementType,
        uint256 level,
        uint256 attackPower,
        uint256 defensePower
    );
    function ownerOf(uint256 tokenId) external view returns (address);
}

interface IItems {
    function weapons(uint256 tokenId) external view returns (
        string memory name,
        uint256 attackPower
    );

    function armors(uint256 tokenId) external view returns (
        string memory name,
        uint256 defensePower
    );
    function balanceOf(address account, uint256 id) external view returns (uint256);
}

contract BattleSystem is Ownable(msg.sender) {
    ICreatures public creatures;
    IItems public items;

    // Estructura para guardar los items equipados por una criatura
    struct CreatureEquipment {
        uint256 weaponId;
        uint256 armorId;
    }

    // Mapeo para asociar una criatura con su equipo
    mapping(uint256 => CreatureEquipment) public equippedItems;
    event ItemsEquipped(uint256 indexed creatureId, uint256 indexed weaponId, uint256 indexed armorId);

    constructor(address _creaturesAddress, address _itemsAddress) {
        creatures = ICreatures(_creaturesAddress);
        items = IItems(_itemsAddress);
    }

    // Función para que un jugador equipe un arma y una armadura a su criatura
    function equipItems(uint256 creatureId, uint256 weaponId, uint256 armorId) public {
        require(weaponId > 0 && weaponId % 2 == 0, "Invalid weapon ID");
        require(armorId > 0 && armorId % 2 == 1, "Invalid armor ID");
        require(creatures.ownerOf(creatureId) == msg.sender, "You do not own this creature");
        require(items.balanceOf(msg.sender, weaponId) > 0, "You do not own this weapon");
        require(items.balanceOf(msg.sender, armorId) > 0, "You do not own this armor");

        equippedItems[creatureId] = CreatureEquipment(weaponId, armorId);
        emit ItemsEquipped(creatureId, weaponId, armorId);
    }

    // Función para realizar una batalla entre dos criaturas

    function battle(uint256 attackerId, uint256 defenderId) public view returns (string memory) {
        // Obtener detalles de las criaturas
        (, , , uint256 attackPower, ) = creatures.creatures(attackerId);
        (, , , , uint256 defensePower) = creatures.creatures(defenderId);
        
        // Obtener detalles de los items equipados
        CreatureEquipment memory attackerEquipment = equippedItems[attackerId];
        CreatureEquipment memory defenderEquipment = equippedItems[defenderId];

        ( , uint256 weaponAttack) = items.weapons(attackerEquipment.weaponId);
        ( , uint256 armorDefense) = items.armors(defenderEquipment.armorId);

        // Calcular el poder de ataque y defensa combinados
        uint256 totalAttackPower = attackPower + weaponAttack;
        uint256 totalDefensePower = defensePower + armorDefense;

        // Comparar los poderes para determinar el ganador
        if (totalAttackPower > totalDefensePower) {
            return "Attacker Wins!";
        } else {
            return "Defender Wins!";
        }
    }
    
}
