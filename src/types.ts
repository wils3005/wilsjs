import type {
  FastifyError,
  FastifyInstance,
  FastifyRequest,
  FastifyReply,
} from 'fastify';
import type { FC } from 'react';
import type { z } from 'zod';

import type { zUser } from './schemas';

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

export type PageManifest = PageManifestItem[];

export type PageManifestItem = {
  component: FC;
  href: string;
  icon: string;
  tab: string;
  text: string;
};

export type User = z.infer<typeof zUser>;
