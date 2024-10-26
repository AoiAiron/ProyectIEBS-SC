const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GameRecords", function () {
  let GameRecords;
  let gameRecords;
  let owner;
  let player1;
  let player2;
  let addrList;

  beforeEach(async function () {
    GameRecords = await ethers.getContractFactory("GameRecords");
    [owner, player1, player2, ...addrList] = await ethers.getSigners();
    
    gameRecords = await GameRecords.deploy();  
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await gameRecords.owner()).to.equal(owner.address);
    });
  });

  describe("Updating scores", function () {
    it("Should update the score correctly", async function () {
        await gameRecords.connect(owner).updateScore(player1.address, 100);
        const score = await gameRecords.getHighestScore(player1.address);  
        expect(score).to.equal(100);
    });

    it("Should fail if score is not higher", async function () {
        await gameRecords.connect(owner).updateScore(player1.address, 100);
        await expect(gameRecords.connect(owner).updateScore(player1.address, 50)).to.be.revertedWith("New score must be higher than the current score.");
    });
  });

  describe("Managing achievements", function () {
    it("Should set and check achievements correctly", async function () {
      await gameRecords.connect(owner).setAchievement(player1.address, "First Kill", true);
      expect(await gameRecords.hasAchieved(player1.address, "First Kill")).to.be.true;
    });
  });
});
