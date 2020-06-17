import * as colyseus from "colyseus";
import * as express from "express";
import { logger, middleware as loggerMiddleware } from "./logger";
import { Schema } from "@colyseus/schema";
import basicAuth from "express-basic-auth";
import http from "http";
import { monitor } from "@colyseus/monitor";

const { ADMIN_PASSWORD = "", GAME_PORT = "", HOST = "" } = process.env;

const app = express.default();

////////////////////////////////////////////////////////////////////////////////
const httpServer = http.createServer(app);

class MyColyseusSchema extends Schema {}

////////////////////////////////////////////////////////////////////////////////
const gameServer = new colyseus.Server({
  server: httpServer,
});

class MyColyseusRoom extends colyseus.Room<MyColyseusSchema> {}

const logListening = (): void =>
  logger.info(`Game server listening at http://${HOST}:${GAME_PORT}!`);

const logError = (error: Error): void => logger.error(error);

const handleGame = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void => {
  logger.info({ req, res });
  next();
};

const basicAuthOptions: basicAuth.BasicAuthMiddlewareOptions = {
  challenge: true,
  users: { admin: ADMIN_PASSWORD },
};

////////////////////////////////////////////////////////////////////////////////
app.use(loggerMiddleware);
app.use("/:gameId", handleGame);
app.use("/colyseus", basicAuth(basicAuthOptions), monitor());

gameServer.define("arena", MyColyseusRoom);

gameServer.listen(Number(GAME_PORT), HOST).then(logListening).catch(logError);
