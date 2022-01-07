// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract Privileges {

    address public owner;

    mapping(address => bool) private privilegedAdmins;
    mapping(address => bool) private gstAdmins;
    mapping(address => bool) private incomeTaxAdmins;
    mapping(address => bool) private tokenAdmins;
    mapping(address => bool) private authorizedMinters;

    constructor() {  
    	owner = msg.sender;
        privilegedAdmins[msg.sender] = true;
    }  


    //////////////////MODIFIERS///////////////////////

    modifier onlyOwner() {
        require(msg.sender == owner, "No Access Rights");
        _;
    }

    modifier onlyPrivilegedAdmin() {
        require(privilegedAdmins[msg.sender] == true, "No Access Rights");
        _;
    }

    modifier onlyGstAdmin() {
        require(gstAdmins[msg.sender] == true, "No Access Rights");
        _;
    }

    modifier onlyIncomeTaxAdmin() {
        require(incomeTaxAdmins[msg.sender] == true, "No Access Rights");
        _;
    }

    modifier onlyTokenAdmin() {
        require(tokenAdmins[msg.sender] == true, "No Access Rights");
        _;
    }

    modifier onlyAuthorisedMinter() {
        require(authorizedMinters[msg.sender] == true, "No Access Rights");
        _;
    }

    modifier onlyTokenAdminORPrivilegedAdmin() {
        require(tokenAdmins[msg.sender] == true || privilegedAdmins[msg.sender] == true, "No Access Rights");
        _;
    }
    

    //////////////////////////GETTER FUNCTIONS//////////////////////////

    function getContractAddress() public view returns (address contractAddress) {
        return address(this);
    }

    ////////////////////////CHECKER FUNCTIONS////////////////////////////

    function isPrivilegedAdmin(address addr) public view returns (bool) {
        return privilegedAdmins[addr];
    }

    function isGstAdmin(address addr) public view returns (bool) {
        return gstAdmins[addr];
    }

    function isIncomeTaxAdmin(address addr) public view returns (bool) {
        return incomeTaxAdmins[addr];
    }

    function isTokenAdmin(address addr) public view returns (bool) {
        return tokenAdmins[addr];
    }

    function isAuthorizedMinter(address addr) public view returns (bool) {
        return authorizedMinters[addr];
    }


    ///////////////////////////////MINTER FUNCTIONS//////////////////////////////

    function addMinter(address addr) onlyTokenAdminORPrivilegedAdmin public returns (bool success) {
        authorizedMinters[addr] = true;
        return true;
    }

    function removeMinter(address addr) onlyTokenAdminORPrivilegedAdmin public returns (bool success) {
        authorizedMinters[addr] = false;
        return true;
    }


    //////////////////////////////ADMIN FUNCTIONS////////////////////////////////

    function addPrivilegedAdmin(address addr) onlyPrivilegedAdmin public returns (bool success) {
        privilegedAdmins[addr] = true;
        return true;
    }

    function removePrivilegedAdmin(address addr) onlyPrivilegedAdmin public returns (bool success) {
        privilegedAdmins[addr] = false;
        return true;
    }   


    function addGstAdmin(address addr) onlyPrivilegedAdmin public returns (bool success) {
        gstAdmins[addr] = true;
        return true;
    }

    function removeGstAdmin(address addr) onlyPrivilegedAdmin public returns (bool success) {
        gstAdmins[addr] = false;
        return true;
    }  


    function addIncomeTaxAdmin(address addr) onlyPrivilegedAdmin public returns (bool success) {
        incomeTaxAdmins[addr] = true;
        return true;
    }

    function removeIncomeTaxAdmin(address addr) onlyPrivilegedAdmin public returns (bool success) {
        incomeTaxAdmins[addr] = false;
        return true;
    } 


    function addTokenAdmin(address addr) onlyPrivilegedAdmin public returns (bool success) {
        tokenAdmins[addr] = true;
        return true;
    }

    function removeTokenAdmin(address addr) onlyPrivilegedAdmin public returns (bool success) {
        tokenAdmins[addr] = false;
        return true;
    } 

}