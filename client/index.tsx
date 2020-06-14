import "./index.css";
import "./notification";
import "./webSocket";
// import * as serviceWorker from "./serviceWorker";

import {
  CssBaseline,
  ThemeProvider,
  colors,
  createMuiTheme,
} from "@material-ui/core";

import App from "./components/App";
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

const element = (
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App theme={theme} />
    </ThemeProvider>
  </React.StrictMode>
);

const container = document.getElementById("root");

ReactDOM.render(element, container);
// serviceWorker.register();
