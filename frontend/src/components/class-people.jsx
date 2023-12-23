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
} from "@mui/material";
import {
  AccountCircleOutlined,
  More as MoreIcon,
  MoreVert,
} from "@mui/icons-material";
import PersonAddAlt1OutlinedIcon from "@mui/icons-material/PersonAddAlt1Outlined";
import { useAuth } from "../hook/useAuth";

export const ClassPeople = (props) => {
  const { students, teachers } = props;
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
  };

  return (
    <Card>
      <Container style={{ marginTop: 20 }}>
        <Section
          title="Teachers"
          data={teachers}
          icon={<PersonAddAlt1OutlinedIcon />}
          selectAll={selectAll}
        />
        <Section
          title="Students"
          data={students}
          icon={<PersonAddAlt1OutlinedIcon />}
          selectAll={selectAll}
        />
      </Container>
    </Card>
  );
};

const Section = ({ title, data, icon, selectAll }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const { user } = useAuth();

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

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems([...data]);
    }
  };

  return (
    <div>
      <Box display="flex" justifyContent="space-evenly">
        <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        <IconButton>{icon} </IconButton>
      </Box>
      <Divider
        sx={{
          height: "4px",
        }}
      />
      <List>
        {data?.map((item) => (
          <ListItem key={item._id} onClick={() => handleToggle(item)}>
            {user?._id === item._id && (
              <ListItemIcon>
                && ({" "}
                <Checkbox
                  checked={selectedItems.indexOf(item) !== -1}
                  tabIndex={-1}
                  disableRipple
                />
                )
              </ListItemIcon>
            )}
            <AccountCircleOutlined />

            <ListItemText
              primary={item.firstName + " " + item.lastName}
              sx={{ flexGrow: 1 }}
            />
            <ListItemIcon>
              <IconButton>
                <MoreVert />
              </IconButton>
            </ListItemIcon>
          </ListItem>
        ))}
      </List>
    </div>
  );
};
