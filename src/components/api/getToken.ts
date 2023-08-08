import generateSignature from '../../libraries/helpers/generateSignature.js';
import fetch from 'node-fetch';
import { config } from '../../libraries/env/convict.js';
import { AppError } from '../../libraries/error/errorObject.js';

const KEY = config.get('splynx.key');
const SECRET = config.get('splynx.secret');
const URL = `${config.get('splynx.url')}/auth/tokens`;

type AuthenticationToken = {
  access_token: string;
  refresh_token: string;
  access_token_expiration: number;
  refresh_token_expiration: number;
  permissions: [Record<string, Record<string, string>>];
};

const fetchData = async (): Promise<AuthenticationToken> => {
  const signature = generateSignature(KEY, SECRET);
  const response = await fetch(URL, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      auth_type: 'api_key',
      key: KEY,
      signature: signature.signature,
      nonce: signature.signature_nonce,
    }),
  });

  return (await response.json()) as AuthenticationToken;
};

/**
 * Requests Splynx API for a new authentication token with a default lifetime of 30 minutes and store data in database
 */
async function getNewToken(): Promise<void> {
  console.log(await fetchData());
}

await getNewToken();
