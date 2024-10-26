const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("CryptoTokenDeployment", (m) => {
    const initialsupply = 10000;  
    const maxsupply = 1000000;
    const name = "BattleGems"
    const symbol = "BGEMS"          
    
    // Deploy the BattleSystem contract with addresses of Creatures and Items
    const cryptoToken = m.contract("Token", [initialsupply, maxsupply, name, symbol ]);
    
    return { cryptoToken };
  });