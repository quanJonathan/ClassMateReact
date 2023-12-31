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
  Select,
  Slide,
  Switch,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { forwardRef, useState } from "react";
import { Close, Delete } from "@mui/icons-material";
import { Box, Stack } from "@mui/system";
import { useAuth } from "../hook/useAuth";
import { stringAvatar } from "../helpers/stringAvator";
import { toast } from "react-toastify";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SettingDialog({ open, handleClose }) {
  const { user, token } = useAuth();
  const [classId, setClassId] = useState("");
  const [error, setError] = useState("");
  const [percentageLeft, setPercentageLeft] = useState(100);

  const [gradeCompositions, setGradeCompositions] = useState([]);

  const addGradeComposition = () => {
    const id = new Date().getTime().toString();
    setGradeCompositions([
      ...gradeCompositions,
      { id, name: "", percentage: 0, helperText: `` },
    ]);
  };

  const handleTextChange = (index, field, value) => {
    if (field == "percentage") {
      let fieldsTotalValue = 0;
      gradeCompositions.map((g, i) => {
        if (index != i)
          fieldsTotalValue = fieldsTotalValue + parseInt(g.percentage);
      });
      console.log(fieldsTotalValue);
      if (value == "") value = 0;
      setPercentageLeft(100 - fieldsTotalValue - parseInt(value));
    }

    const updatedCompositions = [...gradeCompositions];
    updatedCompositions[index] = {
      ...updatedCompositions[index],
      [field]: value,
    };
    setGradeCompositions(updatedCompositions);
  };

  const deleteGradeComposition = (index) => {
    const updatedCompositions = [...gradeCompositions];
    updatedCompositions.splice(index, 1);
    setGradeCompositions(updatedCompositions);
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
          <Typography
            sx={{ ml: 2, flex: 1, fontWeight: "semi-bold" }}
            variant="body1"
            component="div"
          >
            Class settings
          </Typography>
          <Button autoFocus variant="contained" disabled={percentageLeft != 0}>
            Save
          </Button>
        </Toolbar>
      </AppBar>
      <DialogContent
        sx={{
          display: "flex",
          alignItems: "center",
          overflowY: "auto",
          flexDirection: "column",
          maxHeight: '90%'
        }}
      >
        <Card
          sx={{
            width: 700,
            mt: 2,
            overflowY: 'auto',
            minHeight: 0,
          }}
        >
          <CardContent>
            <Typography variant="h4" sx={{ fontWeight: "500" }}>
              Grading
            </Typography>
            <Typography variant="h6" sx={{ my: 2, fontWeight: "400" }}>
              Grading method
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography>Show total score</Typography>
              <Switch />
            </Box>

            <Divider />

            <Typography variant="h5" sx={{ mt: 2 }}>
              Grade Composition
            </Typography>
            <Typography variant="subtitle1" color="gray" sx={{ mt: 1 }}>
              Grade composition must have the total of 100%
            </Typography>
            <List>
              {gradeCompositions.map((composition, index) => (
                <ListItem key={composition.id}>
                  <Stack spacing={2} direction="row">
                    <TextField
                      required
                      label="Grade composition"
                      value={composition?.name}
                      variant="filled"
                      focused
                      color="secondary"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      helperText={composition?.helperText}
                      onChange={(e) =>
                        handleTextChange(index, "name", e.target.value)
                      }
                    />
                    <TextField
                      label="Percentage*"
                      value={composition?.percentage}
                      type="number"
                      variant="filled"
                      onChange={(e) =>
                        handleTextChange(index, "percentage", e.target.value)
                      }
                      inputProps={{
                        min: 0,
                        max: 100,
                      }}
                    />
                    <IconButton onClick={() => deleteGradeComposition(index)}>
                      <Close />
                    </IconButton>
                  </Stack>
                </ListItem>
              ))}
            </List>
            {gradeCompositions.length > 0 && (
              <Typography>Percentage left: {percentageLeft}%</Typography>
            )}
            <Button
              variant="text"
              sx={{ p: 0, m: 0 }}
              onClick={addGradeComposition}
            >
              Add grade composition
            </Button>
          </CardContent>
        </Card>

        {/* <Typography>How to join a class</Typography> */}
      </DialogContent>
    </Dialog>
  );
}
