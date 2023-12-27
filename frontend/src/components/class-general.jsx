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
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import OptionMenu from "./OptionMenu";
import { useRef } from "react";


export const ClassGeneral = ({ course, user }) => {
 

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

  function stringToColor(string) {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
  
    return color;
  }
  
  function stringAvatar(name) {
    name = name.toUpperCase()
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
  }

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
    <div style={{ paddingBottom: "50px" }}>
    
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
          height: "350px",
          marginTop: "30px",
          
  
        }}
      >
        <CardActions sx={{ position: "relative",  }}>
          <Box sx={{ position: "absolute", top: 0, left: 0, padding: 2,
         
        
        }}>
            <Typography variant="h3" component="div" gutterBottom sx={{fontWeight: 600}}>
              {course?.className}
            </Typography>
          </Box>
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
            justifyContent: "space-between"
          }}
        >
          <div style={{  width: "20%",    boxShadow: "0px 1px 6px -2px black", margin: "10px",  padding: "20px",  borderRadius: "15px"}}  >
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
          </div>
          <Box sx={{  width: "80%"}}>
          <div style={{
            display: "flex",
            alignItems: "center",
            margin: "10px",
            padding: "20px",
            boxShadow: "0px 1px 6px -2px black",
            justifyContent: "space-between",
            borderRadius: "15px"
          }}>
          <Avatar
                    {...stringAvatar(
                      user
                        ? `${user.lastName} ${user.firstName}`
                        : "Default Name"
                    )}
                  
                  >
                  </Avatar>
        <input
          type="text"
          placeholder="Announce something to your class"
          style={{
            border: "none",
            padding: "15px 20px",
            width: "100%",
            mx: "20px",
            fontSize: "17px",
            outline: "none"
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
