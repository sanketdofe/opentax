// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import './Privileges.sol';

contract ERC20Token {
    function totalSupply() public virtual view returns (uint256 supply){}

    function balanceOf(address _owner) public virtual view returns (uint256 balance){}

    function transfer(address _to, uint256 _value) public virtual returns (bool success){}

    function transferFrom(address _from, address _to, uint256 _value) public virtual returns (bool success){}

    function approve(address _spender, uint256 _value) public virtual returns (bool success){}

    function allowance(address _owner, address _spender) public virtual view returns (uint256 remaining){}

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
}


contract RupeeToken is ERC20Token {
    string public constant name = "Indian Rupee";
    string public constant symbol = "INR";
    uint8 public constant decimals = 2; 
    uint256 public _totalSupply;
    address public owner;
    
    mapping(address => uint256) balances;
    mapping(address => mapping (address => uint256)) allowed;

    Privileges privilegeContract;
    
    constructor(uint256 total, address _privilegeContract) {  
    	_totalSupply = total;
    	balances[msg.sender] = _totalSupply;
    	owner = msg.sender;
        privilegeContract = Privileges(_privilegeContract);
    }  
    
    
    function totalSupply() public override view returns (uint256) {
        return _totalSupply;
    }
    
    function balanceOf(address _owner) public override view returns (uint256 balance) {
        return balances[_owner];
    }
    
    function transfer(address _to, uint256 _value) public override returns (bool success) {
        if (balances[msg.sender] >= _value && _value > 0) {
            balances[msg.sender] -= _value;
            balances[_to] += _value;
            emit Transfer(msg.sender, _to, _value);
            return true;
        } else { 
            return false; 
        }
    }
    
    function transferFrom(address _from, address _to, uint256 _value) public override returns (bool success) {
        if (balances[_from] >= _value && allowed[_from][msg.sender] >= _value && _value > 0) {
            balances[_from] -= _value;
            allowed[_from][msg.sender] -= _value;
            balances[_to] += _value;
            emit Transfer(_from, _to, _value);
            return true;
        } else { 
            return false; 
        }
    }
    
    function approve(address _spender, uint256 _value) public override returns (bool success) {
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }
    
    function allowance(address _owner, address _spender) public override view returns (uint256 remaining) {
        return allowed[_owner][_spender];
    }
    

    event Mint(address indexed _to, uint256 _value);
    event Burn(address indexed _from, uint256 _value);


    function mint(address account, uint256 amount) public returns (bool success) {
        require(privilegeContract.isAuthorizedMinter(msg.sender) == true, "Not Authorized to Mint");
        if(_totalSupply + amount > _totalSupply){
            _totalSupply += amount;
            balances[account] += amount;
            emit Mint(account, amount);
            return true;
        } else {
            return false;
        }
    }

    function burn(address account, uint256 amount) public returns (bool success) {
        require(privilegeContract.isAuthorizedMinter(msg.sender) == true, "Not Authorized to Burn");
        if(amount <= balances[account]){
            _totalSupply -= amount;
            balances[account] -= amount;
            emit Burn(account, amount);
            return true;
        } else {
            return false;
        }
    }
  
    /////////////////////AUTOAPPROVE ADMINS TO TRANSFER FUNDS///////////////////
    
    function transferFromGovtAccount(address from, address to, uint256 value, string memory approvedBy, address approverAddress) public returns (bool) {
        require(balanceOf(from) >= value, "Insufficient Balance");
        if(keccak256(bytes(approvedBy)) == keccak256(bytes("PRIVILEGEDADMINS"))){
            require(privilegeContract.isPrivilegedAdmin(approverAddress) == true, "No Access Rights");
            allowed[from][msg.sender] = value;
            emit Approval(from, msg.sender, value);
            return transferFrom(from, to, value);
        }
        else if(keccak256(bytes(approvedBy)) == keccak256(bytes("GSTADMINS"))){
            require(privilegeContract.isGstAdmin(approverAddress) == true, "No Access Rights");
            allowed[from][msg.sender] = value;
            emit Approval(from, msg.sender, value);
            return transferFrom(from, to, value);
        }
        else if(keccak256(bytes(approvedBy)) == keccak256(bytes("INCOMETAXADMINS"))){
            require(privilegeContract.isIncomeTaxAdmin(approverAddress) == true, "No Access Rights");
            allowed[from][msg.sender] = value;
            emit Approval(from, msg.sender, value);
            return transferFrom(from, to, value);
        }
        return false;
    }
}

