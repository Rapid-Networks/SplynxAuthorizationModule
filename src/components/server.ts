import Fastify from 'fastify';
import config from '../libraries/environment.js';
import dbClient from './database.js';

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
  test: false,
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

fastify.get('/authentication', async (_request, reply) => {
  // need special logger options for requests
  reply.send('latest splynx header').code(200);
});

fastify.get('/authentication/token', async (_request, reply) => {
  reply.send('raw token data').code(200);
});

fastify.get('/authentication/permissions', async (_request, reply) => {
  reply.send('permissions').code(200);
});

fastify.get('/logs', async (_request, reply) => {
  reply.send('logs endpoint').code(200);
});

export function startServer(): void {
  // running server
  fastify.listen({ port: config.get('server.port') }, (error, _address) => {
    if (error) throw new Error();
  });
}
