const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("CryptoItemsDeployment", (m) => {
  // Deploy the Items contract
  const cryptoItems = m.contract("Items", [])
  return { cryptoItems };
});
