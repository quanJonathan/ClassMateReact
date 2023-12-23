import { CropFree, MoreVert } from "@mui/icons-material";
import {
  Card,
  CardActions,
  CardContent,
  IconButton,
  Paper,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Box } from "@mui/system";

export const ClassGeneral = ({ course }) => {
  console.log(course);
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  return (
    <Box variant="main" sx={{ backgroundColor: "rgba(255, 255, 255, 1)" }}>
      <Card
        sx={{
          width: "100%",
          height: 200,
          overflow: "hidden",
          padding: 2,
          boxSizing: "border-box",
          "@media (max-width:600px)": {
            height: 150,
          },
          backgroundColor: "rgba(144, 206, 203, 0.2)",
          position: 'relative'
        }}
      >
        <CardActions sx={{ position: "relative" }}>
          <Box sx={{ position: "absolute", top: 0, left: 0, padding: 2 }}>
            <Typography variant="h3" component="div" gutterBottom>
              {course?.className}
            </Typography>
          </Box>
        </CardActions>
      </Card>
      {!isSmallScreen && (
        <Paper
          sx={{
            width: "100%",
            maxWidth: 200,
            height: 100,
            marginTop: 2,
            padding: 2,
            boxSizing: "border-box",
          }}
        >
          <Box
            component="div"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignContent: "unset",
            }}
          >
            <Typography>Course ID</Typography>
            <IconButton>
              <MoreVert />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <div>{course?.classId}</div>
            <IconButton>
              <CropFree />
            </IconButton>
          </Box>
        </Paper>
      )}
    </Box>
  );
};
