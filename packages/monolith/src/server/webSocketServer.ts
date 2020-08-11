import ws from "ws";

const wsServerOptions = { server: httpServer };
const webSocketServer = new ws.Server(wsServerOptions);

webSocketServer.on("connection", handleConnection);
webSocketServer.on("error", handleError);

export default webSocketServer;

export function handleMessage(this: ws, data: ws.Data): void {
  logger.info({ this: this, data });

  for (const client of webSocketServer.clients) {
    if (client == this) continue;

    client.send(`Message broadcast: ${String(data)}`);
  }
}

export function handleError(this: unknown, error: Error): void {
  logger.error({ this: this, error });
}

export function handleConnection(this: ws.Server, socket: ws): void {
  logger.info("handleConnection");
  socket.on("message", handleMessage);
  socket.on("error", handleError);
}
