import config from './libraries/environment.js';
import { startServer } from './components/server.js';
import generateNewToken from './components/fetchSplynxData.js';
import dbClient from './components/database.js';

// SPLYNX VARIABLES
const SPLYNX_API_KEY = config.get('splynx.key');
const SPLYNX_API_SECRET = config.get('splynx.secret');
const SPLYNX_URL = `${config.get('splynx.url')}/auth/tokens`;

// SERVER VARIABLES
const INTERVAL = config.get('splynx.interval');

async function main() {
  await dbClient.connect();
  startServer();
  await generateNewToken(SPLYNX_API_KEY, SPLYNX_API_SECRET, SPLYNX_URL);

  setInterval(
    async () =>
      await generateNewToken(SPLYNX_API_KEY, SPLYNX_API_SECRET, SPLYNX_URL),
    INTERVAL,
  );
}

await main();
