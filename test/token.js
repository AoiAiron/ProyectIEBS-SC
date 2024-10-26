const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token contract", function () {
    let Token;
    let token;
    let owner;
    let addr1;
    let addr2;
    let addrs;
    let addr3;
    let addr4;

    beforeEach(async function () {
        Token = await ethers.getContractFactory("Token");
        [owner, addr1, addr2, addr3, addr4, ...addrs] = await ethers.getSigners();
    
        token = await Token.deploy("1000", "10000", "TestToken", "TT");
    });
    

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await token.hasRole(await token.DEFAULT_ADMIN_ROLE(), owner.address)).to.equal(true);
        });

        it("Initial supply should be within the max supply limit", async function () {
            const initialSupply = await token.totalSupply();
            const maxSupply = await token.maxSupply();
            expect(initialSupply).to.be.at.most(maxSupply);
        });
    });

    describe("Minting tokens", function () {
        it("Should mint tokens when called by Minter", async function () {
            await token.grantRole(await token.MINTER_ROLE(), addr1.address);
            await token.connect(addr1).mint(500, addr1.address);
            expect(await token.balanceOf(addr1.address)).to.equal(500);
        });

        it("Should prevent non-minters from minting tokens", async function () {
            await expect(token.connect(addr2).mint(500, addr2.address))
                .to.be.revertedWithCustomError(token, "AccessControlUnauthorizedAccount");
        });

        it("Should fail minting tokens beyond max supply", async function () {
            await token.grantRole(await token.MINTER_ROLE(), addr1.address);
            await expect(token.connect(addr1).mint(10001, addr1.address))
                .to.be.revertedWithCustomError(token, "ExceededMaxSupply")
                .withArgs(11001, 10000); 
        });

        it("Should revert with zero address", async function () {
            await token.grantRole(await token.MINTER_ROLE(), addr1.address);
            await expect(token.connect(addr1).mint(500, "0x0000000000000000000000000000000000000000"))
                .to.be.revertedWith("Can't mint to a zero address");
        });

        
    });

    describe("Burning tokens", function () {
        it("Should allow burn when called by Burner", async function () {
            await token.grantRole(await token.MINTER_ROLE(), addr2.address);
            await token.grantRole(await token.BURNER_ROLE(), addr2.address);
            await token.connect(addr2).mint(500, addr2.address);
            expect(await token.balanceOf(addr2.address)).to.equal(500);
            await token.connect(addr2).burn(500);
            expect(await token.balanceOf(addr2.address)).to.equal(0);
        });

        it("Should prevent non-burners from burning tokens", async function () {
            await expect(token.connect(addr3).burn(500))
                .to.be.revertedWithCustomError(token, "AccessControlUnauthorizedAccount");
        });

                
        it("Should revert if burning zero or less tokens", async function () {
            await token.grantRole(await token.BURNER_ROLE(), owner.address);
            await expect(token.connect(owner).burn(0))
                .to.be.revertedWithCustomError(token, "InvalidAmount")
                .withArgs(0);  
        });
        
    });

    describe("Role management", function () {

        it("Should assign and revoke Minter role by admin", async function () {
            await token.grantMinterRole(addr3.address);
            expect(await token.hasRole(await token.MINTER_ROLE(), addr3.address)).to.be.true;

            await token.revokeMinterRole(addr3.address);
            expect(await token.hasRole(await token.MINTER_ROLE(), addr3.address)).to.be.false;
        });

        it("Should assign and revoke Burner role by admin", async function () {
            await token.grantBurnerRole(addr3.address);
            expect(await token.hasRole(await token.BURNER_ROLE(), addr3.address)).to.be.true;

            await token.revokeBurnerRole(addr3.address);
            expect(await token.hasRole(await token.BURNER_ROLE(), addr3.address)).to.be.false;
        });        

        it("Admin should change correctly", async function () {
            await token.setAdmin(addr4.address);
            expect(await token.hasRole(await token.DEFAULT_ADMIN_ROLE(), owner.address)).to.be.false;
            expect(await token.hasRole(await token.DEFAULT_ADMIN_ROLE(), addr4.address)).to.be.true;
        });

        it("Admin can assign and revoke multiple roles to the same address", async function () {
            await token.setAdmin(addr4.address);
            await token.connect(addr4).grantMinterRole(addr3.address);
            await token.connect(addr4).grantBurnerRole(addr3.address);
            expect(await token.hasRole(await token.MINTER_ROLE(), addr3.address)).to.be.true;
            expect(await token.hasRole(await token.BURNER_ROLE(), addr3.address)).to.be.true;
            await token.connect(addr4).revokeMinterRole(addr3.address);
            await token.connect(addr4).revokeBurnerRole(addr3.address);
            expect(await token.hasRole(await token.MINTER_ROLE(), addr3.address)).to.be.false;
            expect(await token.hasRole(await token.BURNER_ROLE(), addr3.address)).to.be.false;
        });
    });
});
