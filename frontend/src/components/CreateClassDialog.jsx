import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
} from "@mui/material";
import { useRef, useState } from "react";
import { useAuth } from "../hook/useAuth";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { mutate } from "swr";

export default function CreateClassDialog({ isOpen, handleClose }) {
  const { id } = useParams();
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const form = {
      class: {
        className: data.get("className"),
        description: data.get("description"),
      },
      user: user._id,
    };
    if (form.className == "") {
      toast.warning("Class Name is Required");
    } else {
      setLoading(true);
      await axios
        .post("http://localhost:3001/class/addClass", form, {
          headers: {
            Authorization: "Bearer " + token?.refreshToken,
          },
        })
        .then(function (res) {
          console.log(res);
          setLoading(false);
          toast.success("Create Class Successfully!");
          handleClose();
          // mutate("http://localhost:3001/auth/profile");
        })
        .catch(function (error) {
          if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
            toast.error("Create Class Failed due to :" + error.response.data);
          } else if (error.request) {
            console.log(error.request);
            toast.error("Create Class Failed");
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
            toast.error("Create Class Failed");
          }
          console.log(error.config);
        });
    }
  };

  return (
    <div>
      <Dialog open={isOpen} onClose={handleClose}>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{ padding: 4 }}
        >
          <DialogTitle>Create Class</DialogTitle>

          <DialogContent>
            <TextField
              InputProps={{
                sx: {
                  paddingLeft: "20px",
                  paddingRight: "20px",
                },
              }}
              margin="normal"
              fullWidth
              id="className"
              label="Class Name"
              name="className"
              autoFocus
              InputLabelProps={{
                style: { marginLeft: "5px", marginRight: "5px" },
              }}
              required={true}
            />
            <TextField
              InputProps={{
                sx: {
                  paddingLeft: "20px",
                  paddingRight: "20px",
                },
              }}
              margin="normal"
              fullWidth
              id="description"
              label="Description"
              name="description"
              autoFocus
              InputLabelProps={{
                style: { marginLeft: "5px", marginRight: "5px" },
              }}
            />
          </DialogContent>

          <DialogActions>
            <Button variant="contained" type="submit" disabled={loading}>
              Submit
            </Button>
            <Button onClick={() => handleClose()} disabled={loading}>
              Cancel
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </div>
  );
}
