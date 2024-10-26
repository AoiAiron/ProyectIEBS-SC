const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("CryptoCreaturesDeployment", (m) => {
  // Deploy the Creatures contract
  const cryptoCreatures = m.contract("Creatures", []);
  return { cryptoCreatures };
});