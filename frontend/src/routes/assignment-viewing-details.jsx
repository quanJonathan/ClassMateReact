import { useParams } from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import { Box } from "@mui/system";
import MiniDrawer from "../components/Drawer";

export const AssignmentViewingDetailsMain = () => {
  const { user } = useAuth();
  const { id, homeId } = useParams();

  return (
  <>
  
  </>
  );
};

const AssignmentViewingDetails = () => {
  const { id, homeworkId } = useParams();
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
