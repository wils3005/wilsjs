const host = String(process.env.HOST);
const port = String(process.env.WS_PORT);

const url = `ws://${host}:${port}`;

const webSocket = new WebSocket(url);

const handleMessage = (messageEvent: MessageEvent): void =>
  console.log({ messageEvent });

const handleEvent = (event: Event): void => {
  console.log({ event });
  const data = "Hello Server!";
  webSocket.send(data);
};

webSocket.addEventListener("close", handleEvent);
webSocket.addEventListener("error", handleEvent);
webSocket.addEventListener("message", handleMessage);
webSocket.addEventListener("open", handleEvent);
