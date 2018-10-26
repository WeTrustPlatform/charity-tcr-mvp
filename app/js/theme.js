import { createMuiTheme } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: grey[50],
    },
  },
  typography: {
    useNextVariants: true,
  },
});

export default theme;