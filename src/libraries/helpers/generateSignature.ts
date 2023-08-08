import { createHmac } from 'node:crypto';

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

export default generateSignature;
