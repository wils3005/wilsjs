import * as express from "express";
import { logger, middleware as loggerMiddleware } from "./logger";

const { WEB_PORT, PUBLIC_PATH } = process.env;

const app = express.default();
const publicPath = String(PUBLIC_PATH);
const webPort = Number(WEB_PORT);

////////////////////////////////////////////////////////////////////////////////
app.use(loggerMiddleware);

app.use("/", express.static(publicPath));
app.listen(webPort, () => {
  logger.info(`webServer listening on ${webPort}!`);
});
