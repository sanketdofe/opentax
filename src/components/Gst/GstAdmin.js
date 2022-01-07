import { Button, Grid, MenuItem, Modal, Paper, Select, TextField } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { utils } from 'ethers';
import { Contract } from '@ethersproject/contracts';
import { useContractFunction} from "@usedapp/core";
import compiledContracts from "../../contractInterface/compiledContracts.json";


function GstAdmin() {
    const [openModal, setOpenModal] = useState(false);
    const [modalContent, setModalContent] = useState(<></>);
    
    const gstContractInterface = new utils.Interface(compiledContracts["Gst"].abi);
    const gstContract = new Contract(process.env.REACT_APP_GSTCONTRACTADDRESS, gstContractInterface);

    function handleModalClose(){
        setOpenModal(false);
        setModalContent(<></>)
    }

    function handleButtonClick(e){
        console.log(e.target.name);
        switch(e.target.name) {
            case "addnewaccount":
                setModalContent(newAccountForm);
                break;
            case "genbill":
                setModalContent(generateBillForm);
                break;
            case "transferrefund":
                break;
            default:
                return;
        }
        setOpenModal(true);
    }

    ////////////////////////////////NEW ACCOUNT//////////////////////////////
    const [accountForm, setAccountForm] = useState({
        fname : "",
        lname : "",
        userEmail: "",
        gstNo: "",
        _userType: "",
        stateCode: "",
        userAddr: ""
    });
    
    const handleAccountFormChange = (event) => {
        console.log(event.target);
        setAccountForm({ ...accountForm, [event.target.name]: event.target.value});
    }

    var returnedVal = null;
    const createAccountMethod = useContractFunction(gstContract, "createAccount", {});

    function handleCreateAccount() {
        // console.log(createAccount);
        returnedVal = createAccountMethod.send(accountForm.fname, accountForm.lname, accountForm.userEmail, accountForm.gstNo, accountForm._userType, accountForm.stateCode, accountForm.userAddr);
        returnedVal.then(a => console.log(a));
    }

    useEffect(() => {
        console.log(createAccountMethod);
        console.log(returnedVal);
    }, [createAccountMethod, returnedVal]);

    const newAccountForm = <>
        <h3 style={{margin: '1px'}}>Add New Account</h3>
        <TextField sx={{my:1}} onChange={handleAccountFormChange} value={accountForm.fname} name="fname" label="First Name" variant='outlined' fullWidth/>
        <TextField sx={{my:1}} onChange={handleAccountFormChange} value={accountForm.lname} name="lname" label="Last Name" variant='outlined' fullWidth/>
        <TextField sx={{my:1}} onChange={handleAccountFormChange} value={accountForm.userEmail} name="userEmail" label="Email" variant='outlined' fullWidth/>
        <TextField sx={{my:1}} onChange={handleAccountFormChange} value={accountForm.gstNo} name="gstNo" label="GST Number" variant='outlined' fullWidth/>
        <TextField sx={{my:1}} onChange={handleAccountFormChange} value={accountForm._userType} name="_userType" label="User Type" variant='outlined' fullWidth/>
        <TextField sx={{my:1}} onChange={handleAccountFormChange} value={accountForm.stateCode} name="stateCode" label="State Code" variant='outlined' fullWidth/>
        <TextField sx={{my:1}} onChange={handleAccountFormChange} value={accountForm.userAddr} name="userAddr" label="Address" variant='outlined' fullWidth/>
        <Button variant="contained" onClick={handleCreateAccount}>Submit</Button>
    </>

    /////////////////////Generate Bill//////////////////////
    const [billForm, setBillForm] = useState({
        gstNo: "",
        materialSelected: "",
        beforeGstAmt: "",
        gstPercent: "",
        isInterstate: false
    });
    
    const handleBillFormChange = (event) => {
        setBillForm({ ...billForm, [event.target.name]: event.target.value});
    }

    const generateBillMethod = useContractFunction(gstContract, "generateBill", {});
    
    const handleBillFormSubmit = () => {
        var beforeGSTAmountarray = billForm.beforeGstAmt.split(',');
        var GSTpercentarray = billForm.beforeGstAmt.split(',');
        if(beforeGSTAmountarray.length !== GSTpercentarray.length){
            alert("Before GST Amount and GST percent are not organized properly");
            return;
        }
        var TotalGSTPercent = GSTpercentarray.reduce((s, a) => s+a, 0);
        var GSTAmountArray = beforeGSTAmountarray.map((a, i) => 0.01*a*GSTpercentarray[i]);
        var afterGstAmount = beforeGSTAmountarray.map((a, i) => a + GSTAmountArray[i]);
        returnedVal = generateBillMethod.send(billForm.gstNo, billForm.materialSelected, billForm.beforeGstAmt, afterGstAmount.toString(), GSTAmountArray, TotalGSTPercent, "GSTADMINS", billForm.isInterstate);
        returnedVal.then(a => console.log(a));
    }


    const generateBillForm = <>
        <h3 style={{margin: '1px'}}>Generate Bill</h3>
        <TextField sx={{my:1}} onChange={handleBillFormChange} value={billForm.gstNo} name="gstNo" label="GST Number" variant='outlined' fullWidth/>
        <TextField sx={{my:1}} onChange={handleBillFormChange} value={billForm.materialSelected} name="materialSelected" label="Materials (Comma Seperated)" variant='outlined' fullWidth/>
        <TextField sx={{my:1}} onChange={handleBillFormChange} value={billForm.beforeGstAmt} name="beforeGstAmt" label="Before GST Amount (Comma Seperated)" variant='outlined' fullWidth/>
        <TextField sx={{my:1}} onChange={handleBillFormChange} value={billForm.gstPercent} name="gstPercent" label="GST Percent (Comma Seperated)" variant='outlined' fullWidth/>
        <Select
            name="isInterstate"
            onChange={handleBillFormChange}
            value={billForm.isInterstate}
            label="Is Goods/Service Transfer Interstate"
            sx={{my: 1, width:575}} 
        >
            <MenuItem value={true}>Is Goods/Service Transfer Interstate = Yes</MenuItem>
            <MenuItem value={false}>Is Goods/Service Transfer Interstate = No</MenuItem>
        </Select>  
        <Button variant="contained" onClick={handleBillFormSubmit}>Submit</Button>
    </>

    return (
        <Fragment>
            <div style={{margin: '50px', padding: '20px'}}>
                <Grid container spacing={3} sx={{ textAlign: 'center'}}>
                <Grid item xs={4}>
                <Paper>
                    <Button onClick={handleButtonClick} name="addnewaccount" fullWidth variant="outlined">Add New Account</Button>
                </Paper>
                </Grid>
                <Grid item xs={4}>
                <Paper>
                    <Button onClick={handleButtonClick} name="genbill" fullWidth variant="outlined">Generate Bill</Button>
                </Paper>
                </Grid>
                <Grid item xs={4}>
                <Paper>
                    <Button onClick={handleButtonClick} name="transferrefund" fullWidth variant="outlined">Transfer Refunds or Settlements</Button>
                </Paper>
                </Grid>
                </Grid>
            </div>
            <Modal open={openModal} onClose={handleModalClose} style={{margin: "1.5% auto", width: 700}}>
                <Paper sx={{px: 5, py: 3, mx: 3}}>
                    {modalContent}
                </Paper>
            </Modal>
        </Fragment>
    );
}

export default GstAdmin;