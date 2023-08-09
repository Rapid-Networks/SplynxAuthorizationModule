import config from './libraries/environment.js';
import { startServer } from './components/server.js';
import generateNewToken from './components/fetchSplynxData.js';
import dbClient from './components/database.js';

const INTERVAL = config.get('splynx.interval');

async function main() {
  await dbClient.connect();
  startServer();
  await generateNewToken();

  setInterval(async () => await generateNewToken(), INTERVAL);
}

await main();
