// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import './Privileges.sol';
import './RupeeToken.sol';

string constant RELEASEFUNDS = "RELEASEFUNDS";
string constant ASKFUNDS = "ASKFUNDS";
string constant CHECKFIAT = "CHECKFIAT";
string constant RELEASEFIAT = "RELEASEFIAT";

string constant GSTADMINS = "GSTADMINS";
string constant TOKENADMINS = "TOKENADMINS";
string constant INCOMETAXADMINS = "INCOMETAXADMINS";
string constant PRIVILEGEDADMINS = "PRIVILEGEDADMINS";
string constant AUTHORIZEDMINTERS = "AUTHORIZEDMINTERS";


contract Interactions {
    address public owner;
    Privileges privilegeContract;
    RupeeToken public rupeeTokenContract;

    struct Request {
        string requestID;
        address senderAddress;
        string requestType; //RELEASEFUNDS, ASKFUNDS, CHECKFIAT, RELEASEFIAT
        string toAdmin;
        uint amount; //Tokens or paise
        string additionalData;
        string status; //DONE, PENDING, REJECT
    }

    mapping(string => mapping(string => Request[])) requestPool;  // PENDING/DONE, GSTADMIN/TOKENADMIN


    struct FiatTransaction {
        uint unixtime;
        string transactionID;
        address senderAddress;
        string senderBank;
        string senderIFSC;
        string senderAccountNo;
        string senderAccountName;
        uint rupee;
        uint paise;
        string recvBank;
        string recvIFSC;
        uint recvAccountNo;
        string recvAccountName;
        string transactionType; // INCOMING, OUTGOING
        string status; // SUCCESS, FAILURE, NA, PENDING
    }

    mapping (address => mapping(string => FiatTransaction[])) fiatLedger; // SENDERADDRESS, TRANSACTIONID


    struct Government {
        address addr;
        string accountName; //MHSGST, IGST, 
        string accountType; //CGST, SGST, IGST, INCOMETAX, STATERESERVE, CENTRERESERVE, CONSOLIDATEDFUND
        string govtType; //CENTRAL, STATE
        string govtName; //MHGOVT, CENTRAL
        uint256 govtId;
    }

    mapping (string => Government) private governmentAccounts; //ACCOUNTNAME
    string[] private govtAccountNamesRepo;

    constructor(address _privilegeContract, address _rupeeTokenContract){
        owner = msg.sender;
        privilegeContract = Privileges(_privilegeContract);
        rupeeTokenContract = RupeeToken(_rupeeTokenContract);
    }


    /////////////////////GOVT ACCOUNT FUNCTIONS///////////////////////

    event GovernmentAccountCreated (
        address addr,
        string accountName,
        string accountType,
        string govtType,
        string govtName,
        uint256 govtId
    );

    function createGovernmentAccount(address addr, string memory accname, string memory acctype, string memory govttype, string memory govtname, uint256 govtid) public {
        require(privilegeContract.isPrivilegedAdmin(msg.sender) == true, "No Access Rights");
        if (governmentAccounts[accname].addr == address(0)) { 
            governmentAccounts[accname] = Government(addr, accname, acctype, govttype, govtname, govtid);
            govtAccountNamesRepo.push(accname);
            emit GovernmentAccountCreated(addr, accname, acctype, govttype, govtname, govtid);
        }
        else{
            revert("Account with given name exists already");
        }
    }

    function getGovtAccount(string memory accname) public view returns (Government memory) {
        address addr = governmentAccounts[accname].addr;
        if(addr == address(0)){
            revert("No account with given name exists");
        }
        return governmentAccounts[accname];
    }

    function getGovtAccountAddress(string memory accname) public view returns (address) {
        address addr = governmentAccounts[accname].addr;
        if(addr == address(0)){
            revert("No account with given name exists");
        }
        return addr;
    }

    function getAllGovtAccountNames() public view returns (string[] memory) {
        return govtAccountNamesRepo;
    }
    
    ///////////////////////REQUEST FUNCTIONS//////////////////////////

    event closeRequest(string requestID, string department, string status);

    function addRequest(Request memory req) public {
        requestPool["PENDING"][req.toAdmin].push(req);
    }

    function getAllPendingRequests(string memory adminType) public view returns (Request[] memory) {
        if(keccak256(bytes(adminType)) == keccak256(bytes(PRIVILEGEDADMINS))){
            require(privilegeContract.isPrivilegedAdmin(msg.sender) == true, "No Access Rights");
            return requestPool["PENDING"][PRIVILEGEDADMINS];
        }
        else if(keccak256(bytes(adminType)) == keccak256(bytes(GSTADMINS))){
            require(privilegeContract.isGstAdmin(msg.sender) == true, "No Access Rights");
            return requestPool["PENDING"][GSTADMINS];
        }
        else if(keccak256(bytes(adminType)) == keccak256(bytes(INCOMETAXADMINS))){
            require(privilegeContract.isIncomeTaxAdmin(msg.sender) == true, "No Access Rights");
            return requestPool["PENDING"][INCOMETAXADMINS];
        }
        else if(keccak256(bytes(adminType)) == keccak256(bytes(TOKENADMINS))){
            require(privilegeContract.isTokenAdmin(msg.sender) == true, "No Access Rights");
            return requestPool["PENDING"][TOKENADMINS];
        }
        else{
            return requestPool["PENDING"]["0"];
        }
    }

    function handleRequest(uint requestIndex, string memory adminType, string memory action) public {
        if(keccak256(bytes(adminType)) == keccak256(bytes(PRIVILEGEDADMINS))){
            require(privilegeContract.isPrivilegedAdmin(msg.sender) == true, "No Access Rights");
            handleRequestHelper(requestIndex, PRIVILEGEDADMINS, action);
        }
        else if(keccak256(bytes(adminType)) == keccak256(bytes(GSTADMINS))){
            require(privilegeContract.isGstAdmin(msg.sender) == true, "No Access Rights");
            handleRequestHelper(requestIndex, GSTADMINS, action);
        }
        else if(keccak256(bytes(adminType)) == keccak256(bytes(INCOMETAXADMINS))){
            require(privilegeContract.isIncomeTaxAdmin(msg.sender) == true, "No Access Rights");
            handleRequestHelper(requestIndex, INCOMETAXADMINS, action);
        }
        else if(keccak256(bytes(adminType)) == keccak256(bytes(TOKENADMINS))){
            require(privilegeContract.isTokenAdmin(msg.sender) == true, "No Access Rights");
            handleRequestHelper(requestIndex, TOKENADMINS, action);
        }
    }

    function handleRequestHelper(uint requestIndex, string memory typeOfADMIN, string memory action) private {
        uint length = requestPool["PENDING"][typeOfADMIN].length;
        require(requestIndex < length, "No such request present with given Admin");
        Request memory req = requestPool["PENDING"][typeOfADMIN][requestIndex];
        requestPool["PENDING"][typeOfADMIN][requestIndex] = requestPool["PENDING"][typeOfADMIN][length-1];
        requestPool["PENDING"][typeOfADMIN].pop();
        req.status = action;
        requestPool[action][typeOfADMIN].push(req);
        emit closeRequest(req.requestID, typeOfADMIN, req.status);
    }


    /////////////////////////TOKEN FUNCTIONS//////////////////////////

    event TransferTokens(address from, address to, uint256 value, string approvedBy);

    function mintTokensTo(address addr, uint amount) internal returns (bool success) {
        return rupeeTokenContract.mint(addr, amount);
    }

    function burnTokensFrom(address addr, uint amount) internal returns (bool success) {
        return rupeeTokenContract.burn(addr, amount);
    }

    function transferTokensFrom(address from, address to, uint256 value, string memory approvedBy, address approverAddress) public returns (bool success) {
        require(rupeeTokenContract.balanceOf(from) >= value, "Insufficient Balance");
        bool status = rupeeTokenContract.transferFromGovtAccount(from, to, value, approvedBy, approverAddress);
        if(status == true){
            emit TransferTokens(from, to, value, approvedBy);
        }
        return status;
    }


    //////////////////////FIAT FUNCTIONS//////////////////////////

    function verifyIncomingFiatPayment(FiatTransaction memory transaction) public returns (string memory status){
        require(privilegeContract.isTokenAdmin(msg.sender) == true, "No Access Rights");
        require(keccak256(bytes(transaction.transactionType)) == keccak256(bytes("INCOMING")), "Not an incoming transaction");
        fiatLedger[transaction.senderAddress][transaction.transactionID].push(transaction);
        if(keccak256(bytes(transaction.status)) == keccak256(bytes("SUCCESS"))){
            uint amt = (transaction.rupee * 100) + transaction.paise;
            mintTokensTo(transaction.senderAddress, amt);
            return "SUCCESS";
        }
        return "FAILED";
    }
    
    function verifyOutgoingFiatPayment(FiatTransaction memory transaction) public returns (string memory status){
        require(privilegeContract.isTokenAdmin(msg.sender) == true, "No Access Rights");
        require(keccak256(bytes(transaction.transactionType)) == keccak256(bytes("OUTGOING")), "Not an outgoing transaction");
        fiatLedger[transaction.senderAddress][transaction.transactionID].push(transaction);
        if(keccak256(bytes(transaction.status)) == keccak256(bytes("SUCCESS"))){
            uint amt = (transaction.rupee * 100) + transaction.paise;
            burnTokensFrom(transaction.senderAddress, amt);
            return "SUCCESS";
        }
        return "FAILED";
    }


    
}