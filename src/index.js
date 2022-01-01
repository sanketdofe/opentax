import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { DAppProvider } from "@usedapp/core";
require('dotenv').config();

ReactDOM.render(
  <React.StrictMode>
    <DAppProvider config={{
      multicallAddresses: {
        "1337": process.env.REACT_APP_MULTICALLCONTRACTADDRESS
      }
    }}>
      <App />
    </DAppProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

