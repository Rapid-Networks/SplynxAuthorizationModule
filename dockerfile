FROM 18.17.0-alpine3.17 AS stage

# SETUP ENV
RUN apk add --no-cache git && mkdir -p /var/log/sam
WORKDIR /opt
RUN git clone https://github.com/Rapid-Networks/Splynx_Authentication.git --depth 1
WORKDIR /opt/Splynx_Authentication
RUN mkdir opt/Splynx_Authentication/config
COPY ./environment.json /opt/Splynx_Authentication/config/environment.json

RUN npm install
RUN npm run build

# Set up usergroups
RUN addgroup -S sam
RUN adduser -S -H sam -G sam
RUN chown sam:sam /var/log/sam

CMD [ "node ./build/index.js --env production" ]

