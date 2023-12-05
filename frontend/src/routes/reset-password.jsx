import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import {
  Divider,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  styled
} from "@mui/material";
import { NavLink, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useAuth } from "../hook/useAuth.jsx";
import AppName from "../components/WebName.jsx";
import { toast } from "react-toastify";
import axios from "axios";

export default function ResetPassword() {
    const navigate = useNavigate();
    let { token } = useParams();
    console.log(token)
   
    // useEffect(() => {
    //     if (!token) {
    //       toast.error("Expired Token. Please try again")
    //       navigate("/sign-in", { replace: true });
    //       console.log("expired!")
    //     }
    //     else {
    //         console.log(token)
    //     }
    // }, [token]);

   


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

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("");
  const location = useLocation();
  const from = (location.state?.from?.pathname === '/auth' ? '/' : location.state?.from?.pathname) || '/';
  const handleReset = async (event) => {
    event.preventDefault();
    setLoading(true)
    const formData = new FormData(event.currentTarget);
    if (password === confirmPassword){
    const form = {
      password: formData.get("password"),
      token: token
    };
    await axios
    .post("https://classmatebe-authentication/auth/reset-password", form, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
    .then(function (res) {
      console.log(res);
      setLoading(false)
      toast.success("Reset Password Successfully");
      navigate("/sign-in");
    })
    .catch(function (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        toast.error('Reset Password Failed due to :' + error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
        toast.error('Reset Password Failed');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
        toast.error('Reset Password Failed');

      }
      console.log(error.config);
      navigate("/sign-in");
    });
    } 
    
    else {
        toast.warning('Confirm Password Not Match!');
    }
    

    // console.log({
    //     email: data.get("email"),
    //     password: data.get("password"),
    //     save: data.get("remember-me")
    // });

  };

  const [valid, setValid] = useState(true)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const handlePassword = (e) => {
    setPassword(e.target.value)
  }


  const handleValidation = (e) => {
    setConfirmPassword(e.target.value);
    setValid(e.target.value === password);
  };

  const loginWithGoogle = async() =>{
    console.log('click')
    try{
      window.open(`https://classmatebe-authentication/auth/google/${from.replaceAll('/', '@')}`, "_self");
    }catch(error) {
      console.log(error)
    }
  }

  const loginWithFaceBook = async() => {
    try{
      window.open(`https://classmatebe-authentication/auth/facebook`, "_self");
    }catch(error) {
      console.log(error)
    }
  }

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowPassword2 = () => setShowPassword2((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };


  return (
    <Box
      sx={{
        paddingTop: "8%",
        paddingBottom: "7%",
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
            <Typography component="h1" variant="h4">
              Reset Password
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleReset}
              sx={{ mt: 1, width: {xs: "80%", sm: "100%"} }}
            >
              <Grid container spacing={1} sx={{justifyContent: "center", px: 4}}>
                <Grid item xs={10} sx={{mx: 10, mb: 2}}>
                  <FormControl fullWidth required variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password" 
                    sx={{
                      marginLeft: "5px", marginRight: "5px"
                    }}
                    >
                      Password
                    </InputLabel>
                    <OutlinedInput
                      name="password"
                      sx={{ borderRadius: 10,
                        paddingLeft: "20px",
                        paddingRight: "20px",
                      }}
                      id="outlined-adornment-password"
                      type={showPassword ? "text" : "password"}
                      onChange={handlePassword}
                      disabled={loading}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={10} sx={{mx: 10, mb: 4}}>
                  <FormControl fullWidth required variant="outlined" >
                    <InputLabel htmlFor="outlined-adornment-password" 
                    sx={{
                      marginLeft: "5px", marginRight: "5px"
                    }}
                    >
                      Confirm Password
                    </InputLabel>
                    <OutlinedInput
                      name="confirm-password"
                      disabled={loading}
                      sx={{ borderRadius: 10,
                        paddingLeft: "20px",
                        paddingRight: "20px",
                      }}
                      id="outlined-adornment-password"
                      type={showPassword2 ? "text" : "password"}
                      error={!valid}
                      onChange={(e) => handleValidation(e)}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword2}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword2 ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="ConfirmPassword"
                    />
                    {!valid && (
                            <FormHelperText error id="accountId-error">
                            Not Matching
                            </FormHelperText>
                            )}
                  </FormControl>
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
                Reset
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
