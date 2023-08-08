import Fastify from 'fastify';
import { NetworkAppError } from '../../libraries/error/errorObject.js';
import { config } from '../../libraries/env/convict.js';

const ENV = config.get('env');

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
  logger: loggerEnv[ENV] ?? true,
});

// Routes
fastify.get('/', async (request, reply) => {
  reply.type('application/json').code(200);
});

// running server
fastify.listen({ port: config.get('port') }, (error, address) => {
  if (error) throw new Error();
});
