import { styled, Typography, Box } from "@mui/material";

function BenefitSection() {
  const CustomBox = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    gap: theme.spacing(5),
    height: "calc(90vh-80px)",
    marginTop: "100px",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
    },
  }));

  const BenefitBox = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    borderStyle: "solid",
    borderColor: "#B6A5FF",
    borderRadius: "16px",
    padding: "2px 20px 2px 20px",
    margin: "10px",
    [theme.breakpoints.down("md")]: {
      justifyContent: "center",
    },
    "&:hover": {
      backgroundColor: "#B6A5FF",
      color: "#FFF",
    },
  }));

  const Title = styled(Typography)(({ theme }) => ({
    fontSize: "40px",
    fontWeight: "bold",
    color: "#000339",
    my: 3,
    textAlign: "right",
    [theme.breakpoints.down("md")]: {
      fontSize: "30px",
      textAlign: "center",
    },
  }));
  return (
    <CustomBox>
      <Box sx={{ flex: "1.5" }}>
        <img
          alt="benefit"
          src="/assets/benefits.png"
          style={{ width: "100%", marginBottom: "2rem" }}
        />
      </Box>
      <Box
        sx={{
          flex: "1",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Title>Benefits from Online Learning</Title>

        <BenefitBox>
          <img
            alt="degree"
            src="/assets/degree.svg"
            style={{ width: "50px", height: "50px", margin: "10px" }}
          />
          <Typography variant="h5">Online Degree</Typography>
        </BenefitBox>

        <BenefitBox>
          <img
            alt="course"
            src="/assets/courses.svg"
            style={{ width: "50px", height: "50px", margin: "10px" }}
          />
          <Typography variant="h5">Short Courses</Typography>
        </BenefitBox>

        <BenefitBox>
          <img
            alt="trainer"
            src="/assets/trainer.svg"
            style={{ width: "50px", height: "50px", margin: "10px" }}
          />
          <Typography variant="h5">Expert Training</Typography>
        </BenefitBox>
      </Box>
    </CustomBox>
  );
}

export default BenefitSection;
