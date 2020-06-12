import "./index.css";
import * as serviceWorker from "./serviceWorker";

import {
  Box,
  Container,
  CssBaseline,
  Link,
  SvgIcon,
  ThemeProvider,
  Typography,
  colors,
  createMuiTheme,
  makeStyles,
} from "@material-ui/core";

import React from "react";
import ReactDOM from "react-dom";

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

////////////////////////////////////////////////////////////////////////////////
const useStyles = makeStyles(() => {
  return {
    root: {
      margin: theme.spacing(6, 0, 3),
    },
    lightBulb: {
      verticalAlign: "middle",
      marginRight: theme.spacing(1),
    },
  };
});

function LightBulbIcon(props: MyProps): JSX.Element {
  return (
    <SvgIcon {...props}>
      <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z" />
    </SvgIcon>
  );
}

////////////////////////////////////////////////////////////////////////////////
function ProTip(): JSX.Element {
  const classes = useStyles();

  return (
    <Typography color="textSecondary" className={classes.root}>
      <LightBulbIcon className={classes.lightBulb} />
      Pro tip: See more{" "}
      <Link href="https://material-ui.com/getting-started/templates/">
        templates
      </Link>{" "}
      on the Material-UI documentation.
    </Typography>
  );
}

function Copyright(): JSX.Element {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

////////////////////////////////////////////////////////////////////////////////
function App(): JSX.Element {
  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create React App v4-beta example
        </Typography>
        <ProTip />
        <Copyright />
      </Box>
    </Container>
  );
}

////////////////////////////////////////////////////////////////////////////////
const element = (
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

const container = document.getElementById("root");

////////////////////////////////////////////////////////////////////////////////
ReactDOM.render(element, container);
serviceWorker.register();
