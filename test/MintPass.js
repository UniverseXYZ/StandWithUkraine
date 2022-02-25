const { expect } = require("chai");
const { BigNumber } = require("@ethersproject/bignumber");

describe("MintPass tests", function () {
  let MintPassFactory
  let MetaHeroFactory
  
  let mintPass;
  let metaHero;

  let now;

  const validMerkleProof = 
    ["0x25774d93a89387440c47ef551980beac2bc70a33828ab5d8b183196b19a7ccf8",
     "0x51c5307b993037ae5ade90677f87626b064c7d0b2f6378ba212f6deb33ec8054",
     "0xf2b66f734917f26dccea3c37ef8e4636a1f656987d266212c493d052ffa2e7f6",
     "0x7238577a8d17ebed17d1df6d62266cbe4501c4ccfb07188f363874a2d9034398"];

  const validNonOwnerMerkleProof = 
    ["0x70f42682fd7aac7384947c7c35a4b0b0572195174ed837e5ff996dd8f86903c3",
     "0xb3887ed4516af0a494784aef65abdc0a0acd295d70a697d5314a9bf3ed760df5",
     "0x4f9e098c37ad99ae05834cf1367598bf54baf36839db130a245629c456a42151",
     "0x7238577a8d17ebed17d1df6d62266cbe4501c4ccfb07188f363874a2d9034398"
    ]

  const invalidMerkleProof = 
    ["0x99774d93a89387440c47ef551980beac2bc70a33828ab5d8b183196b19a7ccf8",
     "0x51c5307b993037ae5ade90677f87626b064c7d0b2f6378ba212f6deb33ec8054",
     "0xf2b66f734917f26dccea3c37ef8e4636a1f656987d266212c493d052ffa2e7f6",
     "0x7238577a8d17ebed17d1df6d62266cbe4501c4ccfb07188f363874a2d9034398"];
  
  beforeEach(async function () {
    
    [owner, addr1, addr2, addr3, addr4, addr5, addr6, addr7, addr8, addr8, addr10, addr11, addr12, addr13, addr14, addr15] = await ethers.getSigners();
    
    now = Math.round(Date.now() / 1000);

    MintPassFactory = await ethers.getContractFactory("MintPassFactory");
    mintPass = await MintPassFactory.deploy("MintPassFactory", "PASS");
    
    MetaHeroFactory = await ethers.getContractFactory("MetaHero");
    metaHero = await MetaHeroFactory.deploy("MetaHero", "HERO", now, "ipfs://ipfs/", mintPass.address, "arweaveteststring");
    

    // create MintPass with open window for a week from now
    await mintPass.addMintPass(
      "0x1bbccdebcc5cbdc2a591bc8aa1e0908825f6d25bf6817a70f8a81ffd851f175d", 
       now, now + 604800, "80000000000000000", "ipfs://QmWS694ViHvkTms9UkKqocv1kWDm2MTQqYEJeYi6LsJbxK", metaHero.address);

  });

  it("name and symbol", async function () {

    // burn should only be allowed from MetaHero contract
    expect(await mintPass.name()).to.equal("MintPassFactory");
    expect(await mintPass.symbol()).to.equal("PASS");

  });
  
  it("pause and unpause", async function () {

    expect(await mintPass.paused()).to.equal(false);

    expect(mintPass.connect(addr1).pause()).to.be.revertedWith("Ownable: caller is not the owner");

    await mintPass.pause();
    expect(await mintPass.paused()).to.equal(true);

    expect(mintPass.connect(addr1).unpause()).to.be.revertedWith("Ownable: caller is not the owner");

    await mintPass.unpause();
    expect(await mintPass.paused()).to.equal(false);

  });  

  it("edit mint pass", async function () {

    expect(mintPass.connect(addr1).editMintPass(
      "0x1bbccdebcc5cbdc2a591bc8aa1e0908825f6d25bf6817a70f8a81ffd851f175d", 
       now, 
       now + 604800, 
       "80000000000000000", 
       "QmWS694ViHvkTms9UkKqocv1kWDm2MTQqYEJeYi6LsJbxK",
       metaHero.address, 0)
    ).to.be.revertedWith("Ownable: caller is not the owner"); 

    await expect(mintPass.editMintPass(
      "0x1ddccdebcc5cbdc2a591bc8aa1e0908825f6d25bf6817a70f8a81ffd851f175d", 
       0, 
       1637204421, 
       "50000000000000000", 
       "QmWS694ViHvkTms9UkKqocv1kWDm2MTQqYEJeYi6LsJbxK",
       "0x7f0eDcd500476Cb2718F8a4c376a9b9D3121075e", 
       0)
    ).to.be.revertedWith("editMintPass: window cannot be 0");        
    
    await expect(mintPass.editMintPass(
      "0x1ddccdebcc5cbdc2a591bc8aa1e0908825f6d25bf6817a70f8a81ffd851f175d", 
       1637204421, 
       0, 
       "50000000000000000", 
       "QmWS694ViHvkTms9UkKqocv1kWDm2MTQqYEJeYi6LsJbxK",
       "0x7f0eDcd500476Cb2718F8a4c376a9b9D3121075e", 
       0)
    ).to.be.revertedWith("editMintPass: open window must be before close window");   

    await mintPass.editMintPass(
      "0x1ddccdebcc5cbdc2a591bc8aa1e0908825f6d25bf6817a70f8a81ffd851f175d", 
       1627204421, 
       1637204421, 
       "50000000000000000", 
       "QmWS694ViHvkTms9UkKqocv1kWDm2MTQqYEJeYi6LsJbxK",
       "0x7f0eDcd500476Cb2718F8a4c376a9b9D3121075e", 
       0
    );

    let struct = await mintPass.mintPasses(0);

    expect(struct.merkleRoot).to.equal("0x1ddccdebcc5cbdc2a591bc8aa1e0908825f6d25bf6817a70f8a81ffd851f175d");
    expect(struct.mintPrice).to.equal(BigNumber.from("50000000000000000"));
    expect(struct.windowOpens).to.equal(BigNumber.from("1627204421"));
    expect(struct.windowCloses).to.equal(BigNumber.from("1637204421"));
    expect(struct.redeemableContract).to.equal("0x7f0eDcd500476Cb2718F8a4c376a9b9D3121075e");
  
  });

  it("add mint pass", async function () {

    expect(mintPass.connect(addr1).addMintPass(
      "0x1bbccdebcc5cbdc2a591bc8aa1e0908825f6d25bf6817a70f8a81ffd851f175d", 
       now, 
       now + 604800, 
       "80000000000000000", 
       "QmWS694ViHvkTms9UkKqocv1kWDm2MTQqYEJeYi6LsJbxK",
       metaHero.address)
    ).to.be.revertedWith("Ownable: caller is not the owner");

    await expect(mintPass.addMintPass(
      "0x1ddccdebcc5cbdc2a591bc8aa1e0908825f6d25bf6817a70f8a81ffd851f175d", 
       0, 
       1637204421, 
       "50000000000000000", 
       "QmWS694ViHvkTms9UkKqocv1kWDm2MTQqYEJeYi6LsJbxK",
       "0x7f0eDcd500476Cb2718F8a4c376a9b9D3121075e")
    ).to.be.revertedWith("addMintPass: window cannot be 0");

    await expect(mintPass.addMintPass(
      "0x1ddccdebcc5cbdc2a591bc8aa1e0908825f6d25bf6817a70f8a81ffd851f175d", 
       1637204421, 
       0, 
       "50000000000000000", 
       "QmWS694ViHvkTms9UkKqocv1kWDm2MTQqYEJeYi6LsJbxK",       
       "0x7f0eDcd500476Cb2718F8a4c376a9b9D3121075e")
    ).to.be.revertedWith("addMintPass: open window must be before close window");        

    await mintPass.addMintPass(
      "0x1ddccdebcc5cbdc2a591bc8aa1e0908825f6d25bf6817a70f8a81ffd851f175d", 
       1627204421, 
       1637204421, 
       "50000000000000000", 
       "QmWS694ViHvkTms9UkKqocv1kWDm2MTQqYEJeYi6LsJbxK",
       "0x7f0eDcd500476Cb2718F8a4c376a9b9D3121075e");

    let struct = await mintPass.mintPasses(1);

    expect(struct.merkleRoot).to.equal("0x1ddccdebcc5cbdc2a591bc8aa1e0908825f6d25bf6817a70f8a81ffd851f175d");
    expect(struct.mintPrice).to.equal(BigNumber.from("50000000000000000"));
    expect(struct.windowOpens).to.equal(BigNumber.from("1627204421"));
    expect(struct.windowCloses).to.equal(BigNumber.from("1637204421"));
    expect(struct.redeemableContract).to.equal("0x7f0eDcd500476Cb2718F8a4c376a9b9D3121075e");

  });  

  it("return correct amount of claimed MPs", async function () {

    // claim 300 of 314 claimable mint passes
    await mintPass.connect(addr1).claim(
      300, 3, 314, 0, validNonOwnerMerkleProof, 
      {value: "24000000000000000000"}
    );
    
    expect(await mintPass.getClaimedMps(0, addr1.address)).to.equal(300);

    // claim 10 of 314 claimable mint passes
    await mintPass.connect(addr1).claim(
      10, 3, 314, 0, validNonOwnerMerkleProof, 
      {value: "800000000000000000"}
    );
    
    expect(await mintPass.getClaimedMps(0, addr1.address)).to.equal(310);    

  });  

  it("expect claim to fail when paused", async function () {

    await mintPass.pause();

    // claim when paused
    await expect(mintPass.connect(addr1).claim(1, 10, 1019, 0, invalidMerkleProof , {value: "80000000000000000"})).to.be.revertedWith("Claim: claiming is paused");    

  });  

  it("expect claim to fail before window opened", async function () {

    // claim before window opens
    mintPass.editMintPass(
      "0x1bbccdebcc5cbdc2a591bc8aa1e0908825f6d25bf6817a70f8a81ffd851f175d", 
       now + 604800, now + (2*604800), "80000000000000000", "QmWS694ViHvkTms9UkKqocv1kWDm2MTQqYEJeYi6LsJbxK", metaHero.address, 0
    );

    await expect(
      mintPass.connect(addr1).claim(
        1, 10, 1019, 0, validMerkleProof, 
        {value: "80000000000000000"}
      )
    ).to.be.revertedWith("Claim: time window closed");         

  });  

  it("expect claim to fail after window closed", async function () {

    await mintPass.editMintPass(
      "0x1bbccdebcc5cbdc2a591bc8aa1e0908825f6d25bf6817a70f8a81ffd851f175d", now - 604800, now - 1, "80000000000000000", "QmWS694ViHvkTms9UkKqocv1kWDm2MTQqYEJeYi6LsJbxK", metaHero.address, 0
    );
 
    await expect(
      mintPass.connect(addr1).claim(
        1, 3, 314, 0, validNonOwnerMerkleProof, 
        {value: "80000000000000000"}
      )
    ).to.be.revertedWith("Claim: time window closed");        

  });    

  it("expect claim to fail if MP not exists", async function () {

    await expect(
      mintPass.connect(addr1).claim(
        1, 3, 314, 1, validNonOwnerMerkleProof, 
        {value: "80000000000000000"}
      )
    ).to.be.revertedWith("Claim: Mint pass does not exist");      

  });    

  it("expect claim to fail if merkle proof is invalid", async function () {

    await expect(
      mintPass.connect(addr1).claim(
        1, 3, 314, 0, invalidMerkleProof, 
        {value: "80000000000000000"}
      )
    ).to.be.revertedWith("MerkleDistributor: Invalid proof.");    

  });

  it("expect claim to fail if valid merkle proof is used with false address", async function () {

    await expect(
      mintPass.connect(addr15).claim(
        1, 3, 314, 0, validNonOwnerMerkleProof,
        {value: "80000000000000000"}
      )
    ).to.be.revertedWith("MerkleDistributor: Invalid proof.");

  }); 

  it("expect claim to fail if ether value insufficient", async function () {

    await expect(
      mintPass.connect(addr1).claim(
        1, 3, 314, 0, validNonOwnerMerkleProof, 
        {value: "79999999999999999"}
      )
    ).to.be.revertedWith("Claim: Ether value incorrect");

  });     

  it("claim", async function () {

    // claim 300 of 314 claimable mint passes
    await expect(
      mintPass.connect(addr1).claim(
        300, 3, 314, 0, validNonOwnerMerkleProof, 
        {value: "24000000000000000000"}
      )
    ).to.emit(mintPass, 'Claimed').withArgs(3, addr1.address, 300);
    
    expect(await mintPass.balanceOf(addr1.address, 0)).to.equal(300);

    // claim 18 of 1019 claimable mint passes
    await expect(
      mintPass.connect(addr1).claim(
        14, 3, 314, 0, validNonOwnerMerkleProof, 
        {value: "1120000000000000000"}
      )
    ).to.emit(mintPass, 'Claimed').withArgs(3, addr1.address, 14);
    
    expect(await mintPass.balanceOf(addr1.address, 0)).to.equal(314);  

    // claim mint pass when claimable amount has already been claimed
    await expect(
      mintPass.connect(addr1).claim(
        1, 3, 314, 0, validNonOwnerMerkleProof, 
        {value: "80000000000000000"}
      )
    ).to.be.revertedWith("Claim: Not allowed to claim given amount");
    
    expect(await mintPass.balanceOf(addr1.address, 0)).to.equal(314);           

  });

  it("burn", async function () {

    // claim 300 of 314 claimable mint passes
    await mintPass.connect(addr1).claim(
      300, 3, 314, 0, validNonOwnerMerkleProof, 
      {value: "24000000000000000000"}
    );

    await mintPass.connect(addr1).burn(
      addr1.address, 0, 10
    );  
    expect(await mintPass.balanceOf(addr1.address, 0)).to.equal(290);
    expect(await mintPass.totalSupply(0)).to.equal(290);

    await mintPass.addMintPass(
      "0x1bbccdebcc5cbdc2a591bc8aa1e0908825f6d25bf6817a70f8a81ffd851f175d", 
      now, 
      now + 604800, 
      "80000000000000000",
      "QmWS694ViHvkTms9UkKqocv1kWDm2MTQqYEJeYi6LsJbxK", 
      "0x7f0eDcd500476Cb2718F8a4c376a9b9D3121075e"
    );

    await mintPass.connect(addr1).claim(
      10, 3, 314, 1, validNonOwnerMerkleProof, 
      {value: "24000000000000000000"}
    );

    await mintPass.connect(addr1).burn(addr1.address, 1, 10);  
    expect(await mintPass.balanceOf(addr1.address, 1)).to.equal(0);
    expect(await mintPass.totalSupply(1)).to.equal(0);    

  });

  it("burnBatch", async function () {
    
    await mintPass.addMintPass(
      "0x1bbccdebcc5cbdc2a591bc8aa1e0908825f6d25bf6817a70f8a81ffd851f175d", 
      now, 
      now + 604800, 
      "80000000000000000", 
      "QmWS694ViHvkTms9UkKqocv1kWDm2MTQqYEJeYi6LsJbxK",
      "0x7f0eDcd500476Cb2718F8a4c376a9b9D3121075e"
    );

    // claim 300 of 314 claimable mint passes
    await mintPass.connect(addr1).claim(
      300, 3, 314, 0, validNonOwnerMerkleProof, 
      {value: "24000000000000000000"}
    );
    await mintPass.connect(addr1).claim(
      10, 3, 314, 1, validNonOwnerMerkleProof, 
      {value: "24000000000000000000"}
    );

    await mintPass.connect(addr1).burnBatch(addr1.address, [0,1], [298, 8]);  
    expect(await mintPass.balanceOf(addr1.address, 0)).to.equal(2);
    expect(await mintPass.totalSupply(0)).to.equal(2);
    expect(await mintPass.exists(0)).to.equal(true);

    expect(await mintPass.balanceOf(addr1.address, 1)).to.equal(2);
    expect(await mintPass.totalSupply(1)).to.equal(2);  
    expect(await mintPass.exists(1)).to.equal(true);

    await mintPass.connect(addr1).burnBatch(addr1.address, [0,1], [2, 2]);  
    expect(await mintPass.balanceOf(addr1.address, 0)).to.equal(0);
    expect(await mintPass.totalSupply(0)).to.equal(0);
    expect(await mintPass.exists(0)).to.equal(false);

    expect(await mintPass.balanceOf(addr1.address, 1)).to.equal(0);
    expect(await mintPass.totalSupply(1)).to.equal(0);  
    expect(await mintPass.exists(1)).to.equal(false);    

  });

  it("burnFromRedeem", async function () {

    // burn should only be allowed from MetaHero contract
    expect(mintPass.burnFromRedeem(owner.address, 0, 10)).to.be.revertedWith("Burnable: Only allowed from redeemable contract");

    // claim 5 MPs
    await mintPass.connect(addr1).claim(5, 3, 314, 0, validNonOwnerMerkleProof, {value: "400000000000000000000"});
    expect(await mintPass.balanceOf(addr1.address, 0)).to.equal(5);  

    // redeem more MeteHero than MPs owned
    await expect(metaHero.connect(addr1).redeem(6)).to.be.revertedWith("Redeem: insufficient amount of MintPasses");

    // redeem 3 MetaHero and verify MPs have been burned balance
    await expect(metaHero.connect(addr1).redeem(3)).to.emit(metaHero, 'Redeemed').withArgs(addr1.address, 3);
    expect(await mintPass.balanceOf(addr1.address, 0)).to.equal(2);    
  
  });

  it("exists function", async function () {

    expect(await mintPass.exists(0)).to.equal(false);

    await mintPass.connect(addr1).claim(
      300, 3, 314, 0, validNonOwnerMerkleProof, 
      {value: "24000000000000000000"}
    );

    expect(await mintPass.exists(0)).to.equal(true);
    expect(await mintPass.exists(1)).to.equal(false);
  
  });

  it("totalSupply", async function () {

    await mintPass.connect(addr1).claim(
      300, 3, 314, 0, validNonOwnerMerkleProof, 
      {value: "24000000000000000000"}
    );
    expect(await mintPass.totalSupply(0)).to.equal(300);

    await mintPass.connect(addr1).claim(
      10, 3, 314, 0, validNonOwnerMerkleProof, 
      {value: "800000000000000000"}
    );
    expect(await mintPass.totalSupply(0)).to.equal(310);    
  
    await mintPass.addMintPass(
      "0x1bbccdebcc5cbdc2a591bc8aa1e0908825f6d25bf6817a70f8a81ffd851f175d", 
      now, 
      now + 604800, 
      "80000000000000000", 
      "QmWS694ViHvkTms9UkKqocv1kWDm2MTQqYEJeYi6LsJbxK",      
      "0x7f0eDcd500476Cb2718F8a4c376a9b9D3121075e"
    );

    // verify supply works for multiple MPs
    await mintPass.connect(addr1).claim(
      10, 3, 314, 1, validNonOwnerMerkleProof, 
      {value: "800000000000000000"}
    );
    expect(await mintPass.totalSupply(1)).to.equal(10);  

  });  

  it("uri", async function () {

    await expect(mintPass.uri(0)).to.be.revertedWith("URI: nonexistent token");        

    await mintPass.connect(addr1).claim(
      300, 3, 314, 0, validNonOwnerMerkleProof, 
      {value: "24000000000000000000"}
    );
    await expect(await mintPass.uri(0)).to.equal("ipfs://QmWS694ViHvkTms9UkKqocv1kWDm2MTQqYEJeYi6LsJbxK");        

    await mintPass.addMintPass(
      "0x1bbccdebcc5cbdc2a591bc8aa1e0908825f6d25bf6817a70f8a81ffd851f175d", 
      now, 
      now + 604800, 
      "80000000000000000", 
      "ipfs://QmWS694ViHvkTms9UkKqocv1kWDm2MTQqYEJeYi6LsJfff",
      "0x7f0eDcd500476Cb2718F8a4c376a9b9D3121075e"
    );

    // verify URI works for multiple MPs
    await expect(mintPass.uri(1)).to.be.revertedWith("URI: nonexistent token");        

    await mintPass.connect(addr1).claim(
      300, 3, 314, 1, validNonOwnerMerkleProof, 
      {value: "24000000000000000000"}
    );
    await expect(await mintPass.uri(1)).to.equal("ipfs://QmWS694ViHvkTms9UkKqocv1kWDm2MTQqYEJeYi6LsJfff");
  });    
});