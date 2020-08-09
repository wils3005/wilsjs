import * as colyseus from "colyseus";
import * as express from "express";
import * as expressPinoLogger from "express-pino-logger";
import * as pino from "pino";
import { Schema } from "@colyseus/schema";
import basicAuth from "express-basic-auth";
import http from "http";
import { monitor } from "@colyseus/monitor";

const { ADMIN_PASSWORD, PORT, HOST, PINO_OPTIONS } = process.env;
const app = express.default();
const loggerOptions = JSON.parse(String(PINO_OPTIONS)) as pino.LoggerOptions;
const httpServer = http.createServer(app);
class MyColyseusSchema extends Schema {}
const logger = pino.default(loggerOptions);

const gameServer = new colyseus.Server({
  server: httpServer,
});

class MyColyseusRoom extends colyseus.Room<MyColyseusSchema> {}
app.use(expressPinoLogger.default(loggerOptions));

app.use("/:gameId", (req: express.Request, res: express.Response): void => {
  logger.info({ req, res });
});

app.use(
  "/colyseus",
  basicAuth({
    challenge: true,
    users: { admin: String(ADMIN_PASSWORD) },
  }),
  monitor()
);

gameServer.define("arena", MyColyseusRoom);

gameServer
  .listen(Number(PORT), String(HOST))
  .then(() => logger.info({ httpServer }))
  .catch((error: Error) => logger.error({ error }));
