import {Button, Grid, MenuItem, Paper, Select, TextField} from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import {useEthers} from "@usedapp/core";
import privilegesContract from '../contractInterface/privilegesContract';
import interactionsContract from '../contractInterface/interactionsContract';

const PrivilegedAdmin = () => {

    const {account} = useEthers();
    var isPrivilegedAdmin = privilegesContract.useContractGetter('isPrivilegedAdmin', [account]);

    useEffect(() => {
        console.log(isPrivilegedAdmin);
    },[isPrivilegedAdmin]);

    const [addAdmin, setAddAdmin] = useState({
        addr: '',
        type: ''
    });

    const [removeAdmin, setRemoveAdmin] = useState({
        addr: '',
        type: ''
    });

    const [addGovt, setAddGovt] = useState({
        govtAddress: '',
        govtAccName: '',
        govtAccType: 'CGST',
        govtType: 'STATE',
        govtName: '',
        govtid: ''
    });

    const handleAddChange = (event) => {
        setAddAdmin({...addAdmin , [event.target.name]: event.target.value});
    };

    const handleRemoveChange = (event) => {
        setRemoveAdmin({...removeAdmin , [event.target.name]: event.target.value});
    };

    const handleAddGovtChange = (event) => {
        setAddGovt({...addGovt , [event.target.name]: event.target.value});
    };

    const handleAddAdminSubmit = () => {
        if(isPrivilegedAdmin){
            var addAdminMethod = privilegesContract.useContractMethod(addAdmin.type);
            addAdminMethod.send(addAdmin.addr);
        }else{
            alert("You are not a Privileged Admin");
        }
    };

    const handleRemoveAdminSubmit = () => {
        if(isPrivilegedAdmin){
            var removeAdminMethod = privilegesContract.useContractMethod(removeAdmin.type);
            removeAdminMethod[1](removeAdmin.addr);
        }else{
            alert("You are not a Privileged Admin");
        }
    };

    const handleAddGovtSubmit = () => {
        if(isPrivilegedAdmin){
            var addGovtMethod = interactionsContract.useContractMethod('createGovernmentAccount');
            addGovtMethod[1](addGovt.govtAddress, addGovt.govtAccName, addGovt.govtAccType, addGovt.govtType, addGovt.govtName, addGovt.govtid);
        }else{
            alert("You are not a Privileged Admin");
        }
    };

    return <Fragment>
        <Grid container spacing={0}>
            <Grid item xs={6}>
                <Paper sx={{px:3, py:1, m: 3}}>
                    <h3>Add new Admin</h3>
                    <Select
                        name="type"
                        value={addAdmin.type}
                        label="Admin Type"
                        onChange={handleAddChange}
                        fullWidth
                        sx={{my:3}}
                    >
                        <MenuItem value={'addPrivilegedAdmin'}>PrivilegedAdmin</MenuItem>
                        <MenuItem value={'addGstAdmin'}>GstAdmin</MenuItem>
                        <MenuItem value={'addIncomeTaxAdmin'}>IncomeTaxAdmin</MenuItem>
                        <MenuItem value={'addTokenAdmin'}>TokenAdmin</MenuItem>
                        <MenuItem value={'addMinter'}>Minter</MenuItem>
                    </Select>
                    <TextField name="addr" value={addAdmin.addr} onChange={handleAddChange} label="Address" variant="outlined" fullWidth />
                    <Button variant="outlined" sx={{my:2}} onClick={handleAddAdminSubmit}>
                        Submit
                    </Button>
                </Paper>
            </Grid>
            <Grid item xs={6}>
                <Paper sx={{px:3, py:1, m: 3}}>
                    <h3>Remove Admin</h3>
                    <Select
                        name="type"
                        value={removeAdmin.type}
                        label="Admin Type"
                        onChange={handleRemoveChange}
                        fullWidth
                        sx={{my:3}}
                    >
                        <MenuItem value={'removePrivilegedAdmin'}>PrivilegedAdmin</MenuItem>
                        <MenuItem value={'removeGstAdmin'}>GstAdmin</MenuItem>
                        <MenuItem value={'removeIncomeTaxAdmin'}>IncomeTaxAdmin</MenuItem>
                        <MenuItem value={'removeTokenAdmin'}>TokenAdmin</MenuItem>
                        <MenuItem value={'removeMinter'}>Minter</MenuItem>
                    </Select>
                    <TextField name="addr" value={removeAdmin.addr} onChange={handleRemoveChange} label="Address" variant="outlined" fullWidth />
                    <Button variant="outlined" sx={{my:2}} onClick={handleRemoveAdminSubmit}>
                        Submit
                    </Button>
                </Paper>
            </Grid>
            <Paper sx={{p:3, m: 'auto', mb: 20, width: 700}}>
                <h3>Add New Goverment Account</h3>
                <TextField sx={{mx:3, my: 1, width: 660}} onChange={handleAddGovtChange} value={addGovt.govtAddress} name="govtAddress" label="Address" variant="outlined"  />      
                <TextField sx={{mx:3, my: 1, width: 660}} onChange={handleAddGovtChange} value={addGovt.govtAccName} name="govtAccName" label="Account Name" variant="outlined"  />
                <Select
                    name="govtAccType"
                    value={addGovt.govtAccType}
                    label="Account Type"
                    onChange={handleAddGovtChange}
                    sx={{mx:3, my: 1, width: 660}} 
                >
                    <MenuItem value={'CGST'}>CGST</MenuItem>
                    <MenuItem value={'SGST'}>SGST</MenuItem>
                    <MenuItem value={'IGST'}>IGST</MenuItem>
                    <MenuItem value={'INCOMETAX'}>INCOMETAX</MenuItem>
                    <MenuItem value={'STATERESERVE'}>STATERESERVE</MenuItem>
                    <MenuItem value={'CENTRERESERVE'}>CENTRERESERVE</MenuItem>
                    <MenuItem value={'CONSOLIDATEDFUND'}>CONSOLIDATEDFUND</MenuItem>
                </Select>      
                <Select
                    name="govtType"
                    value={addGovt.govtType}
                    label="Government Type"
                    onChange={handleAddGovtChange}
                    sx={{mx:3, my: 1, width: 660}} 
                >
                    <MenuItem value={'STATE'}>STATE</MenuItem>
                    <MenuItem value={'CENTRAL'}>CENTRAL</MenuItem>
                </Select>    
                <TextField sx={{mx:3, my: 1, width: 660}} onChange={handleAddGovtChange} value={addGovt.govtName} name="govtName" label="Government Name" variant="outlined" />      
                <TextField sx={{mx:3, my: 1, width: 660}} onChange={handleAddGovtChange} value={addGovt.govtid} name="govtid" label="State Code as per GST" variant="outlined" />     
                <Button variant='outlined' sx={{mx:3, my: 1, width: 660}} onClick={handleAddGovtSubmit}>
                    Submit
                </Button> 
            </Paper>
        </Grid>
    </Fragment>
}

export default PrivilegedAdmin;