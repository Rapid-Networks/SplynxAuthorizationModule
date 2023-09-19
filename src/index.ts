import { createHmac } from 'node:crypto';
import type { AuthenticationToken } from './types.js';

const SPLYNX_API_KEY = process.env.SPLYNX_API_KEY as string;
const SPLYNX_API_SECRET = process.env.SPLYNX_API_SECRET as string;
const SPLYNX_URL = `${process.env.SPLYNX_BASE_URL}/auth/tokens`;
/**
 * Generate a signature for Splynx token request.
 * @see {@link https://splynx.docs.apiary.io/#reference/auth/tokens/generate-access-token |Splynx authentication documentation}  for more information regarding requirements and PHP implementation.
 * @param {number} nonce timestamp value for signature decoding
 * @returns {string} current token signature
 */
const generateSignature = (nonce: number): string => {
  return createHmac('sha256', SPLYNX_API_SECRET)
    .update(`${nonce}${SPLYNX_API_KEY}`)
    .digest('hex')
    .toUpperCase();
};
/**
 * Token class
 */
export default class Token implements AuthenticationToken {
  public access_token!: string;
  public access_token_expiration!: number;
  public refresh_token!: string;
  public refresh_token_expiration!: number;
  public permissions!: Record<string, Record<string, string>>;

  public async create() {
    const nonce = Math.floor(new Date().getTime() / 1000);
    const response = await fetch(SPLYNX_URL, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth_type: 'api_key',
        key: SPLYNX_API_KEY,
        signature: generateSignature(nonce),
        nonce: nonce,
      }),
    });

    const data = (await response.json()) as AuthenticationToken;

    this.access_token = data.access_token;
    this.access_token_expiration = data.access_token_expiration;
    this.refresh_token = data.refresh_token;
    this.refresh_token_expiration = data.refresh_token_expiration;
    this.permissions = data.permissions;
  }

  public async refresh() {
    const response = await fetch(`${SPLYNX_URL}/${this.refresh_token}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = (await response.json()) as AuthenticationToken;

    this.access_token = data.access_token;
    this.access_token_expiration = data.access_token_expiration;
    this.refresh_token = data.refresh_token;
    this.refresh_token_expiration = data.refresh_token_expiration;
    this.permissions = data.permissions;
  }

  public async delete() {
    await fetch(`${SPLYNX_URL}/${this.refresh_token}`, {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
