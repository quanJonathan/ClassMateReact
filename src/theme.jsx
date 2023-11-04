import { createTheme, responsiveFontSizes } 
    from '@mui/material/styles'; 


const {palette} = createTheme()

const theme  = responsiveFontSizes(createTheme({
  typography:{
    fontFamily: [
        'Poppins',
        'Raleway',
        'Open Sans'
    ].join(','),
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#cda4d2',
    },
    secondary: {
      main: '#861c93',
    },
    transitionColorBegin: palette.augmentColor({
        color: {
            main: '#cda4d2'
    }}),
    transitionColorEnd: palette.augmentColor({
        color: {
            main: '#cda4d2'
        }
    })
  },
}));

export default theme;