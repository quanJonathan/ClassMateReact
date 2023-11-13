import {
    Container,
    Divider,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Typography,
  } from "@mui/material";
  import AppBar from "@mui/material/AppBar";
  import Toolbar from "@mui/material/Toolbar";
  import AppName from "./WebName";
  import { useAuth } from "../hook/useAuth.jsx";
  import { useNavigate } from "react-router-dom";
  import AccountCircle from '@mui/icons-material/AccountCircle';
  import * as React from "react";
  
  function Header({ children }) {
    const { logout, isAuthenticated } = useAuth();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  
    const handleProfileMenuOpen = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  
    const handleMenuClose = () => {
      setAnchorEl(null);
      handleMobileMenuClose();
    };
  
    const handleMobileMenuClose = () => {
      setMobileMoreAnchorEl(null);
    };
  
    const menuId = "primary-search-account-menu";
    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        id={menuId}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => navigate('/user/profile')}>Profile</MenuItem>
        <MenuItem onClick={handleMenuClose}>My account</MenuItem>
        <MenuItem onClick={ () =>  {
          logout()
          setAnchorEl(null)
        }} sx={{ color: "red" }}>
          Log out
        </MenuItem>
      </Menu>
    );
  
    const navigate = useNavigate();
    const handleCloseNavMenu = (path) => {
      setAnchorEl(null);
      if (path) {
        navigate(path);
      }
    };
    return (
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          px: "40px",
          height: "auto",
          bgcolor: "#FFF"
        }}
      >
        <Container maxWidth="x1">
          <Toolbar disableGutters sx={{ maxHeight: "10vh" }}>
            {children}
            <AppName />

            <Box sx={{ flexGrow: 1 }}>
                <Typography color="#5f6368"  sx={{
                    fontWeight: "medium",
                    fontSize: "20px"
                }}>
                    Dashboard
                </Typography>
            </Box>
            <Box
              sx={{ display: { xs: "none", md: "flex", alignItems: "center" } }}
              style={{ marginLeft: "100px" }}
            >
        
              {!isAuthenticated() &&
                (
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <AccountCircle
                    sx={{
                        width: "35px",
                        height: "35px"
                      }}
                  />
                </IconButton>
              )}
  
            </Box>
          </Toolbar>
        </Container>
        {renderMenu}
      </AppBar>
    );
  }
  
  export default Header;
  