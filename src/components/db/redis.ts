import { createClient } from 'redis';

// @todo - add environment specific addresses
const dbClient = createClient({
  url: 'redis://@localhost:6379',
});

// Event Handles
dbClient.on('error', (error: Error) => {
  throw new Error();
});

await dbClient.connect();

export default dbClient;
