import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';

import { Paper } from '@mui/material';
import WebAppBar from '../component/AppBar';

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}


export default function SignIn() {
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            email: data.get('email'),
            password: data.get('password'),
        });
    };

    return (
        <>
        <WebAppBar/>
        <Grid container component="main"
            sx={{
                height: '100vh', p: '5%',

                backgroundImage: 'url(../src/assets/log-in.png)',
                backgroundRepeat: 'no-repeat',
                backgroundColor: (t) =>
                    t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                backgroundSize: '100% 100%',
                backgroundPosition: 'center',
            }}>
            <CssBaseline />
            <Box  xs={true} width="100%" borderRadius={7} sx={{display: "flex", justifyContent: "space-between", border:"10px solid white" }} component={Paper} elevation={6}>
            <Grid
                item
                xs={false}
                sm={4}
                md={7}
                sx={{
                    // backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
                    backgroundImage: 'url(../src/assets/log-in-2.png)',

                    backgroundRepeat: 'no-repeat',
                    
                    backgroundSize: '70%',
                    backgroundPosition: 'center',
                }}
            />
            <Grid item xs={12} sm={8} md={5}  square>
                <Box
                    sx={{
                        my: 8,
                        mx: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h3">
                        Welcome Back
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            InputProps={{ sx: { borderRadius: 10 } }}
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            InputProps={{ sx: { borderRadius: 10 } }}
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <Box sx={{display: "flex", justifyContent: "space-between"}} >
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="Remember me"
                            />
                            <Link href="#" variant="body2" alignSelf="center">
                                Forgot password?
                            </Link>
                        </Box>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, borderRadius: 4, color: "white" }}
                        >
                            Sign In
                        </Button>

                        <Link href="#" variant="body2">
                            {"Don't have an account? Sign Up"}
                        </Link>

                        <Copyright sx={{ mt: 5 }} />
                    </Box>
                </Box>
            </Grid>
            </Box>

        </Grid>
         </>
    );
}