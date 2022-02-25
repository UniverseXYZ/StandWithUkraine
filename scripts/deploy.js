const hre = require("hardhat");

async function main() {
  [owner, addr1, addr2, addr3, addr4, addr5, addr6, addr7, addr8, addr8, addr10, addr11, addr12, addr13, addr14, addr15] = await ethers.getSigners();
  
  now = Math.round(Date.now() / 1000);

  MintPassFactory = await ethers.getContractFactory("StandWithUkraine");
  mintPass = await MintPassFactory.deploy("StandWithUkraine", "SWU", "ipfs://123/", "0x0000000000000000000000000000000000000000");
    
  console.log("MintPass deployed to:", mintPass.address);
  await mintPass.mint(0, 5);
  let uri = await mintPass.uri(0);
  console.log("uri: ", uri)
  await mintPass.mint(1, 5);
  uri = await mintPass.uri(1);
  console.log("uri: ", uri)
  await mintPass.mint(2, 5);
  uri = await mintPass.uri(2);
  console.log("uri: ", uri)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
