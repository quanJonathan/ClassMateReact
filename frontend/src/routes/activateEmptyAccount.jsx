import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import {
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
} from "@mui/material";
import { NavLink, useNavigate, useLocation, useParams } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import axios from "axios";
import AppName from "../components/WebName";
import { toast } from "react-toastify";
import { useAuth } from "../hook/useAuth";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function ActivateEmptyAccount() {
  let navigate = useNavigate();
  let { accountId } = useParams();
  const [valid, setValid] = useState(true);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);


  const { setTempEmail, login } = useAuth();
  const post = async (id) => {
    if (!isLoading) {
      await axios.get(`http://localhost:3001/user/get/${id}`, {

      })
        .then(function (res) {
          console.log(res);
          //toast.success("Get Successfully!");
          //navigate("/");
          setData(res.data);
        })
        .catch(function (error) {
          console.log(error)
        })
      setLoading(true);
    }
  }

  //const location = useLocation();
  //const from = (location.state?.from?.pathname === '/auth' ? '/' : location.state?.from?.pathname) || '/';
  const handleSubmit = async (event) => {
    event.preventDefault();
    // console.log({
    //     email: data.get('email'),
    //     password: data.get('password'),
    //     firstName: data.get('firstName'),
    //     lastName: data.get('lastName')
    // });
    console.log(data)

    const form = {
      _id: data._id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: email,
      password: password,
      studentId: data.studentId
    };
    if (form.firstName == "") {
      toast.warning('First Name is Required');
    } else if (form.lastName == "") {
      toast.warning('Last Name is Required');
    } else if (!valid) {
      toast.warning('Email is Invalid');
    }
    else if (form.password == "") {
      toast.warning('Password is Required');
    }
    else {
      console.log(form);
      await axios
        .post("http://localhost:3001/user/mergeEmptyAccount", form, {

        })
        .then(function (res) {
          //console.log(res.data.email);
          //setTempEmail(res.data.email);
          console.log("Merge successfully")
          toast.success("Merge successfully")
          login({
            email: email,
            password: password,
          })
        })
      //   .catch(function (error) {
      //     if (error.response) {
      //       // The request was made and the server responded with a status code
      //       // that falls out of the range of 2xx
      //       console.log(error.response.data);
      //       console.log(error.response.status);
      //       console.log(error.response.headers);
      //       toast.error('Sign Up Failed due to :' + error.response.data);
      //     } else if (error.request) {
      //       // The request was made but no response was received
      //       // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      //       // http.ClientRequest in node.js
      //       console.log(error.request);
      //       toast.error('Sign Up Failed');
      //     } else {
      //       // Something happened in setting up the request that triggered an Error
      //       console.log("Error", error.message);
      //       toast.error('Sign Up Failed');

      //     }
      //     console.log(error.config);
      //     navigate("/sign-up");
      //   });
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleValidation = (e) => {
    let regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    setValid(regEmail.test(e.target.value));
    setEmail(e.target.value);
  };

  const t = post(accountId);


  // const loginWithGoogle = async() =>{
  //   console.log('click')
  //   try{
  //     window.open(`http://localhost:3001/auth/google/${from.replaceAll('/', '@')}`, "_self");
  //   }catch(error) {
  //     console.log(error)
  //   }
  // }

  // const loginWithFaceBook = async() => {
  //   try{
  //     window.open(`http://localhost:3001/auth/facebook`, "_self");
  //   }catch(error) {
  //     console.log(error)
  //   }
  // }

  return (
    <Box
      sx={{
        paddingTop: "5%",
        paddingBottom: "3%",
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
          sm={8}
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
            <img alt="signUp" src="/assets/log-in-2.png"
              style={{
                width: "100%"
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={4} sx={{ width: { xs: "100%", lg: "auto" }, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Box height="20%" sx={{ mt: 2, ml: 0, display: "flex", alignItems: "center", flexDirection: { xs: "column", lg: "row" }, justifyContent: "center", width: { xs: "100%", lg: "auto" } }}>
            {/* <AppName sx={{height: "100%"}} /> */}
            {/* <Divider sx={{ my: 3, mx:2, width: "20%", display: { xs: "none", lg: "flex" }  }} /> */}
            {data?.email && <Typography sx={{
              fontSize: "16px", fontWeight: "bold", width: { xs: "50%", lg: "100%" },
              textAlign: { xs: "center", lg: "right" },
              color: "red"

            }} >
              {data.email + " (id = " + data.studentId + ") HAS ALREADY BEEN ACTIVATED!"}

            </Typography> }{!data?.email &&
              <Typography sx={{
                fontSize: "16px", fontWeight: "bold", width: { xs: "50%", lg: "100%" },
                textAlign: { xs: "center", lg: "right" },
                color: "red"

              }} >
                {"Please enter information to merge: (Student id = " + data?.studentId + ")"}

              </Typography>}
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
              Fill In Email
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1, width: { xs: "70%", sm: "100%" } }}
              paddingX={4}
            >
              <Grid container spacing={1} sx={{ justifyContent: "center" }}>
                <Grid item xs={10} lg={5} sx={{
                  paddingLeft: { xs: "30px !important", sm: "0px" },
                  paddingRight: { xs: "30px", sm: "0px" }
                }}>
                  <TextField
                    InputProps={{
                      sx: {
                        borderRadius: 10,
                        paddingLeft: "20px",
                        paddingRight: "20px",
                      }
                    }}
                    margin="normal"
                    autoComplete="given-name"
                    name="firstName"
                    fullWidth
                    id="firstName"
                    label="First Name"
                    disabled
                    value={data ? data?.firstName : ""}
                    autoFocus
                    InputLabelProps={{
                      style: { marginLeft: "5px", marginRight: "5px" },
                    }}
                  />
                </Grid>
                <Grid item xs={10} lg={5} sx={{
                  paddingLeft: { xs: "30px !important", sm: "0px" },
                  paddingRight: { xs: "30px", sm: "0px" }
                }}>
                  <TextField
                    InputProps={{
                      sx: {
                        borderRadius: 10,
                        paddingLeft: "20px",
                        paddingRight: "20px",
                      }
                    }}
                    margin="normal"
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    disabled
                    value={data ? data?.lastName : ""}
                    autoComplete="family-name"
                    InputLabelProps={{
                      style: { marginLeft: "5px", marginRight: "5px" },
                    }}
                  />
                </Grid>
                <Grid item xs={10} sx={{
                  paddingLeft: { xs: "30px !important", sm: "0px" },
                  paddingRight: { xs: "30px", sm: "0px" }
                }}>
                  <TextField
                    InputProps={{
                      sx: {
                        borderRadius: 10,
                        paddingLeft: "20px",
                        paddingRight: "20px",
                      }
                    }}
                    margin="normal"
                    fullWidth
                    id="studentId"
                    label="Student ID"
                    name="studentId"
                    autoComplete="studentId"
                    autoFocus
                    disabled
                    InputLabelProps={{
                      style: { marginLeft: "5px", marginRight: "5px" },
                    }}
                    value={data ? data?.studentId : ""}
                    required={true}
                    helperText={!valid ? 'Invalid Format' : ' '}
                  />
                </Grid>
                <Grid item xs={10} sx={{
                  paddingLeft: { xs: "30px !important", sm: "0px" },
                  paddingRight: { xs: "30px", sm: "0px" }
                }}>
                  <TextField
                    InputProps={{
                      sx: {
                        borderRadius: 10,
                        paddingLeft: "20px",
                        paddingRight: "20px",
                      }
                    }}
                    margin="normal"
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    InputLabelProps={{
                      style: { marginLeft: "5px", marginRight: "5px" },
                    }}
                    value={email ? email : data?.email ? data.email : ""}
                    onChange={(e) => handleValidation(e)}
                    error={!valid}
                    required={true}
                    disabled={data?.email}
                    helperText={!valid ? 'Invalid Format' : ' '}
                  />
                </Grid>
                <Grid item xs={10} sx={{
                  paddingLeft: { xs: "30px !important", sm: "0px" },
                  paddingRight: { xs: "30px", sm: "0px" }
                }}>
                  {/* <TextField
                                            InputProps={{ sx: { borderRadius: 10 } }}
                                            margin="normal"
                                            required
                                            fullWidth
                                            name="password"
                                            label="Password"
                                            type="password"
                                            id="password"
                                            autoComplete="current-password"
                
                                        /> */}
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
                      sx={{
                        borderRadius: 10,
                        paddingLeft: "20px",
                        paddingRight: "20px",
                      }}
                      id="outlined-adornment-password"
                      type={showPassword ? "text" : "password"}
                      value={data?.password ? "xxxxxx" : password ? password : ""}
                      disabled={data?.password}
                      onChange={(e) => setPassword(e.target.value)}
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
              </Grid>
              {/* <Box sx={{ display: "flex", justifyContent: "space-between" }} >
                                    <FormControlLabel
                                        control={<Checkbox value="remember" color="primary" />}
                                        label="Sign me in!"
                                    />
                                    <Link href="#" variant="body2" alignSelf="center">
                                        Forgot password?
                                    </Link>
                                </Box> */}
              <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
                {(data && !data?.password) && <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, borderRadius: 4, color: "white", width: "70%" }}
                >
                  Sign Up
                </Button>
                }
              </Box>
              {/* <Copyright sx={{ mt: 5 }} /> */}

              <Box
                sx={{ justifyContent: "center" }}
              >
                <Divider sx={{ width: "100%", px: 20, display: "flex", justifyContent: "center", alignItems: "center" }}>
                </Divider>
                <Box
                  sx={{
                    justifyContent: "center",
                    display: "flex"
                  }}
                >
                  {/* <IconButton onClick={loginWithGoogle} sx={{ border: 1, width: "35px", height: "35px", p: 0, m: 1 }}>
                    <img src="/assets/log-in-gg.svg" width="100%" />
                  </IconButton>
                  <IconButton onClick={loginWithFaceBook} sx={{ border: 1, width: "35px", height: "35px", p: 0, m: 1 }}>
                    <img src="/assets/log-in-fb.svg" width="100%" />
                  </IconButton> */}
                </Box>
              </Box>


            </Box>
          </Box>
        </Grid>
      </Box>
    </Box>
  );
}
