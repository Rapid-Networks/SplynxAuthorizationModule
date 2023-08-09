import { createHmac } from 'node:crypto';
import fetch from 'node-fetch';
import dbClient from './database.js';
import { fastify } from './server.js';
import config from '../libraries/environment.js';

const SPLYNX_API_KEY = config.get('splynx.key');
const SPLYNX_API_SECRET = config.get('splynx.secret');
const SPLYNX_URL = `${config.get('splynx.url')}/auth/tokens`;

type AuthenticationToken = {
  access_token: string;
  refresh_token: string;
  access_token_expiration: number;
  refresh_token_expiration: number;
  permissions: Record<string, Record<string, string>>;
};
/**
 * Generates hashed signature using API key and secret, for use in authentication token generation. These tokens have a lifetime of 30 min
 * @returns Uppercase encrypted signature string used in generation of authentication tokens
 */
const generateSignature = () => {
  const nonce = Math.floor(new Date().getTime() / 1000);
  const secret = `${nonce}${SPLYNX_API_KEY}`;
  const hmac = createHmac('sha256', SPLYNX_API_SECRET)
    .update(secret)
    .digest('hex')
    .toUpperCase();

  return {
    signature: hmac,
    signature_nonce: nonce,
  };
};
/**
 * Make a POST request to the Splynx URL to generate a new authentication token.
 * Used as a helper function with the storage function
 * @returns the authentication token data, with a TTL of 30min
 */
const fetchSplynxData = async (): Promise<AuthenticationToken> => {
  const signature = generateSignature();
  const response = await fetch(SPLYNX_URL, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      auth_type: 'api_key',
      key: SPLYNX_API_KEY,
      signature: signature.signature,
      nonce: signature.signature_nonce,
    }),
  });

  return (await response.json()) as AuthenticationToken;
};
/**
 * Request a splynx token and store the values and generated header in the database.
 * @param url Splynx token URL
 */
async function generateNewToken(): Promise<void> {
  const data = await fetchSplynxData();
  const header = `Splynx-EA (access_token=${data.access_token})`;

  await dbClient
    .multi()
    .set('header:latest', header)
    .hSet('token:latest', {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      access_expiry: data.access_token_expiration,
      refresh_expiry: data.refresh_token_expiration,
      permissions: JSON.stringify(data.permissions),
    })
    .exec()
    .then(() => fastify.log.info('Token Generated'));
}

export default generateNewToken;
