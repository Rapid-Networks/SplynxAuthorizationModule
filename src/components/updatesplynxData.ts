import dbClient from './database.js';
import config from '../libraries/environment.js';
import fetch from 'node-fetch';
import { AuthenticationToken } from './fetchSplynxData.js';
import { fastify } from './server.js';

const SPLYNX_URL = `${config.get('splynx.url')}/auth/tokens`;
/**
 * Performa  get request to Splynx endpoint for refreshing current token, permissions are not updated as they stay the same between tokens.
 * Refresh token value is updated as a redundency to prevent lockouts.
 * @param refresh_token refresh token value from database used in query param
 */
async function updateSplynxToken(refresh_token: string): Promise<void> {
  const response = await fetch(`${SPLYNX_URL}/${refresh_token}`, {
    method: 'get',
  });

  const data = (await response.json()) as AuthenticationToken;
  console.log(data);
  const header = `Splynx-EA (access_token=${data.access_token})`;

  await dbClient
    .multi()
    .set('header:latest', header)
    .hSet('token:latest', {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      access_expiry: data.access_token_expiration,
      refresh_expiry: data.refresh_token_expiration,
    })
    .exec()
    .then(() => fastify.log.info('Token Updated'));
}
export default updateSplynxToken;
