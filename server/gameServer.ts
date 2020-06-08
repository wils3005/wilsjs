import Express from "express";
import ExpressPinoLogger from "express-pino-logger";
import Pino from "pino";

const { PINO_OPTIONS = "{}" } = process.env;

const app = Express();
const loggerOptions = JSON.parse(PINO_OPTIONS) as Pino.LoggerOptions;
const logger = Pino(loggerOptions);
app.use(ExpressPinoLogger(loggerOptions));

import http from "http";

import * as colyseus from "colyseus";
import basicAuth from "express-basic-auth";
import { monitor } from "@colyseus/monitor";
import { Schema } from "@colyseus/schema";

const { ADMIN_PASSWORD, HOST, GAME_SERVER_PORT, PUBLIC_PATH } = process.env;

////////////////////////////////////////////////////////////////////////////////

class MyColyseusSchema extends Schema {}
class MyColyseusRoom extends colyseus.Room<MyColyseusSchema> {}

const basicAuthOptions: basicAuth.BasicAuthMiddlewareOptions = {
  challenge: true,
  users: { admin: ADMIN_PASSWORD },
};

const httpServer = http.createServer(app);

const gameServer = new colyseus.Server({
  server: httpServer,
});

const logListening = () =>
  logger.info(`Game server listening at http://${HOST}:${GAME_SERVER_PORT}!`);

const logError = (error: Error) => logger.error(error);

gameServer.define("arena", MyColyseusRoom);

app.use("/", Express.static(PUBLIC_PATH));

app.use("/colyseus", basicAuth(basicAuthOptions), monitor());

gameServer
  .listen(Number(GAME_SERVER_PORT), HOST)
  .then(logListening)
  .catch(logError);
