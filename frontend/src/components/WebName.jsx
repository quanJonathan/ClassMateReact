import { Box, styled } from "@mui/material";
import { NavLink } from "react-router-dom";

function AppName({width}) {
  const CustomLink = styled(NavLink)(({ theme }) => ({
    
    cursor: "pointer",
    textDecoration: "none",
    width: width || "auto",
    justifyContent: "flex-start",
    [theme.breakpoints.down("md")]: {
      justifyContent: "center",
      width: "100%",
      display: "flex"
    },
    [theme.breakpoints.down("sm")]: {
      display: "none"
    },
  }));


  return (
    <CustomLink to="/">
    <Box
      component="img"
      sx={{ width: width ? "100%" : 200 }}
      alt="appname"
      src="/assets/appName.png"
    />
    </CustomLink>
  );
}

export default AppName;
