import { Box, Typography, styled, TextField, Button } from "@mui/material";

function GetStarted() {
    const CustomBox = styled(Box)(({ theme }) => ({
        width: "50%",
        [theme.breakpoints.down("md")]: {
          width: "85%",
        },
      }));

      const CustomButton = styled(Button)(({ theme }) => ({
        width: "30%", 
        mt: 3,
         mb: 2, 
         borderRadius: 4, 
         color: "white", 
         fontSize: "18px",
         textTransform: "none",
        [theme.breakpoints.down("md")]: {
          width: "100%",
        },
      }));

      const CustomTextField = styled(TextField)(({ theme }) => ({
        width: "50%", margin: "10px 0 10px 0",
        [theme.breakpoints.down("md")]: {
          width: "100%",
        },
      }));

    return (
        <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "100px",
          marginBottom: "100px"
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
         Get Started Now!
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
      <CustomTextField placeholder="Type your Email" variant="outlined"
      
      InputProps={{
        style: {
          borderRadius: "50px",
          paddingLeft: "20px",
          paddingRight: "20px"
        }
      }}
      />

                <CustomButton
                variant="contained"
                >
                  Submit
                </CustomButton>
        </Box>
  
    );
}
export default GetStarted