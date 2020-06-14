import { Box, Container, Typography } from "@material-ui/core";
import Copyright from "./Copyright";
import ProTip from "./ProTip";
import React from "react";

const App = (props: { [index: string]: unknown }): JSX.Element => (
  <Container maxWidth="sm">
    <Box my={4}>
      <Typography variant="h4" component="h1" gutterBottom>
        Create React App v4-beta example
      </Typography>
      <ProTip className="pro-tip" theme={props.theme} />
      <Copyright />
    </Box>
  </Container>
);

export default App;
