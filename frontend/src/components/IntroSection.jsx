import { Button, styled, Typography} from '@mui/material'
import { Box } from '@mui/system';
// const subName1 = "CLASS";
// const subName2 = "MATE";

function IntroSection() {
    const CustomBox = styled(Box)(({ theme }) => ({
        display: "flex",
        justifyContent: "center",
        gap: theme.spacing(5),
        height: "calc(90vh-80px)",
        marginTop: "150px",
        [theme.breakpoints.down("md")]: {
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        },
      }));
    
      const Title = styled(Typography)(({ theme }) => ({
        [theme.breakpoints.down("sm")]: {
          fontSize: "40px",
        },
      }));
  return (
    <CustomBox>
        <Box sx={{ flex: "1", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                <Typography variant="h4">Your Learning</Typography>
                <Title variant="h2" sx={{
                     backgroundImage: `linear-gradient(45deg, #5514B4, #FF80FF)`,
                     backgroundSize: "100%",
                     backgroundRepeat: "repeat",
                     backgroundClip: "text",
                     WebkitBackgroundClip: "text",
                     WebkitTextFillColor: "transparent",
                     fontWeight: "medium"
                }}>Pathway</Title>
                <Typography sx={{my: 4, fontSize: "18px"}}>
                “Online education is electronically supported learning that relies on the Internet for teacher/student interaction and the distribution of class materials.”
                </Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 3, mb: 2, borderRadius: 4, color: "white", fontSize: "18px", textTransform: "none" }}
                >
                  Read More
                </Button>

           </Box>
             <Box sx={{ flex: "2" }}
          >
           <img
            alt='classmate'
            src='../src/assets/log-in-2.png'
            style={{ width: "100%", marginBottom: "2rem" }}
            />  
          </Box>
           
    </CustomBox>
  );
}

export default IntroSection;
