import { createClient } from 'redis';
import config from '../libraries/environment.js';

const DB_ADDRESS = config.get('db.host');
const DB_PORT = config.get('db.port');

// @todo - add environment specific addresses
const dbClient = createClient({
  url: `redis://@${DB_ADDRESS}:${DB_PORT}`,
});

// Event Handles
dbClient.on('error', (error: Error) => {
  throw new Error('Uncaught error', error);
});

export default dbClient;
