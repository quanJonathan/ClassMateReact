import { Box, Container } from "@mui/material";
import IntroSection from "../components/IntroSection";
import ImpactSection from "../components/ImpactSection";
import CoursesSection from "../components/CoursesSection";
import BenefitSection from "../components/BenefitSection";
import GetStarted from "../components/GetStarted";
import Footer from "../components/Footer";
import SwipeableTemporaryDrawer from "../components/Drawer";
export default function Root() {
  return (
    <Box
    sx={{
      position: "absolute",
      top: 0,
      right: 0,
      left: 0,
      minHeight: "100vh"
    }}
  >
    <SwipeableTemporaryDrawer/>
  </Box>
  );
}
