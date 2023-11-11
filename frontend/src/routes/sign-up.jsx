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
import { NavLink, useNavigate } from "react-router-dom";
import { ArrowBack, Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import axios from "axios";

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

export default function SignUp() {
  let navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // console.log({
    //     email: data.get('email'),
    //     password: data.get('password'),
    //     firstName: data.get('firstName'),
    //     lastName: data.get('lastName')
    // });

    const form = {
      fullname: data.get("firstName") + " " + data.get("lastName"),
      email: data.get("email"),
      password: data.get("password"),
    };

    await axios
      .post("http://localhost:3001/auth/signUp", form, {headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Origin': '*',
      }})
      .then(function (res) {
        console.log(res);
        navigate("/");
      })
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
        console.log(error.config);
        navigate('/sign-up')
      });
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Grid
        container
        component="main"
        sx={{
          paddingY: "5%",
          paddingX: "10%",

          backgroundImage: "url(../src/assets/log-in.png)",
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "100%",
          backgroundPosition: "center",
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
              // backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
              backgroundImage: "url(../src/assets/log-in-2.png)",

              backgroundRepeat: "no-repeat",

              backgroundSize: "70%",
              backgroundPosition: "center",
            }}
          >
            <Grid item xs={12}>
              <IconButton sx={{ mt: 2 }}>
                {/* <img width={30} src="../src/assets/log-in-gg.svg" /> */}
                <NavLink to="/" variant="body2">
                  <ArrowBack color="primary" />
                </NavLink>
              </IconButton>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={8} md={6} sx={{ mr: 4 }}>
            <Grid container height="50px" spacing={1} sx={{ mt: 2, ml: 0 }}>
              <Grid
                item
                onClick={() => navigate("/")}
                xs={2}
                sm={2}
                sx={{
                  // backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
                  backgroundImage: "url(../src/assets/appName.svg)",

                  backgroundRepeat: "no-repeat",

                  backgroundPosition: "center",
                }}
              />
              <Grid item sm={4}>
                <Divider sx={{ mt: 3, mb: 3 }} />
              </Grid>
              <Grid item sm={6}>
                <Typography sx={{ mt: 1, mb: 1 }} align="center">
                  {"Already have an account?"}
                  {
                    <NavLink to="/sign-in" variant="body2">
                      {" "}
                      Sign In
                    </NavLink>
                  }
                </Typography>
              </Grid>
            </Grid>
            <Box
              sx={{
                my: 4,
                mr: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                                <LockOutlinedIcon />
                            </Avatar> */}
              <Typography component="h1" variant="h3" sx={{ my: 2 }}>
                Sign Up
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 1 }}
                paddingX={4}
              >
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={6} pl={0}>
                    <TextField
                      InputProps={{ sx: { borderRadius: 10 } }}
                      margin="normal"
                      autoComplete="given-name"
                      name="firstName"
                      required
                      fullWidth
                      id="firstName"
                      label="First Name"
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      InputProps={{ sx: { borderRadius: 10 } }}
                      margin="normal"
                      required
                      fullWidth
                      id="lastName"
                      label="Last Name"
                      name="lastName"
                      autoComplete="family-name"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      InputProps={{ sx: { borderRadius: 10 } }}
                      margin="normal"
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12}>
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
                      <InputLabel htmlFor="outlined-adornment-password">
                        Password
                      </InputLabel>
                      <OutlinedInput
                        name="password"
                        sx={{ borderRadius: 10 }}
                        id="outlined-adornment-password"
                        type={showPassword ? "text" : "password"}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
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

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, borderRadius: 4, color: "white" }}
                >
                  Sign Up
                </Button>

                {/* <Copyright sx={{ mt: 5 }} /> */}

                <Grid
                  container
                  spacing={1}
                  sx={{ mt: 2, ml: 0, justifyContent: "center" }}
                >
                  <Grid item sm={4}>
                    <Divider sx={{ mt: 3, mb: 3 }} />
                  </Grid>
                  <Grid item sm={4}>
                    <Typography sx={{ mt: 1, mb: 1 }} align="center">
                      {"or sign up with"}
                    </Typography>
                  </Grid>
                  <Grid item sm={4}>
                    <Divider sx={{ mt: 3, mb: 3 }} />
                  </Grid>
                  <Grid
                    item
                    container
                    sx={{
                      justifyContent: "center",
                      alignContent: "space-around",
                    }}
                  >
                    <IconButton sx={{ border: 1 }}>
                      <img src="../src/assets/log-in-gg.svg" />
                    </IconButton>
                    <IconButton sx={{ border: 1 }}>
                      <img src="../src/assets/log-in-fb.svg" />
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Box>
      </Grid>
    </>
  );
}
