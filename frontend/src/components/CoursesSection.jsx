import { Box, Typography, styled } from "@mui/material";
import CourseCard from "./CourseCard";

function CoursesSection() {
    const courses = [
        {
          id: "1",
          img: "../src/assets/writing.jpg",
          title: "Creative Writing",
          description: "Lorem ipsum dolor sit amet, in sed integer. Scelerisque nam evget imperdiet accumsan, ipsum  turpis cursus. In elit amet, tortor nunc."
        },
      
        {
            id: "2",
            img: "../src/assets/webdev.jpg",
            title: "Web Development",
            description: "Lorem ipsum dolor sit amet, in sed integer. Scelerisque nam evget imperdiet accumsan, ipsum  turpis cursus. In elit amet, tortor nunc."
          },

          {
            id: "3",
            img: "../src/assets/graphic.jpg",
            title: "Graphic Design",
            description: "Lorem ipsum dolor sit amet, in sed integer. Scelerisque nam evget imperdiet accumsan, ipsum  turpis cursus. In elit amet, tortor nunc."
          },
      ];
    const CustomBox = styled(Box)(({ theme }) => ({
        width: "50%",
        [theme.breakpoints.down("md")]: {
          width: "85%",
        },
      }));

      const CourseBoxes = styled(Box)(({ theme }) => ({
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        [theme.breakpoints.down("md")]: {
          width: "100%",
          marginBottom: "0",
          flexDirection: "column",
        }
      }));
    return (
        <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "5%",
            height: "5px",
            backgroundColor: "#000339",
            margin: "0 auto",
          }}
        ></div>
  
        <Typography
          variant="h3"
          sx={{ fontSize: "25px", fontWeight: "bold", color: "#000339", my: 3 }}
        >
          Our Popular Courses
        </Typography>

        <CustomBox>
        <Typography
          variant="body2"
          sx={{
            fontSize: "16px",
            fontWeight: "500",
            color: "#5A6473",
            textAlign: "center",
          }}
        >
          Lorem ipsum dolor sit amet, in sed integer. Scelerisque nam evget imperdiet accumsan, ipsum  turpis cursus. In elit amet, tortor nunc.
        </Typography>
      </CustomBox>

      <CourseBoxes>
      {courses.map((course) => (
            <CourseCard
              key={course.id}
              item={course}
            />
          ))}

      </CourseBoxes>
        </Box>
  
    );
}
export default CoursesSection