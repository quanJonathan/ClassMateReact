import { useClass } from "../hook/useClass";
import {
  Divider,
  IconButton,
  Paper,
  Tab,
  Tabs,
  Box,
  useMediaQuery,
} from "@mui/material";
import { ClassGeneral } from "../components/class-general";
import { ClassGrade } from "../components/class-grade";
import { ClassPeople } from "../components/class-people";
import { ClassHomeWork } from "../components/class-homework";
import Spinner from "../components/spinner";
import PropTypes from "prop-types";
import { useState } from "react";
import { useAuth } from "../hook/useAuth";
import { alpha } from "@mui/material/styles";
import { Settings } from "@mui/icons-material";
import SettingDialog from "./SettingDialog";

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
          <Paper elevation={0}>{children}</Paper>
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
  const [isDialogOpen, setDialogOpen] = useState(false);
  const { course, teachers, students, isLoading, isError } = useClass();
  const { user } = useAuth();
  // console.log(teachers)
  // console.log(students)
  const currentClassOfUser = user?.classes?.find(
    (it) => it.classId.classId === course?.classId
  );
  // console.log("currentClass" + currentClassOfUser)

  const currentRole = currentClassOfUser?.role;
  //console.log(currentRole)

  //console.log(currentRole === '3000')

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const openModal = () => {
    setDialogOpen(true);
  };

  const tabLabels = ["General Information", "HomeWork", "People"];

  if (currentRole === "3000") {
    tabLabels.push("Grade");
  }

  const maxTabWidth = Math.max(...tabLabels.map((label) => label.length));

  console.log(course);

  const getGradeScaleLeft = () => {
    let finalValue = 100
    course.compositions.map((c) => { finalValue = finalValue - parseInt(c.gradeScale)})
    return finalValue == 0 ? 0: finalValue
  }

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <SettingDialog
          open={isDialogOpen}
          handleClose={() => setDialogOpen(false)}
          compositions={course.compositions}
          defaultValue={getGradeScaleLeft()}
        />
      )}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          mt: 6,
          boxShadow: "none",
        }}
        elevation={0}
      >
        {isLoading ? (
          <Spinner />
        ) : (
          <Box
            sx={{
              position: "sticky",
              width: "100%",
              bgcolor: "white",
              zIndex: 1,
              backgroundColor: (theme) =>
                alpha(theme.palette.background.default, 0.6),
              backdropFilter: "blur(6px)",
              borderBottom: "0px solid rgba(0,0,0,0.3)",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Tabs
              value={value}
              onChange={handleChange}
              sx={{
                "& button:focus": {
                  outline: "none",
                },
              }}
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
            <IconButton edge="start" sx={{ p: 0 }} onClick={openModal}>
              <Settings />
            </IconButton>
          </Box>
        )}
        <Divider
          variant="middle"
          sx={{ borderBottomWidth: "2px", borderColor: "rgba(0, 0, 0, 0.12)" }}
        />
        <TabPanel value={value} index={0}>
          <ClassGeneral course={course} user={user} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <ClassHomeWork />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <ClassPeople
            teachers={teachers}
            students={students}
            course={course}
          />
        </TabPanel>
        {currentRole === "3000" && (
          <TabPanel value={value} index={3}>
            <ClassGrade members={students} homeworks={course?.homeworks} />
          </TabPanel>
        )}
      </Box>
    </>
  );
};

export default CourseContent;
