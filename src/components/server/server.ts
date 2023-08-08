import Fastify from 'fastify';
import { config } from '../../libraries/env/convict.js';

export function initializeServer(environment: string): Fastify.FastifyInstance {
  // Logger configuration for current environment:
  const loggerEnv: Record<string, any> = {
    development: {
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
    },
    production: true,
    test: false,
  };

  const fastify = Fastify({
    logger: loggerEnv[environment] ?? true,
  });

  // Routes
  fastify.get('/authentication', async (_request, reply) => {
    reply.send('latest splynx header').code(200);
  });

  fastify.get('/authentication/token', async (_request, reply) => {
    reply.send('raw token data').code(200);
  });

  // running server
  fastify.listen({ port: config.get('port') }, (error, _address) => {
    if (error) throw new Error();
  });

  return fastify;
}
