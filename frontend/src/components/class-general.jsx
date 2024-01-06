import {
  ContentCopy,
  CropFree,
  InsertLink,
  MoreVert,
  Refresh,
  SendOutlined,
} from "@mui/icons-material";
import {
  Avatar,
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
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import axios from "axios";
import OptionMenu from "./OptionMenu";
import { useRef, useState } from "react";
import ExcelUploadButton from "./UploadExcelButton";
import DownloadExcelButton from "./DownloadExcelButton";
import { stringAvatar } from "../helpers/stringAvator";
import { useParams } from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import { toast } from "react-toastify";

export const ClassGeneral = ({ course, user }) => {
  const [excelData, setExcelData] = useState(null);
  const { id } = useParams();
  const { token } = useAuth();
  const textareaRef = useRef(null);

  const copyTextAction = (text) => {
    console.log("copying...");
    if (textareaRef.current) {
      textareaRef.current.value = text;
      textareaRef.current.select();

      try {
        // Copy the text to the clipboard
        document.execCommand("copy");
        console.log("Text copied to clipboard:", text);
      } catch (err) {
        console.error("Unable to copy to clipboard:", err);
      }
    }
  };

  const resetCodeAction = () => {
    console.log("Resetting code...");
    //axios.post("http://localhost:3001/class/resetClassId");
  };

  const options = [
    {
      icon: <InsertLink />,
      label: "Sao chép đường liên kết mã lớp",
      action: () => {
        copyTextAction(`http://localhost:5173/c/join/${course?.classId}`);
      },
    },
    {
      icon: <ContentCopy />,
      label: "Sao chép mã lớp",
      action: () => {
        copyTextAction(course?.classId);
      },
    },
    {
      icon: <Refresh />,
      label: "Đặt lại mã lớp",
      action: () => {
        resetCodeAction();
      },
    },
  ];

  const handleUpload = async (data) => {
    // Handle the uploaded data as needed
    setExcelData(data);
    // console.log("Uploaded Excel Data:", data);

    const students = [];
    data.forEach((row, rowIndex) => {
      if (row != null && rowIndex > 1) {
        students.push({
          studentId: row[1],
          fullName: row[2],
        });
      }
    });

    // console.log("adding");
    // console.log(students);

    console.log(id);
    const response = await axios.post(
      `http://localhost:3001/class/addStudents/${id}`,
      students,
      {
        headers: {
          Authorization: "Bearer: " + token?.refreshToken,
        },
      }
    );
    if (response.status == 202) {
      toast.success(response.statusText);
    } else {
      toast.error(response.statusText);
    }
    console.log(students);
  };

  const isSmallScreen = useMediaQuery("(max-width:600px)");
  return (
    <div
      style={{
        paddingBottom: "50px",
        paddingLeft: "10px",
        paddingRight: "10px",
        justifyContent: "center",
        alignContent: "center",
        position: "relative",
      }}
    >
      <textarea ref={textareaRef} style={{ display: "none" }} readOnly />
      <Card
        sx={{
          width: "100%",
          overflow: "hidden",
          padding: 2,
          boxSizing: "border-box",
          "@media (max-width:600px)": {
            height: 150,
          },
          position: "relative",
          backgroundColor: "#0a9689",
          color: "white",
          height: "250px",
          marginTop: "30px",
        }}
      >
        <CardActions>
          <Box sx={{ position: "absolute", bottom: 0, left: 0, padding: 2 }}>
            <Typography
              variant="h3"
              component="div"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              {course?.className}
            </Typography>
            <Typography
            variant="h5"
            style={{
             fontStyle: "italic"
        }}>{course?.description ?? ""}</Typography>
          </Box>
          <Stack
            flexDirection="row"
            sx={{ position: "absolute", right: 0, top: 0 }}
          >
            <ExcelUploadButton onUpload={handleUpload} />
            <DownloadExcelButton toolTipName="Download template" />
          </Stack>
        </CardActions>
      </Card>
      {!isSmallScreen && (
        <Box
          elevation={0}
          sx={{
            width: "100%",
            height: 100,
            marginTop: 2,
            py: 2,
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              width: "20%",
              boxShadow: "0px 1px 6px -2px black",
              margin: "10px",
              padding: "20px",
              borderRadius: "15px",
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
              <OptionMenu
                classId={course?.classId}
                options={options}
                actionIcon={<MoreVert />}
              />
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
          </div>
          <Box sx={{ width: "80%" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                margin: "10px",
                padding: "20px",
                boxShadow: "0px 1px 6px -2px black",
                justifyContent: "space-between",
                borderRadius: "15px",
              }}
            >
              <Avatar
                {...stringAvatar(
                  user ? `${user.firstName} ${user.lastName}` : "Default Name"
                )}
              ></Avatar>
              <input
                type="text"
                placeholder="Announce something to your class"
                style={{
                  border: "none",
                  padding: "15px 20px",
                  width: "100%",
                  mx: "20px",
                  fontSize: "17px",
                  outline: "none",
                }}
              />
              <IconButton>
                <SendOutlined />
              </IconButton>
            </div>
          </Box>
        </Box>
      )}
    </div>
  );
};
