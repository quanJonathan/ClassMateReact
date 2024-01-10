import { Box, styled, Typography, Chip, IconButton } from "@mui/material";
import { More, PlayCircle, Star } from "@mui/icons-material";
import { Link } from "react-router-dom";
function CourseCard({ item, courseWidth, courseHeight }) {
  const CourseBox = styled(Box)(({ theme }) => ({
    maxWidth: courseWidth || 300,
    height: courseHeight || 400,
    backgroundColor: "#fff",
    borderTopLeftRadius: "20px",
    borderTopRightRadius: "20px",
    fontSize: courseWidth ? "0.5rem" : "1rem",
    boxShadow:
      "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    margin: theme.spacing(5, 2, 4, 2),
    [theme.breakpoints.down("md")]: {
      margin: theme.spacing(2, 0, 2, 0),
    },
  }));

  return (
    <CourseBox>
      <Box
        sx={{
          height: "40%",
          position: "relative",
        }}
      >
        <img
          style={{
            width: "100%",
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
            height: "100%",
          }}
          alt={item.id}
          src={item.img}
        />
        <Chip
          sx={{
            position: "absolute",
            top: "8px",
            left: "8px",
          }}
          style={{ backgroundColor: "#FFF" }}
          label={
            <Box sx={{ color: "#000", fontWeight: "medium", fontSize: "12px" }}>
              Creative
            </Box>
          }
        />
      </Box>

      <Box
        sx={{
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography sx={{ fontWeight: "700", color: "#0B036B" }}>
          {item.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            my: 2,
            textAlign: "center",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: "2",
            WebkitBoxOrient: "vertical",
          }}
        >
          {item.description}
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            height: "40px",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <PlayCircle color="primary" sx={{ margin: "10px" }} />
            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: courseWidth ? "12px" : "14px",
              }}
            >
              12x Lessons
            </Typography>
          </Box>
          <Chip
            label={
              <Box
                sx={{
                  color: "#FFF",
                  fontWeight: "medium",
                  display: "flex",
                  alignItems: "center",
                  fontSize: courseWidth ? "12px" : "10px",
                  justifyContent: "center",
                }}
              >
                4.9
                <Star
                  sx={{
                    color: "#FFD700",
                    height: courseWidth ? "15px" : "20px",
                    width: courseWidth ? "15px" : "20px",
                    margin: "3px",
                  }}
                />
              </Box>
            }
            color="primary"
          />
        </Box>
      </Box>
    </CourseBox>
  );
}

export default CourseCard;
