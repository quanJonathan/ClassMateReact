import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import {
  Paper,
  styled
} from "@mui/material";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import AppName from "../components/WebName.jsx";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../hook/useAuth.jsx";
import { toast } from "react-toastify";



async function getClass(classId) {
    try {
  const response =  await axios
  .get(`http://localhost:3001/class/getClass/${classId}`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Access-Control-Allow-Origin": "*",
    },
  });

  return response.data;
    }
  catch(error) {
    // Handle errors here
    console.error("Error fetching class:", error);
    throw error; // Rethrow the error or handle it as needed
  }
}

export default function JoinClass() {
const { classId } = useParams();
const  url  = useLocation();

const role = url.pathname.split('/')[2] === 't' ? 'teacher' : 'student'
const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const { user, setJoining, setCurrentJoiningLink, token } = useAuth();



  useEffect(() => {
   
    if (user === null) {
      setJoining(true);
      setCurrentJoiningLink( url.pathname);
      navigate("/sign-in", { replace: true });
    } else {
      setJoining(false);
      setCurrentJoiningLink(null);
      const fetchData = async () => {
        try {
          const classData = await getClass(classId);
          setResult(classData);
        } catch (error) {
          console.error("Error fetching class:", error);
          // Handle error as needed
        }
      };
  
      fetchData();
    }
  }, [user?._id, navigate, setJoining, setCurrentJoiningLink, classId]);



  const handleJoinClass = () => {

   
   
    if (role === 'teacher'){
      // navigate(`/c/t/join/verify/${classId}`)
      axios.post(`http://localhost:3001/class/joinClassAsTeacher/${result?.classId}`, user, {
        headers: {
          Authorization: "Bearer " + token?.refreshToken,
        },
      });
      navigate("/dashboard", { replace: true });
    }
    else {
      if (user?.studentId){
        axios.post(`http://localhost:3001/class/joinClass/${result?.classId}`, user, {
        headers: {
          Authorization: "Bearer " + token?.refreshToken,
        },
      });
      navigate("/dashboard", { replace: true });
      }
      else {
        toast.warning("Student ID required! Please go to profile and update your student ID.")
      }
    }
   
  }


  return (
    <Box
    sx={{
      height: "100vh",
      paddingX: "10%",
      backgroundImage: "url(/assets/log-in.png)",
      backgroundRepeat: "no-repeat",
      backgroundColor: (t) =>
        t.palette.mode === "light" ? t.palette.grey[50] : t.palette.grey[900],
      backgroundSize: "100% 100%",
      backgroundPosition: "center",
      justifyContent: "center",
      display: "flex",
      alignItems: "center",
    }}
  >
    <CssBaseline />
    <Box
        width="100%"
        height="fit-content"
        borderRadius={7}
        sx={{
          border: "10px solid white",
          alignContent: "center",
          padding: "20px"
        }}
        component={Paper}
        elevation={6}
      >

        <Grid sx={{ width: {xs: "100%", lg: "auto"}, display: "flex", flexDirection: "column", alignItems: "center"}}>
          <Box sx={{ mt: 2, ml: 0, display: "flex", alignItems: "center",flexDirection: "column", justifyContent: "center", width: {xs: "100%", lg: "auto"} }}>
            <AppName sx={{height: "100%"}} />
            <Typography sx={{fontSize: "30px", fontWeight: 600, width: {xs: "50%", lg: "100%"}, textAlign: {xs: "center"}}} >
                {`Welcome to ${result?.className} classroom!`}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                elevation={0}
                sx={{
                    "textTransform": "none",
                    "color": "white"
                }}
                onClick={handleJoinClass}
                >
                Continue
                </Button>

          </Box>

        </Grid>
      </Box>
    </Box>
  );
}
