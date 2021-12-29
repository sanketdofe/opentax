// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract Tax {

    struct TaxPayer {
        string firstName;
        string lastName;
        string email;
        address payable taxpayerAddress;
        uint256 aadharId;
        uint256 payerId;
    }
    TaxPayer []taxPayerMap;

    //Address for consolidated fund of India
    address payable cfiAddress;

    //Event fired for Tax Payment
    event paidTax (
        address payable payingAddress,
        string taxSlab,
        uint256 amount
    );

    //Event fired after adding new Taxpayer
    event addedTaxPayer (
        string firstName,
        string lastName,
        string email,
        uint256 aadharId,
        uint256 payerId,
        bool added
    );


    //State variables keeping track of total Taxpayers
    uint256 numberOfTaxPayers = 0;

    //Function for adding new Taxpayer
    function addTaxPayer (
        string memory firstName,
        string memory lastName,
        string memory email,
        address payable taxPayerAddress,
        uint256 aadharId
    )
    public {
        bool TaxpayerStatus = false;
        for(uint256 i = 0; i < numberOfTaxPayers; i++){
            if(taxPayerMap[i].taxpayerAddress == taxPayerAddress) {
                TaxpayerStatus = true;
            }
        }
        if(taxPayerAddress != address(0) && TaxpayerStatus == false){
            uint256 payerId = numberOfTaxPayers;
            taxPayerMap[numberOfTaxPayers] = TaxPayer(firstName, 
            lastName, 
            email, 
            taxPayerAddress, 
            aadharId, 
            payerId
            );
            numberOfTaxPayers++;
            emit addedTaxPayer (
                firstName,
                lastName,
                email,
                aadharId,
                payerId,
                true
            );
        } else {
            revert("Taxpayer already exists");
        }
    }

    function payTax (
        string memory taxSlab,
        uint256 amount,
        uint256 payerId
    ) public payable {
        cfiAddress.transfer(amount);
        address payable payeeAddress;
        for (uint256 i = 0; i < numberOfTaxPayers; i++) {
            if(taxPayerMap[i].payerId == payerId) {
                payeeAddress = taxPayerMap[i].taxpayerAddress;
            }
        }
        emit paidTax (
            payeeAddress,
            taxSlab,
            amount
        );
    }

    function getTotalTaxpayers() public view returns(uint256) {
        return numberOfTaxPayers;
    }

    function getTaxpayer(
        uint256 payerID
        ) public view returns (
            string memory, 
            string memory, 
            string memory, 
            uint256, 
            address) {
        return (
            taxPayerMap[payerID].firstName,
            taxPayerMap[payerID].lastName,
            taxPayerMap[payerID].email,
            taxPayerMap[payerID].aadharId,
            taxPayerMap[payerID].taxpayerAddress
        );
    }
}