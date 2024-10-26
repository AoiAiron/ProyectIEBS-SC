const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Items Contract", function () {
  let Items, items;
  let owner, addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    Items = await ethers.getContractFactory("Items");
    items = await Items.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await items.owner()).to.equal(owner.address);
    });
  });

  describe("Minting Weapons", function () {

    it("Should revert if trying to mint a weapon for a zero address", async function() {
      await expect(items.mintWeapon("0x0000000000000000000000000000000000000000"))
          .to.be.revertedWith("Cannot mint to zero address");
    });

    it("Should mint a weapon and emit WeaponMinted event", async function () {
      const tx = await items.mintWeapon(addr1.address);

      const weaponId = 2; // First weapon ID should be 2 (solo numeros pares)
      const weapon = await items.weapons(weaponId);

      // Check that the event was emitted with the correct data
      await expect(tx)
        .to.emit(items, "WeaponMinted")
        .withArgs(addr1.address, weaponId, weapon.name, weapon.attackPower);

      // Validate the weapon's properties
      const expectedWeaponNames = ["Espada Larga", "Katana", "Cimitarra", "Estoque", "Sable"];
      expect(expectedWeaponNames).to.include(weapon.name);
      expect(weapon.attackPower).to.be.within(1, 100);

      // Ensure the weapon was minted for the correct address
      expect(await items.balanceOf(addr1.address, weaponId)).to.equal(1);
    });

    it("Should only allow the owner to mint a weapon", async function () {
      await expect(items.connect(addr1).mintWeapon(addr1.address)).to.be.reverted; 
    });    
  });

  describe("Minting Armors", function () {

    it("Should revert if trying to mint an armor for a zero address", async function() {
      await expect(items.mintArmor("0x0000000000000000000000000000000000000000"))
          .to.be.revertedWith("Cannot mint to zero address");
    });

    it("Should mint an armor and emit ArmorMinted event", async function () {
      const tx = await items.mintArmor(addr1.address);

      // Fetch armor details after minting
      const armorId = 1; // First armor ID should be 1 (numeros impares)
      const armor = await items.armors(armorId);

      // Check that the event was emitted with the correct data
      await expect(tx)
        .to.emit(items, "ArmorMinted")
        .withArgs(addr1.address, armorId, armor.name, armor.defensePower);

      // Validate the armor's properties
      const expectedArmorNames = ["Cota de Mallas", "Armadura de Placas", "Armadura de cuero", "Brigandina"];
      expect(expectedArmorNames).to.include(armor.name);
      expect(armor.defensePower).to.be.within(1, 100);

      // Ensure the armor was minted for the correct address
      expect(await items.balanceOf(addr1.address, armorId)).to.equal(1);
    });
    

    it("Should only allow the owner to mint an armor", async function () {
      await expect(items.connect(addr1).mintArmor(addr1.address)).to.be.reverted; 
    });
  });

  describe("Minting Potions", function () {

    it("Should revert if trying to mint potions for a zero address", async function () {
      await expect(items.mintPotions("0x0000000000000000000000000000000000000000", 10))
        .to.be.revertedWith("Cannot mint to zero address");
    });

    it("Should mint potions and emit PotionsMinted event", async function () {
      const potionAmount = 10;
      await expect(items.mintPotions(addr1.address, potionAmount))
        .to.emit(items, "PotionsMinted")
        .withArgs(addr1.address, potionAmount);

      const potionId = 0; // Potions have a fixed token ID of 0
      expect(await items.balanceOf(addr1.address, potionId)).to.equal(potionAmount);
    });

    it("Should only allow the owner to mint potions", async function () {
      await expect(items.connect(addr1).mintPotions(addr1.address, 10)).to.be.reverted; 
    });

    it("Should track the total supply of potions", async function () {
      await items.mintPotions(addr1.address, 10);
      expect(await items.getTotalPotionSupply()).to.equal(10);

      await items.mintPotions(addr1.address, 20);
      expect(await items.getTotalPotionSupply()).to.equal(30);
    });
  });
});
