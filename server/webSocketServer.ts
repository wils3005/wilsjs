import WebSocket from "ws";
import { logger } from "./logger";

const { HOST, WEBSOCKET_PORT } = process.env;

const host = String(HOST);
const port = Number(WEBSOCKET_PORT);

const options: WebSocket.ServerOptions = {
  host,
  port,
};

const webSocketServer = new WebSocket.Server(options);

const handleMessage = (data: WebSocket.Data): void => {
  logger.info({ data }, __filename);

  for (const client of webSocketServer.clients) {
    client.send(`Message broadcast: ${String(data)}`);
  }
};

const handleError = (error: Error): void => logger.error({ error }, __filename);

const handleServerConnection = (webSocket: WebSocket): void => {
  webSocket.on("message", handleMessage);
  webSocket.on("error", handleError);
};

webSocketServer.on("connection", handleServerConnection);
webSocketServer.on("error", handleError);
