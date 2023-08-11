FROM node:18.17.0-alpine3.17 AS production 
# Environment
RUN mkdir /opt/sam
RUN mkdir /opt/sam/config && mkdir /opt/sam/logs
RUN touch /opt/sam/logs/prod
# Imports
COPY /build /opt/sam/
COPY /package.json /opt/sam
COPY ./environment.json /opt/sam/config/environment.json

WORKDIR /opt/sam
RUN yarn install --production --frozen-lockfile

EXPOSE 6379
EXPOSE 3000

CMD [ "node", "/opt/sam/index.js", "--env", "production" ]

