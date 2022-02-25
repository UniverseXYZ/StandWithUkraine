"use strict";

require("dotenv").config();
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

const accounts = {mnemonic: `${process.env.MNEMONIC}`, accountsBalance: "99990000000000000000000"};

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      accounts: accounts,
      blockGasLimit: 922450000
    },
    rinkeby: {
      url: `${process.env.RINKEBY_KEY}`,
      accounts: accounts
    },
    mainnet: {
      url: `${process.env.MAINNET_KEY}`,
      accounts: accounts
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
