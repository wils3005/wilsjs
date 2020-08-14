import * as bcrypt from "bcrypt";
import * as passportLocal from "passport-local";
import * as z from "zod";
import User from "./user";
import connectSessionKnex from "connect-session-knex";
import express from "express";
import expressSession from "express-session";
import helmet from "helmet";
import http from "http";
import knex from "./knex";
import logger from "./logger";
import net from "net";
import passport from "passport";
import pinoHttp from "pino-http";
import serveStatic from "serve-static";
import ws from "ws";

const { PORT, ROOT, SECRET } = process.env;
const app = express();
const port = z.number().parse(Number(PORT));
const server = app.listen(port, handleListen);
const wsServer = new ws.Server({ server });
const StoreFactory = connectSessionKnex(expressSession);

app.use(
  express.json(),
  serveStatic(z.string().parse(ROOT), {}),
  helmet(),
  pinoHttp(logger),
  expressSession({
    secret: z.string().parse(SECRET),
    resave: false,
    saveUninitialized: false,
    store: new StoreFactory({
      clearInterval: 60000,
      knex,
    }),
  }),
  passport.initialize(),
  passport.session()
);

app.get("/healthz", respondNoContent);

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/success",
    failWithError: true,
    failureRedirect: "/failure",
  }),
  respondRedirectUsers
);

app.get("/logout", logoutUser);
app.get("/users", respondUsers);
app.use(respondNotFound, respondInternalServerError);
passport.use(new passportLocal.Strategy(verifyCredentials));
passport.serializeUser(handleUserSerialization);
passport.deserializeUser(handleUserDeserialization);
server.on("upgrade", handleServerUpgrade);
wsServer.on("connection", handleConnection);
wsServer.on("error", handleError);

////////////////////////////////////////////////////////////////////////////////
export function handleConnection(socket: ws): void {
  logger.info("handleConnection");
  socket.on("message", handleMessage);
  socket.on("error", handleError);
}

export function handleError(this: unknown, error: Error): void {
  logger.error({ this: this, error });
}

export function handleListen(): void {
  logger.info(`Listening at http://localhost:${port}`);
}

export function handleLogout(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  req.logout();
  res.redirect("/");
  next();
}

export function handleMessage(this: ws, data: ws.Data): void {
  logger.info({ this: this, data });

  for (const client of wsServer.clients) {
    if (client == this) continue;

    client.send(`Message broadcast: ${String(data)}`);
  }
}

export function handleServerUpgrade(
  request: http.IncomingMessage,
  socket: net.Socket,
  head: Buffer
): void {
  wsServer.handleUpgrade(request, socket, head, (webSocket) => {
    wsServer.emit("connection", webSocket, request);
  });
}

export function handleUserSerialization(
  user: User,
  done: (err: unknown, id?: unknown) => void
): void {
  done(null, user.id);
}

export function handleUserDeserialization(
  id: string,
  done: (err: unknown, user?: User) => void
): void {
  User.query()
    .findById(id)
    .then((user) => done(null, user))
    .catch((err) => done(err));
}

export function logoutUser(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  req.logout();
  res.redirect("/");
  next();
}

export function respondInternalServerError(
  _error: Error,
  _req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  res.status(500).json();
  next();
}

export function respondNotFound(
  _req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  res.status(404).json();
  next();
}

export function respondNoContent(
  _req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  res.sendStatus(204);
  next();
}

export function respondRedirectUsers(
  _req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  res.redirect("/users");
  next();
}

export async function respondUsers(
  _req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> {
  res.json(await User.query());
  next();
}

export function verifyCredentials(
  username: string,
  password: string,
  done: (
    error: unknown,
    user?: unknown,
    options?: passportLocal.IVerifyOptions
  ) => void
): void {
  User.query()
    .findOne({ username })
    .then(async (user) => {
      logger.info({ user });
      (await bcrypt.compare(password, user.password))
        ? done(null, user)
        : done(null, false);
    })
    .catch((err: Error) => {
      logger.error({ err });
      done(err);
    });
}
