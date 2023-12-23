import { useClass } from "../hook/useClass";
import { Divider, Paper, Tab, Tabs } from "@mui/material";
import { ClassGeneral } from "../components/class-general";
import { ClassGrade } from "../components/class-grade";
import { ClassPeople } from "../components/class-people";
import { ClassHomeWork } from "../components/class-homework";
import Spinner from "../components/spinner";
import PropTypes from "prop-types";
import { useState } from "react";
import { Box } from "@mui/system";

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

const CourseContent = () => {
  const [value, setValue] = useState(0);
  const { course, teachers, students, isLoading, isError } = useClass();
  // console.log(teachers)
  // console.log(students)

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const tabLabels = ["General Information", "HomeWork", "People", "Grade"];

  const maxTabWidth = Math.max(...tabLabels.map((label) => label.length));

  console.log(course)
  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider" , mt: 6 }}>
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
            {tabLabels.map((label) => (
              <Tab
                key={`tab-${label}`}
                label={label}
                style={{ minWidth: `${maxTabWidth}ch` }}
              />
            ))}
          </Tabs>
        )}
        <Divider
          variant="middle"
          sx={{ borderBottomWidth: "2px", borderColor: "rgba(0, 0, 0, 0.12)" }}
        />
        <TabPanel value={value} index={0}>
          <ClassGeneral course={course}/>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <ClassHomeWork />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <ClassPeople teachers={teachers} students={students} />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <ClassGrade />
        </TabPanel>
      </Box>
  )
}

export default CourseContent;