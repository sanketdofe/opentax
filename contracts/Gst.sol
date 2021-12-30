// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import './Privileges.sol';
import './Interactions.sol';

contract Gst {
    address public owner;
    uint256 private userCount = 0;

    struct Bill {
        uint256 id;
        address receiverAddress;
        string materialSelected;
        string beforeGstAmount;
        string afterGstAmount;
        uint256[] gstAmount;
        uint gstPercent;
        bool isInterstate;
        bool paid;
        address billIssuerAddr;
        string billIssuerName;
    }

    struct User {
        uint256 id;
        address addr;
        string firstName;
        string lastName;
        string email;
        string gstNumber;
        string stateCode;
        string userType;
        Bill[] bills;
    }


    mapping(string => User) private users; //GstNo
    mapping(address => string) private gstNoRepo; 

    event BillCreated (
        uint256 id,
        address receiverAddress,
        string materialSelected,
        string beforeGstAmount,
        string afterGstAmount,
        uint256[] gstAmount,
        uint gstPercent,
        bool isInterstate,
        bool paid,
        address billIssuerAddr,
        string billIssuerName
    );

    event AccountCreated (
        uint256 id,
        address addr,
        string firstName,
        string lastName,
        string email,
        string gstNumber,
        string userType,
        string stateCode
    );

    Privileges privilegeContract;
    Interactions interactionsContract;

    constructor(address _privilegeContract, address _interactionsContract){
        owner = msg.sender;
        privilegeContract = Privileges(_privilegeContract);
        interactionsContract = Interactions(_interactionsContract);
    }

    /////////////////////////GST ADMIN FUNCTIONS////////////////////////

    function createAccount(string memory fName, string memory lName, string memory userEmail, string memory gstNo, string memory _userType, string memory stateCode, address userAddr) public {
        require(privilegeContract.isGstAdmin(msg.sender) == true, "No Access Rights");
        if (users[gstNo].addr == address(0)) { 
            users[gstNo].id = userCount+1;
            users[gstNo].addr = userAddr;
            users[gstNo].firstName = fName;
            users[gstNo].lastName = lName;
            users[gstNo].email = userEmail;
            users[gstNo].gstNumber = gstNo;
            users[gstNo].userType = _userType;
            users[gstNo].stateCode = stateCode;
            gstNoRepo[userAddr] = gstNo;
            emit AccountCreated(userCount+1, userAddr, fName, lName, userEmail, gstNo, _userType, stateCode);
            userCount++;
        } else {
            revert("User already exists");
        }
    }

    function generateBill(string memory gstNo, string memory materialSelected, string memory beforeGstAmt, string memory afterGstAmt, uint256[] memory gstAmt, uint gstPercent, string memory billIssuerName, bool isInterstate) public {
        require(privilegeContract.isGstAdmin(msg.sender) == true, "No Access Rights");
        users[gstNo].bills.push(Bill(
            users[gstNo].bills.length+1,
            users[gstNo].addr,
            materialSelected,
            beforeGstAmt,
            afterGstAmt,
            gstAmt,
            gstPercent,
            isInterstate,
            false,
            msg.sender,
            billIssuerName
        ));

        emit BillCreated(
            users[gstNo].bills.length,
            users[gstNo].addr,
            materialSelected,
            beforeGstAmt,
            afterGstAmt,
            gstAmt,
            gstPercent,
            isInterstate,
            false,
            msg.sender,
            billIssuerName
        );
    }

    function transferAmountToUser(string memory gstNo, string memory fromAccountName, uint256 amount) public returns (bool) {
        require(privilegeContract.isGstAdmin(msg.sender) == true, "No Access Rights");
        address fromAccAddress = interactionsContract.getGovtAccountAddress(fromAccountName);
        address toAccAddress = getGstUserAddress(gstNo);
        return interactionsContract.transferTokensFrom(fromAccAddress, toAccAddress, amount, "GSTADMINS", msg.sender);
    }


    /////////////////////////////GST USER FUNCTIONS/////////////////////////////

    function payBill(uint256 billId) public returns (string memory status) {
        string memory gstNo = getGstNo(msg.sender);
        User memory u = getGstUser(gstNo);
        Bill memory b = getBill(gstNo, billId);
        if(b.paid == true) {
            return "Bill already paid";
        }
        uint256 totalamt = getBillAmount(b.gstAmount);
        if(interactionsContract.rupeeTokenContract().balanceOf(msg.sender) < totalamt){
            revert("Insufficient Balance for this transaction");
        }
        if(b.isInterstate == true) {
            address toAccAddress = interactionsContract.getGovtAccountAddress("IGST");
            interactionsContract.rupeeTokenContract().transfer(toAccAddress, totalamt);
            setBillPaid(gstNo, billId);
            return "Success";
        }else{
            address toStateAccAddress = interactionsContract.getGovtAccountAddress(concatenate(u.stateCode, "SGST"));
            address toCentralAccAddress = interactionsContract.getGovtAccountAddress("CGST");
            interactionsContract.rupeeTokenContract().transfer(toStateAccAddress, totalamt/2);
            interactionsContract.rupeeTokenContract().transfer(toCentralAccAddress, totalamt/2);
            setBillPaid(gstNo, billId);
            return "Success";
        }
    }

    function setBillPaid(string memory gstNo, uint256 billId) internal {
        users[gstNo].bills[billId-1].paid = true;
    }

    function getGstUser(string memory gstNo) public view returns (User memory){
        User memory u = users[gstNo];
        if(u.addr == address(0)){
            revert("No user with given GSTNO exists");
        }
        return u;
    }

    function getGstUserAddress(string memory gstNo) public view returns (address){
        address addr = users[gstNo].addr;
        if(addr == address(0)){
            revert("No user with given GSTNO exists");
        }
        return addr;
    }

    function getGstNo(address addr) public view returns (string memory){
        string memory gstNo = gstNoRepo[addr];
        if(bytes(gstNo).length == 0){
            revert("No user with given address exists");
        }
        return gstNo;
    }

    function getAllBills(string memory gstNo) public view returns (Bill[] memory) {
        User memory u = users[gstNo];
        if(u.addr == address(0)){
            revert("No user with given GSTNO exists");
        }
        return u.bills;
    }

    function getBill(string memory gstNo, uint256 billId) public view returns (Bill memory) {
        User memory u = users[gstNo];
        if(u.addr == address(0)){
            revert("No user with given GSTNO exists");
        }
        if(billId > u.bills.length){
            revert("No bill with given bill id exists");
        }
        return u.bills[billId-1];
    }

    function getBillAmount(uint256[] memory amounts) private pure returns(uint256){
        uint256 total = 0;
        for(uint i=0; i<amounts.length; i++){
            total += amounts[i];
        }
        return total;
    }


    ///////////////////////////UTILITY FUNCTION/////////////////////////

    function concatenate(string memory a, string memory b) public pure returns (string memory) {
        return string(abi.encodePacked(a , b));
    } 

}