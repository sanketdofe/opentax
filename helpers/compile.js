const path = require("path");
const fs = require("fs");
const solc = require("solc");

const GstPath = path.resolve(__dirname, "..", "contracts", "Gst.sol");
const GstSource = fs.readFileSync(GstPath, "utf8");

var input = {
    language: 'Solidity',
    sources: {
      'Gst.sol': {
        content: GstSource
      }
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*']
        }
      }
    }
};

var outputs = JSON.parse(solc.compile(JSON.stringify(input)));

module.exports.gst = {
  abi: outputs.contracts['Gst.sol'].Gst.abi,
  bytecode: outputs.contracts['Gst.sol'].Gst.evm.bytecode.object
};