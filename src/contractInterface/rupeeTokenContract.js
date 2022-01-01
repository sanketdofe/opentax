import { utils } from 'ethers';
import { Contract } from '@ethersproject/contracts';
import { useContractFunction, useContractCall } from "@usedapp/core";
import compiledContracts from "./compiledContracts.json";
require('dotenv').config();

const rupeeTokenContractInterface = new utils.Interface(compiledContracts["RupeeToken"].abi);
const rupeeTokenContract = new Contract(process.env.REACT_APP_RUPEETOKENCONTRACTADDRESS, rupeeTokenContractInterface);

function useContractGetter(getterName, args) {
    var [val] = useContractCall({
        abi: rupeeTokenContractInterface,
        address: process.env.REACT_APP_RUPEETOKENCONTRACTADDRESS,
        method: getterName,
        args: args,
      }) ?? [];
    return val;
}

function useContractMethod(methodName) {
    var { state, send, events } = useContractFunction(rupeeTokenContract, methodName, {});
    return [ state, send, events ];
}

const contr = {
    useContractGetter, useContractMethod
}

export default contr;