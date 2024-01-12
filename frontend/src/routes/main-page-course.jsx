import { Box } from "@mui/system";
import MiniDrawer from "../components/Drawer";
import { useClass } from "../hook/useClass";

const MainPageCourse = () => {
  const { course, isLoading, error } = useClass();
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
      <MiniDrawer page="Course" children={course} />
    </Box>
  );
};

export default MainPageCourse;
