import { utils } from 'ethers';
import { Contract } from '@ethersproject/contracts';
import { useContractFunction, useContractCall } from "@usedapp/core";
import compiledContracts from "./compiledContracts.json";
require('dotenv').config();

const gstContractInterface = new utils.Interface(compiledContracts["Gst"].abi);
const gstContract = new Contract(process.env.REACT_APP_GSTCONTRACTADDRESS, gstContractInterface);

function useContractGetter(getterName, args) {
    var [val] = useContractCall({
        abi: gstContractInterface,
        address: process.env.REACT_APP_GSTCONTRACTADDRESS,
        method: getterName,
        args: args,
      }) ?? [];
    return val;
}

function useContractMethod(methodName) {
    var { state, send, events } = useContractFunction(gstContract, methodName, {});
    return [ state, send, events ];
}

export default {
    useContractGetter, useContractMethod
}