import {
  Box,
  Button,
  Typography,
  Tab,
  Tabs,
  Paper,
  Divider,
  ListItem,
  ListItemText,
  List,
  Checkbox,
  Select,
  Avatar,
  Link,
  MenuItem,
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import {
  Close,
  PeopleAltRounded,
  SendOutlined,
  Settings,
} from "@mui/icons-material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { alpha } from "@mui/material/styles";
import PropTypes from "prop-types";
import { useState } from "react";
import { useAuth } from "../hook/useAuth";
import StudentLayout from "./StudentLayout";
import { useNavigate, useParams } from "react-router-dom";
import OptionMenu from "./OptionMenu";
import { stringAvatar } from "../helpers/stringAvator";
import { Stack } from "@mui/system";
import Spinner from "../components/spinner";
import { useGradeReview } from "../hook/useGradeReview";
import { useHomeworks } from "../hook/useHomeworks";
import axios, { HttpStatusCode } from "axios";
import { toast } from "react-toastify";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 2 }}>
          <Paper elevation={0}>{children}</Paper>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const StudentHomeworkPage = ({ course, homeworkId }) => {
  const [selectedValue, setSelectedValue] = useState("first");
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };
  const { user, token } = useAuth();
  const homework = course?.homeworks?.find(
    (h) => h._id.toString() == homeworkId.toString()
  );

  const [isAll, setIsAll] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const [currentStudent, setCurrentStudent] = useState(null);
  const { gradeReviews, isLoading, isError } = useGradeReview();
  const [comment, setComment] = useState("");
  const { headers, rows } = useHomeworks(
    course?.members,
    [homework],
    course?.compositions,
    gradeReviews
  );

  // console.log(homework);
  const doneMembers = homework?.doneMembers;
  // console.log(doneMembers);
  const getData = (data) => {
    // console.log(data);
    setCurrentStudent(data);
    setComment("");
  };

  const sendComment = async () => {
    if (comment == "") return;
    setIsSending(true);
    console.log("sending");
    try {
      const response = await axios.post(
        `http://localhost:3001/gradeReview/${currentStudent?.gradeReview?._id}/comment`,
        {
          comment: {
            role: "3000",
            id: user?._id,
            content: comment,
          },
          target: currentStudent.user._id,
        },
        {
          headers: {
            Authorization: "Bearer: " + token?.refreshToken,
          },
        }
      );

      if (
        response.status == HttpStatusCode.Accepted ||
        response.status == HttpStatusCode.Created
      ) {
        setIsSending(false);
        setComment("");
      } else {
        toast.error(response.statusText);
        setIsSending(false);
      }
    } catch (e) {
      toast.error(e);
    }
  };

  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <Box sx={{ pt: 4, m: 0 }}>
      <Stack
        flexDirection="row"
        alignContent="flex-start"
        justifyContent="space-between"
        sx={{
          minWidth: 20,
          top: "64px",
          ml: 3,
          p: 2,
        }}
      >
        <Stack flexDirection="row">
          <Button variant="contained">Return homework</Button>
          <IconButton sx={{ ml: 4 }}>
            <EmailOutlinedIcon sx={{ height: 30, width: 30 }} />
          </IconButton>
        </Stack>
        <OptionMenu actionIcon={<Settings sx={{ height: 30, width: 30 }} />} />
      </Stack>
      <Box
        display="flex"
        sx={{
          minHeight: "90%",
          height: "100vh",
          borderTop: "1px solid #ddd",
          m: 0,
          p: 0,
        }}
      >
        <Box
          sx={{
            flex: 1,
            borderRight: "1px solid #ddd",
            minHeight: "100%",
          }}
        >
          <List>
            <ListItem>
              <Checkbox sx={{ ml: 1 }} />
              <Avatar sx={{ backgroundColor: "black" }}>
                <PeopleAltRounded />
              </Avatar>
              <ListItemText sx={{ ml: 1 }}>
                <Link
                  underline="hover"
                  color="black"
                  key={"all-students"}
                  sx={{ cursor: "pointer", ":hover": { color: "black" } }}
                  onClick={() => {
                    setIsAll(true);
                    setCurrentStudent(null);
                  }}
                >
                  All students
                </Link>
              </ListItemText>
            </ListItem>
            <ListItem>
              <Select
                label="Sort"
                value={selectedValue}
                onChange={handleChange}
                autoWidth
                sx={{
                  minWidth: "10",
                  ml: 6,
                }}
              >
                <MenuItem value="first">Group by First Name</MenuItem>
                <MenuItem value="last">Group by Last Name</MenuItem>
              </Select>
            </ListItem>
            {rows?.map((m, index) => (
              <ListItem key={m?._id} sx={{ border: "1px solid #eee" }}>
                <Checkbox sx={{ ml: 1 }} />
                <Avatar
                  {...stringAvatar(
                    m
                      ? `${m.user.firstName} ${m.user.lastName}`
                      : "Default Name"
                  )}
                  size="small"
                  edge="end"
                  aria-label="account of current user"
                  color="inherit"
                />
                <ListItemText
                  sx={{
                    borderRight: "1px solid #ddd",
                    flex: 2,
                    ml: 1,
                    flexGrow: 2,
                  }}
                >
                  <Link
                    color="black"
                    underline="hover"
                    key={m._id}
                    sx={{
                      cursor: "pointer",
                      ":hover": { color: "black" },
                      fontSize: "15px",
                    }}
                    onClick={() => {
                      setCurrentStudent(m);
                      setIsAll(false);
                      getData(m);
                    }}
                  >
                    {m?.user.firstName} {m?.user.lastName}
                  </Link>
                </ListItemText>
              </ListItem>
            ))}
          </List>
        </Box>
        {isAll ? (
          <Box
            display="flex"
            flexDirection="column"
            sx={{
              flex: 1.5,
              minHeight: "100%",
              height: "100%",
              p: 4,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: "500" }}>
              {course?.className}
            </Typography>
            <Typography>{doneMembers?.length} graded</Typography>
          </Box>
        ) : (
          <Box
            display="flex"
            flexDirection="column"
            sx={{
              flex: 2,
              maxHeight: "80%",
              height: "70%",
              p: 4,
              borderBottom: "1px solid #ddd",
            }}
          >
            {isLoading ? (
              <Spinner />
            ) : (
              <>
                <IconButton sx={{ right: 0, top: 0, position: "absolute" }}>
                  <Close />
                </IconButton>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <Avatar
                    {...stringAvatar(
                      currentStudent
                        ? `${currentStudent?.user.firstName} ${currentStudent?.user.lastName}`
                        : "Default Name",
                      { width: 40, height: 40 }
                    )}
                    edge="end"
                    aria-label="account of current user"
                    color="inherit"
                  />
                  <Link
                    underline="hover"
                    color="black"
                    sx={{ ":hover": { color: "black" }, pl: 2 }}
                    onClick={() => {
                      navigate(`${id}/a/${homework?._id}/details`);
                    }}
                  >
                    {currentStudent?.user.firstName}{" "}
                    {currentStudent?.user.lastName}
                  </Link>
                </Box>

                {currentStudent?.homeworks[0]?.score == "" ? (
                  <Typography>No score</Typography>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      pt: 2,
                    }}
                  >
                    <Typography sx={{ fontWeight: 600 }}>
                      Grade: {currentStudent.homeworks[0].score}/
                      {homework?.maxScore}
                    </Typography>

                    {/* <Typography>
                      {homework?.composition?.gradeScale /
                        homework?.composition?.homeworks?.length}
                      %
                    </Typography> */}
                  </Box>
                )}
                <Divider sx={{ m: 2 }} />
                {currentStudent?.gradeReview != null && (
                  <List
                    sx={{ maxHeight: "50%", overflowY: "auto", height: "auto" }}
                  >
                    <ListItem
                      key={currentStudent?.gradeReview?._id}
                      sx={{ width: "100%" }}
                    >
                      <Card
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          px: 2,
                          pt: 2,
                          width: "100%",
                        }}
                      >
                        <CardContent>
                          <Typography sx={{ fontWeight: 600 }}>
                            Expected Grade:{" "}
                            {currentStudent?.gradeReview?.expectedGrade}
                          </Typography>
                          <Typography sx={{ fontWeight: 600, pb: 2 }}>
                            Explanation
                          </Typography>
                          <Typography>
                            {currentStudent?.gradeReview?.studentExplanation}
                          </Typography>
                        </CardContent>
                      </Card>
                    </ListItem>
                    {currentStudent?.gradeReview?.comments?.map((c) => (
                      <ListItem
                        key={c?.userId?._id}
                        sx={{
                          pl: c?.userId?._id == user?._id ? 60 : 0,
                        }}
                      >
                        <Link underline="none" color="blue">
                          {c?.userId?.email}
                        </Link>
                        <Typography sx={{ ml: 2 }}>{c?.content}</Typography>
                      </ListItem>
                    ))}
                  </List>
                )}
              </>
            )}{" "}
            {currentStudent?.gradeReview != null && (
              <Box sx={{ width: "100%" }}>
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
                      user
                        ? `${user.firstName} ${user.lastName}`
                        : "Default Name"
                    )}
                  ></Avatar>
                  <input
                    type="text"
                    placeholder="Give feedback"
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
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default function TeacherLayout({ course }) {
  const { user, readFromStorage } = useAuth();
  const [value, setValue] = useState(0);
  const { id, homeworkId } = useParams();

  const tabLabels = ["Guide", "Student homework"];

  const maxTabWidth = Math.max(...tabLabels.map((label) => label.length));

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ p: 0 }}>
      <Box
        sx={{
          position: "sticky",
          width: "96%",
          bgcolor: "white",
          zIndex: 1000,
          backgroundColor: (theme) =>
            alpha(theme.palette.background.default, 0.6),
          backdropFilter: "blur(10px)",
          borderBottom: "0px solid rgba(0,0,0,0.3)",
          display: "flex",
          justifyContent: "flex-start",
          alignContent: "flex-start",
          ml: 2,
          top: "64px",
          "@media screen and (max-width: 500px)": {
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            ml: 3,
          },
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          sx={{
            "& button:focus": {
              outline: "none",
            },
            flexShrink: 0,
            flexGrow: 1,
          }}
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabLabels.map((label) => (
            <Tab
              key={`tab-${label}`}
              label={label}
              style={{ minWidth: `${maxTabWidth}px` }}
            />
          ))}
        </Tabs>
        <Divider
          sx={{
            borderBottomWidth: "10px",
            borderColor: "rgba(0, 0, 0, 0.12)",
          }}
        />
      </Box>

      <TabPanel value={value} index={0}>
        <StudentLayout course={course} homework={homeworkId} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <StudentHomeworkPage course={course} homeworkId={homeworkId} />
      </TabPanel>
    </Box>
  );
}
