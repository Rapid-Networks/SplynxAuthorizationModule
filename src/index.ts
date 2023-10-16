import { createHmac } from 'node:crypto';
import fetch from 'node-fetch';

type AuthenticationToken = {
  access_token: string;
  refresh_token: string;
  access_token_expiration: number;
  refresh_token_expiration: number;
  permissions: Record<string, Record<string, string>>;
};

/**
 *
 */
class AuthorizationToken implements AuthenticationToken {
  private url: string;
  public access_token: string;
  public refresh_token: string;
  public access_token_expiration: number;
  public refresh_token_expiration: number;
  public permissions: Record<string, Record<string, string>>;

  constructor(url: string, token: AuthenticationToken) {
    this.url = url;
    this.access_token = token.access_token;
    this.refresh_token = token.refresh_token;
    this.access_token_expiration = token.access_token_expiration;
    this.refresh_token_expiration = token.refresh_token_expiration;
    this.permissions = token.permissions;
  }
  /**
   *
   */
  public async refresh(): Promise<void> {
    await fetch(`${this.url}/${this.refresh_token}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  /**
   *
   */
  public async delete(): Promise<void> {
    await fetch(`${this.url}/${this.refresh_token}`, {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
/**
 *
 * @param api_key
 * @param api_secret
 * @returns
 */
export const apiToken = async (
  url: string,
  api_key: string,
  api_secret: string,
): Promise<AuthorizationToken> => {
  /**
   * Generate a signature for Splynx API token request.
   * @see {@link https://splynx.docs.apiary.io/#reference/auth/tokens/generate-access-token |Splynx authentication documentation}  for more information regarding requirements and PHP implementation.
   */
  const nonce = Math.floor(new Date().getTime() / 1000);
  const signature = createHmac('sha256', api_secret)
    .update(`${nonce}${api_key}`)
    .digest('hex')
    .toUpperCase();
  const response = await fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      auth_type: 'api_key',
      key: api_key,
      signature: signature,
      nonce: nonce,
    }),
  });
  return new AuthorizationToken(
    url,
    (await response.json()) as AuthenticationToken,
  );
};
/**
 *
 * @param login
 * @param password
 * @returns
 */
export const customerToken = async (
  url: string,
  login: string,
  password: string,
): Promise<AuthorizationToken> => {
  const response = await fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      auth_type: 'customer',
      login: login,
      password: password,
    }),
  });
  return new AuthorizationToken(
    url,
    (await response.json()) as AuthenticationToken,
  );
};
/**
 *
 * @param login
 * @param password
 * @param code
 * @param fingerprint
 * @returns
 */
export const adminToken = async (
  url: string,
  login: string,
  password: string,
  code?: string,
  fingerprint?: string,
): Promise<AuthorizationToken> => {
  const response = await fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      auth_type: 'admin',
      login: login,
      password: password,
      code: code,
      fingerprint: fingerprint,
    }),
  });
  return new AuthorizationToken(
    url,
    (await response.json()) as AuthenticationToken,
  );
};
/**
 *
 * @param session_id
 * @returns
 */
export const sessionToken = async (
  url: string,
  session_id: string,
): Promise<AuthorizationToken> => {
  const response = await fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      auth_type: 'session',
      session_id: session_id,
    }),
  });
  return new AuthorizationToken(
    url,
    (await response.json()) as AuthenticationToken,
  );
};
