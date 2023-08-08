import { createClient } from 'redis';
import { AppError } from '../../libraries/error/errorObject.js';

// @todo - add environment specific addresses
const dbClient = createClient();

// Event Handles
dbClient.on('error', (error: Error) => {
  throw new AppError('Uncaught database error:', error.message, false);
});

await dbClient.connect();

export default dbClient;
