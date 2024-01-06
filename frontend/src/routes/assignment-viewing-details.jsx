import { useParams } from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import { Box } from "@mui/system";
import MiniDrawer from "../components/Drawer";
import { useClass } from "../hook/useClass";
import { Typography } from "@mui/material";
import Spinner from "../components/spinner";
import { countBy } from "lodash";

export const AssignmentViewingDetailsMain = () => {
  const { user } = useAuth();
  const { id, homeworkId } = useParams();
  const { course, isLoading, isError, ...other } = useClass();

  return (
    <>
      {isLoading ? <Spinner /> : <Typography>{course?.className}</Typography>}
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
        minHeight: '90vh'
      }}
    >
      <MiniDrawer page="AssignmentViewingDetails" children={course}/>
    </Box>
  );
};

export default AssignmentViewingDetails;
