import Index from './pages/Index/Index'
import { ThemeProvider, createTheme } from '@mui/material/styles';


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
    <Index></Index>
    </ThemeProvider>  
  );
}

export default App;
