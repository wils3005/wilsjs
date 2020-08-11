import * as bcrypt from "bcrypt";
import * as z from "zod";
import { IVerifyOptions, Strategy } from "passport-local";
import express, { NextFunction, Request, Response } from "express";
import User from "./models/user";
import expressSession from "express-session";
import helmet from "helmet";
import initFunction from "connect-session-knex";
import knex from "./knex";
import logger from "./logger";
import passport from "passport";
import pinoHttp from "pino-http";
import serveStatic from "serve-static";

const expressJsonHandler = express.json();

const expressStaticHandler = serveStatic(
  z.string().parse(process.env.ROOT),
  {}
);

const StoreFactory = initFunction(expressSession);

const store = new StoreFactory({
  clearInterval: 60000,
  createTable: false,
  knex,
  sidfieldname: "id",
  tablename: "sessions",
});

const expressSessionHandler = expressSession({
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: false,
  store,
});

const before = [
  expressJsonHandler,
  expressStaticHandler,
  helmet(),
  pinoHttp(logger),
  expressSessionHandler,
  passport.initialize(),
  passport.session(),
];

const after = [handleNotFound, handleInternalServerError];

passport.use(new Strategy(verify));
passport.serializeUser(handleUserSerialization);
passport.deserializeUser(handleUserDeserialization);

export default { before, after };

export function verify(
  username: string,
  password: string,
  done: (error: unknown, user?: unknown, options?: IVerifyOptions) => void
): void {
  logger.info("export function verify(");

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

export function handleUserSerialization(
  user: User,
  done: (err: unknown, id?: unknown) => void
): void {
  logger.info("export function handleUserSerialization(");

  done(null, user.id);
}

export function handleUserDeserialization(
  id: string,
  done: (err: unknown, user?: User) => void
): void {
  logger.info("export function handleUserDeserialization(");

  User.query()
    .findById(id)
    .then((user) => done(null, user))
    .catch((err) => done(err));
}
export function handleNotFound(
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  res.status(404).json();
  next();
}

export function handleInternalServerError(
  error: Error,
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  const { name, message, stack } = error;
  res.status(500).json(JSON.stringify({ name, message, stack }));
  next();
}
