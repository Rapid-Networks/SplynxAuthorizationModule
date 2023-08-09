import { createHmac } from 'node:crypto';
import fetch from 'node-fetch';
import dbClient from './database.js';
import { fastify } from './server.js';

type AuthenticationToken = {
  access_token: string;
  refresh_token: string;
  access_token_expiration: number;
  refresh_token_expiration: number;
  permissions: Record<string, Record<string, string>>;
};
/**
 * Generates hashed signature using API key and secret, for use in authentication token generation. These tokens have a lifetime of 30 min
 * @param api_key Splynx generated API key
 * @param api_secret Splynx generated API key secret, used for private key cryptography
 * @returns Uppercase encrypted signature string used in generation of authentication tokens
 */
const generateSignature = (api_key: string, api_secret: string) => {
  const nonce = Math.floor(new Date().getTime() / 1000);
  const secret = `${nonce}${api_key}`;
  const hmac = createHmac('sha256', api_secret)
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
 * @param api_key Splynx API Key
 * @param api_secret Splynx API Secret
 * @param url Splynx token URL
 * @returns the authentication token data, with a TTL of 30min
 */
const fetchSplynxData = async (
  api_key: string,
  api_secret: string,
  url: string,
): Promise<AuthenticationToken> => {
  const signature = generateSignature(api_key, api_secret);
  const response = await fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      auth_type: 'api_key',
      key: api_key,
      signature: signature.signature,
      nonce: signature.signature_nonce,
    }),
  });

  return (await response.json()) as AuthenticationToken;
};
/**
 * Request a splynx token and store the values and generated header in the database.
 * @param api_key Splynx API Key
 * @param api_secret Splynx API Secret
 * @param url Splynx token URL
 */
async function generateNewToken(
  api_key: string,
  api_secret: string,
  url: string,
): Promise<void> {
  const data = await fetchSplynxData(api_key, api_secret, url);
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
