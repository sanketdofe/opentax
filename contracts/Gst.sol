// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract Gst {
    uint256 public userCount = 0;
    uint256 public billCount = 0;
    uint256 public governmentCount = 0;

    struct Users {
        uint256 id;
        address payable addr;
        string firstName;
        string lastName;
        string email;
        string gstNumber;
        string userType;
    }
    Users []usersMap;

    struct Bill {
        uint256 id;
        address payable receiverAddress;
        string materialSelected;
        string beforeGstAmount;
        string afterGstAmount;
        string[] gstAmount;
        string gstPercent;
        bool paid;
        address payable billIssuer;
    }
    Bill []billMap;

    struct Government {
        address payable addr;
        string govType;
        uint256 govtId;
    }
    Government []governmentMap;

    // mapping(address => Users) public usersMap;
    // mapping(uint256 => Bill) public billMap;
    // mapping(address => Government) public governmentMap;

    event BillCreated (
        uint256 id,
        address receiverAddress,
        string materialSelected,
        string beforeGstAmount,
        string afterGstAmount,
        string[] gstAmount,
        string gstPercent,
        bool paid,
        address billIssuer
    );

    event AccountCreated (
        uint256 id,
        address addr,
        string firstName,
        string lastName,
        string email,
        string gstNumber,
        string userType
    );

    event GovernmentAccountCreated (
        address payable addr, 
        string govType,
        uint256 govtId
    );

    function createGovernmentAccount(address payable addr, string memory govType) public {
        governmentMap[governmentCount] = Government(addr, govType, governmentCount);
        emit GovernmentAccountCreated(addr, govType, governmentCount);
        governmentCount++;
    }

    function createAccount(
        string memory firstName,
        string memory lastname,
        string memory email,
        string memory gstNumber,
        string memory userType,
        address payable addr
        )
        public {
            usersMap[userCount] = Users(
                userCount,
                addr,
                firstName,
                lastname,
                email,
                gstNumber,
                userType
                );

            emit AccountCreated(
                userCount,
                addr,
                firstName,
                lastname,
                email,
                gstNumber,
                userType
                );
            userCount++;
    }

    function generateBill(
        address payable receiverAddress,
        string memory materialSelected,
        string memory beforeGstAmount,
        string memory afterGstAmount,
        string[] memory gstAmount,
        string memory gstPercent,
        address payable billIssuer
        )
        public {
            billMap[billCount] = Bill(
                billCount,
                receiverAddress,
                materialSelected,
                beforeGstAmount,
                afterGstAmount,
                gstAmount,
                gstPercent,
                false,
                billIssuer
                );

            emit BillCreated(
                billCount,
                receiverAddress,
                materialSelected,
                beforeGstAmount,
                afterGstAmount,
                gstAmount,
                gstPercent,
                false,
                billIssuer
                );
            billCount++;
    }

    function transferAmountToUser(address receiver, uint256 amount) public payable {
        uint256 userAccountId;
        for(uint256 i = 0; i < userCount; i++){
            if(usersMap[i].addr == receiver){
                userAccountId = usersMap[i].id;
            }
        }
        usersMap[userAccountId].addr.transfer(amount);
    }

    function transferAmountToSGST(address sgstAddress, uint256 amount) public payable {
        uint256 governmentAccountId;
        for(uint256 i = 0; i < governmentCount; i++){
            if(usersMap[i].addr == sgstAddress){
                governmentAccountId = governmentMap[i].govtId;
            }
        }
        governmentMap[governmentAccountId].addr.transfer(amount);
    }

    function transferAmountToCGST(address cgstAddress, uint256 amount) public payable {
        uint256 governmentAccountId;
        for(uint256 i = 0; i < governmentCount; i++){
            if(usersMap[i].addr == cgstAddress){
                governmentAccountId = governmentMap[i].govtId;
            }
        }
        governmentMap[governmentAccountId].addr.transfer(amount);
    }

    function transferAmountToIGST(address cgstAddress, uint256 amount) public payable {
        uint256 governmentAccountId;
        for(uint256 i = 0; i < governmentCount; i++){
            if(usersMap[i].addr == cgstAddress){
                governmentAccountId = governmentMap[i].govtId;
            }
        }
        governmentMap[governmentAccountId].addr.transfer(amount);
    }

    function gstAmountArray(uint256 billId) public view returns(string[] memory) {
        return billMap[billId].gstAmount;
    }
    function paidBill(uint256 billID, bool paidStatus) public {
        billMap[billID].paid = paidStatus;
    }
}