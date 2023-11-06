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
      main: '#B6A5FF',
    },
    secondary: {
      main: '#7A5EF3',
    },
    transitionColorBegin: palette.augmentColor({
        color: {
            main: '#FCE9FF'
    }}),
    transitionColorEnd: palette.augmentColor({
        color: {
            main: '#F9D0FF'
        }
    })
  },
}));

export default theme;