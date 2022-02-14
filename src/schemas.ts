import { z } from "zod";

import type { JsonObject } from "./types";

export const zEnv = z.object({
  ADMIN_PASSWORD: z.string(),
  ADMIN_USERNAME: z.string(),
  FASTIFY_CORS_OPTIONS: z
    .string()
    .transform((s) => zFastifyCorsOptions.parse(JSON.parse(s))),
  FASTIFY_JWT_OPTIONS: z
    .string()
    .transform((s) => zFastifyJwtOptions.parse(JSON.parse(s))),
  NODE_ENV: z.string(),
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
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  metadata: zJsonObject,
});

export const zEvent = zAbstract.extend({
  eventTypeId: z.string().uuid(),
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
  roleId: z.string().uuid(),
  policyId: z.string().uuid(),
});

export const zUserRole = zAbstract.extend({
  userId: z.string().uuid(),
  roleId: z.string().uuid(),
});

export const zUser = zAbstract.extend({
  name: z.string(),
  password: z.string(),
});
