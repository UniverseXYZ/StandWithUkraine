const hre = require("hardhat");

async function main() {
  [owner, addr1, addr2, addr3, addr4, addr5, addr6, addr7, addr8, addr8, addr10, addr11, addr12, addr13, addr14, addr15] = await ethers.getSigners();
  
  now = Math.round(Date.now() / 1000);
  multisig="0x8a9Ce756D38135DC018a6bb62b1a22FFcE1153d0"
  SWU = await ethers.getContractFactory("StandWithUkraine");
  swu = await SWU.deploy("StandWithUkraine", "SWU", "ipfs://QmZzBH7hRgcYguvsfSfoLxYQaJGkXHEMox516f7jdDyvfP/", "0x1945A6Ce6B99E404fef9244B73158eA0A56a2266");

  console.log("SWU deployed to:", swu.address);
  //VERIFY COMMAND TO RUN IN TERMINAL - need to switch it to mainnet, plug in correct contract, ipfs, and multisig addr
  //npx hardhat verify --network rinkeby 0x492ee467804694b405D252C16505499aFc7C9169 StandWithUkraine SWU ipfs:// 0x0000000000000000000000000000000000000000

  // await mintPass.mint(0, 5);
  // let uri = await mintPass.uri(0);
  // console.log("uri: ", uri)
  // await mintPass.mint(1, 5);
  // uri = await mintPass.uri(1);
  // console.log("uri: ", uri)
  // await mintPass.mint(2, 5);
  // uri = await mintPass.uri(2);
  // console.log("uri: ", uri)


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
