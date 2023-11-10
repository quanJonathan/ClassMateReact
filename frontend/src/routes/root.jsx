import { Box, Container } from '@mui/material';
import WebAppBar from '../components/AppBar';
import React from 'react';

export default function Root() {
    
   return (
    <React.Fragment>
        <WebAppBar/>
        <Container maxWidth="sm">
            <Box sx={{ bgcolor: '#cfe8fc', height: '100vh' }} />
        </Container>
    </React.Fragment>
   );
}