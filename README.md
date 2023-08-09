# S.A.M - Splynx Authentication Microservice

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

---

## About

> Wow, I am really getting tired of trying to implement the authentication for Splynx everytime I start a new project. - me

## Building

### Ready the environment:

1. Create a file in the root directory named `environment.json`, and add all the environment variables as stated in the environment.ts [schema](https://github.com/Rapid-Networks/Splynx_Authentication/blob/main/src/libraries/environment.ts).

## Production

In production mode, the service will load the environment variables from the container directory `./opt/config/environment.json` and will throw an `INITIALIZATION_ERROR` should the config not be present.[^production_env]

## Development

In development mode, the service will load the environment variables in the current development directory, in `./config/{environment}.json` and will throw an `INITIALIZATION_ERROR` should the config not be present or not named after the environment it is loaded in.

[^production_env]: This directory should be present within the docker image.
