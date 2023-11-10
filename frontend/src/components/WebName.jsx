import {Box} from '@mui/material'
// const subName1 = "CLASS";
// const subName2 = "MATE";

function AppName() {
  return (
    <Box component="img"
    sx={{height: 200, width: 200}}
      alt='appname'
      src='../src/assets/appName.svg'
    />  
  );
}

export default AppName;
