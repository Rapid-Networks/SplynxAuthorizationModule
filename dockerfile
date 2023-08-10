# work in progress
FROM alpine AS build
# Redis build
RUN apk add --no-cache git wget build-base
RUN git clone https://github.com/redis/redis.git
RUN git clone https://github.com/Rapid-Networks/Splynx_Authentication.git
WORKDIR /redis
RUN make


FROM node:18.17.0-alpine3.17 AS stage
# S.A.M setup
COPY --from=build /Splynx_Authentication /build
WORKDIR /build
RUN yarn install --frozen-lockfile
RUN yarn run build

FROM node:18.17.0-alpine3.17 AS production 
# Environment
RUN mkdir /opt/redis && mkdir /opt/sam
RUN mkdir /opt/sam/config && mkdir /opt/sam/logs
RUN touch /opt/sam/logs/prod
# Imports
COPY --from=build /redis/src/redis-server /opt/redis/
COPY --from=build /redis/src/redis-cli /opt/redis/
COPY --from=stage /build/build /opt/sam/
COPY --from=stage /build/package.json /opt/sam

COPY ./environment.json /opt/sam/config/environment.json

RUN addgroup -S sam
RUN adduser -S -H sam -G sam
RUN chown sam:sam /opt/sam && chown sam:sam /opt/redis

WORKDIR /opt/sam
RUN yarn install --production --frozen-lockfile

CMD [ "node", "/opt/sam/index.js", "--env", " production"  ]

