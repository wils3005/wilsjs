import { z } from 'zod';

import type { JsonObject } from './types';

export const zEnv = z.object({
  ADMIN_PASSWORD: z.string(),
  ADMIN_USERNAME: z.string(),
  FASTIFY_CORS_OPTIONS: z
    .string()
    .refine((s) => zFastifyCorsOptions.parse(JSON.parse(s))),
  FASTIFY_JWT_OPTIONS: z
    .string()
    .refine((s) => zFastifyJwtOptions.parse(JSON.parse(s))),
  PGDATABASE: z.string(),
  PGHOST: z.string(),
  PGPASSWORD: z.string(),
  PGUSER: z.string(),
  SCRYPT_KEYLEN: z.string().transform((s) => Number(s)),
});

export const zFastifyCorsOptions = z.object({
  methods: z.array(z.string()),
  origin: z.string().transform((s) => new RegExp(s)),
});

export const zFastifyJwtOptions = z.object({
  secret: z.string(),
});

export const zJsonLiteral = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
]);

export const zJsonObject: z.ZodSchema<JsonObject> = z.lazy(() =>
  z.union([zJsonLiteral, z.array(zJsonObject), z.record(zJsonObject)])
);

export const zRequestParams = z.object({ id: z.number() }).passthrough();

export const zAbstract = z.object({
  id: z.string().uuid(),
  created_at: z.date(),
  updated_at: z.date(),
  deleted_at: z.date().nullable(),
  metadata: zJsonObject,
});

export const zEvent = zAbstract.extend({
  event_type_id: z.string().uuid(),
});

export const zEventType = zAbstract.extend({
  name: z.string(),
});

export const zPolicy = zAbstract.extend({
  name: z.string(),
});

export const zRole = zAbstract.extend({
  name: z.string(),
});

export const zRolePolicy = zAbstract.extend({
  role_id: z.string().uuid(),
  policy_id: z.string().uuid(),
});

export const zUserRole = zAbstract.extend({
  user_id: z.string().uuid(),
  role_id: z.string().uuid(),
});

export const zUser = zAbstract.extend({
  name: z.string(),
  password_hash: z.string(),
  password_salt: z.string(),
});
