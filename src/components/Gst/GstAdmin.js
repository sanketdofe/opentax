import { Button, Grid, Modal, Paper, TextField } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { utils } from 'ethers';
import { Contract } from '@ethersproject/contracts';
import { useContractFunction} from "@usedapp/core";
import compiledContracts from "../../contractInterface/compiledContracts.json";

const gstContractInterface = new utils.Interface(compiledContracts["Gst"].abi);
const gstContract = new Contract(process.env.REACT_APP_GSTCONTRACTADDRESS, gstContractInterface);

function GstAdmin() {
    const [openModal, setOpenModal] = useState(false);
    const [modalContent, setModalContent] = useState(<></>);
    

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
                break
            case "transferrefund":
                break;
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

    const {state, send, events} = useContractFunction(gstContract, "createAccount", {});
    function handleAccountTextFieldChange(event){
        setAccountForm({ ...accountForm, [event.target.name]: event.target.value});
    }
    var returnedVal = null;
    function handleCreateAccount() {
        // console.log(createAccount);
        returnedVal = send(accountForm.fname, accountForm.lname, accountForm.userEmail, accountForm.gstNo, accountForm._userType, accountForm.stateCode, accountForm.userAddr);
        returnedVal.then(a => console.log(a));
    }

    useEffect(() => {
        console.log(state);
        console.log(returnedVal);
    }, [state, returnedVal]);

    const newAccountForm = <>
        <TextField sx={{my:1}} name="fname" value={accountForm.fname} onChange={handleAccountTextFieldChange} label="First Name" variant='outlined' fullWidth/>
        <TextField sx={{my:1}} name="lname" value={accountForm.lname} onChange={handleAccountTextFieldChange} label="Last Name" variant='outlined' fullWidth/>
        <TextField sx={{my:1}} name="userEmail" value={accountForm.userEmail} onChange={handleAccountTextFieldChange} label="Email" variant='outlined' fullWidth/>
        <TextField sx={{my:1}} name="gstNo" value={accountForm.gstNo} onChange={handleAccountTextFieldChange} label="GST Number" variant='outlined' fullWidth/>
        <TextField sx={{my:1}} name="_userType" value={accountForm._userType} onChange={handleAccountTextFieldChange} label="User Type" variant='outlined' fullWidth/>
        <TextField sx={{my:1}} name="stateCode" value={accountForm.stateCode} onChange={handleAccountTextFieldChange} label="State Code" variant='outlined' fullWidth/>
        <TextField sx={{my:1}} name="userAddr" value={accountForm.userAddr} onChange={handleAccountTextFieldChange} label="Address" variant='outlined' fullWidth/>
        <Button variant="contained" onClick={handleCreateAccount}>Submit</Button>
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