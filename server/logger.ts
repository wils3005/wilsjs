import * as expressPinoLogger from "express-pino-logger";
import * as pino from "pino";

const { PINO_OPTIONS = "{}" } = process.env;
const loggerOptions = JSON.parse(PINO_OPTIONS) as pino.LoggerOptions;

export const logger = pino.default(loggerOptions);

export const middleware = expressPinoLogger.default(loggerOptions);

export default logger;
