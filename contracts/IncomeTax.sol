// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import './Privileges.sol';
import './RupeeToken.sol';
import './Interactions.sol';

contract IncomeTax {
    string constant ALLPAID = "ALLPAID";
    string constant PARTIAL = "PARTIAL";

    address public owner;

    event paidTax(address payingAddress, int paidAmount);
    event addTaxpayer(bool added);
    event Log(string message);

    struct Tax {
        int owedAmount;
        uint taxYear;
        string paidStatus; // ALLPAID/NOTPAID/PARTIAL
        int remainingAmount;
    }

    struct TaxPayer {
        address taxpayerAddress;
        string pan;
        string name;
        int outstandingAmount; 
        Tax[] taxes;
    }

    uint public numberOfTaxpayers = 0;


    mapping (address => TaxPayer) taxpayers;
    mapping (string => address) panRepo;

    Privileges privilegeContract;
    RupeeToken rupeeTokenContract;
    Interactions interactionsContract;

    constructor(address _privilegeContract, address _rupeeTokenContract, address _interactionsContract){
        owner = msg.sender;
        privilegeContract = Privileges(_privilegeContract);
        rupeeTokenContract = RupeeToken(_rupeeTokenContract);
        interactionsContract = Interactions(_interactionsContract);
    }


    /////////////////////////////TAX ADMIN FUNCTIONS////////////////////////////

    function addTaxPayer(address payerAddress, string memory panNo, string memory payerName, int _outstandingAmount) public {
        require(privilegeContract.isIncomeTaxAdmin(msg.sender) == true, "Not Authorized to Add TaxPayer");
        if (taxpayers[payerAddress].taxpayerAddress == address(0)) { 
            taxpayers[payerAddress].taxpayerAddress = payerAddress;
            taxpayers[payerAddress].pan = panNo;
            taxpayers[payerAddress].name = payerName;
            taxpayers[payerAddress].outstandingAmount = _outstandingAmount;
            panRepo[panNo] = payerAddress;
            numberOfTaxpayers++;
            emit addTaxpayer(true);
            emit Log("Add TaxPayer Success");
        } else {
            emit Log("Add TaxPayer Fail");
            revert("Taxpayer exists already");
        }
    }

    function addTaxForTaxpayer(string memory panNo, int payerAmount, uint payerTaxYear, string memory _paidstatus) public {
        require(privilegeContract.isIncomeTaxAdmin(msg.sender) == true, "Not Authorized to Add Tax");
        address addressKey = panRepo[panNo];
        int toBePaid = taxpayers[addressKey].outstandingAmount;
        toBePaid += payerAmount;
        taxpayers[addressKey].taxes.push(Tax(payerAmount, payerTaxYear, _paidstatus, toBePaid)); 
        emit Log("Add Tax Success");
    }

    function addOutstandingAmountForTaxpayer(string memory panNo, int amount) public {
        require(privilegeContract.isIncomeTaxAdmin(msg.sender) == true, "Not Authorized to Add Tax");
        address addressKey = panRepo[panNo];
        taxpayers[addressKey].outstandingAmount += amount;
        emit Log("Add Outstanding Amount Success");
    }


    ///////////////////////////////TAX PAYER FUNCTIONS/////////////////////////////////

    function payOwedTax(string memory panNo, int payerAmount, uint payerTaxYear) public returns (int _remainingAmount) {
        require(panRepo[panNo] == msg.sender && keccak256(bytes(taxpayers[msg.sender].pan)) == keccak256(bytes(panNo)), "Not authenticated");
        address addressKey = panRepo[panNo];
        require(taxpayers[addressKey].taxes.length>0, "No tax data present");
        require(rupeeTokenContract.balanceOf(msg.sender) >= uint(payerAmount), "Insufficient Balance");
        for(uint i=taxpayers[addressKey].taxes.length-1; i>=0; i--) {
            if(taxpayers[addressKey].taxes[i].taxYear == payerTaxYear) {
                if(keccak256(bytes(taxpayers[addressKey].taxes[i].paidStatus)) != keccak256(bytes(ALLPAID))) {
                    int paidAmt;
                    address toAccAddress = interactionsContract.getGovtAccountAddress("IT");
                    if(taxpayers[addressKey].taxes[i].remainingAmount >= payerAmount) {
                        paidAmt = payerAmount;
                        taxpayers[addressKey].taxes[i].remainingAmount -= payerAmount;
                        if(taxpayers[addressKey].taxes[i].remainingAmount == 0) {
                            taxpayers[addressKey].taxes[i].paidStatus = "ALLPAID";
                            taxpayers[addressKey].outstandingAmount = 0;
                        }else{
                            taxpayers[addressKey].taxes[i].paidStatus = "PARTIAL";
                            if(paidAmt > taxpayers[addressKey].outstandingAmount){
                                taxpayers[addressKey].outstandingAmount = 0;
                            }else{
                                taxpayers[addressKey].outstandingAmount -= paidAmt;
                            }
                        }
                        rupeeTokenContract.transfer(toAccAddress, uint(paidAmt));
                        emit paidTax(msg.sender, paidAmt);
                        emit Log("Pay Tax Success");
                        return 0;
                    }else{
                        paidAmt = taxpayers[addressKey].taxes[i].remainingAmount;
                        payerAmount -= taxpayers[addressKey].taxes[i].remainingAmount;
                        taxpayers[addressKey].taxes[i].remainingAmount = 0;
                        taxpayers[addressKey].outstandingAmount = 0;
                        rupeeTokenContract.transfer(toAccAddress, uint(paidAmt));
                        emit paidTax(msg.sender, paidAmt);
                        emit Log("Pay Tax Success");
                        return payerAmount;
                    }
                }
            }else if (taxpayers[addressKey].taxes[i].taxYear < payerTaxYear){
                break;
            }
        }
        emit Log("Pay Tax Fail");
        return payerAmount;
    }

    
    /////////////////////////////////GETTER FUNCTIONS////////////////////////////////

    function getTaxpayer(string memory panNo) public view returns (address, string memory, string memory) {
        address addressKey = panRepo[panNo];
        return (taxpayers[addressKey].taxpayerAddress, taxpayers[addressKey].pan, taxpayers[addressKey].name);
    }

    function getAllTaxesForTaxPayer(string memory panNo) public view returns (Tax[] memory) {
        address addressKey = panRepo[panNo];
        return taxpayers[addressKey].taxes;
    }

    function getTaxesForYear(string memory panNo, uint givenYear) public view returns (Tax memory) {
        address addressKey = panRepo[panNo];
        require(taxpayers[addressKey].taxes.length>0, "No tax data present");
        for(uint i=taxpayers[addressKey].taxes.length-1; i>=0; i--) {
            if(taxpayers[addressKey].taxes[i].taxYear == givenYear){
                return taxpayers[addressKey].taxes[i];
            }
        }
        revert("Not found");
    }

    function getOutstandingAmount(string memory panNo) public view returns (int amount) {
        address addressKey = panRepo[panNo];
        return taxpayers[addressKey].outstandingAmount;
    }


    function getTotalTaxpayers() public view returns(uint) {
        return numberOfTaxpayers;
    }

}