// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Creatures is ERC721, Ownable(msg.sender) {
    
    uint256 private _nextTokenId = 1;

    // Creature elements
    enum ElementType { Fire, Water, Earth, Air }

    // Creature Structure
    struct Creature {
        string name;             // Name of the creature (randomly assigned)
        ElementType elementType; // Enum for element type
        uint256 level;           // Creature level (starts at 1)
        uint256 attackPower;     // Attack power (randomly assigned)
        uint256 defensePower;    // Defense power (randomly assigned)
    }

    event CreatureObtained(uint256 indexed creatureId, address indexed owner, string name, ElementType elementType, uint256 attackPower, uint256 defensePower);

    mapping(uint256 => Creature) public creatures;

    string[] private _names = [
        "Vortex", "Mystic", "Nebula", "Riftbeast", "Reihorn", "Kinkarean", "Corinden", "Galgadosh"
    ];

    // Constructor
    constructor() ERC721("CryptoCreaturesBattle", "CCB") {}
    
    // Function to obtain a new creature and assign it to a player
    function obtainCreature(address player) public onlyOwner returns (uint256) {
        require(player != address(0), "Cannot mint to zero address");
        uint256 newCreatureId = _nextTokenId++;

        // Generate random element type
        ElementType elementType = ElementType(_random() % 4);
        // Generate random name from the list of names
        string memory randomName = _names[_random() % _names.length];

        // Create the creature with random name, level 1, and random stats for attack and defense
        Creature memory newCreature = Creature({
            name: randomName,
            elementType: elementType,
            level: 1,
            attackPower: _random() % 100 + 1, // Attack power between 1 and 100
            defensePower: _random() % 100 + 1 // Defense power between 1 and 100
        });

        creatures[newCreatureId] = newCreature;

        // Mint the ERC721 token to the player's address
        _safeMint(player, newCreatureId);
        emit CreatureObtained(newCreatureId, player, randomName, elementType, newCreature.attackPower, newCreature.defensePower);

        // Return the new creature's token ID
        return newCreatureId;
    }

    // Internal function to generate random numbers (Debe mejorarse, puede ser con Chainlink)
    function _random() private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender)));
    }
}
