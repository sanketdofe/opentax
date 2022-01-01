const path = require("path");
const fs = require("fs");
const solc = require("solc");

const PrivilegesPath = path.resolve(__dirname, "..", "contracts", "Privileges.sol");
const PrivilegesSource = fs.readFileSync(PrivilegesPath, "utf8");

const RupeeTokenPath = path.resolve(__dirname, "..", "contracts", "RupeeToken.sol");
const RupeeTokenSource = fs.readFileSync(RupeeTokenPath, "utf8");

const InteractionsPath = path.resolve(__dirname, "..", "contracts", "Interactions.sol");
const InteractionsSource = fs.readFileSync(InteractionsPath, "utf8");

const IncomeTaxPath = path.resolve(__dirname, "..", "contracts", "IncomeTax.sol");
const IncomeTaxSource = fs.readFileSync(IncomeTaxPath, "utf8");

const GstPath = path.resolve(__dirname, "..", "contracts", "Gst.sol");
const GstSource = fs.readFileSync(GstPath, "utf8");

var input = {
    language: 'Solidity',
    sources: {
      'Privileges.sol': {
        content: PrivilegesSource
      },
      'RupeeToken.sol': {
        content: RupeeTokenSource
      },
      'Interactions.sol': {
        content: InteractionsSource
      },
      'IncomeTax.sol': {
        content: IncomeTaxSource
      },
      'Gst.sol': {
        content: GstSource
      }
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['abi', 'evm.bytecode.object']
        }
      }
    }
};

var outputs = JSON.parse(solc.compile(JSON.stringify(input)));

var contractsObj = {};

for (var file in outputs.contracts) {
  contractsObj[file.split('.')[0]] = {};
  contractsObj[file.split('.')[0]].abi = outputs.contracts[file][file.split('.')[0]].abi;
  contractsObj[file.split('.')[0]].bytecode = outputs.contracts[file][file.split('.')[0]].evm.bytecode.object;
}

fs.writeFile('../src/contractInterface/compiledContracts.json', JSON.stringify(contractsObj), 'utf8', (err) =>{
  if(err){
      console.log(err);
  }else{
      console.log("Success");
  }
});