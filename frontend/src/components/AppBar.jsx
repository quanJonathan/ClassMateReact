import {
  Container,
  Divider,
  Button,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import AppName from "./WebName";
import { NavLink } from "react-router-dom";
import { useAuth } from "../hook/useAuth.jsx";
import useScrollPosition from "../hook/useStrollPosition.js";
import { useNavigate } from "react-router-dom";
import AccountCircle from '@mui/icons-material/AccountCircle';
import * as React from "react";

function WebAppBar({ pages }) {
  const { logout, isAuthenticated } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const scrollPosition = useScrollPosition();

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
      <MenuItem onClick={() => navigate('/dashboard')}>Dashboard</MenuItem>
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
      elevation={scrollPosition > 10 ? 4 : 0}
      color="transparent"
      sx={{
        py: 2,
        px: "40px",
        height: "auto",
        bgcolor: scrollPosition > 10 ? "#FFF" : "transparent",
      }}
    >
      <Container maxWidth="x1">
        <Toolbar disableGutters sx={{ maxHeight: "10vh" }}>
          <AppName />
          <Box sx={{ flexGrow: 1 }}>
            <Divider
              sx={{ ml: 2, mr: 2, display: { xs: "none", md: "flex" } }}
            />
          </Box>
          <Box
            sx={{ display: { xs: "none", md: "flex", alignItems: "center" } }}
            style={{ marginLeft: "100px" }}
          >
            <NavLink to="/" style={{ textDecoration: "none" }}>
              <Button sx={{ my: 2, textTransform: "none" }}>
                <Typography
                  sx={{
                    fontSize: "16px",
                    color: "black",
                    fontWeight: "medium",
                    cursor: "pointer",
                  }}
                >
                  About Us
                </Typography>
              </Button>
            </NavLink>
            {!isAuthenticated() ? (
              <>
                <NavLink to="/sign-in" style={{ textDecoration: "none" }}>
                  <Button sx={{ my: 2, textTransform: "none" }}>
                    <Typography
                      sx={{
                        fontSize: "16px",
                        color: "black",
                        fontWeight: "medium",
                        cursor: "pointer",
                      }}
                    >
                      Login
                    </Typography>
                  </Button>
                </NavLink>
                <NavLink to="/sign-up" style={{ textDecoration: "none" }}>
                  <Button sx={{ my: 2, textTransform: "none" }}>
                    <Typography
                      sx={{
                        fontSize: "16px",
                        fontWeight: "medium",
                        cursor: "pointer",
                      }}
                    >
                      Sign Up
                    </Typography>
                  </Button>
                </NavLink>
              </>
            ): (
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle sx={{width: "40px", height: "40px"}}/>
              </IconButton>
            )}

          </Box>
        </Toolbar>
      </Container>
      {renderMenu}
    </AppBar>
  );
}

export default WebAppBar;
