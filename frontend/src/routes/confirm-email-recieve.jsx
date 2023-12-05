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
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  styled
} from "@mui/material";
import { NavLink, useParams } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useAuth } from "../hook/useAuth.jsx";
import AppName from "../components/WebName.jsx";
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

async function post(refreshToken) {
  return await axios
  .post("http://localhost:3001/email-confirmation/verify", {token: refreshToken}, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Access-Control-Allow-Origin": "*",
    },
  })
  .then(function (res) {
    //console.log(res);
    toast.success("Confirm Successfully!");
    //navigate("/");
  })
  .catch(function (error) {
    //console.log(error)
  })
}

export default function ConfirmEmailRecieve() {

  //let {user} = useAuth();
  let {refreshToken,} = useParams();
  //console.log(useParams());

  //console.log(refreshToken);
  post(refreshToken);

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

  const { login, loginWithGoogle, loginWithFaceBook } = useAuth();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const form = {
      email: formData.get("email"),
      password: formData.get("password"),
      save: formData.get("remember-me"),
    };

    login(form);

    // console.log({
    //     email: data.get("email"),
    //     password: data.get("password"),
    //     save: data.get("remember-me")
    // });

  };

  const handleGoogleLogin = async() =>{
    loginWithGoogle();
  }

  const handleFacebookLogin = async() => {
    loginWithFaceBook();
  }

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };


  return (
    <Box
    sx={{
      height: "100vh",
      paddingX: "10%",
      backgroundImage: "url(/assets/log-in.png)",
      backgroundRepeat: "no-repeat",
      backgroundColor: (t) =>
        t.palette.mode === "light" ? t.palette.grey[50] : t.palette.grey[900],
      backgroundSize: "100% 100%",
      backgroundPosition: "center",
      justifyContent: "center",
      display: "flex",
      alignItems: "center",
    }}
  >
    <CssBaseline />
    <Box
        width="100%"
        height="fit-content"
        borderRadius={7}
        sx={{
          border: "10px solid white",
          alignContent: "center",
          padding: "20px"
        }}
        component={Paper}
        elevation={6}
      >

        <Grid sx={{ width: {xs: "100%", lg: "auto"}, display: "flex", flexDirection: "column", alignItems: "center"}}>
          <Box sx={{ mt: 2, ml: 0, display: "flex", alignItems: "center",flexDirection: "column", justifyContent: "center", width: {xs: "100%", lg: "auto"} }}>
            <AppName sx={{height: "100%"}} />
            <Typography sx={{fontSize: "16px", width: {xs: "50%", lg: "100%"}, textAlign: {xs: "center"}}} >
                {`Email has been confirmed!`}
              
                {
                  <NavLink to="/" variant="body2">
                    {" "}
                    Return to homepage.
                  </NavLink>
                
                }
              </Typography>
          </Box>

        </Grid>
      </Box>
    </Box>
  );
}
