import * as express from "express";
import * as peer from "peer";
import { Foo } from ".";
import { PeerClient } from "./types";

const { HOST, SIGNALING_SERVER_PORT, PROXIED } = process.env;

const { app, logger } = new Foo();

////////////////////////////////////////////////////////////////////////////////

const afterListen = (): void =>
  logger.info(
    `Signaling server listening at http://${HOST}:${SIGNALING_SERVER_PORT}!`
  );

////////////////////////////////////////////////////////////////////////////////
const clients: Set<PeerClient> = new Set();

const httpServer = app.listen(Number(SIGNALING_SERVER_PORT), afterListen);

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
peerServer.on("connection", handleConnection);
peerServer.on("disconnect", handleDisconnect);
app.use("/", peerServer);
app.get("/clients", handleGetClients);
