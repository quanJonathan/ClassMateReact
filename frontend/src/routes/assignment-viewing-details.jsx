import { useParams } from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import { Box } from "@mui/system";
import MiniDrawer from "../components/Drawer";
import { useClass } from "../hook/useClass";
import { Tab, Tabs, Typography } from "@mui/material";
import Spinner from "../components/spinner";
import { countBy } from "lodash";
import { useIsTeacher } from "../helpers/getCurrentRole";

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
    <Box
      sx={{
        position: "fixed",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        minHeight: "95vh",
        pl: 10,
        pr: 20,
        minWidth: "85%",
        backgroundColor: "gray",
      }}
    >
      {isTeacher ? <TeacherLayout /> : <StudentLayout />}
    </Box>
  );
};

const TeacherLayout = () => {};

const StudentLayout = () => {};

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
        minHeight: "90vh",
      }}
    >
      <MiniDrawer page="AssignmentViewingDetails" children={course} />
    </Box>
  );
};

export default AssignmentViewingDetails;
