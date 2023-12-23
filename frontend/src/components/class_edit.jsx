import { Box, Divider, Paper, Tab, Tabs, Typography } from "@mui/material";
import React from "react";
import { ClassGeneral } from "../sections/classes/class-general";
import { ClassHomeWork } from "../sections/classes/class-homework";
import { ClassPeople } from "../sections/classes/class-people";
import { ClassGrade } from "../sections/classes/class-grade";
import PropTypes from "prop-types";
import useSWR from "swr";
import { useLocation, useParams } from "react-router-dom";
import Spinner from "../components/spinner";
import axios from "axios";
import { useClassMember } from "../hooks/useClassMember";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Paper elevation={3}>{children}</Paper>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const ClassEdit = () => {
  const [value, setValue] = React.useState(0);
  const { classId } = useParams();
  const { students, teachers, isLoading, isError } = useClassMember()

  //if (isError) return <div>{isError}</div>

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const tabLabels = ["General Information", "HomeWork", "People", "Grade"];

  const maxTabWidth = Math.max(...tabLabels.map((label) => label.length));

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        {isLoading ? (
          <Spinner />
        ) : (
          <Tabs
            value={value}
            onChange={handleChange}
            sx={{ ml: 5 }}
            variant="scrollable"
            scrollButtons="auto"
          >
            {tabLabels.map((label, index) => (
              <Tab key={index} label={label} style={{ minWidth: `${maxTabWidth}ch` }} />
            ))}
          </Tabs>
        )}
      </Box>
      <Divider
        variant="middle"
        sx={{ borderBottomWidth: "2px", borderColor: "rgba(0, 0, 0, 0.12)" }}
      />
      <TabPanel value={value} index={0}>
        <ClassGeneral />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ClassHomeWork />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ClassPeople teachers={teachers} students={students} />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <ClassGrade classId={classId} />
      </TabPanel>
    </Box>
  );
};

export default ClassEdit;
