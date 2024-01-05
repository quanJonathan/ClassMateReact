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
  AccountCircle,
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
import {useIsTeacher} from "../helpers/getCurrentRole"

export const ClassPeople = (props) => {
  const { students, teachers, course } = props;

 

  const [open, setOpen] = useState(false);
  const [personal,setPersonal] = useState(false);
  const [title, setTitle] = useState("Invite student");
  const [url,setUrl] = useState("");

  // const studentOptions = (studentId) => [
  //   {
  //     label: "Delete",
  //     action: () => handleDelete(studentId),
  //   },
  // ];


  const openCreateLinkForEmptyUser =(studentId) =>{
    console.dir(studentId)
    setPersonal(true);
  
    setUrl(`http://localhost:5173/c/join/${course?._id}/${studentId}`)
    sendMailForStudent();
  }

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
        personal={personal}
        handleClose={() => setOpen(false)}
        course={course}
        url={url}
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
            createLink={openCreateLinkForEmptyUser}
            icon={<PersonAddAlt1OutlinedIcon />}
            sendMailAction={() => sendMailForStudent()}
          />
        </Container>
      </Card>
    </>
  );
};

const Section = ({ title, data, icon, sendMailAction, createLink, course }) => {


  
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

  // const currentRole = useIsTeacher(id);

  // console.log("currentClass")
  const currentClass = user?.classes.filter(
    (classObject) => classObject.classId._id == id
  );
  const currentRole = currentClass[0].role;

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
              )}
              {(item.email ==='' || !item.email) ?
              (<IconButton
              size="medium"
              edge="start"
              aria-label="account of current user"
              color="gray"
            >
              <AccountCircle
                sx={{
                    width: "45px",
                    height: "45px"
                  }}
              />
            </IconButton>)
            : 
              (<Avatar
                {...stringAvatar(
                  item
                    ? `${item?.firstName} ${item?.lastName}`
                    : "Default Name",
                  { mr: 2 }
                )}
                size="medium"
                edge="end"
                aria-label="account of current user"
                color="inherit"
              />)
                }
              <ListItemText
                primary={(item.email ==='' || !item.email)? item.studentId : item.firstName + " " + item.lastName}
                sx={{ flexGrow: 1, fontWeight: "bold", ml: 2,  color: (item.email ==='' || !item.email) ? "gray" : "inherit", }}

              />

                { (item.email ==='' || !item.email) && (<Button onClick={()=>createLink(item.studentId)} variant="contained" color="primary" elevation={0} sx={{
                "textTransform": "none"
            }}>
           Create an Invite Link
          </Button>)}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
