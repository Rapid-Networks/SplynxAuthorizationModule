import { createClient } from 'redis';
import { NetworkAppError } from '../../libraries/error/errorObject.js';

// @todo - add environment specific addresses
const dbClient = createClient();

// Event Handles
dbClient.on('error', (error: Error) => {
  throw new Error();
});

await dbClient.connect();

export default dbClient;
