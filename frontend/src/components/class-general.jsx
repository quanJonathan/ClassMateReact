import {
  ContentCopy,
  CropFree,
  InsertLink,
  MoreVert,
  Refresh,
} from "@mui/icons-material";
import {
  Card,
  CardActions,
  CardContent,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Paper,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import OptionMenu from "./OptionMenu";
import { useRef } from "react";

export const ClassGeneral = ({ course }) => {
  console.log(course);

  const textareaRef = useRef(null)
  const options = [
    {
      icon: <InsertLink />,
      label: "Sao chép đường liên kết mã lớp",
      action: () => copyTextAction(`http://localhost:5173/c/join/${course?.classId}`),
    },
    {
      icon: <ContentCopy />,
      label: "Sao chép mã lớp",
      action: () => copyTextAction(course?.classId),
    },
    {
      icon: <Refresh />,
      label: "Đặt lại mã lớp",
      action: () => resetCodeAction(),
    },
  ];

  const copyTextAction = (text) => {
    if (textareaRef.current) {
      textareaRef.current.value = text;
      textareaRef.current.select();

      try {
        // Copy the text to the clipboard
        document.execCommand('copy');
        console.log('Text copied to clipboard:', text);
      } catch (err) {
        console.error('Unable to copy to clipboard:', err);
      }
    }
  };

  const resetCodeAction = () => {
    console.log("Resetting code...");
    axios.post("http://localhost:3001/class/resetClassId");
  };

  const isSmallScreen = useMediaQuery("(max-width:600px)");
  return (
    <Box variant="main" sx={{ backgroundColor: "rgba(255, 255, 255, 1)" }}>
      <textarea ref={textareaRef} style={{ position: 'absolute', left: '-9999px' }} readOnly />
      <Card
        sx={{
          width: "100%",
          height: 200,
          overflow: "hidden",
          padding: 2,
          boxSizing: "border-box",
          "@media (max-width:600px)": {
            height: 150,
          },
          backgroundColor: "rgba(144, 206, 203, 0.2)",
          position: "relative",
        }}
      >
        <CardActions sx={{ position: "relative" }}>
          <Box sx={{ position: "absolute", top: 0, left: 0, padding: 2 }}>
            <Typography variant="h3" component="div" gutterBottom>
              {course?.className}
            </Typography>
          </Box>
        </CardActions>
      </Card>
      {!isSmallScreen && (
        <Paper
          sx={{
            width: "100%",
            maxWidth: 200,
            height: 100,
            marginTop: 2,
            padding: 2,
            boxSizing: "border-box",
          }}
        >
          <Box
            component="div"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignContent: "unset",
            }}
          >
            <Typography>Course ID</Typography>
            <OptionMenu classId={course?.classId} options={options} actionIcon={<MoreVert/>}/>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <div>{course?.classId}</div>
            <IconButton>
              <CropFree />
            </IconButton>
          </Box>
        </Paper>
      )}
    </Box>
  );
};
