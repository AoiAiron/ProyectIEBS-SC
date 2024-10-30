const { expect } = require('chai');
const { ethers, network } = require('hardhat');

describe("Marketplace", () => {

    let marketplace, nft, token;
    let deployerMarket, buyer, seller;

    beforeEach(async () => {

        [deployerMarket, buyer, seller] = await ethers.getSigners();

        if(network.name === 'sepolia') seller = deployerMarket;

        //console.log('Deploying..');

        nft = await ethers.getContractFactory('MyNFT', seller);
        token = await ethers.getContractFactory('Token', buyer);
        marketplace = await ethers.getContractFactory('Marketplace', deployerMarket);

        nft = await nft.deploy();
        token = await token.deploy(10000);

        await nft.waitForDeployment();
        await token.waitForDeployment();

        marketplace = await marketplace.deploy(token.target, nft.target);
        await marketplace.waitForDeployment();

        //console.log('Contracts deployed');
    })


    it("should deploy contract marketplace", async function () {
        expect(marketplace.target).to.not.be.undefined;
    });


    it("should set token and nft addresses", async function () {
        expect(token.target).to.equal(await marketplace.paymentToken());
        expect(nft.target).to.equal(await marketplace.nftContract());
    });

    it("should list a new nft for sale", async function () {

        await nft.mint(seller);
        
        // Approving the listing of the nft..
        await nft.connect(seller).approve(marketplace.target, 0);

        // Listing the nft..
        await marketplace.connect(seller).listNFT(0, 100);
        
        // Checking listing..
        const listing = await marketplace.listings(0);

        expect(listing.price).to.equal(100);
        expect(listing.seller).to.equal(seller.address);

    });

    it("should allow a buyer to purchase an NFT", async function () {
        await nft.mint(seller);
        await nft.connect(seller).approve(marketplace.target, 0);
        await marketplace.connect(seller).listNFT(0, 100);
        await token.connect(buyer).approve(marketplace.target, 100);
        await marketplace.connect(buyer).purchaseNFT(0);
        const newOwner = await nft.ownerOf(0);
        expect(newOwner).to.equal(buyer.address);
        const sellerBalance = await token.balanceOf(seller.address);
        expect(sellerBalance).to.equal(100);
    });

    it("should not allow purchase if NFT is not listed", async function () {
        await token.connect(buyer).approve(marketplace.target, 100);
        await expect(marketplace.connect(buyer).purchaseNFT(0)).to.be.revertedWith("NFT not listed for sale");
    });

    it("should not allow purchase if the buyer hasn't approved enough tokens", async function () {
        await nft.mint(seller);
        await nft.connect(seller).approve(marketplace.target, 0);
        await marketplace.connect(seller).listNFT(0, 500);
        await token.connect(buyer).approve(marketplace.target, 100);
        await expect(marketplace.connect(buyer).purchaseNFT(0)).to.be.reverted;
    });


    it("should allow the seller to update the price of a listed NFT", async function () {
        await nft.mint(seller);
        await nft.connect(seller).approve(marketplace.target, 0);
        await marketplace.connect(seller).listNFT(0, 100);
        await marketplace.connect(seller).updateNFTPrice(0, 200);
        const listing = await marketplace.listings(0);
        expect(listing.price).to.equal(200);
    });
    

    it("should not allow non-sellers to update the price of an NFT", async function () {
        await nft.mint(seller);
        await nft.connect(seller).approve(marketplace.target, 0);
        await marketplace.connect(seller).listNFT(0, 100);
        await expect(marketplace.connect(buyer).updateNFTPrice(0, 200)).to.be.reverted;
    });
})