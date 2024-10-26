const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("CryptoBattleDeployment", (m) => {
  // Assuming cryptoCreatures and cryptoItems have been deployed and their addresses are available.
  // Replace 'CREATURES_ADDRESS' and 'ITEMS_ADDRESS' with actual deployed contract addresses
  const creaturesAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';  
  const itemsAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';          
  
  // Deploy the BattleSystem contract with addresses of Creatures and Items
  const cryptoBattle = m.contract("BattleSystem", [creaturesAddress, itemsAddress]);
  
  return { cryptoBattle };
});
