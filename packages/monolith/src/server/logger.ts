import * as z from "zod";
import pino from "pino";

const loggerOptions = z
  .record(z.unknown())
  .parse(JSON.parse(z.string().parse(process.env.PINO_OPTIONS)));

const logger = pino(loggerOptions);

export default logger;
