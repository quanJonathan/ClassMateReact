/* eslint-disable react/prop-types */
import { Container, Divider, Button, Box, Typography } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import AppName from "./WebName";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth.jsx";
import { useState } from "react";

export const WebAppBar = ({pages}) => {

  const [anchorElNav, setAnchorElNav] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleCloseNavMenu = (path) => {
    setAnchorElNav(null);
    if (path) {
      navigate(path);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: "appBarColor" }}>
      <AppBar position="fixed" sx={{ bgcolor: "appBarColor.main" }}>
        <Container maxWidth="x1">
          <Toolbar disableGutters>
            <AppName />
            <Box sx={{ flexGrow: 1 }}>
              <Divider sx={{ ml: 2, mr: 2 }} />
            </Box>
            <Box
              sx={{ display: { xs: "none", md: "flex", alignItems: "center" } }}
              style={{ marginLeft: "auto" }}
            >
              <NavLink to="/about" style={{ textDecoration: "none" }}>
                <Button sx={{ my: 2, color: "black" }}>
                  <Typography>About</Typography>
                </Button>
              </NavLink>
              {(user === null) && (
                <>
                  <NavLink to="/sign-in" style={{ textDecoration: "none" }}>
                    <Button sx={{ my: 2, color: "black" }}>
                      <Typography>Login</Typography>
                    </Button>
                  </NavLink>
                  <NavLink to="/sign-up" style={{ textDecoration: "none" }}>
                    <Button sx={{ my: 2 }}>
                      <Typography>Sign up</Typography>
                    </Button>
                  </NavLink>
                </>
              )}
              {!!(user === null) && (
                <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                {pages?.map((page) => (
                  <Button
                    key={page.label}
                    onClick={() => handleCloseNavMenu(page.path)}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    {page.label}
                  </Button>
                ))}
                {!!user && (
                  <Button
                    key={"logout"}
                    onClick={logout}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    {"logout"}
                  </Button>
                )}
              </Box>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}