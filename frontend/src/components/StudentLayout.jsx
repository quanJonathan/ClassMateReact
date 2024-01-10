import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  Typography,
  styled,
} from "@mui/material";
import { useState } from "react";
import { useAuth } from "../hook/useAuth";
import {
  AddRounded,
  AssignmentRounded,
  SendOutlined,
} from "@mui/icons-material";
import { Link, useParams } from "react-router-dom";
import GradeReviewDialog from "./GradeReviewDialog";
import { useIsTeacher } from "../helpers/getCurrentRole";
import { format } from "date-fns";
import { stringAvatar } from "../helpers/stringAvator";
import axios, { HttpStatusCode } from "axios";
import { toast } from "react-toastify";

export default function StudentLayout({ course, homework }) {
  const { user, token } = useAuth();
  const [isOpen, setOpen] = useState(false);
  const { id } = useParams();
  const [isSending, setIsSending] = useState(false);
  const [comment, setComment] = useState("");
  let assignment = course?.homeworks?.find((item) => item._id === homework);
  const isTeacher = useIsTeacher(id);
  // console.log(assignment?.deadline);

  const CustomBox = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    height: "calc(90vh-80px)",
    marginTop: "40px",
    padding: "50px",
    flexDirection: "row",
    alignItems: "flex-start",
    [theme.breakpoints.down("md")]: {
      alignItems: "center",
      textAlign: "center",
      flexDirection: "column",
    },
  }));

  const sendComment = async () => {
    if (comment == "") return;
    setIsSending(true);
    console.log("sending");
    // try {
    //   const response = await axios.post(
    //     `https://classmatebe-final.onrender.com/gradeReview/${currentStudent?.gradeReview?._id}/comment`,
    //     {
    //       comment: {
    //         role: "3000",
    //         id: user?._id,
    //         content: comment,
    //       },
    //       target: "all",
    //     },
    //     {
    //       headers: {
    //         Authorization: "Bearer: " + token?.refreshToken,
    //       },
    //     }
    //   );

    //   if (
    //     response.status == HttpStatusCode.Accepted ||
    //     response.status == HttpStatusCode.Created
    //   ) {
    //     setIsSending(false);
    //     setComment("");
    //   } else {
    //     toast.error(response.statusText);
    //     setIsSending(false);
    //   }
    // } catch (e) {
    //   toast.error(e);
    // }
  };

  const handleHomework = (homework) => {
    const foundUser = homework?.doneMembers?.find(
      (m) => m.memberId === user?._id
    );
    // console.log("homework");
    // console.log(homework);
    // console.log(foundUser);
    if (isTeacher) {
      return homework?.maxScore;
    } else {
      if (foundUser && foundUser.state == "final") {
        return `${foundUser?.score}/${homework?.maxScore}`;
      } else if (foundUser && foundUser.state == "pending") {
        return "Delivered";
      } else {
        return "";
      }
    }
  };

  return (
    <>
      {!isTeacher && (
        <GradeReviewDialog
          open={isOpen}
          assignment={assignment}
          handleClose={() => setOpen(false)}
        />
      )}

      <CustomBox>
        <Avatar
          size="medium"
          edge="start"
          aria-label="account of current user"
          color="gray"
          sx={{ mr: 2 }}
        >
          <AssignmentRounded />
        </Avatar>

        <Box
          sx={{
            flexGrow: 2,
            display: "flex",
            flexDirection: "column",
            px: 3,
          }}
        >
          <Typography variant="h4" component="div">
            {assignment?.name}
          </Typography>
          <Typography>{assignment?.composition?.name}</Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Typography>
              {assignment &&
                `Due ${format(assignment.deadline, "HH:MM:ss yyyy-mm-dd")}`}
            </Typography>
            <Typography sx={{ pl: 5, fontSize: "15px", fontWeight: "600" }}>
              Grade: {handleHomework(assignment)}
            </Typography>
          </Box>

          <Box sx={{ width: "100%", mt: 10 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                margin: "10px",
                padding: "20px",
                boxShadow: "0px 1px 6px -2px black",
                justifyContent: "space-between",
                borderRadius: "15px",
              }}
            >
              <Avatar
                {...stringAvatar(
                  user ? `${user.firstName} ${user.lastName}` : "Default Name"
                )}
              ></Avatar>
              <input
                type="text"
                placeholder="Comment your thought"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{
                  border: "none",
                  padding: "15px 20px",
                  width: "100%",
                  mx: "20px",
                  fontSize: "17px",
                  outline: "none",
                }}
              />
              <IconButton onClick={sendComment} disabled={isSending}>
                <SendOutlined />
              </IconButton>
            </div>
          </Box>
          <Divider sx={{ my: 3 }} />
        </Box>

        {!isTeacher && (
          <Box sx={{ flexGrow: 1, px: 4 }}>
            <Card sx={{ p: 2, mx: 2, width: "100%" }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography gutterBottom variant="h5" component="div">
                    Your Work
                  </Typography>
                  <Typography>
                    {handleHomework(assignment) === ""
                      ? ""
                      : handleHomework(assignment) === "Delivered"
                      ? "Delivered"
                      : "Turned in"}
                  </Typography>
                </Box>
                {assignment?.doneMembers?.find(
                  (m) => m.memberId === user?._id
                ) ? (
                  <Card
                    variant="outlined"
                    sx={{ display: "flex", flexDirection: "row", p: 2 }}
                  >
                    <AssignmentRounded sx={{ mr: 2 }} />
                    <Link>{user?.studentId}.zip</Link>
                  </Card>
                ) : (
                  <Button
                    sx={{ width: "100%" }}
                    variant="outlined"
                    startIcon={<AddRounded />}
                  >
                    {" "}
                    Upload File
                  </Button>
                )}
              </CardContent>
            </Card>

            {assignment?.doneMembers?.find((m) => m.memberId === user?._id) && (
              <Button
                sx={{ m: 2 }}
                fullWidth
                variant="contained"
                onClick={() => setOpen(true)}
              >
                Grade Review
              </Button>
            )}
          </Box>
        )}
      </CustomBox>
    </>
  );
}
