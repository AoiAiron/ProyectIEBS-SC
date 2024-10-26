const { expect } = require("chai");
const { ethers } = require("hardhat");
const sinon = require('sinon');

describe("Creatures Contract", function () {
  let Creatures;
  let creatures;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    Creatures = await ethers.getContractFactory("Creatures");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    creatures = await Creatures.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await creatures.owner()).to.equal(owner.address);
    });

    it("Should have the correct token name and symbol", async function () {
      expect(await creatures.name()).to.equal("CryptoCreaturesBattle");
      expect(await creatures.symbol()).to.equal("CCB");
    });
  });

  describe("Obtain Creature", function () {
    it("Should revert if trying to obtain a creature for a zero address", async function() {
      await expect(creatures.obtainCreature("0x0000000000000000000000000000000000000000"))
          .to.be.revertedWith("Cannot mint to zero address");
    });

    it("Should emit a CreatureObtained event upon minting", async function () {
      const tx = await creatures.obtainCreature(addr1.address);
      
      // Await the transaction response and check for the event emission
      await expect(tx)
        .to.emit(creatures, "CreatureObtained");
    });
  
    it("Should correctly set creature properties upon minting", async function () {
      // Mint a new creature to addr1
      await creatures.obtainCreature(addr1.address);

      // The ID of the newly minted creature is 1 
      const creatureId = 1;

      // Fetch the creature's properties from the mapping
      const creature = await creatures.creatures(creatureId);

      // Check that the creature's name is one of the expected names
      const expectedNames = [
          "Vortex", "Mystic", "Nebula", "Riftbeast", 
          "Reihorn", "Kinkarean", "Corinden", "Galgadosh"
      ];
      expect(expectedNames).to.include(creature.name);

      // Directly check the elementType as it's already a number
      expect(creature.elementType).to.be.within(0, 3); // Enum values: Fire = 0, Water = 1, Earth = 2, Air = 3

      // Check that the creature's level is 1 
      expect(creature.level).to.equal(1);

      // Check that the attackPower is between 1 and 100
      expect(creature.attackPower).to.be.within(1, 100);

      // Check that the defensePower is between 1 and 100
      expect(creature.defensePower).to.be.within(1, 100);
  });

  it("Only owner should call obtainCreature", async function () {
    await expect(creatures.connect(addr1).obtainCreature(addr1.address))
        .to.be.reverted; // Checks for any revert
  });

  });
});
