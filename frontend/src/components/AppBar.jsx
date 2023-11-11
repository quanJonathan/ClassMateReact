import { Container, Divider, Button, Box, Typography } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import AppName from "./WebName";
import { NavLink } from "react-router-dom";
import { useAuth } from "../hook/useAuth.jsx";

function WebAppBar() {
  const { user} = useAuth();

  return (
      <AppBar position="fixed" color="transparent" elevation={0} sx={{padding: "40px"}}>
        <Container maxWidth="x1" >
          <Toolbar disableGutters sx={{maxHeight: '10vh'}}>
            <AppName />
            <Box sx={{ flexGrow: 1 }}>
              <Divider sx={{ ml: 2, mr: 2 }} />
            </Box>
            <Box
              sx={{ display: { xs: "none", md: "flex", alignItems: "center" } }}
              style={{ marginLeft: "100px" }}
            >
              <NavLink to="/about" style={{ textDecoration: "none" }}>
                <Button sx={{ my: 2, color: "black", textTransform: 'none' }}>
                  <Typography sx={{fontSize: "20px"}}>About Us</Typography>
                </Button>
              </NavLink>
              {!user && (
                <>
                  <NavLink to="/sign-in" style={{ textDecoration: "none" }}>
                    <Button sx={{ my: 2, color: "black", textTransform: 'none' }}>
                      <Typography sx={{fontSize: "20px"}}>Login</Typography>
                    </Button>
                  </NavLink>
                  <NavLink to="/sign-up" style={{ textDecoration: "none" }}>
                    <Button sx={{ my: 2, textTransform: 'none' }}>
                      <Typography sx={{fontSize: "20px"}}>Sign Up</Typography>
                    </Button>
                  </NavLink>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
  );
}

export default WebAppBar