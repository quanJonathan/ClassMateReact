import {
  Avatar,
  Button,
  FormControlLabel,
  Typography,
  TextField,
  Grid,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAuth } from "../hook/useAuth";
import { Box, Container } from "@mui/system";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProfilePage() {
  const [isView, setIsView] = useState(true);
  const {token, updateUser, user} = useAuth();
  const navigate = useNavigate();
  console.log(user)

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get(`http://127.0.0.1:3001/auth/profile/${user.email}`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        console.log(data)
        updateUser(data);
      } catch(exception) {
       console.log(exception)
       //navigate('/')
      }
    }
    fetchData();
    console.log(user)
  }, [updateUser, navigate, token]);


  const handleForm = async (event) => {
    event.preventDefault();
    if (isView) {
      setIsView(false);
    } else {
      setIsView(true);
      const formData = new FormData(event.currentTarget);
      const form = {
        email: user.email,
        fullname: formData.get("firstName") + " " + formData.get("lastName"),
        phoneNumber: formData.get("tel"),
        address: formData.get("address"),
      };
      updateUser(form);
      await axios
        .post("http://localhost:3001/user/update", form, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then(function (res) {
          console.log(res);
          // navigate("/user/profile");
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
          navigate("/user/profile");
        });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}></Avatar>
        <Box component="form" onSubmit={handleForm} noValidate sx={{ mt: 1 }}>
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
                defaultValue={user.fullname}
                autoFocus
                disabled={isView}
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
                defaultValue={user.fullname}
                disabled={isView}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                InputProps={{ sx: { borderRadius: 10 } }}
                margin="normal"
                required
                fullWidth
                id="email"
                label="Tel"
                name="telephone"
                autoComplete="phone"
                defaultValue={user.phone}
                autoFocus
                disabled={isView}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                InputProps={{ sx: { borderRadius: 10 } }}
                margin="normal"
                required
                fullWidth
                id="email"
                label="Address"
                name="telephone"
                autoComplete="address"
                autoFocus
                defaultValue={user.address}
                disabled={isView}
              />
            </Grid>
          </Grid>
          <Button
            onClick={handleForm}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {isView && <Typography>Edit</Typography>}
            {!isView && <Typography>Save</Typography>}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}