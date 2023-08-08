import { validateEnvironment } from './libraries/lib.js';
import { config } from './libraries/env/convict.js';
import { initializeServer } from './components/server/server.js';
import { generateNewToken } from './components/api/getToken.js';

validateEnvironment();

const ENV = config.get('env');
const IP = config.get('ip');
const PORT = config.get('port');

// SPLYNX VARIABLES
const SPLYNX_API_KEY = config.get('splynx.key');
const SPLYNX_API_SECRET = config.get('splynx.secret');
const SPLYNX_URL = `${config.get('splynx.url')}/auth/tokens`;

async function main() {
  const fastify = initializeServer(ENV);
  await generateNewToken(SPLYNX_API_KEY, SPLYNX_API_SECRET, SPLYNX_URL);
}

await main();
