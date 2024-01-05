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
} from "@mui/material";
import {
  AccountCircleOutlined,
  More as MoreIcon,
  MoreVert,
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
import {useIsTeacher} from "../helpers/getCurrentRole"

export const ClassPeople = (props) => {
  const { students, teachers, course } = props;
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
  };

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

  const studentOptions = [
    {
      label: "Delete",
    },
  ];

  const openSendMailModal = ({ title }) => {
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
            icon={<PersonAddAlt1OutlinedIcon />}
            selectAll={selectAll}
            sendMailAction={() => sendMailForTeacher()}
          />
          <Section
            title="Students"
            data={students}
            icon={<PersonAddAlt1OutlinedIcon />}
            selectAll={selectAll}
            options={studentOptions}
            sendMailAction={() => sendMailForStudent()}
          />
        </Container>
      </Card>
    </>
  );
};

const Section = ({ title, data, icon, selectAll, options, sendMailAction }) => {
  const [selectedItems, setSelectedItems] = useState([]);
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

  const currentRole = useIsTeacher(id);

  // console.log("currentClass")

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems([...data]);
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        {currentRole && (
          <>
            {/* {data?.length > 0 && (
              <Typography variant="body2" fontWeight="bold">
                {data?.length} student {data?.length > 1 && "s"}
              </Typography>
            )} */}
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
              currentRole && (
                <OptionMenu
                  options={options}
                  actionIcon={<MoreVert />}
                  key={item._id}
                />
              )
            }
          >
            <ListItemButton onClick={() => handleToggle(item)} dense>
              {user?._id !== item._id && currentRole  && (
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
              <Avatar
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
              />

              <ListItemText
                primary={item.firstName + " " + item.lastName}
                sx={{ flexGrow: 1, fontWeight: "bold" }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
