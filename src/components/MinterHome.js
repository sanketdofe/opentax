import { Button, Grid, Paper, TextField } from "@mui/material";
import { Fragment, useState } from "react";
import { useEthers} from "@usedapp/core";
import rupeeTokenContract from '../contractInterface/rupeeTokenContract';
import privilegesContract from '../contractInterface/privilegesContract';

const MinterHome = () => {

    const {account } = useEthers();
    var isAuthorizedMinter = privilegesContract.useContractGetter('isAuthorizedMinter', [account]);


    const [mintForm, setMintForm] = useState({
        address: '',
        amount: ''
    });

    const [burnForm, setBurnForm] = useState({
        address: '',
        amount: ''
    });

    const handleMintFormChange = (event) => {
        setMintForm({...mintForm , [event.target.name]: event.target.value});
    };

    const handleBurnFormChange = (event) => {
        setBurnForm({...burnForm , [event.target.name]: event.target.value});
    };

    const handleMintFormSubmit = () => {
        if(isAuthorizedMinter){
            var mintMethod = rupeeTokenContract.useContractMethod('mint');
            mintMethod[2](mintForm.address, mintForm.amount);
        }else{
            alert('You are not an authorized minter');
        }
    };

    const handleBurnFormSubmit = () => {
        if(isAuthorizedMinter){
            var burnMethod = rupeeTokenContract.useContractMethod('burn');
            burnMethod[2](burnForm.address, burnForm.amount);
        }else{
            alert('You are not an authorized minter');
        }
    };

    return <Fragment>
        <Grid container spacing={0}>
            <Grid item xs={6}>
                <Paper sx={{px:3, py:1, m: 3}}>
                    <h3>Mint Tokens To</h3>
                    <TextField onChange={handleMintFormChange} sx={{my: 1}} value={mintForm.address} name="address" label="Address" variant="outlined" fullWidth />
                    <TextField onChange={handleMintFormChange} sx={{my: 1}} value={mintForm.amount} name="amount" label="Amount in Paise" variant="outlined" fullWidth />
                    <Button onClick={handleMintFormSubmit} variant="outlined" sx={{my:2}}>
                        Submit
                    </Button>
                </Paper>
            </Grid>
            <Grid item xs={6}>
                <Paper sx={{px:3, py:1, m: 3}}>
                    <h3>Burn Tokens From</h3>
                    <TextField onChange={handleBurnFormChange} sx={{my: 1}} value={burnForm.address} name="address" label="Address" variant="outlined" fullWidth />
                    <TextField onChange={handleBurnFormChange} sx={{my: 1}} value={burnForm.amount} name="amount" label="Amount in Paise" variant="outlined" fullWidth />
                    <Button onClick={handleBurnFormSubmit} variant="outlined" sx={{my:2}}>
                        Submit
                    </Button>
                </Paper>
            </Grid>
        </Grid>
    </Fragment>
}

export default MinterHome;