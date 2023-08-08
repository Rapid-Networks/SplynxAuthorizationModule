import generateSignature from '../../libraries/helpers/generateSignature.js';
import fetch from 'node-fetch';
import dbClient from '../db/redis.js';

type AuthenticationToken = {
  access_token: string;
  refresh_token: string;
  access_token_expiration: number;
  refresh_token_expiration: number;
  permissions: [Record<string, Record<string, string>>];
};

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

// generate header and queue database calls
export async function generateNewToken(
  api_key: string,
  api_secret: string,
  url: string,
): Promise<void> {
  const data = await fetchSplynxData(api_key, api_secret, url);
  const header = `Splynx-EA (access_token=${data.access_token})`;

  await dbClient
    .multi()
    .hSet('header:1', ['Authorization', header])
    .hSet('token:1', {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      access_expiry: data.access_token_expiration,
      refresh_expiry: data.refresh_token_expiration,
    })
    .exec()
    .then(async () => await dbClient.quit());
}
