import * as express from "express";
import * as peer from "peer";
import { logger, middleware as loggerMiddleware } from "./logger";
import { PeerClient } from "./types";

const { HOST = "", SIGNALING_PORT = "", PROXIED = "" } = process.env;

const app = express.default();

////////////////////////////////////////////////////////////////////////////////

const afterListen = (...args: unknown[]): void =>
  logger.info(
    `Signaling server listening at http://${HOST}:${SIGNALING_PORT}!`,
    ...args
  );

////////////////////////////////////////////////////////////////////////////////
const clients: Set<PeerClient> = new Set();

const httpServer = app.listen(Number(SIGNALING_PORT), afterListen);

////////////////////////////////////////////////////////////////////////////////
const handleConnection = (client: PeerClient): void => {
  clients.add(client);
  logger.info(`Client ${client.getId()} connected!`);
};

const handleDisconnect = (client: PeerClient): void => {
  clients.delete(client);
  logger.info(`Client ${client.getId()} disconnected!`);
};

const handleGetClients = (
  _req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void => {
  const body = [...clients].map((client: PeerClient) => client.id);
  res.json(body);
  next();
};

const peerServer = peer.ExpressPeerServer(httpServer, {
  proxied: Boolean(PROXIED),
});

////////////////////////////////////////////////////////////////////////////////
app.use(loggerMiddleware);
app.use("/", peerServer);
app.get("/clients", handleGetClients);
peerServer.on("connection", handleConnection);
peerServer.on("disconnect", handleDisconnect);
