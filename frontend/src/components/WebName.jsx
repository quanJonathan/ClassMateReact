import { Box } from "@mui/material";
import { NavLink } from "react-router-dom";

function AppName() {
  return (
    <NavLink to="/" style={{ textDecoration: "none" }}>
    <Box
      component="img"
      sx={{ height: 200, width: 200 }}
      alt="appname"
      src="../src/assets/appName.svg"
    />
    </NavLink>
  );
}

export default AppName;
