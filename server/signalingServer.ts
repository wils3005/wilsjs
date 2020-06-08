import Express from "express";
import ExpressPinoLogger from "express-pino-logger";
import Pino from "pino";

import { ExpressPeerServer } from "peer";
import WebSocketLib from "ws";

const {
  HOST,
  PINO_OPTIONS = "{}",
  SIGNALING_SERVER_PORT,
  PROXIED,
} = process.env;

const app = Express();
const loggerOptions = JSON.parse(PINO_OPTIONS) as Pino.LoggerOptions;
const logger = Pino(loggerOptions);
app.use(ExpressPinoLogger(loggerOptions));

////////////////////////////////////////////////////////////////////////////////

const httpServer = app.listen(Number(SIGNALING_SERVER_PORT), () => {
  logger.info(
    `Signaling server listening at http://${HOST}:${SIGNALING_SERVER_PORT}!`
  );
});

const peerServer = ExpressPeerServer(httpServer, {
  proxied: Boolean(PROXIED),
});

interface Client {
  id?: string;
  getId(): string;
  getToken(): string;
  getSocket(): WebSocketLib | null;
  setSocket(socket: WebSocketLib | null): void;
  getLastPing(): number;
  setLastPing(lastPing: number): void;
  send(data: any): void;
}

const clients: Set<Client> = new Set();

peerServer.on("connection", (client) => {
  clients.add(client);
  logger.info(`Client ${client.getId()} connected!`);
});

peerServer.on("disconnect", (client) => {
  clients.delete(client);
  logger.info(`Client ${client.getId()} disconnected!`);
});

app.use("/", peerServer);

app.get("/clients", (_req, res, next) => {
  const body = [...clients].map((client) => client.id);
  res.json(body);
  next();
});
