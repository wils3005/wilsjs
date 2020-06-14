import ws from "ws";

const { HOST = "", WS_PORT = "" } = process.env;

const options: ws.ServerOptions = { host: HOST, port: Number(WS_PORT) };
const webSocketServer = new ws.Server(options);

const handleConnection = (client: ws): void => {
  console.log({ client });
  const data = "hello world";
  client.send(data);
};

webSocketServer.addListener("connection", handleConnection);
