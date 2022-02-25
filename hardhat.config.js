"use strict";

require("dotenv").config();
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      blockGasLimit: 922450000
    },
    rinkeby: {
      url: `${process.env.RINKEBY_NODE}`,
      accounts: [`${process.env.RINKEBY_KEY}`,]
    },
    mainnet: {
      url: `${process.env.MAINNET_NODE}`,
      accounts: [`${process.env.MAINNET_KEY}`,]
    }    
  },
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 200000
  },
  etherscan: {
    apiKey: `${process.env.ES_API_KEY}`
  }
}
