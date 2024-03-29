import {
  AppBar,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  List,
  Slide,
  Switch,
  TextField,
  Toolbar,
  Typography,
  Box,
  Stack,
} from "@mui/material";
import { forwardRef, useRef, useState } from "react";
import { Close } from "@mui/icons-material";
import { useAuth } from "../hook/useAuth";
import { toast } from "react-toastify";
import axios from "axios";
import { useParams } from "react-router-dom";
import YesNoDialog from "./yesNoDialog";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function SettingDialog({ open, handleClose, compositions, defaultValue }) {
  const { user, token } = useAuth();
  const [error, setError] = useState("");
  const modifiedInitial = compositions?.map((c) => {
    return {
      _id: c?._id,
      gradeScale: c?.gradeScale,
      name: c?.name,
      isDefault: true,
    };
  });

  const [gradeScaleLeft, setGradeScaleLeft] = useState(defaultValue);
  const [currentComposition, setCurrentComposition] = useState(null);
  const [openYesNo, setYesNo] = useState(false);

  const [gradeCompositions, setGradeCompositions] = useState(modifiedInitial);

  const [tempValues, setTempValues] = useState([]);

  const { id } = useParams();

  // console.log(gradeCompositions);

  const onListChange = (newList) => {
    setGradeCompositions(newList);
  };
  const isAllFieldNameGood = () => {
    const namesSet = new Set();

    for (const composition of gradeCompositions) {
      if (!composition.name || composition.name.trim() === "") {
        return false; // Empty name found
      }

      if (namesSet.has(composition.name)) {
        return false;
      }

      namesSet.add(composition.name);
    }
    return true;
  };

  const isAllValid = () => {
    return isAllFieldNameGood() && gradeScaleLeft == 0;
  };

  const saveGradeCompositions = async () => {
    // console.log(token);
    console.log(gradeCompositions);
    console.log(tempValues);
    const modifiedGradeCompositions = [
      ...gradeCompositions.map((g) => {
        return {
          _id: g._id.toString(),
          classId: id,
          name: g.name,
          gradeScale: g.gradeScale,
          homeworks: [],
          isDelete: false,
        };
      }),
      ...tempValues.map((t) => {
        return {
          _id: t._id.toString(),
          classId: id,
          name: t.name,
          gradeScale: t.gradeScale,
          homeworks: [],
          isDelete: true,
        };
      }),
    ];

    try {
      const response = await axios.post(
        `https://classmatebe-final.onrender.com/class/updateOrAddGradeCompositions/${id}`,
        modifiedGradeCompositions,
        {
          headers: {
            Authorization: "Bearer: " + token?.refreshToken,
          },
        }
      );
      if (response) {
        console.log(response);
        setGradeCompositions(response.data);
        handleClose();
      }
    } catch (error) {
      toast.error("Save failed");
    }
  };

  const addGradeComposition = () => {
    const id = new Date().getTime().toString();
    setGradeCompositions([
      ...gradeCompositions,
      {
        _id: id,
        name: "",
        gradeScale: 0,
        helperText: ``,
        isDefault: false,
      },
    ]).then((g) => calculateGradeScale(0, g.length - 1));
  };

  const calculateGradeScale = (value, index) => {
    let fieldsTotalValue = 0;
    gradeCompositions.map((g, i) => {
      if (index != i)
        fieldsTotalValue = fieldsTotalValue + parseInt(g.gradeScale);
    });
    //console.log(fieldsTotalValue);
    //console.log(value)
    if (value == "") value = 0;
    //console.log(100 - fieldsTotalValue - parseInt(value))
    setGradeScaleLeft(100 - fieldsTotalValue - parseInt(value));
  };

  const handleTextChange = (index, field, value) => {
    // console.log("calling");
    // console.log(index);
    // console.log(field);
    // console.log(value);
    if (field == "gradeScale") {
      calculateGradeScale(value, index);
    }

    const updatedCompositions = [...gradeCompositions];
    updatedCompositions[index] = {
      ...updatedCompositions[index],
      [field]: value,
    };
    setGradeCompositions(updatedCompositions);
  };

  const deleteGradeComposition = (index) => {
    setGradeScaleLeft(
      (prev) => prev + parseInt(gradeCompositions[index].gradeScale)
    );
    const updatedCompositions = [...gradeCompositions];
    updatedCompositions.splice(index, 1);

    setGradeCompositions(updatedCompositions);

    // calculateGradeScale(currentComposition?.gradeScale, index)
  };

  const onYes = () => {
    // console.log(currentComposition);
    if (currentComposition?.isDefault) {
      // console.log("adding");
      const modifiedTemp = [...tempValues, currentComposition];
      setTempValues(modifiedTemp);
    }
    const index = gradeCompositions.findIndex(
      (g) => g._id == currentComposition._id
    );
    // console.log(index)
    calculateGradeScale(0, index);
    deleteGradeComposition(index);
    setCurrentComposition(null);

    // console.log(tempValues)
    setYesNo(false);
  };

  const onNo = () => {
    setYesNo(false);
  };

  const onClose = () => {
    // console.log(tempValues);
    if (tempValues.length > 0) {
      const currentGradeComposition = [...gradeCompositions, ...tempValues];
      setGradeCompositions(currentGradeComposition);
      tempValues.length = 0;
      handleClose();
      return;
    }
    handleClose();
  };

  const dragComposition = useRef(0);
  const dragOverComposition = useRef(0);

  const handleDrag = () => {
    const gradeCompositionClone = [...gradeCompositions];
    const temp = gradeCompositionClone[dragComposition.current];
    gradeCompositionClone[dragComposition.current] =
      gradeCompositionClone[dragOverComposition.current];
    gradeCompositionClone[dragOverComposition.current] = temp;

    setGradeCompositions(gradeCompositionClone);
    console.log(gradeCompositions);
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      scroll="paper"
    >
      <YesNoDialog
        open={openYesNo}
        onYes={onYes}
        onNo={onNo}
        title={currentComposition?.name}
      />
      <AppBar
        elevation={0}
        sx={{
          position: "relative",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderBottom: "1px solid #ccc",
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
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
          <Button
            autoFocus
            variant="contained"
            disabled={!isAllValid()}
            onClick={saveGradeCompositions}
          >
            Save
          </Button>
        </Toolbar>
      </AppBar>
      <DialogContent
        sx={{
          display: "flex",
          height: "100%",
          justifyContent: "center",
          alignContent: "center",
          mt: 3,
          p: 1,
        }}
      >
        <Card
          sx={{
            width: "60%",
            p: 4,
            overflowY: "auto",
            "@media screen and (max-width: 500px)": {
              p: 0,
            },
          }}
        >
          <CardContent sx={{ minHeight: 0 }}>
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

            <List sx={{ minWidth: "100%" }}>
              {gradeCompositions.map((composition, index) => (
                <div
                  key={composition?._id}
                  onMouseEnter={() => setCurrentComposition(composition)}
                  style={{ minWidth: "100%", cursor: "move" }}
                >
                  <Card
                    draggable
                    onDragStart={() => (dragComposition.current = index)}
                    onDragEnter={() => (dragOverComposition.current = index)}
                    onDragEnd={handleDrag}
                    onDragOver={(e) => e.preventDefault()}
                    sx={{
                      my: 1,
                      display: "flex",
                      justifyContent: "space-between",
                      flexDirection: "row",
                    }}
                  >
                    <Stack spacing={2} direction="row" sx={{ minWidth: "80%" }}>
                      <TextField
                        required
                        label="Grade composition"
                        value={composition?.name}
                        variant="filled"
                        focused
                        InputLabelProps={{
                          shrink: true,
                        }}
                        helperText={composition?.helperText}
                        onChange={(e) =>
                          handleTextChange(index, "name", e.target.value)
                        }
                      />
                      <TextField
                        label="Grade Scale"
                        required
                        value={composition?.gradeScale}
                        type="number"
                        variant="filled"
                        onChange={(e) =>
                          handleTextChange(index, "gradeScale", e.target.value)
                        }
                        inputProps={{
                          min: 1,
                          max: 100,
                        }}
                      />
                    </Stack>
                    <IconButton
                      onClick={() => {
                        composition.isDefault
                          ? setYesNo(true)
                          : deleteGradeComposition(index);
                      }}
                    >
                      <Close />
                    </IconButton>
                  </Card>
                </div>
              ))}
            </List>

            {gradeCompositions.length > 0 && (
              <Typography>Grade scale left: {gradeScaleLeft}%</Typography>
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
      </DialogContent>
    </Dialog>
  );
}

SettingDialog.defaultProps = {
  compositions: [],
  handleClose: () => {},
  open: false,
};

export default SettingDialog;
