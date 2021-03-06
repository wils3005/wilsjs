import API from "./api";
import CheckBrokenConnections from "./check-broken-connections";
import Client from "./web-socket-wrapper";
import Config from "./config";
import Express from "express";
import HTTP from "http";
import Message from "./message";
import MessageHandler from "./message-handler";
import MessagesExpire from "./messages-expire";
import Pino from "pino";
import Realm from "./realm";
import WebSocketServerWrapper from "./web-socket-server-wrapper";

// receives OR creates HTTP.Server
// creates Express.Express
// creates Config
// creates Realm
// creates MessageHandler
// creates API
// creates MessagesExpire
// creates CheckBrokenConnections
// creates WebSocketServerWrapper
class PeerExpressMiddleware {
  server: HTTP.Server;
  logger: Pino.Logger;
  app: Express.Express;
  config: Config;
  messageHandler: MessageHandler;
  realm: Realm;
  api: API;
  messagesExpire: MessagesExpire;
  checkBrokenConnections: CheckBrokenConnections;
  wss: WebSocketServerWrapper;

  static defaultConfig = {
    host: "::",
    port: 9000,
    expireTimeout: 5000,
    aliveTimeout: 60000,
    path: "/peerjs",
    concurrentLimit: 5000,
    allowDiscovery: false,
    cleanupOutMessages: 1000,
  };

  constructor(server: HTTP.Server, logger: Pino.Logger) {
    this.server = server;
    this.logger = logger;

    this.config = PeerExpressMiddleware.defaultConfig;
    this.app = Express();
    this.realm = new Realm();
    this.messageHandler = new MessageHandler(this.realm);
    this.api = new API(
      this.realm,
      this.messageHandler,
      this.config,
      this.logger
    );

    this.messagesExpire = new MessagesExpire(
      this.realm,
      this.messageHandler,
      this.config
    );

    this.checkBrokenConnections = new CheckBrokenConnections(
      this.realm,
      this.config.aliveTimeout,
      (c) => this.app.emit("disconnect", c)
    );

    this.app.use(this.config.path, this.api.router);
    this.wss = new WebSocketServerWrapper(
      this.server,
      this.realm,
      this.config,
      this.logger
    );

    this.wss.on("connection", (c) => this.onConnection(c));
    this.wss.on("message", (c, m) => this.onMessage(c, m));
    this.wss.on("close", (c) => this.app.emit("disconnect", c));
    this.wss.on("error", (e) => this.app.emit("error", e));

    // this.messagesExpire.startMessagesExpiration();
    // this.checkBrokenConnections.start();
    this.logger.info("PeerExpressMiddleware.constructor");
  }

  onConnection(client: Client): void {
    this.logger.info("PeerExpressMiddleware.onConnection");
    const messageQueue = this.realm.getMessageQueueById(client.getId());
    if (messageQueue) {
      let message: Message | undefined;
      while ((message = messageQueue.readMessage())) {
        this.messageHandler.handle(client, message);
      }

      this.realm.clearMessageQueue(client.getId());
    }

    this.app.emit("connection", client);
  }

  onMessage(client: Client, message: Message): void {
    this.logger.info("PeerExpressMiddleware.onMessage");
    this.app.emit("message", client, message);
    this.messageHandler.handle(client, message);
  }
}

export default PeerExpressMiddleware;
