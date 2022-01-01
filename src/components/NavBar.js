import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { shortenIfAddress, useEthers} from "@usedapp/core";
import Jazzicon from "@metamask/jazzicon";
import rupeeTokenContract from '../contractInterface/rupeeTokenContract';

const pages = ['GST', 'Income Tax', 'Others'];
const settings = ['Profile', 'Dashboard', 'Logout'];

const NavBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const {activateBrowserWallet, account } = useEthers();
  var inrBalance = rupeeTokenContract.useContractGetter('balanceOf', [account]);
  function handleConnectWallet() {
    activateBrowserWallet();
  }

  const ref = React.useRef();
  React.useEffect(() => {
    if (account && ref.current) {
      ref.current.innerHTML = "";
      ref.current.appendChild(Jazzicon(16, parseInt(account.slice(2, 10), 16)));
    }
  }, [account]);
  
  return (
    <AppBar position="static" style={{backgroundColor: "#1A202C"}}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{color: "white", mr: 2, display: { xs: 'none', md: 'flex' } }}
          >
            OpenTax
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{color: "white", flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
          >
            OpenTax
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>
          {account ? 
            (<Box
              style={{ 
                flexGrow: 0, 
                display: "flex",
                alignItems: "center",
                backgroundColor: "#2D3748",
                borderRadius: "12px",
                padding: "0" 
              }}
            >
              <Box style={{margin: "0 5px", paddingLeft: "4px"}}>
                <Typography color="white" fontSize="16px">
                  {inrBalance && (inrBalance.toNumber()/100).toFixed(2)} INR
                </Typography>
              </Box>
              <Button
                style={{
                  backgroundColor: "#1A202C", 
                  border: "1px solid transparent", 
                  borderRadius: "12px", 
                  margin: "1px",
                  padding: "0 5px",
                  height: "38px",
                }}
                onClick={handleOpenUserMenu}
              >
                <Typography color="white" fontSize="16px" fontWeight="medium" marginRight={1}>
                  {shortenIfAddress(account)}
                </Typography>
                <div style={{height: "1rem", width: "1rem", borderRadius: "1.125rem", backgroundColor: "black"}} ref={ref}>
                </div>
              </Button>
            </Box>
          ) : (
            <Tooltip title="Connects your wallet">
              <Button size="large" variant="text" onClick={handleConnectWallet} sx={{ p: 0.5, color: 'white' }}>Connect</Button>
            </Tooltip>
          )}
          <Box sx={{ flexGrow: 0 }}>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default NavBar;
