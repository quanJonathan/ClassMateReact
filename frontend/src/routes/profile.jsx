import {
  Avatar,
  Button,
  FormControlLabel,
  Typography,
  TextField,
  Grid,
  InputLabel,
  FormControl,
  CssBaseline,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAuth } from "../hook/useAuth";
import { Box, Container } from "@mui/system";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import lodash from 'lodash'

export default function ProfilePage() {
  const [isView, setIsView] = useState(true);
  const { token, updateUser, user} = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState(user?.firstName || "")
  const [lastName, setLastName] = useState(user?.lastName || "")
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "")
  const [address, setAddress] = useState(user?.address || "")

  console.log(user)

  // console.log(user);

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const { data } = await axios.get(
  //         `http://127.0.0.1:3001/auth/profile/${user?.email}`,
  //         {
  //           headers: {
  //             Authorization: "Bearer " + token,
  //           },
  //         }
  //       );
  //       console.log(data);
  //       // updateUser(data);
  //     } catch (exception) {
  //       console.log(exception);
  //       //navigate('/')
  //     }
  //   }
  //   fetchData();
  //   console.log(user);
  // }, [updateUser, navigate, token]);

  const handleForm = async (event) => {
    event.preventDefault();
    if (isView) {
      setIsView(false);
    } else {
      setIsView(true);
      const formData = new FormData(event.currentTarget);
      const form = {
        email: user.email,
        firstName: formData.get("firstName").trim(),
        lastName: formData.get("lastName").trim(),
        phoneNumber: formData.get("phoneNumber"),
        address: formData.get("address"),
      };
      console.log(form)
      updateUser(form);
      await axios
        .post("http://localhost:3001/auth/profile/update", form, {
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
      <CssBaseline/>
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
                  value={firstName}
                  autoFocus
                  onChange={(e) => setFirstName(e.target.value)}
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
                value={lastName}
                autoFocus
                onChange={(e) => setLastName(e.target.value)}
                disabled = {isView}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                InputProps={{ sx: { borderRadius: 10 } }}
                margin="normal"
                fullWidth
                id="phoneNumber"
                label="Tel"
                name="phoneNumber"
                autoComplete="phone"
                value={phoneNumber}
                autoFocus
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={isView}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                InputProps={{ sx: { borderRadius: 10 } }}
                margin="normal"
                fullWidth
                id="address"
                label="Address"
                name="address"
                autoComplete="address"
                autoFocus
                onChange={(e) => setAddress(e.target.value)}
                value={address}
                disabled={isView}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
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
