import * as express from "express";
import * as expressPinoLogger from "express-pino-logger";
import * as peer from "peer";
import * as pino from "pino";
import * as ws from "ws";

const { PORT, PINO_OPTIONS, PROXIED } = process.env;
const loggerOptions = JSON.parse(String(PINO_OPTIONS)) as pino.LoggerOptions;
const app = express.default();
const logger = pino.default(loggerOptions);

interface Client {
  id?: string;
  getId: () => string;
  getToken: () => string;
  getSocket: () => ws | null;
  setSocket: (socket: ws | null) => void;
  getLastPing: () => number;
  setLastPing: (lastPing: number) => void;
  send: (data: unknown) => void;
}

const httpServer = app.listen(Number(PORT), () => logger.info({ httpServer }));
const clients: Set<Client> = new Set();

const peerServer = peer.ExpressPeerServer(httpServer, {
  proxied: Boolean(PROXIED),
});

app.use(expressPinoLogger.default(loggerOptions));
app.use("/", peerServer);

app.get("/clients", (_req: express.Request, res: express.Response) => {
  res.json([...clients].map((client: Client) => client.id));
});

peerServer.on("connection", (client: Client) => {
  clients.add(client);
  logger.info({ client }, `Connected: ${client.getId()}`);
});

peerServer.on("disconnect", (client: Client) => {
  clients.delete(client);
  logger.info({ client }, `Disconnected: ${client.getId()}`);
});
