import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import axios from "axios"

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
import { NavLink } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../hook/useAuth.jsx";
import AppName from "../components/WebName.jsx";

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

async function post(email) {
  console.log(email);
  return await axios
  .post("http://localhost:3001/email-confirmation/resend-confirmation-link", {email: email}, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Access-Control-Allow-Origin": "*",
    },
  })
  .then(function (res) {
    //console.log(res);
    toast.success("Email Sent Successfully!");
    //navigate("/");
  })
  .catch(function (error) {
    console.log(error)
  })
}

export default function ConfirmEmail() {

  let {tempEmail, user} = useAuth();
  //let {token} = useParams();
  console.log(tempEmail);
  //const email = user?.email;
  //console.log(user.email);
  //post(user.email);

  return (
    <Box
      sx={{
        paddingTop: "4%",
        paddingBottom: "6%",
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
          border: "10px solid white",
          alignContent: "center"
        }}
        component={Paper}
        elevation={6}
      >

        <Grid sx={{ width: {xs: "100%", lg: "auto"}, display: "flex", flexDirection: "column", alignItems: "center"}}>
          <Box sx={{ mt: 2, ml: 0, display: "flex", alignItems: "center",flexDirection: {xs: "column", lg: "row"}, justifyContent: "center", width: {xs: "100%", lg: "auto"} }}>
            <AppName sx={{height: "100%"}} />
            <Typography sx={{fontSize: "16px", width: {xs: "50%", lg: "100%"}, textAlign: {xs: "center"}}} >
                {`Email has been sent ${user ? user.email : tempEmail}.`}

              </Typography>
              <Button onClick={() =>  post(user ? user.email : tempEmail) } >Resend Email</Button>
              <Typography sx={{fontSize: "16px", width: {xs: "50%", lg: "100%"}, textAlign: {xs: "center"}}} >
                {
                  <NavLink to="/sign-in" variant="body2">
                    {" "}
                    Return to Sign in.
                  </NavLink>
                
                }
              </Typography>
          </Box>

        </Grid>
      </Box>
    </Box>
  );
}
