// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol';
import '@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol';

contract Mock1155 is ERC1155Supply, ERC1155Burnable, Ownable  {
  
    string public name_;
    string public symbol_;   

    address redeemableContract;    
    
    constructor(
        string memory _name, 
        string memory _symbol,
        address _redeemableContract
    ) public ERC1155("ipfs://ipfs/") {
        name_ = _name;
        symbol_ = _symbol;

        redeemableContract = _redeemableContract;

        _mint(msg.sender, 0, 1000, "");
        _mint(msg.sender, 1, 1000, "");
        _mint(msg.sender, 2, 1000, "");
        _mint(msg.sender, 3, 1000, "");
        _mint(msg.sender, 4, 1000, "");
        _mint(msg.sender, 5, 1000, "");
        _mint(msg.sender, 6, 1000, "");
        _mint(msg.sender, 7, 1000, "");
        _mint(msg.sender, 8, 1000, "");
        _mint(msg.sender, 9, 1000, "");
        _mint(msg.sender, 10, 1000, "");
        _mint(msg.sender, 11, 1000, "");
    }    

    function burnFromRedeem(
        address account, 
        uint256 mpIndex, 
        uint256 amount
    ) external {
        require(redeemableContract == msg.sender, "Burnable: Only allowed from redeemable contract");

        _burn(account, mpIndex, amount);
    }  
    
    function withdrawEther(address payable _to, uint256 _amount) public onlyOwner {
        _to.transfer(_amount);
    }

    function uri(uint256 _id) public view override returns (string memory) {
        require(totalSupply(_id) > 0, "URI: nonexistent token");
            
        return string(abi.encodePacked(super.uri(_id), "test"));
    }   

    function name() public view returns (string memory) {
        return name_;
    }

    function symbol() public view returns (string memory) {
        return symbol_;
    }          

    function _mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) internal virtual override(ERC1155, ERC1155Supply) {
        super._mint(account, id, amount, data);
    }

    function _mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal virtual override(ERC1155, ERC1155Supply) {
        super._mintBatch(to, ids, amounts, data);
    }

    function _burn(
        address account,
        uint256 id,
        uint256 amount
    ) internal virtual override(ERC1155, ERC1155Supply) {
        super._burn(account, id, amount);
    }

    function _burnBatch(
        address account,
        uint256[] memory ids,
        uint256[] memory amounts
    ) internal virtual override(ERC1155, ERC1155Supply) {
        super._burnBatch(account, ids, amounts);
    }  
}

