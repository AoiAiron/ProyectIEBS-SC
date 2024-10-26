// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Items is ERC1155, Ownable(msg.sender) {
    // Weapon structure
    struct Weapon {
        string name;
        uint256 attackPower;
    }
    string[] private _weapon_names = [
        "Espada Larga", "Katana", "Cimitarra", "Estoque", "Sable"
    ];

    // Armor structure
    struct Armor {
        string name;
        uint256 defensePower;
    }
    string[] private _armor_names = [
        "Cota de Mallas", "Armadura de Placas", "Armadura de cuero", "Brigandina"
    ];

    mapping(uint256 => Weapon) public weapons;
    mapping(uint256 => Armor) public armors;

    event WeaponMinted(address indexed to, uint256 indexed weaponId, string name, uint256 attackPower);
    event ArmorMinted(address indexed to, uint256 indexed armorId, string name, uint256 defensePower);
    event PotionsMinted(address indexed to, uint256 amount);

    // Counters for next available tokenId for each type
    uint256 private _nextWeaponId = 1; 
    uint256 private _nextArmorId = 0;  

    // Track total supply of potions
    uint256 private _totalPotionSupply = 0;

    // Constructor 
    constructor() ERC1155("") {}

    // Function to mint a weapon
    function mintWeapon(address player) public onlyOwner {
        require(player != address(0), "Cannot mint to zero address");
        uint256 newWeaponId = 2 * _nextWeaponId;
        string memory randomWeaponName = _weapon_names[_random() % _weapon_names.length];

        Weapon memory weapon = Weapon({
            name: randomWeaponName,
            attackPower: _random() % 100 + 1 // Attack power between 1 and 100
        });
        
        weapons[newWeaponId] = weapon;
        
        // Mint the weapon as a unique token (NFT)
        _mint(player, newWeaponId, 1, "");  
        emit WeaponMinted(player, newWeaponId, weapon.name, weapon.attackPower);
        _nextWeaponId++;
    }

    // Function to mint an armor
    function mintArmor(address player) public onlyOwner {
        require(player != address(0), "Cannot mint to zero address");
        uint256 newArmorId = 2 * _nextArmorId + 1;
        string memory randomArmorName = _armor_names[_random() % _armor_names.length];

        Armor memory armor = Armor({
            name: randomArmorName,
            defensePower: _random() % 100 + 1 // Defense power between 1 and 100
        });
        
        armors[newArmorId] = armor;

        // Mint the armor as a unique token (NFT)
        _mint(player, newArmorId, 1, "");  
        emit ArmorMinted(player, newArmorId, armor.name, armor.defensePower);
        _nextArmorId++;
    }

    // Function to mint Level Potions (Fungible Token, Token ID = 0)
    function mintPotions(address player, uint256 amount) public onlyOwner {
        require(player != address(0), "Cannot mint to zero address");
        uint256 potionID = 0;
        _mint(player, potionID, amount, "");
        emit PotionsMinted(player, amount);
        _totalPotionSupply += amount;
    }

    // Function to get the total supply of Level Potions
    function getTotalPotionSupply() public view returns (uint256) {
        return _totalPotionSupply;
    }

    // Internal function to generate random numbers (Debe mejorarse, puede ser con Chainlink)
    function _random() private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender)));
    }
}
