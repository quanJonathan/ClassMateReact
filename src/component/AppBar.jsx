import { Container, Divider, Button, Box } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import AppName from "./WebName";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

//  TO-DO

function WebAppBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  function checkForLogin() {
    setIsLoggedIn(true);
  }

  useEffect(() => {
    checkForLogin();
    return () => {};
  }, [isLoggedIn]);

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
              <Button component={NavLink} sx={{my: 2, color: "black"}} to='\about' >
                About us
              </Button>
              <Button component={NavLink} sx={{my: 2, color: "black"}} to='\login'>
                Log in
              </Button>
              <Button component={NavLink} sx={{ my: 2, outlineStyle: "none" }} to='\signup'>
                Sign up
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}

export default WebAppBar;
