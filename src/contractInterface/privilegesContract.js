import { utils } from 'ethers';
import { Contract } from '@ethersproject/contracts';
import { useContractFunction, useContractCall } from "@usedapp/core";
import compiledContracts from "./compiledContracts.json";
require('dotenv').config();

const privilegesContractInterface = new utils.Interface(compiledContracts["Privileges"].abi);
const privilegesContract = new Contract(process.env.REACT_APP_PRIVILEGESCONTRACTADDRESS, privilegesContractInterface);

function useContractGetter(getterName, args) {
    var [val] = useContractCall({
        abi: privilegesContractInterface,
        address: process.env.REACT_APP_PRIVILEGESCONTRACTADDRESS,
        method: getterName,
        args: args,
      }) ?? [];
    return val;
}

function useContractMethod(methodName) {
    var { state, send, events } = useContractFunction(privilegesContract, methodName, {});
    return [ state, send, events ];
}

export default {
    useContractGetter, useContractMethod
}