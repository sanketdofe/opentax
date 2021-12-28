import web3 from './web3';
let deployedcontracts = require('deployedContracts.json');

module.exports.gst = new web3.eth.Contract(deployedcontracts.gst.abi, deployedcontracts.gst.address);