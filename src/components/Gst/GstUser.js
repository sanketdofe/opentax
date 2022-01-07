import { Fragment, useEffect, useState } from "react";
import { utils } from 'ethers';
import { useContractCall, useEthers } from "@usedapp/core";
import compiledContracts from "../../contractInterface/compiledContracts.json";

function GstUser() {
    // const {account} = useEthers();
    // const gstContractInterface = new utils.Interface(compiledContracts["Gst"].abi);
    // const [gstNo, setGstNo] = useState('');
    // var [userGstNo] = useContractCall({
    //     abi: gstContractInterface,
    //     address: process.env.REACT_APP_GSTCONTRACTADDRESS,
    //     method: 'getGstNo',
    //     args: account,
    // }) ?? [];

    // var [userBills] = useContractCall({
    //     abi: gstContractInterface,
    //     address: process.env.REACT_APP_GSTCONTRACTADDRESS,
    //     method: 'getAllBills',
    //     args: gstNo,
    // }) ?? [];
    
    // useEffect(() => {
    //     console.log(userGstNo);
    //     setGstNo(userGstNo);
    //     console.log(userBills);
    // }, [userGstNo, userBills]);
    return (
        <Fragment>
            <div>
                hello User
            </div>
        </Fragment>
    );
}

export default GstUser;