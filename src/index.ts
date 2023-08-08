import { validateEnvironment } from './libraries/lib.js';
import { config } from './libraries/env/convict.js';
import { initializeServer } from './components/server/server.js';

validateEnvironment();

const ENV = config.get('env');
const IP = config.get('ip');
const PORT = config.get('port');

function main() {
  const fastify = initializeServer(ENV);
}

main();
