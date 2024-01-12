import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import axios from "axios";

import { Paper } from "@mui/material";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../hook/useAuth.jsx";
import AppName from "../components/WebName.jsx";

async function post(email) {
  console.log(email);
  return await axios
    .post(
      "https://classmatebe-final.onrender.com/email-confirmation/resend-confirmation-link",
      { email: email },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Access-Control-Allow-Origin": "*",
        },
      }
    )
    .then(function (res) {
      //console.log(res);
      toast.success("Email Sent Successfully!");
      //navigate("/");
    })
    .catch(function (error) {
      console.log(error);
    });
}

export default function ConfirmEmail() {
  let { tempEmail, user } = useAuth();
  //let {token} = useParams();
  console.log(tempEmail);
  //const email = user?.email;
  //console.log(user.email);
  //post(user.email);

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
          padding: "20px",
        }}
        component={Paper}
        elevation={6}
      >
        <Grid
          sx={{
            width: { xs: "100%", lg: "auto" },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              mt: 2,
              ml: 0,
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              justifyContent: "center",
              width: { xs: "100%", lg: "auto" },
            }}
          >
            <AppName sx={{ height: "100%" }} />
            <Typography
              sx={{
                fontSize: "16px",
                width: "100%",
                textAlign: { xs: "center" },
              }}
            >
              {`Email has been sent ${user ? user.email : tempEmail}.`}
            </Typography>
            <Button onClick={() => post(user ? user.email : tempEmail)}>
              Resend Email
            </Button>
          </Box>

          <Typography
            sx={{
              fontSize: "16px",
              width: { xs: "50%", lg: "100%" },
              textAlign: { xs: "center" },
            }}
          >
            {
              <NavLink to="/sign-in" variant="body2">
                {" "}
                Return to Sign In.
              </NavLink>
            }
          </Typography>
        </Grid>
      </Box>
    </Box>
  );
}
