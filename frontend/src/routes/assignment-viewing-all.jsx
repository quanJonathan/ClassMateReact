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
  Tooltip,
  Typography,
  Zoom,
} from "@mui/material";
import { stringAvatar } from "../helpers/stringAvator";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { useClass } from "../hook/useClass";
import MiniDrawer from "../components/Drawer";
import Spinner from "../components/spinner";
import { calculateTotalScore } from "../hook/useHomeworks";
import { useState } from "react";
import GradeScaleDialog from "../components/GradeScaleDialog";

export const AssignmentViewingAllMain = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const [open, setOpen] = useState(false);

  const { course, members, teachers, isLoading, isError } = useClass();
  // console.log(course);

  const [expandedAccordion, setExpandedAccordion] = useState(null);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedAccordion(isExpanded ? panel : null);
  };

  const totalPercent = calculateTotalScore(
    user,
    course.homeworks,
    course?.compositions
  );
  const homeworks = course?.homeworks;

  const navigate = useNavigate();

  const showGradeScale = () => {
    // TODO document why this arrow function is empty
    setOpen(true);
  };

  const handleHomework = (homework) => {
    const foundUser = homework.doneMembers?.find(
      (m) => m.memberId === user._id
    );
    console.log("homework");
    console.log(homework);
    console.log(foundUser);
    if (foundUser && foundUser.state == "final") {
      return `${foundUser.score}/${homework.maxScore}`;
    } else {
      return "Delivered";
    }
  };

  if (isError) return <div>{isError}</div>;

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <Box
          sx={{
            position: "fixed",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "calc(100vh - 100px)",
            height: "auto",
            minHeight: "100vh",
            pl: 10,
            pr: 20,
            minWidth: "80%",
            overflowY: "auto",
          }}
        >
          <GradeScaleDialog
            open={open}
            onClose={() => setOpen(false)}
            compositions={course?.compositions}
          />
          <Stack flexDirection="row">
            <Box
              sx={{
                flexGrow: 0.9,
                display: "flex",
                alignContent: "flex-start",
                justifyContent: "flex-start",
                width: "calc(100vh - 60px)",
              }}
            >
              <Avatar
                {...stringAvatar(
                  user ? `${user.firstName} ${user.lastName}` : "Default Name",
                  { width: 70, height: 70 }
                )}
                edge="end"
                aria-label="account of current user"
                color="inherit"
              />
              <Typography variant="h4" sx={{ mb: 1, ml: 4 }}>
                {user?.firstName + " " + user?.lastName}
              </Typography>
            </Box>

            <Tooltip
              title={<h3>Show calculating methods</h3>}
              TransitionComponent={Zoom}
              sx={{ fontSize: "20px" }}
              slotProps={{
                popper: {
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [0, -14],
                      },
                    },
                  ],
                },
              }}
            >
              <Button
                variant="text"
                onClick={showGradeScale}
                sx={{ fontSize: "35px" }}
              >
                {totalPercent.score.toFixed(2) + "%"}
              </Button>
            </Tooltip>
          </Stack>
          <Divider
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              height: 1,
              margin: "5px 10px",
            }}
          />
          <Box>
            {homeworks?.map((homework) => (
              <Accordion
                disableGutters
                elevation={1}
                square
                key={homework._id}
                expanded={expandedAccordion === homework._id}
                onChange={handleAccordionChange(homework._id)}
              >
                <AccordionSummary
                  aria-controls={`panel-${homework._id}-content`}
                  id={`panel-${homework._id}-header`}
                  sx={{ backgroundColor: "#fff" }}
                >
                  <Box sx={{ width: "70%" }}>
                    <Typography
                      sx={{ flexShrink: 0, width: "30%", fontWeight: "500" }}
                    >
                      {homework?.name}
                    </Typography>

                    <Stack flexDirection="row" alignContent="flex-start">
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        sx={{
                          fontWeight: "500",
                        }}
                      >
                        {homework?.deadline == ""
                          ? "No deadline"
                          : "Due at " +
                            format(homework?.deadline, "HH:mm yyyy-MM-dd")}
                        {" " + homework?.composition?.name}
                      </Typography>
                    </Stack>
                  </Box>
                  <Typography
                    sx={{ pl: 5, fontSize: "15px", fontWeight: "600" }}
                  >
                    {handleHomework(homework)}
                  </Typography>
                  <Stack justifyContent="space-between"></Stack>
                </AccordionSummary>
                <AccordionDetails>
                  <Divider />
                </AccordionDetails>
                <AccordionActions sx={{ justifyContent: "flex-start" }}>
                  <Button
                    variant="text"
                    onClick={() =>
                      navigate(`/c/${id}/a/${homework?._id}/details`)
                    }
                  >
                    View details
                  </Button>
                </AccordionActions>
              </Accordion>
            ))}
          </Box>
        </Box>
      )}
    </>
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
