const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require('web3');
const fs = require("fs");
require('dotenv').config({path: '../.env'});

var contractsObj = {};

var compiledContracts = require('./compile');
// console.log(contract)

const provider = new HDWalletProvider(
    process.env.MNEMONIC,
    process.env.NODE_PROVIDER_URL
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('Attempting to deploy from account', accounts[0]);
  
    const result = await new web3.eth.Contract(compiledContracts.gst.abi)
      .deploy({ data: compiledContracts.gst.bytecode })
      .send({ gas: '1000000', from: accounts[0] });
  
    console.log(compiledContracts.gst.abi);
    console.log('Contract deployed to', result.options.address);
    return result.options.address;
};

deploy().then(addr => {
    contractsObj['gst'] = {
        address: addr, 
        abi: compiledContracts.gst.abi
    };
    
    var json = JSON.stringify(contractsObj);
    fs.writeFile('../src/deployedContracts.json', json, 'utf8', (err) =>{
        if(err){
            console.log(err);
        }else{
            console.log("Success");
        }
    });
});

