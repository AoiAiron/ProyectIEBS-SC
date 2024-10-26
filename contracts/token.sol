// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

error ExceededMaxSupply(uint256 attemptedSupply, uint256 maxSupply);
error InvalidAmount(uint256 amountRequired);
error UnauthorizedAccess(address caller);

contract Token is ERC20, AccessControl, ReentrancyGuard {
    uint256 public immutable maxSupply;
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);
    event AdminChanged(address indexed previousAdmin, address indexed newAdmin);

    constructor(
        uint256 _initialSupply,
        uint256 _maxSupply,
        string memory _name,
        string memory _symbol
    ) ERC20(_name, _symbol) {
        require(_initialSupply <= _maxSupply, "Initial supply exceeds max supply");
        _mint(msg.sender, _initialSupply);
        maxSupply = _maxSupply;
        // Asignar roles al OWNER del contrato.
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(BURNER_ROLE, msg.sender);
    }

    function mint(uint256 amount, address to) public onlyRole(MINTER_ROLE) nonReentrant {
        require(to != address(0), "Can't mint to a zero address");
        if (amount <= 0) {
            revert InvalidAmount(amount);
        }
        if (totalSupply() + amount > maxSupply) {
            revert ExceededMaxSupply(totalSupply() + amount, maxSupply);
        }
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    function burn(uint256 amount) public onlyRole(BURNER_ROLE) nonReentrant {
        if (amount <= 0) {
            revert InvalidAmount(amount);
        }
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount);
    }

    function setAdmin(address newAdmin) public onlyRole(DEFAULT_ADMIN_ROLE) nonReentrant {
        require(newAdmin != address(0), "New admin cannot be the zero address");
        grantRole(DEFAULT_ADMIN_ROLE, newAdmin);
        revokeRole(DEFAULT_ADMIN_ROLE, msg.sender);
        emit AdminChanged(msg.sender, newAdmin);
    }

    function grantMinterRole(address minter) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(MINTER_ROLE, minter);
    }

    function revokeMinterRole(address minter) public onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(MINTER_ROLE, minter);
    }

    function grantBurnerRole(address burner) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(BURNER_ROLE, burner);
    }

    function revokeBurnerRole(address burner) public onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(BURNER_ROLE, burner);
    }
}
