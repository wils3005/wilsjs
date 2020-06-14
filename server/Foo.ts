import * as express from "express";
import * as expressPinoLogger from "express-pino-logger";
import * as pino from "pino";

const { PINO_OPTIONS = "{}" } = process.env;

const loggerOptions = JSON.parse(PINO_OPTIONS) as pino.LoggerOptions;
const loggerMiddleware = expressPinoLogger.default(loggerOptions);

export default class Foo {
  public app: express.Express;

  public logger: pino.Logger;

  public constructor() {
    this.app = express.default();
    this.logger = pino.default(loggerOptions);
    this.app.use(loggerMiddleware);
  }
}
