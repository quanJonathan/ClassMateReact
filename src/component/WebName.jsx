import FancyText from '@carefully-coded/react-text-gradient';
import theme from '../theme';
import { ThemeProvider } from '@mui/material';

const subName1 = "CLASS"
const subName2 = "MATE"
export default function AppName(){
    return (
        <ThemeProvider theme={theme}>          
        <div>
        <FancyText gradient={{ from: '#CDA4D2', to: '#861C93' }}>
            {subName1}
        </FancyText>
        <FancyText gradient={{ from: '#CDA4D2', to: '#861C93' }}>
           {subName2}
        </FancyText>
        </div>
        </ThemeProvider>  
    );
}