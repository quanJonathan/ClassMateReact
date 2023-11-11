import { Container, Divider, Button, Box, Typography } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import AppName from "./WebName";
import { NavLink } from "react-router-dom";
import { useAuth } from "../hook/useAuth.jsx";
import useScrollPosition from "../hook/useStrollPosition.js";


function WebAppBar() {
  const { user} = useAuth();
  const scrollPosition = useScrollPosition();
  return (
      <AppBar position="fixed" 
      elevation={scrollPosition > 10 ? 4 : 0} 
      color="transparent"
      sx={{
        py: 2,
        px: "40px",
        height: "auto",
        bgcolor: scrollPosition > 10 ? "#FFF" : "transparent",
      }}>
        <Container maxWidth="x1" >
          <Toolbar disableGutters sx={{maxHeight: '10vh'}}>
            <AppName />
            <Box sx={{ flexGrow: 1 }}>
              <Divider sx={{ ml: 2, mr: 2, display: { xs: "none", md: "flex"} }} />
            </Box>
            <Box
              sx={{ display: { xs: "none", md: "flex", alignItems: "center" } }}
              style={{ marginLeft: "100px" }}
            >
              <NavLink to="/" style={{ textDecoration: "none",
              
            
            }}>
                <Button sx={{ my: 2, textTransform: 'none', 
                
              
              }}>
                  <Typography sx={{fontSize: "16px",
                      color: "black",
                     fontWeight: "medium",
                     cursor: "pointer",
                
                }}>About Us</Typography>
                </Button>
              </NavLink>
              {!user && (
                <>
                  <NavLink to="/sign-in" style={{ textDecoration: "none" }}>
                    <Button sx={{ my: 2, textTransform: 'none' }}>
                      <Typography sx={{fontSize: "16px",
                       color: "black",
                       fontWeight: "medium",
                       cursor: "pointer",
                      }}>Login</Typography>
                    </Button>
                  </NavLink>
                  <NavLink to="/sign-up" style={{ textDecoration: "none" }}>
                    <Button sx={{ my: 2, textTransform: 'none' }}>
                      <Typography sx={{fontSize: "16px",
                         fontWeight: "medium",
                         cursor: "pointer",
                    }}>Sign Up</Typography>
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