import { Avatar, Box, Button, Card, CardContent, CardHeader, Divider, Typography, styled } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAuth } from "../hook/useAuth";
import { AddRounded, AssignmentRounded } from "@mui/icons-material";
import { Link } from "react-router-dom";
import GradeReviewDialog from "./GradeReviewDialog";

export default function StudentLayout({course, homework}) {
  const { user } = useAuth();
  const [isOpen, setOpen] = useState(false);
  let assignment = course?.homeworks?.find( item => item._id === homework );
  console.log(assignment);

  const CustomBox = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    height: "calc(90vh-80px)",
    marginTop: "100px",
    padding: "50px",
    flexDirection: "row",
    alignItems: "flex-start",
    [theme.breakpoints.down("md")]: {
      alignItems: "center",
      textAlign: "center",
      flexDirection: "column",
    },
  }));
  
  const handleHomework = (homework) => {
    const foundUser = homework?.doneMembers?.find(
      (m) => m.memberId === user._id
    );
    console.log("homework");
    console.log(homework);
    console.log(foundUser);
    if (foundUser && foundUser.state == "final") {
   
      return `${foundUser.score}/${homework.maxScore}`;
    } else if (foundUser && foundUser.state == "pending") {
     
      return "Delivered";
    }
    else {
    return "";
    }
  };



  return ( 
        <>
           <GradeReviewDialog
        open={isOpen}
        assignment={assignment}
        handleClose={() => setOpen(false)}
      />
        <CustomBox>
            <Avatar
              size="medium"
              edge="start"
              aria-label="account of current user"
              color="gray"
              sx={{mr:2}}
            >
            <AssignmentRounded/>
            </Avatar>

            <Box
            sx={{
                flexGrow: 2,
                display: "flex",
                flexDirection: "column",
                px:3
              }}
            >
            <Typography
            variant="h4"
            component="div"
           >{assignment?.name}
            </Typography>
            <Typography>{assignment?.composition?.name}</Typography>
            <Box sx={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
            <Typography>Due {assignment?.deadline}</Typography>
            <Typography
                    sx={{ pl: 5, fontSize: '15px', fontWeight: '600'}}
                  >
                    Grade: {handleHomework(assignment)}
                  </Typography>
            </Box>
            <Divider sx={{my: 3}} />
            </Box>

            <Box sx={{flexGrow: 1, px: 4}}>
            <Card sx={{p:2, mx: 2, width: "100%"}}>
            <CardContent>
                <Box sx={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
        <Typography gutterBottom variant="h5" component="div">
          Your Work
        </Typography>
        <Typography>{ handleHomework(assignment) === "" ? "" : (handleHomework(assignment) === "Delivered"? "Delivered" : "Turned in")}</Typography>
        </Box>
        { assignment?.doneMembers?.find(
      (m) => m.memberId === user._id) ?
            (<Card variant="outlined" sx={{display: "flex", flexDirection: "row", p: 2}}>
            <AssignmentRounded sx={{mr: 2}}/>
            <Link>{user?.studentId}.zip</Link>
        </Card>) : (
            <Button sx={{width: "100%"}}   variant="outlined" startIcon={<AddRounded />}> Upload File</Button>
        )
        }
       
        </CardContent>
            </Card>

            { assignment?.doneMembers?.find(
      (m) => m.memberId === user._id) && <Button sx={{m: 2}} fullWidth variant="contained" onClick={()=> setOpen(true)}>Grade Review</Button>}
            </Box>
        
    </CustomBox>
    </>
  );
}
