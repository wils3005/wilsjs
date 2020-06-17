import {
  Box,
  Container,
  CssBaseline,
  ThemeProvider,
  Typography,
  colors,
  createMuiTheme,
} from "@material-ui/core";

import Copyright from "./Copyright";
import ProTip from "./ProTip";
import React from "react";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#556cd6",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: colors.red.A400,
    },
    background: {
      default: "#fff",
    },
  },
});

const App = (): JSX.Element => (
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm">
        <Box my={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            FlumpJS
          </Typography>
          <ProTip className="pro-tip" theme={theme} />
          <Copyright />
        </Box>
      </Container>
    </ThemeProvider>
  </React.StrictMode>
);

export default App;
