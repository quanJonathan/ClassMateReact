import { styled, Box, Typography } from "@mui/material";
import { WatchLater, Groups, Public } from "@mui/icons-material";
function ImpactSection() {
  const ImpactBoxes = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
    [theme.breakpoints.down("sm")]: {
      marginBottom: "0",
      flexDirection: "column",
    },
  }));

  const ImpactBox = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
    borderRadius: "16px",
    borderColor: "#B6A5FF",
    borderStyle: "solid",
    width: "200px",
    padding: "20px",
    marginLeft: "50px",
    marginRight: "50px",
    [theme.breakpoints.down("sm")]: {
      margin: theme.spacing(2, 0, 2, 0),
    },
  }));
  return (
    <ImpactBoxes>
      <ImpactBox>
        <WatchLater color="primary" sx={{ width: "50px", height: "50px" }} />
        <Typography
          variant="h5"
          sx={{
            fontWeight: "500",
            fontSize: "20px",
            color: "#3B3c45",
            my: 1,
          }}
        >
          60,000+
        </Typography>
        <Typography>Hours</Typography>
      </ImpactBox>

      <ImpactBox>
        <Groups color="primary" sx={{ width: "50px", height: "50px" }} />
        <Typography
          variant="h5"
          sx={{
            fontWeight: "500",
            fontSize: "20px",
            color: "#3B3c45",
            my: 1,
          }}
        >
          1,000,000+
        </Typography>
        <Typography>Students</Typography>
      </ImpactBox>

      <ImpactBox>
        <Public color="primary" sx={{ width: "50px", height: "50px" }} />
        <Typography
          variant="h5"
          sx={{
            fontWeight: "500",
            fontSize: "20px",
            color: "#3B3c45",
            my: 1,
          }}
        >
          110+
        </Typography>
        <Typography>Countries</Typography>
      </ImpactBox>
    </ImpactBoxes>
  );
}

export default ImpactSection;
