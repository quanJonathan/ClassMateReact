import { Box, Button, Divider, Typography, styled } from "@mui/material";
import React, { useEffect, useState } from "react";
import CourseCard from "./CourseCard";
import { useAuth } from "../hook/useAuth";
import ClassCard from "./ClassCard";

export default function HomeContent() {
  const { user, readFromStorage } = useAuth();

  // const courses = [
  //   {
  //     id: "1",
  //     img: "/assets/writing.jpg",
  //     title: "Creative Writing",
  //     description:
  //       "Lorem ipsum dolor sit amet, in sed integer. Scelerisque nam evget imperdiet accumsan, ipsum  turpis cursus. In elit amet, tortor nunc.",
  //   },

  //   {
  //     id: "2",
  //     img: "/assets/webdev.jpg",
  //     title: "Web Development",
  //     description:
  //       "Lorem ipsum dolor sit amet, in sed integer. Scelerisque nam evget imperdiet accumsan, ipsum  turpis cursus. In elit amet, tortor nunc.",
  //   },

  //   {
  //     id: "3",
  //     img: "/assets/graphic.jpg",
  //     title: "Graphic Design",
  //     description:
  //       "Lorem ipsum dolor sit amet, in sed integer. Scelerisque nam evget imperdiet accumsan, ipsum  turpis cursus. In elit amet, tortor nunc.",
  //   },
  //   {
  //     id: "4",
  //     img: "/assets/writing.jpg",
  //     title: "Creative Writing",
  //     description:
  //       "Lorem ipsum dolor sit amet, in sed integer. Scelerisque nam evget imperdiet accumsan, ipsum  turpis cursus. In elit amet, tortor nunc.",
  //   },

  //   {
  //     id: "5",
  //     img: "/assets/webdev.jpg",
  //     title: "Web Development",
  //     description:
  //       "Lorem ipsum dolor sit amet, in sed integer. Scelerisque nam evget imperdiet accumsan, ipsum  turpis cursus. In elit amet, tortor nunc.",
  //   },
  // ];

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
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignContent: 'flex-start'
    },
    display: "flex",
  }));

  return (
    <>
      {/* {isLoading ? (
        <Typography>Loading</Typography>
      ) : ( */}
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
          {/* <Typography
            variant="body2"
            sx={{
              fontSize: "16px",
              fontWeight: "500",
              color: "#5A6473",
            }}
          >
            Recent Courses
          </Typography> */}

          <CourseBoxes>
            {user?.classes?.map((course) => (
              <ClassCard
                key={course?.classId?._id}
                item={course}
                user={user}
              />
            ))}
          </CourseBoxes>
          </CustomBox>
          {/* <Box
            sx={{
              justifyContent: "center",
              display: "flex",
            }}
          >
            <CustomButton variant="contained">View More</CustomButton>
          </Box>
          <Typography
            variant="body2"
            sx={{
              fontSize: "16px",
              fontWeight: "500",
              color: "#5A6473",
            }}
          >
            Favorite Courses
          </Typography>

          <CourseBoxes>
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                item={course}
                courseWidth={200}
                courseHeight={300}
              />
            ))}
          </CourseBoxes>
          <Box
            sx={{
              justifyContent: "center",
              display: "flex",
            }}
          >
            <CustomButton variant="contained">View More</CustomButton>
          </Box>
        </CustomBox> */}
      {/* )} */}
    </>
  );
}
