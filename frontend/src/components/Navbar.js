import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Chip
} from '@mui/material';
import {
  Dashboard,
  Devices,
  AccountCircle,
  Logout,
  Security
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  boxShadow: '0 4px 20px rgba(59, 130, 246, 0.15)',
}));

const NavButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(0, 1),
  borderRadius: 12,
  textTransform: 'none',
  fontWeight: 600,
  padding: theme.spacing(1, 2),
  '&:hover': {
    background: 'rgba(255,255,255,0.1)',
  },
  '&.active': {
    background: 'rgba(255,255,255,0.2)',
  }
}));

function Navbar({ view, setView, username, onLogout }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    onLogout();
  };

  return (
    <StyledAppBar position="static">
      <Toolbar>
        <Box display="flex" alignItems="center" flexGrow={1}>
          <Security sx={{ mr: 1, fontSize: 28 }} />
          <Typography variant="h6" component="div" fontWeight="bold">
            Modbus Gateway
          </Typography>
          <Chip 
            label="Industrial IoT" 
            size="small" 
            sx={{ ml: 2, bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
          />
        </Box>
        
        <Box display="flex" alignItems="center">
          <NavButton
            color="inherit"
            startIcon={<Dashboard />}
            className={view === 'dashboard' ? 'active' : ''}
            onClick={() => setView('dashboard')}
          >
            Dashboard
          </NavButton>
          
          <NavButton
            color="inherit"
            startIcon={<Devices />}
            className={view === 'devices' ? 'active' : ''}
            onClick={() => setView('devices')}
          >
            Devices
          </NavButton>

          <Box ml={2}>
            <IconButton
              size="large"
              onClick={handleMenu}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.2)' }}>
                <AccountCircle />
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem disabled>
                <Typography variant="body2" color="text.secondary">
                  Signed in as <strong>{username}</strong>
                </Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Logout sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
}

export default Navbar;