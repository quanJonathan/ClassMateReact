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
  InputAdornment,
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
import { Close, ContentCopy, InsertLink } from "@mui/icons-material";
import { Box, Stack } from "@mui/system";
import { useAuth } from "../hook/useAuth";
import { stringAvatar } from "../helpers/stringAvator";
import axios, { HttpStatusCode } from "axios";
import { toast } from "react-toastify";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function GradeReviewDialog({ open, handleClose, assignment }) {
  const { user, token } = useAuth();
  const [expected, setExpected] = useState("");
  const [explanation, setExplanation] = useState("");
  const [error, setError] = useState("");

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const handleClear = () => {
    setExpected("")
    setExplanation("")
    handleClose()
  }

  const handleSave = async () => {
    if (expected == "") {
      toast.warning("Expected Grade Required!");
    } else if (explanation == "") {
      toast.warning("Explanation Required!");
    } else {
      try {
        const response = await axios.post(
          `http://localhost:3001/gradeReview/add/h/${assignment?._id}`,
          {
            gradeReview: {
              expectedGrade: expected,
              studentExplanation: explanation,
              user: [user],
              teacherComment: [],
            },
            user: user._id,
          },
          {
            headers: {
              Authorization: "Bearer " + token.refreshToken,
            },
          }
        );

        if (response.status === HttpStatusCode.Ok || response.status === 201) {
          handleClear();
        }
      } catch (error) {
        console.error("Review grade failed:", error);
        toast.error("Review grade Failed");
      }
    }
  };

  const handleValidation = (e) => {
    var regex = /^([0-9]*[.])?[0-9]+$/;
    const text = e.target.value;
    if (!regex.test(text)) {
      setError("Invalid Format");
    } else {
      if (parseFloat(text) > assignment?.maxScore) {
        console.log(assignment?.maxScore);
        setError("Expected Grade must be lower than the max score");
      } else {
        setError("");
      }
    }
    setExpected(e.target.value);
  };

  const handleHomework = (homework) => {
    const foundUser = homework?.doneMembers?.find(
      (m) => m.memberId === user._id
    );
    // console.log("homework");
    // console.log(homework);
    // console.log(foundUser);
    if (foundUser && foundUser.state == "final") {
      return `${foundUser.score}/${homework.maxScore}`;
    } else if (foundUser && foundUser.state == "pending") {
      return "Delivered";
    } else {
      return "";
    }
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClear}
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
            onClick={handleClear}
            aria-label="close"
          >
            <Close />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Grade Review
          </Typography>
          <Button
            autoFocus
            variant="contained"
            onClick={handleSave}
            disabled={!/^([0-9]*[.])?[0-9]+$/.test(expected)}
          >
            Send
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

        <Box
          sx={{
            width: 600,
            maxWidth: "95%",
            mt: 2,
            height: 180,
            minHeight: 180,
          }}
        >
          <Typography variant="h5" component="div">
            {assignment?.name}
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Typography sx={{ color: "gray" }}>
              {assignment?.composition?.name}
            </Typography>
            <Typography sx={{ pl: 5, fontSize: "15px", fontWeight: "600" }}>
              Grade: {handleHomework(assignment)}
            </Typography>
          </Box>
          <Divider sx={{ my: 3 }} />
          <Typography>Expected Grade</Typography>
          <Box
            sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
          >
            <TextField
              variant="standard"
              InputProps={{
                sx: {
                  paddingLeft: "20px",
                  paddingRight: "20px",
                  disableUnderline: false,
                },
              }}
              margin="normal"
              type="text"
              fullWidth
              id="expectedGrade"
              name="expectedGrade"
              autoFocus
              value={expected}
              maxRows={1}
              error={!!error}
              helperText={error}
              onChange={handleValidation}
              InputLabelProps={{
                style: { marginLeft: "5px", marginRight: "5px" },
              }}
              required={true}
            />
            <Typography>/{assignment?.maxScore}</Typography>
          </Box>
          <Typography sx={{ my: 2 }}>Explanation</Typography>
          <TextField
            id="explanation"
            value={explanation}
            fullWidth
            rows={4}
            multiline
            onChange={(e) => setExplanation(e.target.value)}
          />
        </Box>

        {/* <Typography>How to join a class</Typography> */}
      </DialogContent>
    </Dialog>
  );
}
