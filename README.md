# S.A.M - Splynx Authentication Microservice

[![https://nodei.co/npm/@rapidnetworks/sam.png?mini=true](https://nodei.co/npm/@rapidnetworks/sam.png?mini=true)](https://www.npmjs.com/package/@rapidnetworks/sam)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

---

## About

> Wow, I am really getting tired of trying to implement the authentication for Splynx everytime I start a new project.

This module is built for ongoing projects involving our (at time of writing) ISP billing software: [Splynx][Splynx home].
This service uses the [v2][Splynx API Doc] API spec for communicating with the Splynx API.

## Install :electric_plug:

```bash
    npm i @rapidnetworks/sam
    yarn add @rapidnetworks/sam -E
```

_This module includes its own type definitions_

## Usage :rocket:

This package exposes the 4 different API token types, each having a _TTL_ of 30 minutes.
This is just a basic overview of usage of the package, however you can view the official documentation to see the implementation and required information [here][Splynx authentication page]

### 1. API Token:

```typescript
import { apiToken } from '@rapidnetworks/sam';

const token = apiToken(url: string, api_key: string, api_secret: string);
```

### 2. Customer Token:

```typescript
import { customerToken } from '@rapidnetworks/sam';

const token = customerToken(url: string, customer_login: string, customer_password: string);
```

### 3. Administrator Token:

```typescript
import { adminToken } from '@rapidnetworks/sam';

const token = customerToken(url: string, admin_login: string, admin_password: string, 2fa_code?: string, 2fa_fingerprint?: string);
```

### 4. Session Token:

```typescript
import { sessionToken } from '@rapidnetworks/sam';

const token = customerToken(url: string, session_id: string);
```

All of these tokens are part of a base Authentication token class, allowing full access to the following methods:

### 1. `.refresh(): Promise<void>`

    This method refreshes the token and updates the token object with the new `access_token` value

### 2. `.delete(): Promise<void>`

    This method invalidates the `access_token` value, blacklisting it for further use.

The full token object has the following properties:

```typescript
class AuthorizationToken {
  private url: string;
  public readonly access_token: string;
  public readonly refresh_token: string;
  public readonly access_token_expiration: number;
  public readonly refresh_token_expiration: number;
  public readonly permissions: Record<string, Record<string, string>>;
}
```

[Splynx home]: https://splynx.com/
[Splynx API Doc]: https://splynx.docs.apiary.io/
[Splynx authentication page]: https://splynx.docs.apiary.io/#introduction/authentication
