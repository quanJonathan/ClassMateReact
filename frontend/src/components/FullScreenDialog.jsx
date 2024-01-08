import {
  AppBar,
  Avatar,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Slide,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { forwardRef, useState } from "react";
import { Close, ContentCopy, Http, InsertLink } from "@mui/icons-material";
import { Box, Stack } from "@mui/system";
import { useAuth } from "../hook/useAuth";
import { stringAvatar } from "../helpers/stringAvator";
import axios, { HttpStatusCode } from "axios";
import { toast } from "react-toastify";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog({ open, handleClose }) {
  const { user, token } = useAuth();
  const [classId, setClassId] = useState("");
  const [error, setError] = useState("");
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const handleSave = async () => {
    try {
      const response = await axios.post(
        `https://classmatebe-final.onrender.com/class/joinClassWithId/${classId}`,
        user,
        {
          headers: {
            Authorization: "Bearer " + token.refreshToken,
          },
        }
      );

      if (
        response.status === HttpStatusCode.Accepted ||
        response.status === HttpStatusCode.Ok
      ) {
        handleClose();
      }
    } catch (error) {
      console.error("Join class failed:", error);
      toast.error("Join class Failed");
    }
  };

  const handleChange = (e) => {
    const inputValue = e.target.value;

    if (inputValue.length <= 6) {
      setClassId(inputValue);
      setError("");
    } else {
      setError(
        "The Id has 6 digits including character and number with no spacing"
      );
    }
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar
        sx={{
          position: "relative",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <Close />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Join class
          </Typography>
          <Button
            autoFocus
            variant="contained"
            onClick={handleSave}
            disabled={classId.length!=6}
          >
            Save
          </Button>
        </Toolbar>
      </AppBar>
      <DialogContent
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          minHeight: "80vh",
          flexGrow: 1,
        }}
      >
        <Card
          sx={{
            width: 600,
            maxWidth: "95%",
            height: 100,
            minHeight: 100,
          }}
        >
          <CardContent>
            <Typography variant="body1" color="text.secondary">
              You are logged in with
            </Typography>
            <Stack
              direction={isSmallScreen ? "column" : "row"}
              alignItems="center"
              spacing={2}
            >
              <Avatar
                {...stringAvatar(
                  user ? `${user.firstName} ${user.lastName}` : "Default Name"
                )}
                size="large"
                edge="end"
                color="inherit"
              />
              <div>
                <Typography variant="h7" sx={{ fontWeight: "bold" }}>
                  {user?.firstName + " " + user?.lastName}
                </Typography>
                <Typography variant="body1">{user?.email}</Typography>
              </div>
            </Stack>
          </CardContent>
        </Card>

        <Card
          sx={{
            width: 600,
            maxWidth: "95%",
            mt: 2,
            height: 180,
            minHeight: 180,
          }}
        >
          <CardContent>
            <Typography variant="h6">Class ID</Typography>
            <Typography>
              Ask your teacher for ID then enter it down below
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              value={classId}
              variant="outlined"
              label="Class ID"
              sx={{ mt: 1, minWidth: "50%", width: 200 }}
              inputProps={{
                maxLength: 6,
              }}
              error={!!error}
              helperText={error}
              onChange={handleChange}
            />
          </CardContent>
        </Card>

        {/* <Typography>How to join a class</Typography> */}
      </DialogContent>
    </Dialog>
  );
}
