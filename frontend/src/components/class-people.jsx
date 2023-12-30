import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Checkbox,
  Box,
  Container,
  Card,
  Divider,
  Avatar,
  ListItemButton,
  ListItemAvatar,
  Button,
} from "@mui/material";
import {
  AccountCircleOutlined,
  More as MoreIcon,
  MoreVert,
  PersonRemoveAlt1Outlined,
} from "@mui/icons-material";
import PersonAddAlt1OutlinedIcon from "@mui/icons-material/PersonAddAlt1Outlined";
import { useAuth } from "../hook/useAuth";
import { stringAvatar } from "../helpers/stringAvator";
import OptionMenu from "./OptionMenu";
import { useParams } from "react-router-dom";
import FullScreenDialog from "./FullScreenDialog";
import FormDialog from "./FormDialog";
import SendMailDialog from "./SendMailDialog";
import AddPeopleDialog from "./AddPeopleDialog";
import axios from "axios";
import { toast } from "react-toastify";

export const ClassPeople = (props) => {
  const { students, teachers, course } = props;

 

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("Invite student");

  // const studentOptions = (studentId) => [
  //   {
  //     label: "Delete",
  //     action: () => handleDelete(studentId),
  //   },
  // ];



  const openSendMailModal = (title) => {
    setOpen(true);
    setTitle(title);
  };

  const sendMailForTeacher = () => {
    openSendMailModal("Invite teacher");
  };

  const sendMailForStudent = () => {
    openSendMailModal("Invite student");
  };

  return (
    <>
      <AddPeopleDialog
        isOpen={open}
        title={title}
        handleClose={() => setOpen(false)}

        course={course}
      />
      <Card>
        <Container style={{ marginTop: 20, justifyContent: "center" }}>
          <Section
            title="Teachers"
            data={teachers}
            course={course}
            icon={<PersonAddAlt1OutlinedIcon />}
            sendMailAction={() => sendMailForTeacher()}
          />
          <Section
            title="Students"
            data={students}
            course={course}
            icon={<PersonAddAlt1OutlinedIcon />}
            sendMailAction={() => sendMailForStudent()}
          />
        </Container>
      </Card>
    </>
  );
};

const Section = ({ title, data, icon, sendMailAction, course }) => {
  
  const { token } = useAuth();

  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const studentOptions = (studentId)=> [
    {
      label: "Delete",
      action: () => handleDelete(studentId)
    },
  ]

  
  const  handleDelete = async (studentId) =>{
    try {
      console.log(studentId + "check");
      await axios.post(
        `http://localhost:3001/class/removeStudent/${studentId}`,
        {
            id: course?._id
        },
        {
          headers: {
            Authorization: "Bearer " + token.refreshToken,
          }
        }
      )
    } catch (error) {
      console.error("Remove student failed:", error);
      toast.error("Remove student failed");
    }
  }
  const { id } = useParams();

  const handleToggle = (item) => {
    const currentIndex = selectedItems.indexOf(item);
    const newSelectedItems = [...selectedItems];

    if (currentIndex === -1) {
      newSelectedItems.push(item);
    } else {
      newSelectedItems.splice(currentIndex, 1);
    }

    setSelectedItems(newSelectedItems);
  };

  const { user } = useAuth();

  const currentClass = user?.classes.filter(
    (classObject) => classObject.classId._id == id
  );
  const currentRole = currentClass[0].role;

  // console.log("currentClass")

  const getSelectedAll = () => {
    setSelectAll(!selectAll);
    if (selectAll) {
     
      setSelectedItems([]);
    } else {
      setSelectedItems([...data]);
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Box display="flex" justifyContent="space-between">
      {currentRole == "3000" && (
          <Checkbox
          edge="start"
          tabIndex={-1}
          disableRipple
          onChange={getSelectedAll}
          checked={selectAll}
            />
            )}
        
        <Typography variant="h5" component="div" sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
          {title}
        </Typography>
        {currentRole == "3000" && (
          <>
            {/* {data?.length > 0 && (
              <Typography variant="body2" fontWeight="bold">
                {data?.length} student {data?.length > 1 && "s"}
              </Typography>
            )} */}
            <IconButton ><PersonRemoveAlt1Outlined/></IconButton>
            <IconButton onClick={sendMailAction}>{icon}</IconButton>
          </>
        )}
      </Box>
      <Divider
        sx={{
          height: "4px",
        }}
      />
      <List>
        {data?.map((item) => (
          <ListItem
            disablePadding
            key={item._id}
            onClick={() => handleToggle(item)}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            secondaryAction={
              user?._id !== item._id &&
              currentRole == "3000" && (
                <OptionMenu
                  options={studentOptions(item._id) ?? [{
                    label: '',
                    action: ()=>{}
                  }]}
                  actionIcon={<MoreVert />}
                  key={item._id}
                />
              )
            }
          >
            <ListItemButton onClick={() => handleToggle(item)} dense>
              {user?._id !== item._id && currentRole == "3000" && (
                <>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={selectedItems.indexOf(item) !== -1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{
                        "aria-labelledby": `checkbox-list-label-${item._id}`,
                      }}
                    />
                  </ListItemIcon>
                </>
              )}
              <Avatar
                {...stringAvatar(
                  item ? `${item.firstName} ${item.lastName}` : "Default Name"
                )}
                size="medium"
                edge="end"
                aria-label="account of current user"
                color="inherit"
              />

              <ListItemText
                primary={item.firstName + " " + item.lastName}
                sx={{ flexGrow: 1, fontWeight: "bold", ml: 2 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
