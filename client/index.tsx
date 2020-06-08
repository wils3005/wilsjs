import React from "react";
import { render } from "react-dom";
import { Container } from "@material-ui/core";

import "./index.css";
import { register } from "./serviceWorker";
import { Component as Game } from "./game";
import { Component as Cams } from "./cams";

const container = document.querySelector("body");

function Component() {
  return (
    <Container>
      <div id="app">
        <Game />
        <Cams />
      </div>
    </Container>
  );
}

render(Component(), container);
register();
