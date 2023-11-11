import { Box, Container } from '@mui/material';
import WebAppBar from '../components/AppBar';
import IntroSection from '../components/IntroSection';
export default function Root() {
    
   return (
    <Box sx={{backgroundImage: "url(../src/assets/landing-background.png)",
    minHeight: "100vh",
    backgroundSize: "100%",
    backgroundRepeat: "no-repeat",
    }}>
        <Container sx={{height: "100vh"}}>
        <WebAppBar/>
        <IntroSection/>
        </Container>

    </Box>
   );
}