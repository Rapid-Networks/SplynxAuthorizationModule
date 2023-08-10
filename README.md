# S.A.M - Splynx Authentication Microservice

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

---

## About

> Wow, I am really getting tired of trying to implement the authentication for Splynx everytime I start a new project.

This is a microservice container built for ongoing projects involving our (at time of writing) ISP billing software: [Splynx][Splynx home].
This service uses the [v2][Splynx API Doc] API spec for communicating with the Splynx API.

## Index :scroll:

1. [Building](#building-nut_and_bolt)
2. [Production](#production-briefcase)
3. [Development](#development-desktop_computer)

   - [Database](#database)

4. [Testing](#testing-ticket) - _work in progress_

## Building :nut_and_bolt:

### Ready the environment:

1. Create a file in the root project directory named `environment.json`, and add all the environment variables as required in the environment.ts [schema][Convict schema].

## Production :briefcase:

`--env production`

In production mode, the service will load the environment variables from the container directory `./opt/sam/config/environment.json` and will throw an `INITIALIZATION_ERROR` should the config not be present.[^production_env]

The service will pipe all logs to a compressed file found in `./opt/sam/logs`. Hitting the `/logs` endpoint will return the full log stream for further processing.

## Development :desktop_computer:

`--env development`

In development mode, the service will load the environment variables in the current development directory, in `./config/{environment}.json` and will throw an `INITIALIZATION_ERROR` should the config not be present or not named after the environment it is loaded in.

### Database

In development the service assumes a redis stack docker container is running on its default mappings. This allows you to view the database with your browser of choice with redInsight on [`http://localhost:8001`](http://localhost:8001).

#### _Quickstart:_

```
docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest
```

> You can read more on their official documentation [here][Redis-stack docker install]

## Testing :ticket:

`--env testing`

This section is still very much a work in progress.

[^production_env]: This directory should be present within the docker image.

[Redis-stack docker install]: https://redis.io/docs/getting-started/install-stack/docker/
[Convict schema]: https://github.com/Rapid-Networks/Splynx_Authentication/blob/main/src/libraries/environment.ts
[Splynx home]: https://splynx.com/
[Splynx API Doc]: https://splynx.docs.apiary.io/
