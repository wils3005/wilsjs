const host = String(process.env.HOST);
const port = String(process.env.WEBSOCKET_PORT);

const url = `ws://${host}:${port}`;

const webSocket = new WebSocket(url);

let openTime = 0;
let closeTime = 0;

const handleOpen = (event: Event): void => {
  console.debug({ event });
  openTime = Number(new Date());
};

const handleMessage = (messageEvent: MessageEvent): void =>
  console.debug({ messageEvent });

const handleClose = (closeEvent: CloseEvent): void => {
  console.debug({ closeEvent });
  closeTime = Number(new Date());
  console.debug((closeTime - openTime) / 1000);
};

const handleError = (event: Event): void => console.error({ event });

export default {};

////////////////////////////////////////////////////////////////////////////////
webSocket.addEventListener("error", handleError);
webSocket.addEventListener("message", handleMessage);

webSocket.addEventListener("open", handleOpen);
webSocket.addEventListener("close", handleClose);
