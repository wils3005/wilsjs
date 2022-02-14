import type {
  FastifyError,
  FastifyInstance,
  FastifyRequest,
  FastifyReply,
} from "fastify";
import type { z } from "zod";

import type { zUser } from "./schemas";

export type FastifyErrorHandler = (
  this: FastifyInstance,
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) => Promise<void>;

export type JsonLiteral = boolean | null | number | string;

export type JsonObject =
  | JsonLiteral
  | { [key: string]: JsonObject }
  | JsonObject[];

export type User = z.infer<typeof zUser>;
