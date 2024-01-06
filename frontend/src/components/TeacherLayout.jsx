import { Box, Button, Divider, Typography, styled } from "@mui/material";
import React, { useEffect, useState } from "react";
import CourseCard from "./CourseCard";
import { useAuth } from "../hook/useAuth";
import ClassCard from "./ClassCard";

export default function TeacherLayout({course}) {
  const { user, readFromStorage } = useAuth();


  const CustomBox = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    height: "calc(90vh-80px)",
    marginTop: "100px",
    padding: "20px",
    flexDirection: "column",
    [theme.breakpoints.down("md")]: {
      alignItems: "center",
      textAlign: "center",
    },
  }));
  const CourseBoxes = styled(Box)(({ theme }) => ({
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "left",
    alignItems: "center",
    flexDirection: "row",
    width: "calc(100%-240px)",
    [theme.breakpoints.down("md")]: {
      marginBottom: "0",
      flexDirection: "column",
    },
  }));

  const CustomButton = styled(Button)(({ theme }) => ({
    width: "15%",
    mt: 3,
    mb: 2,
    borderRadius: 4,
    color: "white",
    fontSize: "14px",
    textTransform: "none",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
    display: "flex",
  }));

  return (
    <>
    
        <CustomBox>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Typography variant="h4">Hello, {user?.firstName || ""}</Typography>
            <Divider
              sx={{
                ml: 2,
                mr: 2,
                display: { xs: "none", md: "flex" },
                width: "50%",
              }}
            ></Divider>
          </Box>
          
              </CustomBox>
    </>
  );
}
