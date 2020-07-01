import * as pino from "pino";
import ws from "ws";

const { HOST, PINO_OPTIONS, PORT } = process.env;
const logger = pino.default(JSON.parse(String(PINO_OPTIONS)));

const webSocketServer = new ws.Server(
  {
    host: String(HOST),
    port: Number(PORT),
  },
  () => {
    logger.info({ webSocketServer });
  }
);

const handleError = (error: Error): void => logger.error({ error });

webSocketServer.on("connection", (webSocket: ws) => {
  webSocket.on("message", (data: ws.Data): void => {
    logger.info({ data });

    for (const client of webSocketServer.clients) {
      client.send(`Message broadcast: ${String(data)}`);
    }
  });

  webSocket.on("error", handleError);
});

webSocketServer.on("error", handleError);
