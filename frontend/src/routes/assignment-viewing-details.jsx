import { useParams } from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import { Box } from "@mui/system";
import MiniDrawer from "../components/Drawer";
import { useClass } from "../hook/useClass";
import { Tab, Tabs, Typography } from "@mui/material";
import Spinner from "../components/spinner";
import { countBy } from "lodash";
import { useIsTeacher } from "../helpers/getCurrentRole";
import StudentLayout from "../components/StudentLayout";
import TeacherLayout from "../components/TeacherLayout";

export const AssignmentViewingDetailsMain = ({ course }) => {
  const { user } = useAuth();
  const { id, homeworkId } = useParams();

  console.log(course);

  const isTeacher = useIsTeacher(id);

  const tabLabels = ["Instruction", "Student Homework"];

  if (isTeacher) {
    tabLabels.push("Grade");
  }

  return (
    <>
      {isTeacher ? <TeacherLayout  /> : <StudentLayout course={course} homework={homeworkId} />}
    </>
  );
};


const AssignmentViewingDetails = () => {
  const { course, isLoading, isError, ...other } = useClass();
  return (
    <Box
      sx={{
        display: "flex",
        position: "absolute",
        top: 0,
        right: 0,
        left: 0,
        minHeight: "100vh",
      }}
    >
      <MiniDrawer page="AssignmentViewingDetails" children={course} />
    </Box>
  );
};

export default AssignmentViewingDetails;
