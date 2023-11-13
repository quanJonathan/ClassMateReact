import { Box } from "@mui/material";
import MiniDrawer from "../components/Drawer";
export default function Dashboard() {
  return (
    <Box
    sx={{
     display: "flex",
     position: "absolute",
     top: 0,
     right: 0,
     left: 0,
     minHeight: "100vh"
    }}
  >
    <MiniDrawer/>
  </Box>
  );
}
