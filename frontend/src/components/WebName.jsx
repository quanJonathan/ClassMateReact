import { Box, styled } from "@mui/material";
import { NavLink } from "react-router-dom";

function AppName({width, children}) {
  const CustomLink = styled(NavLink)(({ theme }) => ({
    
    cursor: "pointer",
    textDecoration: "none",
    width: width,
    justifyContent: "flex-start",
    [theme.breakpoints.down("md")]: {
      justifyContent: "left",
      width: "22%",
      display: "flex",
    },
    [theme.breakpoints.down("sm")]: {
      display: children ? "none": "flex"
    },
  }));


  return (
    <CustomLink to="/">
    <Box
      component="img"
      sx={{ width: 150 }}
      alt="appname"
      src="/assets/appName.png"
    />
    </CustomLink>
  );
}

export default AppName;
