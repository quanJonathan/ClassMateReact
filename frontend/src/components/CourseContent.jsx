import { useClass } from "../hook/useClass";
import {
  Divider,
  IconButton,
  Paper,
  Tab,
  Tabs,
  Box,
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
import { useIsTeacher } from "../helpers/getCurrentRole";
import { useParams } from "react-router-dom";

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
  const { id } = useParams();
  // console.log(teachers)
  // console.log(students)
  const isTeacher = useIsTeacher(id);
  //console.log(currentRole)

  //console.log(currentRole === '3000')

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const openModal = () => {
    setDialogOpen(true);
  };

  const tabLabels = ["General", "HomeWork", "People"];

  if (isTeacher) {
    tabLabels.push("Grade");
  }

  const maxTabWidth = Math.max(...tabLabels.map((label) => label.length));

  // console.log(course);

  const getGradeScaleLeft = () => {
    let finalValue = 100;
    course?.compositions.map((c) => {
      finalValue = finalValue - parseInt(c.gradeScale);
    });
    return finalValue == 0 ? 0 : finalValue;
  };

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <SettingDialog
          open={isDialogOpen}
          handleClose={() => setDialogOpen(false)}
          compositions={course?.compositions}
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
              width: "96%",
              bgcolor: "white",
              zIndex: 1000,
              backgroundColor: (theme) =>
                alpha(theme.palette.background.default, 0.6),
              backdropFilter: "blur(10px)",
              borderBottom: "0px solid rgba(0,0,0,0.3)",
              display: "flex",
              justifyContent: "flex-start",
              alignContent: "flex-start",
              ml: 1,
              top: '64px',
              "@media screen and (max-width: 500px)": {
                display: 'flex',
                justifyContent: "center",
                alignContent: "center",
                ml: 3
              },
            }}
          >
            <Tabs
              value={value}
              onChange={handleChange}
              sx={{
                "& button:focus": {
                  outline: "none",
                },
                flexShrink: 0,
                flexGrow: 1
              }}
              variant="scrollable"
              scrollButtons="auto"
            >
              {tabLabels.map((label) => (
                <Tab
                  key={`tab-${label}`}
                  label={label}
                  style={{ minWidth: `${maxTabWidth}px` }}
                />
              ))}
            </Tabs>
            {isTeacher && (
              <IconButton
                edge="end"
                sx={{
                  width: 20,
                  height: 20,
                  mt: 2,
                  "@media screen and (max-width: 500px)": {
                    display: "none",
                  },
                }}
                onClick={openModal}
                aria-label="settings"
                id="long-button"
              >
                <Settings sx={{ width: 30, height: 30 }} />
              </IconButton>
            )}
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
          <ClassHomeWork homeworks={course?.homeworks} />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <ClassPeople
            teachers={teachers}
            students={students}
            course={course}
          />
        </TabPanel>
        {isTeacher && (
          <TabPanel value={value} index={3}>
            <ClassGrade
              members={students}
              homeworks={course?.homeworks}
              compositions={course?.compositions}
              course={course}
            />
          </TabPanel>
        )}
      </Box>
    </>
  );
};

export default CourseContent;
