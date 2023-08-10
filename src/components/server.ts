import Fastify from 'fastify';
import config from '../libraries/environment.js';
import dbClient from './database.js';
import { AppError } from '../libraries/errors.js';

// Logger configuration for current environment:
const loggerOptions: Record<string, any> = {
  development: {
    name: 'dev',
    transport: {
      target: 'pino-pretty',
      level: 'trace',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
  production: {
    name: 'production',
    level: 'info',
  },
  testing: false,
};

export const fastify = Fastify({
  logger: loggerOptions[config.get('env')] ?? true,
});

/**
 * Base request to route, returns latest header value
 */
fastify.get('/', async (_request, reply) => {
  reply.send(await dbClient.get('header:latest')).code(200);
});
/**
 * Return full token from database, without permissions
 */
fastify.get('/token', async (_request, reply) => {
  const tokenWithoutPermissions = {
    access_token: await dbClient.hGet('token:latest', 'access_token'),
    refresh_token: await dbClient.hGet('token:latest', 'refresh_token'),
    access_token_expiration: await dbClient.hGet(
      'token:latest',
      'access_expiry',
    ),
    refresh_token_expiration: await dbClient.hGet(
      'token:latest',
      'refresh_expiry',
    ),
  };

  reply.send(tokenWithoutPermissions).code(200);
});
/**
 * Return full token from database, including permissions
 */
fastify.get('/token/raw', async (_request, reply) => {
  const dump = await dbClient.hGetAll('token:latest');
  const permissionDump = JSON.parse(dump.permissions);

  const parsedToken = {
    access_token: dump.access_token,
    refresh_token: dump.refresh_token,
    access_token_expiration: dump.access_expiry,
    refresh_token_expiration: dump.refresh_expiry,
    permissions: { ...permissionDump },
  };

  reply.send(parsedToken).code(200);
});
/**
 * Return permission list from database
 */
fastify.get('/permissions', async (_request, reply) => {
  const permissionDump = await dbClient.hGet('token:latest', 'permissions');
  if (permissionDump === undefined) {
    throw new AppError(
      'APP_ERROR',
      'Permissions not found on token object',
      new Error(),
    );
  }
  reply.send(JSON.parse(permissionDump)).code(200);
});
// @TODO - implement log dumping and streaming
fastify.get('/logs', async (_request, reply) => {
  reply.send('logs endpoint').code(200);
});

export function startServer(): void {
  fastify.listen({ port: config.get('server.port') }, (error, _address) => {
    if (error) throw new Error();
  });
}