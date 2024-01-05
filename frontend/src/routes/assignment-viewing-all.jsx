import { Stack } from "@mui/system";
import { useAuth } from "../hook/useAuth";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Divider,
  Icon,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { stringAvatar } from "../helpers/stringAvator";
import { useNavigate, useParams } from "react-router-dom";
import { useHomeworks } from "../hook/useHomeworks";
import { AssignmentOutlined } from "@mui/icons-material";
import { useCalculate } from "../hook/useCalculate";
import { format } from "date-fns";
import { useClass } from "../hook/useClass";
import MiniDrawer from "../components/Drawer";

export const AssignmentViewingAllMain = (course) => {
  const { user } = useAuth();
  const { id, homeworkId } = useParams();

  const totalPercent = useCalculate();
  const homeworks = course?.homeworks;

  const navigate = useNavigate();

  const showGradeScale = () => {};

  const handleHomework = (homework) => {
    const foundUser = homework.doneMembers?.find((m) => m.memberId == user._id);
    if (foundUser && foundUser.state == "final") {
      return `${foundUser.score}/${homework.maxScore}`;
    } else {
      return "Delivered";
    }
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignContent: "center" }}
    >
      <Stack>
        <Box>
          <Avatar
            {...stringAvatar(
              user ? `${user.firstName} ${user.lastName}` : "Default Name"
            )}
            size="medium"
            edge="end"
            aria-label="account of current user"
            color="inherit"
            sx={{ mr: 2 }}
          />
          <Typography variant="h2">
            {user?.firstName + " " + user?.lastName}
          </Typography>
        </Box>
        <Typography variant="button" onClick={showGradeScale}>
          {totalPercent + "%"}
        </Typography>
      </Stack>
      <Divider />
      <Box>
        {homeworks?.map((homework) => (
          <Accordion disableGutters elevation={1} square key={homework._id}>
            <AccordionSummary
              aria-controls={`panel-${homework._id}-content`}
              id={`panel-${homework._id}-header`}
              sx={{ p: 1, mb: 0, backgroundColor: "#fff" }}
            >
              <div style={{ flexGrow: 1 }}>
                <Typography
                  sx={{ flexShrink: 0, width: "40%", fontWeight: "500" }}
                >
                  {homework?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {() => handleHomework(homework)}
                </Typography>
              </div>
              <Stack justifyContent="space-between">
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{
                    fontWeight: "400",
                    flexGrow: 1,
                    minHeight: 0,
                    width: "80%",
                  }}
                >
                  {homework?.deadline == ""
                    ? "No deadline"
                    : "Due at " +
                      format(homework?.deadline, "HH:mm yyyy-MM-dd")}
                  {" " + homework?.composition.name}
                </Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <Divider />
            </AccordionDetails>
            <AccordionActions sx={{ justifyContent: "flex-start" }}>
              <Button
                variant="text"
                onClick={() => navigate(`/c/${id}/a/${homework?._id}/details`)}
              >
                View details
              </Button>
            </AccordionActions>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
};

const AssignmentViewingAll = () => {
  const { id, homeworkId } = useParams();
  const { course, isLoading, isError, ...other } = useClass();
  return (
    <Box
      sx={{
        display: "flex",
        position: "absolute",
        top: 0,
        right: 0,
        left: 0,
        minHeight: "100vh",
      }}
    >
      <MiniDrawer page="AssignmentViewingAll" children={course} />
    </Box>
  );
};

export default AssignmentViewingAll;
