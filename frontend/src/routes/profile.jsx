import {
  Avatar,
  Button,
  Typography,
  TextField,
  Grid,
  CssBaseline,
} from "@mui/material";
import { useState } from "react";
import { useAuth } from "../hook/useAuth";
import { Box, Container } from "@mui/system";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MiniDrawer from "../components/Drawer";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const [isView, setIsView] = useState(true);
  const { token, updateUser, user } = useAuth();
  const navigate = useNavigate();
  const [checkFirstName, setCheckFirstName] = useState("");
  const [checkLastName, setCheckLastName] = useState("");
  const [checkPhone, setCheckPhone] = useState("");
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [address, setAddress] = useState(user?.address || "");
  const [studentId, setStudentId] = useState(user?.studentId || "");

  const handleForm = async (event) => {
    event.preventDefault();
    if (isView) {
      setIsView(false);
    } else {
      const formData = new FormData(event.currentTarget);
      const form = {
        email: user.email,
        firstName: formData.get("firstName").trim(),
        lastName: formData.get("lastName").trim(),
        phoneNumber: formData.get("phoneNumber"),
        address: formData.get("address"),
        studentId: formData.get("studentId"),
      };
      // console.log(form)

      if (form.firstName == "") {
        toast.warning("First Name is Required");
      } else if (form.lastName == "") {
        toast.warning("Last Name is Required");
      } else {
        setIsView(true);
        await axios
          .post("https://classmatebe-final.onrender.com/auth/profile/update", form, {
            headers: {
              Authorization: "Bearer " + token.refreshToken,
            },
          })
          .then(function (res) {
            console.log(res);

            // navigate("/user/profile");
            updateUser(form);
            // window.location.reload();
            toast.success("Edit Profile Successfully!");
          })
          .catch(function (error) {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
              toast.error("Change data Failed due to :" + error.response.data);
            } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              console.log(error.request);
              toast.error("Change data Failed " + error.request);
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log("Error", error.message);
              toast.error("Change Data Failed " + error.message);
            }
            console.log(error.config);
            navigate("/user/profile");
          });
      }
    }
  };

  const handleChange = (e) => {
    const inputValue = e.target.value;
    if (e.target.id == "firstName") {
      if (inputValue.length <= 30) {
        setCheckFirstName("");
      } else {
        setCheckFirstName("The First Name can't be over 30 characters");
      }
      setFirstName(e.target.value);
    } else if (e.target.id == "lastName") {
      if (inputValue.length <= 30) {
        setCheckLastName("");
      } else {
        setCheckLastName("Last Name can't be over 30 characters");
      }
      setLastName(e.target.value);
    } else if (e.target.id == "phoneNumber") {
      let regPhone = /((^(\+84|84|0|0084){1})(3|5|7|8|9))+([0-9]{8})$/;
      if (regPhone.test(e.target.value)) {
        setCheckPhone("");
      } else {
        setCheckPhone("Phone Number Wrong Format");
      }
      setPhoneNumber(e.target.value);
    }
  };

  return (
    <MiniDrawer profile="true" page="Profile">
      <Container component="main" maxWidth="sm" height="100vh">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Avatar
            sx={{ m: 1, bgcolor: "secondary.main", marginTop: "4vh" }}
          ></Avatar>
          <Box
            component="form"
            onSubmit={handleForm}
            noValidate
            sx={{ mt: 1, mr: 5, ml: { xs: "50px", md: 5 } }}
          >
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6} pl={0}>
                <TextField
                  InputProps={{
                    sx: {
                      borderRadius: 10,
                      paddingLeft: "20px",
                      paddingRight: "20px",
                      maxLength: 30,
                    },
                  }}
                  margin="normal"
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  value={firstName}
                  autoFocus
                  InputLabelProps={{
                    style: { marginLeft: "5px", marginRight: "5px" },
                  }}
                  error={!!checkFirstName}
                  helperText={checkFirstName}
                  onChange={handleChange}
                  disabled={isView}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  InputProps={{
                    sx: {
                      borderRadius: 10,
                      paddingLeft: "20px",
                      paddingRight: "20px",
                      maxLength: 30,
                    },
                  }}
                  margin="normal"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  value={lastName}
                  autoFocus
                  error={!!checkLastName}
                  helperText={checkLastName}
                  onChange={handleChange}
                  disabled={isView}
                  InputLabelProps={{
                    style: { marginLeft: "5px", marginRight: "5px" },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  InputProps={{
                    sx: {
                      borderRadius: 10,
                      paddingLeft: "20px",
                      paddingRight: "20px",
                    },
                  }}
                  margin="normal"
                  fullWidth
                  id="phoneNumber"
                  label="Tel"
                  name="phoneNumber"
                  autoComplete="phone"
                  value={phoneNumber}
                  autoFocus
                  error={!!checkPhone}
                  helperText={checkPhone}
                  onChange={handleChange}
                  disabled={isView}
                  InputLabelProps={{
                    style: { marginLeft: "5px", marginRight: "5px" },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  InputProps={{
                    sx: {
                      borderRadius: 10,
                      paddingLeft: "20px",
                      paddingRight: "20px",
                    },
                  }}
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
                  InputLabelProps={{
                    style: { marginLeft: "5px", marginRight: "5px" },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  InputProps={{
                    sx: {
                      borderRadius: 10,
                      paddingLeft: "20px",
                      paddingRight: "20px",
                    },
                  }}
                  margin="normal"
                  fullWidth
                  id="studentId"
                  label="Student ID"
                  name="studentId"
                  autoComplete="studentId"
                  autoFocus
                  onChange={(e) => setStudentId(e.target.value)}
                  value={studentId}
                  disabled={user?.studentId ? false && !isView : true && isView}
                  InputLabelProps={{
                    style: { marginLeft: "5px", marginRight: "5px" },
                  }}
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
    </MiniDrawer>
  );
}
