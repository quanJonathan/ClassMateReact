import { Box } from "@mui/material";
import MiniDrawer from "../components/Drawer";
import { useAuth } from "../hook/useAuth";
import Spinner from "../components/spinner";
export default function Dashboard() {
  const { isLoading } = useAuth();
  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
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
          <MiniDrawer page="Dashboard" />
        </Box>
      )}
    </>
  );
}
