import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { toast } from "react-toastify";
import axios from "axios";
import {
  Divider,
  IconButton,
  Paper,
  styled
} from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hook/useAuth.jsx";
import AppName from "../components/WebName.jsx";



export default function ForgotPassword() {

  const CustomBox = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    gap: theme.spacing(5),
    height: "100vh",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
    },
  }));

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const from = (location.state?.from?.pathname === '/auth' ? '/' : location.state?.from?.pathname) || '/';
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true)
    const formData = new FormData(event.currentTarget);
    const form = {
      email: formData.get("email")
    };

    await axios
    .post("https://classmatebe-final.onrender.com/auth/forgot-password", form, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
    .then(function (res) {
      console.log(res);
      setLoading(false)
      toast.success("We have sent an confirmation to your email. Please have a check.");
     
    })
    .catch(function (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        toast.error('Send Email Failed due to :' + error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
        toast.error('Send Email Failed');
      } 
      console.log(error.config);
      navigate("/sign-in");
    });
    } 
    
 
    

  const loginWithGoogle = async() =>{
    console.log('click')
    try{
      window.open(`https://classmatebe-final.onrender.com/auth/google/${from.replaceAll('/', '@')}`, "_self");
    }catch(error) {
      console.log(error)
    }
  }

  const loginWithFaceBook = async() => {
    try{
      window.open(`https://classmatebe-final.onrender.com/auth/facebook`, "_self");
    }catch(error) {
      console.log(error)
    }
  }




  return (
    <Box
      sx={{
        paddingTop: "8%",
        paddingBottom: "11%",
        paddingX: "10%",
        backgroundImage: "url(/assets/log-in.png)",
        backgroundRepeat: "no-repeat",
        backgroundColor: (t) =>
          t.palette.mode === "light" ? t.palette.grey[50] : t.palette.grey[900],
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        justifyContent: "center",
        display: "flex"
      }}
    >
      <CssBaseline />
      <Box
        width="100%"
        borderRadius={7}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          border: "10px solid white",
          alignItems: "center"
        }}
        component={Paper}
        elevation={6}
      >
        <Grid
          item
          container
          xs={0}
          sm={4}
          md={6}
          sx={{
            display: {
              xs: "none",
              lg: "block"
            },
           
          }}
        >
          <Box sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
          }} >
            <img alt="login" src="/assets/log-in-2.png" 
            style={{
              width: "100%"
            }}
            />
          </Box>
        </Grid>

        <Grid item xs={12} sm={8} md={6} sx={{ width: {xs: "100%", lg: "auto"}, display: "flex", flexDirection: "column", alignItems: "center"}}>
          <Box height="20%" sx={{ mt: 2, ml: 0, display: "flex", alignItems: "center",flexDirection: {xs: "column", lg: "row"}, justifyContent: "center", width: {xs: "100%", lg: "auto"} }}>
            <AppName sx={{height: "100%"}} />
            <Divider sx={{ mt: 3, mb: 3, mx:2, width: "20%", display: { xs: "none", lg: "flex" }  }} />
            <Typography sx={{fontSize: "16px", width: {xs: "50%", lg: "100%"}, textAlign: {xs: "center", lg: "right"}}} >
                {"Don't have an account ?"}
                {
                  <NavLink to="/sign-up" variant="body2">
                    {" "}
                    Sign Up
                  </NavLink>
                }
              </Typography>
          </Box>
          <Box
            sx={{
              my: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                                <LockOutlinedIcon />
                            </Avatar> */}
            <Typography component="h1" variant="h4"
            sx={{
                display: "flex",
                alignItems: "center",
                width: "50%",
                textAlign: "center"
            }}
            >
            Forgot Your Password ?
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1, width: {xs: "80%", sm: "100%"} }}
            >
              <Grid container spacing={1} sx={{justifyContent: "center", px: 2}}>
              <Grid item xs={10} sx={{mx: 12}}>
                 Enter the email address associated with your account.
                </Grid>
                <Grid item xs={10} sx={{mx: 10}}>
                  <TextField
                    InputProps={{ sx: { borderRadius: 10, paddingLeft: "20px",
                    paddingRight: "20px", } }}
                    margin="normal"
                    required
                    fullWidth
                    disabled={loading}
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    InputLabelProps={{
                      style: { marginLeft: "5px", marginRight: "5px" },
                    }}
                  />
                </Grid>
               
              </Grid>
             
              <Box sx={{ display: "flex", justifyContent: "center", p: {xs: 2, sm: 0}}}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{  mb: 2, borderRadius: 4, color: "white",
                  width: "70%"
              }}
              >
               Submit
              </Button>
              </Box>
              {/* <Copyright sx={{ mt: 5 }} /> */}
              <Typography component="p" variant="p" color="red">
                {errorMessage}
              </Typography>

              <Box
                sx={{ justifyContent: "center" }}
              >
               <Divider sx={{width: "100%", px: 20, display: "flex", justifyContent: "center", alignItems: "center"}}>
                or sign in with
               </Divider>
                <Box
                  sx={{
                    justifyContent: "center",
                    display: "flex"
                  }}
                >
                  <IconButton onClick={loginWithFaceBook} sx={{ border: 1, width: "35px", height: "35px", p: 0, m: 1 }}>
                    <img src="/assets/log-in-fb.svg" width="100%" />
                  </IconButton>
                  <IconButton onClick={loginWithGoogle} sx={{ border: 1, width: "35px", height: "35px", p: 0, m: 1 }}>
                    <img src="/assets/log-in-gg.svg" width="100%" />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Box>
    </Box>
  );
}
