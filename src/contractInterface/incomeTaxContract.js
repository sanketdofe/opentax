import { utils } from 'ethers';
import { Contract } from '@ethersproject/contracts';
import { useContractFunction, useContractCall } from "@usedapp/core";
import compiledContracts from "./compiledContracts.json";
require('dotenv').config();

const incomeTaxContractInterface = new utils.Interface(compiledContracts["IncomeTax"].abi);
const incomeTaxContract = new Contract(process.env.REACT_APP_INCOMETAXCONTRACTADDRESS, incomeTaxContractInterface);

function useContractGetter(getterName, args) {
    var [val] = useContractCall({
        abi: incomeTaxContractInterface,
        address: process.env.REACT_APP_INCOMETAXCONTRACTADDRESS,
        method: getterName,
        args: args,
      }) ?? [];
    return val;
}

function useContractMethod(methodName) {
    var { state, send, events } = useContractFunction(incomeTaxContract, methodName, {});
    return [ state, send, events ];
}

export default {
    useContractGetter, useContractMethod
}