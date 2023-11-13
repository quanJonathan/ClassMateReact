import { Box } from "@mui/material";
import { NavLink } from "react-router-dom";

function AppName() {
  return (
    <NavLink to="/" style={{ textDecoration: "none" }}>
    <Box
      component="img"
      sx={{ width: 200 }}
      alt="appname"
      src="../src/assets/appName.png"
    />
    </NavLink>
  );
}

export default AppName;
