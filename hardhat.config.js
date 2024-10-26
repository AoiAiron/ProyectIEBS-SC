require("@nomicfoundation/hardhat-toolbox");
require('@nomicfoundation/hardhat-ignition');


// Hardhat default configuration already includes localhost settings
module.exports = {
    solidity: "0.8.27",
    namedAccounts: {
        deployer: {
            default: 0, // default account used as deployer
        },
    },
};
