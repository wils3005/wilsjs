import "./index.css";
import "./notification";
import "./webSocket";
import App from "./components/App";
import ReactDOM from "react-dom";
// import * as serviceWorker from "./serviceWorker";

const container = document.getElementById("root");

ReactDOM.render(App(), container);
// serviceWorker.register();
