const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("DEXDeployment", (m) => {
    // Deploy the DEX contract
    const dex = m.contract("DEX", []);
    return { dex };
});
