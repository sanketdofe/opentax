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

    function createGovernmentAccount(address payable _addr, string memory _govType) public {
        governmentMap[governmentCount] = Government(_addr, _govType, governmentCount);
        emit GovernmentAccountCreated(_addr, _govType, governmentCount);
        governmentCount++;
    }

    function createAccount(
        string memory _firstName,
        string memory _lastname,
        string memory _email,
        string memory _gstNumber,
        string memory _userType,
        address payable addr
        )
        public {
            usersMap[userCount] = Users(
                userCount,
                addr,
                _firstName,
                _lastname,
                _email,
                _gstNumber,
                _userType
                );

            emit AccountCreated(
                userCount,
                msg.sender,
                _firstName,
                _lastname,
                _email,
                _gstNumber,
                _userType
                );
            userCount++;
    }

    function generateBill(
        address payable _receiverAddress,
        string memory _materialSelected,
        string memory _beforeGstAmount,
        string memory _afterGstAmount,
        string[] memory _gstAmount,
        string memory _gstPercent,
        address payable _billIssuer
        )
        public {
            billMap[billCount] = Bill(
                billCount,
                _receiverAddress,
                _materialSelected,
                _beforeGstAmount,
                _afterGstAmount,
                _gstAmount,
                _gstPercent,
                false,
                _billIssuer
                );

            emit BillCreated(
                billCount,
                _receiverAddress,
                _materialSelected,
                _beforeGstAmount,
                _afterGstAmount,
                _gstAmount,
                _gstPercent,
                false,
                _billIssuer
                );
            billCount++;
    }

    function transferAmountToUser(address _receiver, uint256 amount) public payable {
        uint256 userAccountId;
        for(uint256 i = 0; i < userCount; i++){
            if(usersMap[i].addr == _receiver){
                userAccountId = usersMap[i].id;
            }
        }
        usersMap[userAccountId].addr.transfer(amount);
    }

    function transferAmountToSGST(address _sgstAddress, uint256 amount) public payable {
        uint256 governmentAccountId;
        for(uint256 i = 0; i < governmentCount; i++){
            if(usersMap[i].addr == _sgstAddress){
                governmentAccountId = governmentMap[i].govtId;
            }
        }
        governmentMap[governmentAccountId].addr.transfer(amount);
    }

    function transferAmountToCGST(address _cgstAddress, uint256 amount) public payable {
        uint256 governmentAccountId;
        for(uint256 i = 0; i < governmentCount; i++){
            if(usersMap[i].addr == _cgstAddress){
                governmentAccountId = governmentMap[i].govtId;
            }
        }
        governmentMap[governmentAccountId].addr.transfer(amount);
    }

    function gstAmountArray(uint256 _billId) public view returns(string[] memory) {
        return billMap[_billId].gstAmount;
    }
    function paidBill(uint256 _billID, bool _paidStatus) public {
        billMap[_billID].paid = _paidStatus;
    }
}