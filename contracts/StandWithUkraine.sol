// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import './AbstractERC1155Factory.sol';
import "@openzeppelin/contracts/utils/Strings.sol";

contract StandWithUkraine is AbstractERC1155Factory  {
    string ipfs;
    address multisig;
    uint256 endTime = 1648771200;
    mapping(uint256 => uint256) public costs;

    constructor(
        string memory _name, 
        string memory _symbol,
        string memory _ipfs,
        address _multsig
    ) ERC1155("ipfs://") {
        name_ = _name;
        symbol_ = _symbol;
        ipfs = _ipfs;
        multisig = _multsig;

        costs[0] = 10000000000000000;
        costs[1] = 100000000000000000;
        costs[2] = 1000000000000000000;
    }

    function setEndTime(uint256 _endTime) 
        public
        onlyOwner
    {
        endTime = _endTime;
    }

    function mint(uint256 id, uint256 amount)
        public
        payable
    {
        require(block.timestamp <= endTime, "Mint: Not in mint window");
        require(id <= 2, "Mint: Invalid Id");
        require(amount <= 20, "Mint: Limit is 20");
        require(msg.value * amount == costs[id] * amount, "Mint: Incorrect value");

        (bool sent, bytes memory data) = multisig.call{value: msg.value}("");
        require(sent, "Mint: Failed to send Ether");

        _mint(msg.sender, id, amount, "");
    }


    function uri(uint256 _id) public view override returns (string memory) {
            require(totalSupply(_id) > 0, "URI: nonexistent token");
            return string(abi.encodePacked(ipfs, Strings.toString(_id)));
    }    
}

