import { utils } from 'ethers';
import { Contract } from '@ethersproject/contracts';
import { useContractFunction, useContractCall } from "@usedapp/core";
import compiledContracts from "./compiledContracts.json";
require('dotenv').config();

const interactionsContractInterface = new utils.Interface(compiledContracts["Interactions"].abi);
const interactionsContract = new Contract(process.env.REACT_APP_INTERACTIONSCONTRACTADDRESS, interactionsContractInterface);

function useContractGetter(getterName, args) {
    var [val] = useContractCall({
        abi: interactionsContractInterface,
        address: process.env.REACT_APP_INTERACTIONSCONTRACTADDRESS,
        method: getterName,
        args: args,
      }) ?? [];
    return val;
}

function useContractMethod(methodName) {
    var { state, send, events } = useContractFunction(interactionsContract, methodName, {});
    return [ state, send, events ];
}

export default {
    useContractGetter, useContractMethod
}