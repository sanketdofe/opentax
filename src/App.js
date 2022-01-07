import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import GstUser from './components/Gst/GstUser.js';
import GstAdmin from './components/Gst/GstAdmin.js';
import GstHome from './components/Gst/GstHome.js';
import Home from './components/Home.js';
import NavBar from './components/NavBar.js';
import PrivilegedAdmin from './components/PrivilegedAdmin.js';
import MinterHome from './components/MinterHome.js';

function App() {
  // const {activateBrowserWallet, account } = useEthers();
  // const etherBalance = useEtherBalance(account);
  
  // const [transferState, transferMethod, transferEvents] = rupeeTokenContract.useContractMethod("transfer");
  // const [stat, meth, eve] = interactionsContract.useContractMethod("createGovernmentAccount");

  // React.useEffect(() => {
  //   console.log(transferEvents);
  //   console.log(transferState);
  //   console.log(b);
  // }, [transferEvents, transferState, b]);
  // var b = null;
  // var aa = rupeeTokenContract.useContractGetter('balanceOf', [account]);
  // function tra(){
  //   // b = transferMethod('0x628D177444206aa2104d99624AD121C402e7A78a', 200);
  //   // console.log(transferEvents);
  //   // console.log(transferState);
  //   // console.log(b);
  //   b = meth('0x628D177444206aa2104d99624AD121C402e7A78a', 'abcd', 'nf', 'asa', 'cdv', 10);
  // }
  // React.useEffect(() => {
  //   console.log(eve);
  //   console.log(stat);
  //   console.log(b);
  // }, [eve, stat, b]);
  // // var privisAdmin = privilegesContract.useContractGetter('getContractAddress', []);
  // // console.log('privisAdmin', privisAdmin);
  return (
    <BrowserRouter>
      <div>
        <NavBar/>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="privileged-admin" element={<PrivilegedAdmin/>} />
          <Route path="minter" element={<MinterHome/>} />
          <Route path="gst" element={<GstHome/>} />
          <Route path="gst/admin" element={<GstAdmin/>} />
          <Route path="gst/user" element={<GstUser/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
