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

import { Divider, Paper } from '@mui/material';
import { NavLink } from 'react-router-dom';

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


export default function SignUp() {
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
            <Grid container component="main"
                sx={{
                    height: '105vh', paddingY: '5%', paddingX: '10%',

                    backgroundImage: 'url(../src/assets/log-in.png)',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: (t) =>
                        t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                    backgroundSize: '100% 100%',
                    backgroundPosition: 'center',
                }}>
                <CssBaseline />
                <Box xs="true" width="100%" borderRadius={7} sx={{ display: "flex", justifyContent: "space-between", border: "10px solid white" }} component={Paper} elevation={6}>
                    <Grid
                        item
                        xs={0}
                        sm={4}
                        md={6}
                        sx={{
                            // backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
                            backgroundImage: 'url(../src/assets/log-in-2.png)',

                            backgroundRepeat: 'no-repeat',

                            backgroundSize: '70%',
                            backgroundPosition: 'center',
                        }}
                    />
                    <Grid item xs={12} sm={8} md={6} square sx={{ mr: 4 }}>
                        <Grid container height='50px' spacing={1} sx={{ mt: 2, ml: 0 }}>
                            <Grid
                                item
                                xs={2}
                                sm={2}
                                sx={{
                                    // backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
                                    backgroundImage: 'url(../src/assets/appName.svg)',

                                    backgroundRepeat: 'no-repeat',

                                    backgroundPosition: 'center',
                                }}
                            />
                            <Grid item sm={4} xs="false">
                                <Divider sx={{ mt: 3, mb: 3 }} />
                            </Grid>
                            <Grid item sm={6}>
                                <Typography sx={{ mt: 1, mb: 1 }} align='center'>{"Already have an account?"}
                                    {<NavLink to="/sign-in" variant="body2"> Sign In</NavLink>}
                                </Typography>
                            </Grid>

                        </Grid>
                        <Box
                            sx={{
                                my: 4,
                                mr: 4,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >

                            {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                                <LockOutlinedIcon />
                            </Avatar> */}
                            <Typography component="h1" variant="h3" sx={{ my: 2 }}>
                                Sign Up
                            </Typography>
                            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} sm={6} pl={0}>
                                        <TextField
                                            InputProps={{ sx: { borderRadius: 10 } }}
                                            margin="normal"
                                            autoComplete="given-name"
                                            name="firstName"
                                            required
                                            fullWidth
                                            id="firstName"
                                            label="First Name"
                                            autoFocus
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            InputProps={{ sx: { borderRadius: 10 } }}
                                            margin="normal"
                                            required
                                            fullWidth
                                            id="lastName"
                                            label="Last Name"
                                            name="lastName"
                                            autoComplete="family-name"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
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
                                    </Grid>
                                    <Grid item xs={12}>
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
                                    </Grid>
                                </Grid>
                                <Box sx={{ display: "flex", justifyContent: "space-between" }} >
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

                                {/* <Copyright sx={{ mt: 5 }} /> */}

                                
                                <Grid container spacing={1} sx={{ mt: 2, ml: 0 }}>

                                    <Grid item sm={4}>
                                        <Divider sx={{ mt: 3, mb: 3 }} />
                                    </Grid>
                                    <Grid item sm={4}>
                                        <Typography sx={{ mt: 1, mb: 1 }} align='center'>{"or sign up with"}
                                        </Typography>
                                    </Grid>
                                    <Grid item sm={4}>
                                        <Divider sx={{ mt: 3, mb: 3 }} />
                                    </Grid>
                                    <Grid item container>
                                        <Button variant="outlined">
                                            Google
                                        </Button>
                                        <Button variant="outlined">
                                            Facebook
                                        </Button>
                                    </Grid>

                                </Grid>
                            </Box>
                        </Box>
                    </Grid>
                </Box>

            </Grid>
        </>
    );
}