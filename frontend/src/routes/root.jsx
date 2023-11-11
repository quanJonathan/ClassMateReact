import { Box, Container } from '@mui/material';
import WebAppBar from '../components/AppBar';
import IntroSection from '../components/IntroSection';
import ImpactSection from '../components/ImpactSection';
export default function Root() {
    
   return (
    <Box sx={{backgroundImage: "url(../src/assets/landing-background.png)",
    position: 'relative',
    minHeight: "100vh",
    backgroundSize: "100%",
    backgroundRepeat: "no-repeat",
    }}>
        <Container>
        <WebAppBar/>
        <IntroSection/>
        <ImpactSection/>
        </Container>

    </Box>
   );
}