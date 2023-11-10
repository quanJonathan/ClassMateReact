import { Container, Divider, Button, Box, Typography } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import AppName from "./WebName";
import { NavLink } from "react-router-dom";
import { useAuth } from "../hook/useAuth.jsx";

function WebAppBar() {
  const { user} = useAuth();

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
              {!user && (
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
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}

export default WebAppBar