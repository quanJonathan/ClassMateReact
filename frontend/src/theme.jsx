import { createTheme, responsiveFontSizes } 
    from '@mui/material/styles'; 

const theme  = responsiveFontSizes(createTheme({
  typography:{
    fontFamily: [
      'Poppins',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    appName: {
      background: "-webkit-linear-gradient(#cda4d2, #ffffff)",
      "-webkit-background-clip": "text",
      "-webkit-text-fill-color": "transparent",
      backgroundClip: "text",
      textFillColor: "transparent",
      fontSize: '2.4rem'
    }
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#B6A5FF',
    },
    secondary: {
      main: '#7A5EF3',
    },
    transitionColorBegin: {
        main: '#cda4d2'
    },
    transitionColorEnd: {
        main: '#861c93'
    },
    appBarColor:{
      main: '#f0f1f2'
    }
  },
}));

export default theme;