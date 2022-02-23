import { scrypt } from 'crypto';

import awsLambdaFastify from 'aws-lambda-fastify';
import fastify, {
  HTTPMethods,
  RouteHandlerMethod,
  preHandlerHookHandler,
} from 'fastify';
import fastifyCors from 'fastify-cors';
import fastifyJwt from 'fastify-jwt';
import postgres from 'postgres';
import { z } from 'zod';

import {
  zEnv,
  zRequestParams,
  zEvent,
  zEventType,
  zFastifyCorsOptions,
  zFastifyJwtOptions,
  zUser,
  zUserRole,
  zRole,
  zRolePolicy,
  zPolicy,
} from './schemas';
import type { FastifyErrorHandler, User } from './types';

export const authenticate: preHandlerHookHandler = async (request) => {
  const { method, url } = request;
  if (method === 'POST' && url === '/login') return;

  await request.jwtVerify();
};

export const createInsertOneHandler = <T extends z.ZodObject<z.ZodRawShape>>(
  tableName: string,
  schema: T
): RouteHandlerMethod => {
  return async ({ body }, reply) => {
    const parsedBody = schema.omit({ id: true }).partial().parse(body);
    const sql = postgres();
    const keys = Object.keys(parsedBody).join(',');
    const values = Object.values(parsedBody).join(',');
    await sql`insert into ${tableName} (${keys}) values ${values}`;
    return reply.status(201).send();
  };
};

export const createSelectAllHandler = (
  tableName: string
): RouteHandlerMethod => {
  return async (_request, reply) => {
    const sql = postgres();
    const rows = await sql`select * from ${tableName}`;
    return reply.send(rows);
  };
};

export const createSelectOneHandler = (
  tableName: string
): RouteHandlerMethod => {
  return async ({ params }, reply) => {
    const { id } = zRequestParams.parse(params);
    const sql = postgres();
    const [row] = await sql`select * from ${tableName} where id = ${id}`;
    return reply.send(row);
  };
};

export const createUpdateOneHandler = <T extends z.ZodObject<z.ZodRawShape>>(
  tableName: string,
  schema: T
): RouteHandlerMethod => {
  return async ({ body, params }, reply) => {
    const { id } = zRequestParams.parse(params);
    const parsedBody = schema.parse(body);
    const sql = postgres();
    const keys = Object.keys(parsedBody).join(',');
    const values = Object.values(parsedBody).join(',');
    await sql`update ${tableName} set (${keys}) = (${values}) where id = ${id}`;
    return reply.send();
  };
};

export const createDeleteOneHandler = (
  tableName: string
): RouteHandlerMethod => {
  return async (request, reply) => {
    const { id } = zRequestParams.parse(request.params);
    const sql = postgres();
    await sql`delete from ${tableName} where id = ${id}`;
    return reply.send();
  };
};

export const createResourceRoutes = <T extends z.ZodObject<z.ZodRawShape>>(
  tableName: string,
  schema: T
) => {
  const handlerDefinitions = [
    {
      method: 'POST' as HTTPMethods,
      url: `/${tableName}`,
      handler: createInsertOneHandler(tableName, schema),
    },
    {
      method: 'GET' as HTTPMethods,
      url: `/${tableName}`,
      handler: createSelectAllHandler(tableName),
    },
    {
      method: 'GET' as HTTPMethods,
      url: `/${tableName}/:id`,
      handler: createSelectOneHandler(tableName),
    },
    {
      method: 'PATCH' as HTTPMethods,
      url: `/${tableName}/:id`,
      handler: createUpdateOneHandler(tableName, schema),
    },
    {
      method: 'DELETE' as HTTPMethods,
      url: `/${tableName}/:id`,
      handler: createDeleteOneHandler(tableName),
    },
  ];

  for (const opts of handlerDefinitions) {
    app.route(opts);
  }
};

export const errorHandler: FastifyErrorHandler = async (error, _, reply) => {
  return reply.status(400).send(error);
};

export const loginHandler: RouteHandlerMethod = async ({ body }, reply) => {
  const expiresIn = 60 * 60 * 24 * 365.25;

  const { name, password } = z
    .object({ name: z.string(), password: z.string() })
    .parse(body);

  const sql = postgres();
  const [user] = await sql<User[]>`select * from users where name = ${name}`;
  if (!user) {
    return reply.status(401).send({ message: 'Unauthorized' });
  }

  const derivedKey = await new Promise<string>((resolve, reject) => {
    scrypt(password, user.password_salt, SCRYPT_KEYLEN, (err, derivedKey) => {
      err ? reject() : resolve(derivedKey.toString('base64'));
    });
  });

  if (derivedKey != user.password_hash) {
    return reply.status(401).send({ message: 'Unauthorized' });
  }

  const token = await reply.jwtSign({ id: user.id }, { expiresIn });
  return reply.status(200).send({ token });
};

export const formatError = (error: unknown) => {
  if (error instanceof z.ZodError) {
    const { name, issues } = error;
    return { error: { name, issues } };
  } else if (error instanceof Error) {
    const { name, message, stack } = error;
    return {
      error: { name, message, stack: stack?.split('\n') },
    };
  } else {
    return { error: String(error) };
  }
};

export const lambdaHandler = async (event: unknown, context: unknown) => {
  const log = { event, context };
  try {
    const lambdaResponse = await fastifyLambdaHandler(event, context);
    Object.assign(log, { lambdaResponse });
    return lambdaResponse;
  } catch (error) {
    Object.assign(log, formatError(error));
    return {
      body: JSON.stringify({ message: 'Bad Request' }),
      headers: { 'content-type': 'application/json' },
      statusCode: 400,
    };
  } finally {
    process.stdout.write(JSON.stringify(log));
  }
};

const { FASTIFY_CORS_OPTIONS, FASTIFY_JWT_OPTIONS, SCRYPT_KEYLEN } = zEnv.parse(
  process.env
);

const app = fastify()
  .register(
    fastifyCors,
    zFastifyCorsOptions.parse(JSON.parse(FASTIFY_CORS_OPTIONS))
  )
  .register(
    fastifyJwt,
    zFastifyJwtOptions.parse(JSON.parse(FASTIFY_JWT_OPTIONS))
  );

const fastifyLambdaHandler = awsLambdaFastify(app);

const resourceDefinitions = [
  { tableName: 'eventTypes', schema: zEventType },
  { tableName: 'policies', schema: zPolicy },
  { tableName: 'roles', schema: zRole },
  { tableName: 'users', schema: zUser },
  { tableName: 'events', schema: zEvent },
  { tableName: 'rolePolicies', schema: zRolePolicy },
  { tableName: 'userRoles', schema: zUserRole },
];

app
  .addHook('preHandler', authenticate)
  .setErrorHandler(errorHandler)
  .post('/login', loginHandler);

for (const { tableName, schema } of resourceDefinitions) {
  createResourceRoutes(tableName, schema);
}
