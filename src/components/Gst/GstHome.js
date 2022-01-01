import { Button, Grid, Modal, Paper, TextField } from "@mui/material";
import { Fragment, useState } from "react";
import { utils } from 'ethers';
import { useContractCall, useEthers } from "@usedapp/core";
import compiledContracts from "../../contractInterface/compiledContracts.json";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import {useNavigate } from "react-router-dom";
import privilegesContract from '../../contractInterface/privilegesContract';

function GstHome() {
    let navigate = useNavigate();
    const [functionArgs, setFunctionArgs] = useState(["", []]);
    const [openModal, setOpenModal] = useState(false);
    const [state, setState] = useState({
        findUserAddressInput: "",
        findGstNoInput: "",
        findUserInput: ""
    });
    const [modalContent, setModalContent] = useState(<></>);
    const gstContractInterface = new utils.Interface(compiledContracts["Gst"].abi);

    var [val] = useContractCall({
        abi: gstContractInterface,
        address: process.env.REACT_APP_GSTCONTRACTADDRESS,
        method: functionArgs[0],
        args: functionArgs[1],
    }) ?? [];

    function handleTextFieldChange(event){
        setState({ ...state, [event.target.name]: event.target.value});
    }
    
    function handlefindGstUser(){
        // val = gstContract.contractGetter("getGstUser", [state.findUserInput]);
        setModalContent(<></>);
        setFunctionArgs(["getGstUser", [state.findUserInput]]);
        setModalContent(
            <Table>
                <TableBody>
                    {val ? Object.keys(val).map((key) => (
                        (isNaN(key) && key!=='bills') ?
                    <TableRow key={key}>
                        <TableCell component="th" scope="row">
                        {key}
                        </TableCell>
                        <TableCell align="right">{typeof val[key] === 'string' ? val[key] : val[key].toString()}</TableCell>
                    </TableRow>
                    : <></>
                    )) : <></>}
                </TableBody>
            </Table>
        );
        setOpenModal(true);
    }

    function handlefindUserAddress(){
        // val = gstContract.contractGetter("getGstUserAddress", [state.findUserAddressInput]);
        setModalContent(<></>);
        setFunctionArgs(["getGstUserAddress", [state.findUserAddressInput]]);
        setModalContent(
            <Table>
                <TableBody>
                    {val ?
                        <TableRow key='Address'>
                            <TableCell component="th" scope="row">Address</TableCell>
                            <TableCell align="right">{val.toString()}</TableCell>
                        </TableRow>
                    : <></>}
                </TableBody>
            </Table>
        );
        setOpenModal(true);
    }

    function handlefindGstNo(){
        // val = gstContract.contractGetter("getGstNo", [state.findGstNoInput]);
        setModalContent(<></>);
        setFunctionArgs(["getGstNo", [state.findGstNoInput]]);
        setModalContent(
            <Table>
                <TableBody>
                    {val ?
                        <TableRow key='GstNo'>
                            <TableCell component="th" scope="row">GST Number</TableCell>
                            <TableCell align="right">{val}</TableCell>
                        </TableRow>
                    : <></>}
                </TableBody>
            </Table>
        );
        setOpenModal(true);
    }

    function handleModalClose(){
        setModalContent(<></>);
        setOpenModal(false);
    }

    const {account} = useEthers();
    var isGstAdmin = privilegesContract.useContractGetter('isGstAdmin', [account]);

    return (
        <Fragment>
            <Grid container spacing={0}>
                <Grid item xs={6}>
                    <Paper sx={{px:3, py:1, m: 3}}>
                        <h3>Find GST User's Address</h3>
                        <TextField name="findUserAddressInput" value={state.findUserAddressInput} onChange={handleTextFieldChange} label="GST Number" variant="outlined" fullWidth />
                        <Button onClick={handlefindUserAddress} variant="outlined" sx={{my:2}}>
                            Submit
                        </Button>
                    </Paper>
                    <Paper sx={{px:3, py:1, m: 3}}>
                        <h3>Find GST User's GST Number</h3>
                        <TextField name="findGstNoInput" value={state.findGstNoInput} onChange={handleTextFieldChange} label="Address" variant="outlined" fullWidth />
                        <Button onClick={handlefindGstNo} variant="outlined" sx={{my:2}}>
                            Submit
                        </Button>
                    </Paper>
                </Grid>
                <Grid item xs={6}>
                    <Paper sx={{px:3, py:1, m: 3}}>
                        <h3>Find GST User's Details</h3>
                        <TextField name="findUserInput" value={state.findUserInput} onChange={handleTextFieldChange} label="GST Number" variant="outlined" fullWidth />
                        <Button onClick={handlefindGstUser} variant="outlined" sx={{my:2}}>
                            Submit
                        </Button>
                    </Paper>
                    <Paper sx={{px:3, py:1, m: 3}}>
                        <h3>Get your bills</h3>
                        {(typeof isGstAdmin==='boolean' && isGstAdmin) ? 
                        <Button onClick={() => navigate('admin')} variant="outlined" sx={{my:2}}>
                            Go to Admin Section
                        </Button>
                        :
                        <Button onClick={() => navigate('user')} variant="outlined" sx={{my:2}}>
                            Go to User Section
                        </Button>}
                    </Paper>
                </Grid>
            </Grid>
            <Modal open={openModal && modalContent!==<></>} onClose={handleModalClose} style={{margin: "3% auto", width: 700}}>
                <Paper sx={{px: 4, py: 1, m: 3}}>
                    <h3>Results</h3>
                    {modalContent}
                </Paper>
            </Modal>
        </Fragment>
    );
}

export default GstHome;