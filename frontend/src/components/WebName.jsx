import { Box, styled } from "@mui/material";
import { NavLink } from "react-router-dom";

function AppName() {
  const CustomLink = styled(NavLink)(({ theme }) => ({
    cursor: "pointer",
    textDecoration: "none",
    
    justifyContent: "flex-start",
    [theme.breakpoints.down("md")]: {
      display: "flex",
      justifyContent: "center",
      width: "100%",
    },
  }));


  return (
    <CustomLink to="/">
    <Box
      component="img"
      sx={{ width: 200 }}
      alt="appname"
      src="../src/assets/appName.png"
    />
    </CustomLink>
  );
}

export default AppName;
