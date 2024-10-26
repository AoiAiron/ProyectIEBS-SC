const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("CryptoGameRecordsDeployment", (m) => {
  // Deploy the Game Records contract
  const cryptoGame_Records = m.contract("GameRecords", []);
  return { cryptoGame_Records };
});